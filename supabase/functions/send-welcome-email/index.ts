// supabase/functions/send-welcome-email/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'hook@baitlist.com';

interface EmailPayload {
  email: string;
  name?: string;
  score: number;
  template: 'instant-access' | 'priority-review' | 'waitlist';
  magicLink?: string;
  signupId?: string;
  waitlistId?: string;
  waitlistName?: string;
  position?: number;
  status?: string;
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, content-type',
        },
      });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if Resend API key is configured
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const payload: EmailPayload = await req.json();
    const { email, name, score, template, magicLink } = payload;

    // Validate required fields
    if (!email || !score || !template) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, score, template' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate template
    if (!['instant-access', 'priority-review', 'waitlist'].includes(template)) {
      return new Response(
        JSON.stringify({ error: 'Invalid template. Must be: instant-access, priority-review, or waitlist' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const displayName = name || 'there';
    
    // Email templates
    const templates = {
      'instant-access': {
        subject: `🎉 Welcome to Baitlist - You scored ${score}/100!`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
                .score { font-size: 48px; font-weight: bold; color: #667eea; margin: 20px 0; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">🎣 BaitList</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">You're in!</p>
                </div>
                <div class="content">
                  <p>Hey ${displayName},</p>
                  <p>Your signup scored <strong>${score}/100</strong> - that's impressive! 🎉</p>
                  <p>You're approved for instant access. Click below to access your dashboard and create your first smart waitlist:</p>
                  ${magicLink ? `<div style="text-align: center;"><a href="${magicLink}" class="button">Access Dashboard →</a></div>` : ''}
                  <p>Welcome aboard!</p>
                  <p style="margin-top: 30px;">- Dennis<br><small>Founder, BaitList</small></p>
                </div>
                <div class="footer">
                  <p>If you have any questions, just reply to this email.</p>
                </div>
              </div>
            </body>
          </html>
        `
      },
      'priority-review': {
        subject: `👀 You're on our priority list - Score: ${score}/100`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
                .score { font-size: 36px; font-weight: bold; color: #f59e0b; margin: 20px 0; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">🎣 BaitList</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">Priority Review</p>
                </div>
                <div class="content">
                  <p>Hey ${displayName},</p>
                  <p>Thanks for signing up! Your score: <strong>${score}/100</strong></p>
                  <p>You're on our priority review list. We'll get back to you within 24 hours with next steps.</p>
                  <p>In the meantime, feel free to reply to this email if you have any questions.</p>
                  <p style="margin-top: 30px;">- Dennis<br><small>Founder, BaitList</small></p>
                </div>
                <div class="footer">
                  <p>We'll be in touch soon!</p>
                </div>
              </div>
            </body>
          </html>
        `
      },
      'waitlist': {
        subject: `📋 You're on the Baitlist waitlist`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">🎣 BaitList</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">You're on the list</p>
                </div>
                <div class="content">
                  <p>Hey ${displayName},</p>
                  <p>Thanks for your interest in BaitList!</p>
                  <p>You're currently on our waitlist. We'll notify you when spots open up. Stay tuned!</p>
                  <p>In the meantime, feel free to share BaitList with others - it helps you move up in the queue!</p>
                  <p style="margin-top: 30px;">- Dennis<br><small>Founder, BaitList</small></p>
                </div>
                <div class="footer">
                  <p>We'll notify you as soon as spots become available.</p>
                </div>
              </div>
            </body>
          </html>
        `
      }
    };
    
    const emailContent = templates[template];
    
    if (!emailContent) {
      return new Response(
        JSON.stringify({ error: 'Template not found' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Send email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      console.error('Resend API error:', resData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: resData 
        }),
        {
          status: res.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Email sent successfully:', { email, template, score });

    return new Response(
      JSON.stringify({ 
        success: true,
        messageId: resData.id 
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: unknown) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});