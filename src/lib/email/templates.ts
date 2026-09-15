import { contact, registration, site } from "@/content/site";

/**
 * The registration emails, as HTML plus a plain-text twin.
 *
 * Email clients are not browsers: no stylesheet, no CSS variables, no flexbox
 * in Outlook. So this is the one place in the codebase that writes table markup
 * with inline styles and raw hex — and the hex values are copied from
 * `.theme-deck` in `globals.css`, role for role, so the mail reads as the same
 * site. Change a colour there and mirror it here.
 *
 * Every string comes from `registration.emails` in `site.ts`. Anything the
 * registrant typed goes through `escape` before it touches the markup.
 *
 * No em-dashes anywhere in what a recipient reads, copy included.
 */
const C = {
  deep: "#063a5e",
  sky: "#4bad74",
  sky700: "#17795c",
  sky300: "#9ed17f",
  sky50: "#eaf7ef",
  leaf: "#2f7fae",
  shell: "#eafcfe",
  summit: "#b3dced",
  ink: "#123a52",
  muted: "#4a7186",
  white: "#ffffff",
};

const FONT = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const { emails } = registration;

export type Registrant = {
  name: string;
  attendee: string;
  joiningRedFort: boolean;
  pitching: boolean;
};

export type Rendered = { subject: string; html: string; text: string };

export function confirmationEmail(r: Registrant): Rendered {
  const e = emails.confirmation;
  const title = fill(e.title, firstName(r.name));
  const scheduleUrl = `${site.url}/${encodeURI(emails.schedule.path)}`;

  const details = [
    [e.whenLabel, site.datesLong],
    [e.whereLabel, site.venue],
    [e.registeredAsLabel, r.attendee],
  ];

  const redFort = r.joiningRedFort ? e.redFort : null;

  const rows = details
    .map(([label, value], i) => {
      const top = i === 0 ? 18 : 8;
      const bottom = i === details.length - 1 ? 18 : 8;
      return `
        <tr>
          <td width="120" style="padding:${top}px 12px ${bottom}px 22px;font-family:${FONT};font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};vertical-align:top;">${escape(label)}</td>
          <td style="padding:${top}px 22px ${bottom}px 0;font-family:${FONT};font-size:15px;font-weight:600;color:${C.ink};vertical-align:top;">${escape(value)}</td>
        </tr>`;
    })
    .join("");

  const content = `
    ${paragraphs(e.body)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border-collapse:separate;background:${C.shell};border:1px solid ${C.summit};border-radius:16px;">
      ${rows}
    </table>
    ${redFort ? redFortBlock(redFort) : ""}
    ${r.pitching ? callout(e.oneMentorNote) : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:10px 0 0;border-collapse:separate;">
      <tr>
        <td style="padding:22px 24px;background:${C.sky50};border:1px solid ${C.sky300};border-radius:16px;font-family:${FONT};">
          <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:${C.sky700};">${escape(e.scheduleTitle)}</p>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.ink};">${escape(e.scheduleNote)}</p>
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:${C.sky700};border-radius:999px;">
                <a href="${scheduleUrl}" style="display:inline-block;padding:12px 24px;font-family:${FONT};font-size:15px;font-weight:700;color:${C.white};text-decoration:none;border-radius:999px;">${escape(e.scheduleButton)}</a>
              </td>
            </tr>
          </table>
          <p style="margin:14px 0 0;font-size:12px;line-height:1.5;color:${C.muted};">Or copy this link: <a href="${scheduleUrl}" style="color:${C.sky700};word-break:break-all;">${scheduleUrl}</a></p>
        </td>
      </tr>
    </table>
    <p style="margin:28px 0 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.ink};">${escape(e.questions)}</p>
  `;

  const text = [
    title,
    "",
    ...e.body.flatMap((p) => [p, ""]),
    ...details.map(([l, v]) => `${l}: ${v}`),
    "",
    ...(redFort
      ? [redFort.title.toUpperCase(), redFort.intro, ...redFort.details.map((d) => `${d.label}: ${d.href ?? d.value}`), ""]
      : []),
    ...(r.pitching ? [e.oneMentorNote, ""] : []),
    e.scheduleTitle.toUpperCase(),
    e.scheduleNote,
    `${e.scheduleButton}: ${scheduleUrl}`,
    "",
    e.questions,
    ...signOff(),
  ].join("\n");

  return {
    subject: e.subject,
    html: layout({ preheader: e.preheader, eyebrow: e.eyebrow, title, content }),
    text,
  };
}

export function oneMentorEmail(r: Registrant): Rendered {
  const e = emails.oneMentor;
  const title = fill(e.title, firstName(r.name));

  const steps = e.steps
    .map(
      (s, i) => `
      <tr>
        <td width="46" style="padding:0 0 18px;vertical-align:top;">
          <div style="width:32px;height:32px;line-height:32px;border-radius:16px;background:${C.deep};color:${C.sky300};font-family:${FONT};font-size:14px;font-weight:700;text-align:center;">${i + 1}</div>
        </td>
        <td style="padding:5px 0 18px;vertical-align:top;font-family:${FONT};">
          <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:${C.ink};">${escape(s.title)}</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:${C.muted};">${escape(s.body)}</p>
        </td>
      </tr>`,
    )
    .join("");

  const content = `
    ${paragraphs(e.body)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 30px;border-collapse:separate;">
      <tr>
        <td style="padding:22px 24px;background:${C.sky50};border:2px solid ${C.sky700};border-radius:16px;">
          <p style="margin:0 0 8px;font-family:${FONT};font-size:17px;font-weight:700;line-height:1.35;color:${C.sky700};">${escape(e.notice.title)}</p>
          <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.ink};">${escape(e.notice.body)}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${C.leaf};">${escape(e.stepsTitle)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${steps}
    </table>
    <p style="margin:12px 0 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.ink};">${escape(e.questions)}</p>
  `;

  const text = [
    title,
    "",
    ...e.body.flatMap((p) => [p, ""]),
    e.notice.title.toUpperCase(),
    e.notice.body,
    "",
    e.stepsTitle,
    ...e.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`),
    "",
    e.questions,
    ...signOff(),
  ].join("\n");

  return {
    subject: e.subject,
    html: layout({ preheader: e.preheader, eyebrow: e.eyebrow, title, content }),
    text,
  };
}

/** The shared frame: a navy header band on the pale wash, a green rule, a white card, the footer. */
function layout({
  preheader,
  eyebrow,
  title,
  content,
}: {
  preheader: string;
  eyebrow: string;
  title: string;
  content: string;
}) {
  const host = site.url.replace("https://", "");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${escape(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.shell};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.shell};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td style="background:${C.deep};border-radius:24px 24px 0 0;padding:28px 32px 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;padding-right:14px;">
                    <img src="${site.url}/images/icuc-icon.png" width="48" height="40" alt="" style="display:block;border:0;" />
                  </td>
                  <td style="vertical-align:middle;font-family:${FONT};">
                    <div style="font-size:20px;font-weight:800;letter-spacing:.04em;color:${C.white};">${escape(site.name)} 3.0</div>
                    <div style="font-size:12px;color:${C.sky300};">${escape(site.tagline)}</div>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 6px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.sky300};">${escape(eyebrow)}</p>
              <h1 style="margin:0;font-family:${FONT};font-size:28px;line-height:1.25;font-weight:800;color:${C.white};">${escape(title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="height:6px;line-height:6px;font-size:0;background:${C.sky};">&nbsp;</td>
          </tr>
          <tr>
            <td style="background:${C.white};border-radius:0 0 24px 24px;padding:32px 32px 36px;">
              ${content}
              <p style="margin:24px 0 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.ink};">The ${escape(site.name)} team</p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 24px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};text-align:center;">
              ${escape(site.fullName)} &middot; <a href="${site.url}" style="color:${C.muted};">${escape(host)}</a> &middot; <a href="mailto:${contact.email}" style="color:${C.muted};">${escape(contact.email)}</a><br />
              ${escape(emails.footer)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function paragraphs(ps: string[]) {
  return ps
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:1.65;color:${C.ink};">${escape(p)}</p>`,
    )
    .join("");
}

function callout(body: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;">
      <tr>
        <td style="padding:14px 18px;background:${C.shell};border-left:4px solid ${C.leaf};font-family:${FONT};font-size:14px;line-height:1.6;color:${C.ink};">${escape(body)}</td>
      </tr>
    </table>`;
}

/** The Red Fort clean-up details, for registrants who ticked that box. */
function redFortBlock(block: typeof emails.confirmation.redFort) {
  const rows = block.details
    .map((d, i) => {
      const top = i === 0 ? 4 : 6;
      const value = d.href
        ? `<a href="${escape(d.href)}" style="color:${C.sky700};font-weight:600;">${escape(d.value)}</a>`
        : escape(d.value);
      return `
          <tr>
            <td width="130" style="padding:${top}px 12px 6px 0;font-family:${FONT};font-size:13px;color:${C.muted};vertical-align:top;">${escape(d.label)}</td>
            <td style="padding:${top}px 0 6px;font-family:${FONT};font-size:14px;font-weight:600;color:${C.ink};vertical-align:top;">${value}</td>
          </tr>`;
    })
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;">
      <tr>
        <td style="padding:18px 20px;background:${C.shell};border-left:4px solid ${C.leaf};font-family:${FONT};">
          <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:${C.leaf};">${escape(block.title)}</p>
          <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:${C.ink};">${escape(block.intro)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
          </table>
        </td>
      </tr>
    </table>`;
}

function signOff() {
  return ["", `The ${site.name} team`, "", emails.footer];
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}

function fill(template: string, name: string) {
  return template.replace("{name}", name);
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
