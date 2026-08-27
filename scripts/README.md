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
   the *other* tab.

## The two tabs

| Payload `sheet` | Tab                          | What lands there                                     |
| --------------- | ---------------------------- | ---------------------------------------------------- |
| `one_mentor`    | `One Mentor, Many Missions`  | Registrations that ticked the pitch box, with answers |
| `general`       | `General registrations`      | Everyone else                                        |

The split happens at write time rather than as a filter, so the panel opens one
tab and reads nothing else, and general registrations are not diluted by a
column per application question.

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
