/**
 * ICUC 3.0 registrations → Google Sheets.
 *
 * This is Google Apps Script, not part of the Next.js build. Nothing bundles it
 * and nothing imports it; it is kept in the repo so the endpoint the site posts
 * to is reviewable next to the form that posts to it. See `scripts/README.md`
 * for how it gets deployed and where the URL then goes.
 *
 * `RegistrationForm.tsx` sends one JSON object per registration, as `text/plain`
 * so the browser treats it as a CORS simple request and skips the preflight this
 * runtime cannot answer. The body arrives here as `e.postData.contents`.
 *
 * Three tabs, and which ones a row lands on is decided by the payload's `sheet`
 * field rather than by a filter: the One Mentor, Many Missions panel opens its
 * own tab and reads nothing else, and general registrations are never diluted by
 * fourteen mostly-empty application columns.
 *
 * `sheet` may be a single name or a list of them, and a list writes the same row
 * to each named tab. That is how the Red Fort clean-up works: every registration
 * still lands on exactly one of the two primary tabs, and a clean-up tick adds a
 * *copy* on the clean-up tab rather than diverting the row away from where it
 * would otherwise have gone. The two questions are unrelated, so neither list is
 * complete if one tick can take somebody off the other.
 */

/** Payload `sheet` value → tab name. Anything unrecognised falls to GENERAL. */
var TABS = {
  one_mentor: 'One Mentor, Many Missions',
  general: 'General registrations',
  red_fort: 'Red Fort clean-up',
};
var GENERAL = TABS.general;

/**
 * The columns we know we want, in the order a human wants to read them. Anything
 * in the payload that is not listed here still gets written — it is appended as
 * a new column the first time it appears. That is deliberate: adding a question
 * to `registration.oneMentor.questions` in `site.ts` should not require editing
 * and redeploying this script.
 *
 * Never reorder or rename a header by hand once submissions exist. The row is
 * aligned to whatever the header row says, so an edit up there silently shifts
 * every future row relative to the ones already written.
 */
var KNOWN_COLUMNS = [
  'submitted_at',
  'name',
  'email',
  'phone',
  'city',
  'organisation',
  'role',
  'registering_as',
  'one_mentor_many_missions',
  'red_fort_clean_up',
  'message',
];

function doPost(e) {
  // Two people pressing Register in the same second would otherwise both read
  // the same last row and one would overwrite the other.
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ success: false, message: 'Empty request.' });
    }

    var payload = JSON.parse(e.postData.contents);
    var tabs = resolveTabs(payload.sheet);

    // `sheet` is routing, not an answer — it does not belong in a column.
    delete payload.sheet;

    if (!payload.submitted_at) {
      payload.submitted_at = new Date().toISOString();
    }

    for (var i = 0; i < tabs.length; i++) {
      appendRow(tabs[i], payload);
    }
    return json({ success: true });
  } catch (err) {
    return json({ success: false, message: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

/** A GET is only ever a human checking the deployment is alive. */
function doGet() {
  return json({ success: true, message: 'ICUC registrations endpoint is live.' });
}

/**
 * `sheet` → the tabs this row belongs on. Accepts a single name or a list, and
 * de-duplicates, so a payload can never write the same row onto one tab twice.
 * An empty or unrecognised value falls to the general tab: a registration we
 * cannot route is still a registration, and losing it would be worse.
 */
function resolveTabs(sheet) {
  var names = Object.prototype.toString.call(sheet) === '[object Array]' ? sheet : [sheet];
  var tabs = [];

  for (var i = 0; i < names.length; i++) {
    var tab = TABS[names[i]];
    if (tab && tabs.indexOf(tab) === -1) tabs.push(tab);
  }

  return tabs.length > 0 ? tabs : [GENERAL];
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

  var added = false;
  for (var key in payload) {
    if (payload.hasOwnProperty(key) && headers.indexOf(key) === -1) {
      headers.push(key);
      added = true;
    }
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
