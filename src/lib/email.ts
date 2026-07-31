import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_YOUR_RESEND_API_KEY";
const FROM_EMAIL = "Jinzai <otpprocess@domainexpansion.in>";

const resend = new Resend(RESEND_API_KEY);

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("[Resend] Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (e) {
    console.error("[Resend] Exception:", e);
    return { success: false, error: (e as Error).message };
  }
}

export async function sendOTPEmail(to: string, code: string, name?: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f1ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1ec;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d3cec6;">
          <tr>
            <td style="background:#0d9488;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;letter-spacing:-0.5px;">Jinzai 人材</h1>
              <p style="margin:4px 0 0;color:#ffffff;opacity:0.8;font-size:12px;">Talent Hub · Domain Expansion</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#111111;font-size:20px;font-weight:500;">Verify your email</h2>
              <p style="margin:0 0 24px;color:#626260;font-size:14px;line-height:1.6;">
                Hi ${name || "there"},<br><br>
                Use the code below to verify your email address and complete your ${name ? "signup" : "login"}.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <div style="display:inline-block;background:#f5f1ec;border:1px solid #d3cec6;border-radius:12px;padding:20px 40px;">
                  <p style="margin:0 0 8px;color:#7b7b78;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Your verification code</p>
                  <p style="margin:0;font-size:36px;font-weight:600;color:#0d9488;letter-spacing:8px;font-family:'Courier New',monospace;">${code}</p>
                </div>
              </div>
              <p style="margin:0 0 16px;color:#626260;font-size:13px;line-height:1.6;">
                This code expires in <strong>5 minutes</strong>. If you didn't request this, you can safely ignore this email.
              </p>
              <hr style="border:none;border-top:1px solid #ebe7e1;margin:32px 0;">
              <p style="margin:0;color:#9c9fa5;font-size:11px;line-height:1.5;text-align:center;">
                Jinzai by Domain Expansion<br>
                Made in India · domainexpansion.in<br>
                © ${new Date().getFullYear()} Domain Expansion. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return sendEmail({
    to,
    subject: `${code} — Your Jinzai verification code`,
    html,
  });
}

export async function sendWelcomeEmail(to: string, name?: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f1ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1ec;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d3cec6;">
          <tr>
            <td style="background:#0d9488;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;">Welcome to Jinzai 人材</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#111111;font-size:20px;">Welcome aboard, ${name || "there"}!</h2>
              <p style="margin:0 0 16px;color:#626260;font-size:14px;line-height:1.6;">
                Your Jinzai account is ready. You now have access to 72 professional resume templates, AI-powered writing tools, and ATS optimization.
              </p>
              <div style="background:#f5f1ec;border-radius:12px;padding:20px;margin:24px 0;">
                <p style="margin:0 0 8px;color:#111111;font-size:14px;font-weight:600;">Quick start:</p>
                <p style="margin:0 0 4px;color:#626260;font-size:13px;">1. Choose from 72 templates</p>
                <p style="margin:0 0 4px;color:#626260;font-size:13px;">2. Upload your old resume or build from scratch</p>
                <p style="margin:0;color:#626260;font-size:13px;">3. Export to PDF when ready</p>
              </div>
              <p style="margin:24px 0 0;color:#9c9fa5;font-size:11px;text-align:center;">
                Jinzai by Domain Expansion · Made in India
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return sendEmail({
    to,
    subject: "Welcome to Jinzai 人材 — Your Talent Hub",
    html,
  });
}
