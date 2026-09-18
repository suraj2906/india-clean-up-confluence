/**
 * ICUC 3.0 feedback → Google Sheets.
 *
 * This is Google Apps Script, not part of the Next.js build. Nothing bundles it
 * and nothing imports it; it is kept in the repo so the endpoint the site posts
 * to is reviewable next to the form that posts to it. See `scripts/README.md`
 * for how it gets deployed and where the URL then goes.
 *
 * It is a sibling of `registrations.gs`, not a part of it, and is meant to be
 * bound to a spreadsheet of its own. The registration sheet is live and has
 * people reading it; feedback arriving in the middle of it would be one more
 * tab for them to step around, and one more reason to redeploy a script that is
 * working.
 *
 * `/feedback` sends one flat JSON object per submission, as `text/plain` so the
 * browser treats it as a CORS simple request and skips the preflight this
 * runtime cannot answer. The body arrives here as `e.postData.contents`.
 *
 * Everything lands on one tab. There is no routing to do: every submission is
 * the same kind of thing. The form requires a name and a phone number, but
 * this script does not insist on them: whatever arrives is written as sent.
 *
 * Unlike the registration form, this one is reached by a QR code on a screen in
 * a full room, and its URL ends up in a public client bundle. So it assumes the
 * worst about what it is sent: every value is capped and turned into inert text,
 * and a single request cannot grow the sheet without limit.
 */

var TAB = 'Feedback';

/**
 * The columns we know we want, in the order a human wants to read them. Anything
 * in the payload that is not listed here still gets written — it is appended as
 * a new column the first time it appears. That is deliberate: the questions are
 * written in `site.ts` and will keep changing, and adding one should not require
 * editing and redeploying this script.
 *
 * Never reorder or rename a header by hand once submissions exist. The row is
 * aligned to whatever the header row says, so an edit up there silently shifts
 * every future row relative to the ones already written.
 */
var KNOWN_COLUMNS = ['submitted_at', 'received_at', 'name', 'phone'];

/**
 * Limits. Each one is far above anything the real form sends, and each one is
 * there because the URL is public and anybody can POST anything to it.
 *
 * A cell holds 50,000 characters; nobody's honest feedback needs a tenth of
 * that, and a request filling every cell to the brim is how a sheet stops
 * loading. New columns are capped per request so one crafted POST cannot invent
 * thousands of headers, and capped overall so a loop of them cannot either.
 */
var MAX_BODY_LENGTH = 200000;
var MAX_VALUE_LENGTH = 5000;
var MAX_NEW_COLUMNS_PER_REQUEST = 50;
var MAX_COLUMNS = 200;

/**
 * What a key has to look like to become a column: the snake_case question
 * `name`s the site uses. Anything else is dropped rather than written, because a
 * key is about to become a header, and a header is as much a cell as any other.
 * Requiring a leading letter also keeps out `__proto__` and friends.
 */
var KEY_PATTERN = /^[a-z][a-z0-9_]{0,63}$/i;

function doPost(e) {
  // A room full of phones scanning the same QR code will submit in the same
  // second. Without the lock two of them read the same header row and the same
  // last row, and one either overwrites the other or clobbers the headers.
  var lock = LockService.getScriptLock();
  var locked = false;

  try {
    lock.waitLock(30000);
    locked = true;

    if (!e || !e.postData || !e.postData.contents) {
      return json({ success: false, message: 'Empty request.' });
    }
    if (e.postData.contents.length > MAX_BODY_LENGTH) {
      return json({ success: false, message: 'Request too large.' });
    }

    var parsed = JSON.parse(e.postData.contents);

    // An array, a string or a number is valid JSON and still not a submission.
    if (!parsed || typeof parsed !== 'object' || Object.prototype.toString.call(parsed) === '[object Array]') {
      return json({ success: false, message: 'Expected a JSON object.' });
    }

    var payload = clean(parsed);

    if (!payload.submitted_at) {
      payload.submitted_at = new Date().toISOString();
    }

    // The client's clock says when they pressed Submit; this says when it
    // arrived. Always ours — a value in the payload never gets to claim it.
    payload.received_at = new Date().toISOString();

    appendRow(TAB, payload);
    return json({ success: true });
  } catch (err) {
    return json({ success: false, message: String(err && err.message ? err.message : err) });
  } finally {
    if (locked) lock.releaseLock();
  }
}

/** A GET is only ever a human checking the deployment is alive. */
function doGet() {
  return json({ success: true, message: 'ICUC feedback endpoint is live.' });
}

/**
 * The parsed body → a map of column name to safe string. A null-prototype
 * object, so a header that happens to share a name with something on
 * `Object.prototype` reads as absent rather than as a function.
 */
function clean(raw) {
  var out = Object.create(null);

  for (var key in raw) {
    if (!Object.prototype.hasOwnProperty.call(raw, key)) continue;
    if (!KEY_PATTERN.test(key)) continue;
    out[key] = neutralise(toText(raw[key]));
  }

  return out;
}

/**
 * The contract says every value is a string, but nothing stops a request saying
 * otherwise. Blank stays blank, scalars are printed, and anything structured is
 * written as its JSON rather than as `[object Object]`.
 */
function toText(value) {
  if (value === undefined || value === null) return '';
  var text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return text.length > MAX_VALUE_LENGTH ? text.slice(0, MAX_VALUE_LENGTH) : text;
}

/**
 * Formula injection. A value starting with one of these is read by Sheets as a
 * formula, and a formula can fetch URLs or pull in data from elsewhere the next
 * time someone opens the sheet. A leading apostrophe makes Sheets keep it as
 * literal text; the apostrophe itself is not shown in the cell. Tab and carriage
 * return are on the list because some spreadsheet exports strip them and leave
 * the character behind them leading the cell.
 */
function neutralise(text) {
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function appendRow(tabName, payload) {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(tabName) || book.insertSheet(tabName);

  var headers = readHeaders(sheet);

  if (headers.length === 0) {
    // First write into an empty tab: lay down the known columns, then whatever
    // else this particular payload brought with it.
    headers = KNOWN_COLUMNS.slice();
  }

  // Known columns are always admitted — they are ours, and a tab somebody set up
  // by hand should still grow the four we rely on. Only the rest count against
  // the caps. A key past a cap is left out of this row, not the whole
  // submission: the answers that do fit are still worth keeping.
  var added = false;
  var newColumns = 0;
  for (var key in payload) {
    if (headers.indexOf(key) !== -1) continue;

    var known = KNOWN_COLUMNS.indexOf(key) !== -1;
    if (!known && (newColumns >= MAX_NEW_COLUMNS_PER_REQUEST || headers.length >= MAX_COLUMNS)) {
      continue;
    }

    headers.push(key);
    added = true;
    if (!known) newColumns++;
  }

  if (added || sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  var row = headers.map(function (key) {
    var value = payload[key];
    return value === undefined || value === null ? '' : value;
  });

  sheet.appendRow(row);
}

function readHeaders(sheet) {
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) return [];
  return sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(function (h) {
      return String(h).trim();
    })
    .filter(function (h) {
      return h.length > 0;
    });
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
