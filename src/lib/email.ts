import "server-only";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLowCreditsEmail(
  email: string,
  name: string | null,
  credits: number,
  plan: string
) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: "AI SaaS <notifications@ai-saas.com>",
      to: email,
      subject: `Low Credits Warning - ${credits} credits remaining`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Low Credits Warning</h2>
          <p>Hi ${name || "there"},</p>
          <p>You currently have <strong>${credits}</strong> credits remaining on your <strong>${plan}</strong> plan.</p>
          <p>Upgrade your plan to continue generating content without interruption.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/billing" style="display: inline-block; background: #d97706; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Upgrade Plan</a>
          <p style="margin-top: 24px; color: #666; font-size: 12px;">If you don't need more credits, no action is required.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send low credits email:", error);
  }
}

export async function sendBillingReceiptEmail(
  email: string,
  name: string | null,
  amount: number,
  plan: string
) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: "AI SaaS <billing@ai-saas.com>",
      to: email,
      subject: `Payment Receipt - $${(amount / 100).toFixed(2)} for ${plan} plan`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Payment Confirmed</h2>
          <p>Hi ${name || "there"},</p>
          <p>Your payment of <strong>$${(amount / 100).toFixed(2)}</strong> for the <strong>${plan}</strong> plan has been processed successfully.</p>
          <p>You can manage your subscription from your billing dashboard.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/billing" style="display: inline-block; background: #d97706; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Billing</a>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send billing receipt email:", error);
  }
}

export async function sendMonthlyReportEmail(
  email: string,
  name: string | null,
  data: {
    generationsCount: number;
    creditsUsed: number;
    creditsRemaining: number;
    plan: string;
  }
) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: "AI SaaS <reports@ai-saas.com>",
      to: email,
      subject: `Your Monthly Report - ${new Date().toLocaleString("default", { month: "long" })}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">Monthly Usage Report</h2>
          <p>Hi ${name || "there"},</p>
          <p>Here's your usage summary for this month:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Generations</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${data.generationsCount}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Credits Used</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${data.creditsUsed}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Credits Remaining</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${data.creditsRemaining}</td></tr>
            <tr><td style="padding: 8px;">Plan</td><td style="padding: 8px; text-align: right; font-weight: bold; text-transform: capitalize;">${data.plan}</td></tr>
          </table>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #d97706; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Dashboard</a>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send monthly report email:", error);
  }
}
