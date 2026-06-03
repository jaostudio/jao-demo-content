import type { ContactSubmission } from '@/lib/validation/contact'

export function confirmationEmail(data: ContactSubmission): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 40px 20px;">
  <table align="center" style="max-width: 520px; width: 100%; background: white; border-radius: 12px; padding: 40px;">
    <tr><td style="text-align: center;">
      <p style="font-size: 36px; margin: 0 0 16px;">✓</p>
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 8px; color: #111;">Thanks for reaching out, ${data.name}</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #555; margin: 0 0 24px;">
        I've received your inquiry and will respond within 24 hours with a project brief and next steps.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #999; margin: 0;">
        JAOstudio — jameson.olitoquit@gmail.com
      </p>
    </td></tr>
  </table>
</body>
</html>`
}

export function internalNotification(data: ContactSubmission, score: number): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 40px 20px;">
  <table align="center" style="max-width: 560px; width: 100%; background: white; border-radius: 12px; padding: 40px;">
    <tr><td>
      <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 16px; color: #111;">New Inquiry</h1>
      <p style="font-size: 14px; color: #555; margin: 0 0 24px;">Lead score: <strong>${score}/16</strong></p>
      <table style="width: 100%; border-collapse: collapse;">
        ${row('Name', data.name)}
        ${row('Email', data.email)}
        ${row('Business', data.business || '—')}
        ${row('Website', data.website || '—')}
        ${row('Project Type', data.project_type === 'other' ? data.project_type_other || 'Other' : data.project_type)}
        ${row('Budget', data.budget)}
        ${row('Timeline', data.timeline)}
        ${row('Priority', data.priority)}
        ${row('Source', data.source_override || data.source)}
        ${row('Goal', data.business_goal || '—')}
        ${row('Message', data.message || '—')}
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function row(label: string, value: string): string {
  return `
<tr>
  <td style="padding: 8px 12px 8px 0; font-size: 12px; color: #999; vertical-align: top; white-space: nowrap; width: 100px;">${label}</td>
  <td style="padding: 8px 0; font-size: 13px; color: #333; vertical-align: top;">${value}</td>
</tr>`
}
