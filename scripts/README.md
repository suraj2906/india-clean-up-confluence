# The registrations spreadsheet

`/register` writes every submission into a Google Sheet, and posts the same
payload to Web3Forms as a second copy. The sheet is the record; the mail is what
survives a broken or revoked deployment. A registration is shown as successful if
either destination accepted it, so losing one is invisible to the registrant and
shows up as a `console.warn` instead.

`registrations.gs` is the Apps Script Web App that does the writing. It is not
part of the Next.js build — nothing imports it. It lives here so the endpoint is
reviewable next to `src/components/register/RegistrationForm.tsx`, which posts to
it.

## Deploying it (once)

1. Create a new Google Sheet on **IndiaCleanupConfluence@gmail.com**, so the
   registrations sit in the same account as the inbox. Name it something like
   `ICUC 3.0 registrations`. Leave the default `Sheet1` alone — the script
   creates the two tabs it needs on the first write.
2. In that sheet: **Extensions → Apps Script**. Delete the stub `Code.gs`
   contents and paste in the whole of `registrations.gs`. Save.
3. **Deploy → New deployment → Web app**.
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   
   Both matter. "Me" is what gives the script permission to write to your sheet;
   "Anyone" is what lets a visitor's browser reach it without a Google login.
   Nothing sensitive is exposed by this — the endpoint only appends rows and
   returns `{"success":true}`; it never reads anything back out.
4. Approve the permissions prompt. Google will warn that the app is unverified —
   that is normal for a script you wrote yourself; continue via **Advanced**.
5. Copy the **Web app URL** (`https://script.google.com/macros/s/…/exec`) and put
   it in `.env.local`:

   ```
   NEXT_PUBLIC_SHEETS_ENDPOINT=https://script.google.com/macros/s/…/exec
   ```

   Add the same variable to the hosting environment, or the deployed site will
   post to nothing and quietly fall back to email only.
6. Check it: open the Web app URL in a browser. A live deployment answers
   `{"success":true,"message":"ICUC registrations endpoint is live."}`.
7. Then submit the real form in a browser and confirm a row lands. Tick the One
   Mentor, Many Missions box on a second submission and confirm that one lands on
   the *other* tab. Tick the Red Fort clean-up box on a third and confirm it
   lands on **two** tabs — the clean-up tab and whichever primary tab it would
   have gone to anyway.

## The three tabs

| Payload `sheet` | Tab                          | What lands there                                     |
| --------------- | ---------------------------- | ---------------------------------------------------- |
| `one_mentor`    | `One Mentor, Many Missions`  | Registrations that ticked the pitch box, with answers |
| `general`       | `General registrations`      | Everyone else                                        |
| `red_fort`      | `Red Fort clean-up`          | A copy of anyone who ticked the clean-up box          |

The split happens at write time rather than as a filter, so the panel opens one
tab and reads nothing else, and general registrations are not diluted by a
column per application question.

`sheet` is a **list**, and every name in it gets the same row. The first two tabs
are the primary pair — a registration lands on exactly one of them — and
`red_fort` is added alongside, so ticking the clean-up box writes a *copy* rather
than diverting the row. The two questions are unrelated: an NGO can apply to
pitch and also turn up to the clean-up, and neither list is complete if one tick
can take somebody off the other. Both rows carry the `red_fort_clean_up` column
either way, so the answer is readable without opening the third tab.

Adding a tab is the one change that does need a script edit and a redeploy — the
tab names live in `TABS` at the top of `registrations.gs`. Adding a *question*
still does not; see below.

## Changing the questions

Don't edit the script. `appendRow` aligns each row to the header row and appends
a column the first time it sees a key it has no header for, so adding a question
to `registration.oneMentor.questions` in `site.ts` is the whole change — the new
column appears on the next submission that answers it.

Two rules that follow from that:

- **Never reorder or rename a header by hand once submissions exist.** Rows are
  aligned to whatever the header row says, so editing it shifts every future row
  relative to the ones already written.
- **A question's `name` in `site.ts` is the column name.** Renaming one leaves
  the old column full of the old batch and starts a new one beside it. Add a new
  question instead.

## Redeploying after a script change

**Deploy → Manage deployments → edit (pencil) → Version: New version → Deploy.**
Editing the existing deployment keeps the same URL, so nothing has to change in
the environment. Creating a *new* deployment issues a new URL and the site will
keep posting to the old one until you update `NEXT_PUBLIC_SHEETS_ENDPOINT`.

# The feedback spreadsheet

`/feedback` writes every submission into a Google Sheet through `feedback.gs`, a
second Apps Script Web App built the same way as `registrations.gs`. It is a
separate script bound to a separate spreadsheet: the registration sheet is live
and people are reading it, and nothing about feedback is a reason to touch it or
redeploy its script.

Everything lands on one tab, `Feedback`, which the script creates (bold, frozen
header row) on the first write. The leading columns are fixed:

| Column         | What it holds                                                   |
| -------------- | --------------------------------------------------------------- |
| `submitted_at` | When the person pressed Submit, by their clock                  |
| `received_at`  | When the script wrote the row, by Google's clock — always ours  |
| `name`         | Blank if they chose to stay anonymous                           |
| `email`        | Blank if they chose to stay anonymous                           |

Every other key in the payload becomes a column after those, appended the first
time it appears and never reordered — one column per feedback question.

## Deploying it (once)

1. Create a **new, separate** Google Sheet on **IndiaCleanupConfluence@gmail.com**
   named something like `ICUC 3.0 feedback`. Do not use the registrations sheet.
   Leave the default `Sheet1` alone — the script creates `Feedback` itself.
2. In that sheet: **Extensions → Apps Script**. Delete the stub `Code.gs`
   contents and paste in the whole of `feedback.gs`. Save.
3. **Deploy → New deployment → Web app**.
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**

   Same reasons as for registrations: "Me" lets the script write to your sheet,
   "Anyone" lets a phone that just scanned the QR code reach it without a Google
   login. The endpoint only appends rows; it never reads anything back out.
4. Approve the permissions prompt, continuing past the unverified-app warning via
   **Advanced**.
5. Copy the **Web app URL** (`https://script.google.com/macros/s/…/exec`) into
   `.env.local`:

   ```
   NEXT_PUBLIC_FEEDBACK_ENDPOINT=https://script.google.com/macros/s/…/exec
   ```

   Add the same variable in Vercel (Project → Settings → Environment Variables),
   then **redeploy the site** — `NEXT_PUBLIC_*` values are baked in at build
   time, so a deployment built before the variable existed will not have it.
6. Check it: open the Web app URL in a browser. A live deployment answers
   `{"success":true,"message":"ICUC feedback endpoint is live."}`.
7. Then submit the real `/feedback` form in a browser — not with `curl` — and
   confirm a row lands on the `Feedback` tab. Submit a second one with name and
   email left blank and confirm it lands too.

## What it refuses

The URL is public and the form is reached by QR code in a full room, so the
script assumes the worst about what it is sent:

- A body that is not a JSON object is rejected, as is anything over 200,000
  characters.
- Only keys that look like question `name`s — a letter, then letters, digits or
  underscores, up to 64 characters — become columns. Anything else is dropped.
- Every value is written as text and cut at 5,000 characters.
- A value starting with `=`, `+`, `-`, `@`, tab or carriage return is prefixed
  with an apostrophe so Sheets stores it as text rather than running it as a
  formula. The apostrophe is not shown in the cell.
- One request can add at most 50 new columns, and the tab stops growing at 200.
  Keys past either cap are left out of that row; the rest of the submission is
  still written.
- A script lock serialises writes, so simultaneous submissions cannot interleave
  or clobber the header row.

## Changing the questions

Same rules as registrations. Don't edit the script — a new question's column
appears on the first submission that answers it. **A question's `name` is its
column header**, so never rename one once answers exist (the old column keeps the
old batch and a new one starts beside it), and never reorder or rename a header
in the sheet by hand.

## Redeploying after a script change

**Deploy → Manage deployments → edit (pencil) → Version: New version → Deploy.**
That keeps the same URL. A *new* deployment issues a new URL, and the site will
keep posting to the old one until `NEXT_PUBLIC_FEEDBACK_ENDPOINT` is updated and
the site redeployed.
