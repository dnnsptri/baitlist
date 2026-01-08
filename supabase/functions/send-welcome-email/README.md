# Send Welcome Email Edge Function

This Supabase Edge Function sends custom welcome emails to users based on their AI scoring results.

## Setup

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Set environment variables** in your Supabase project:
   - `RESEND_API_KEY`: Your Resend API key (get it from https://resend.com/api-keys)
   - `FROM_EMAIL`: Email address to send from (defaults to `hook@baitlist.com`)

   To set these in Supabase:
   ```bash
   supabase secrets set RESEND_API_KEY=your_key_here
   supabase secrets set FROM_EMAIL=noreply@baitlist.com
   ```

   Or via Supabase Dashboard:
   - Go to Project Settings > Edge Functions > Environment Variables

3. **Deploy the function**:
   ```bash
   supabase functions deploy send-welcome-email
   ```

## Usage

The function is called automatically from your Next.js API when a signup is scored.

### Request Payload

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "score": 95,
  "template": "instant-access",
  "magicLink": "https://your-app.com/auth/callback?token_hash=...",
  "signupId": "uuid",
  "waitlistId": "uuid",
  "waitlistName": "My Waitlist",
  "position": 1,
  "status": "approved"
}
```

### Templates

- **instant-access** (score ≥ 92): Congratulations email with magic link for dashboard access
- **priority-review** (score 80-91): Priority review notification
- **waitlist** (score < 80): Waitlist confirmation

### Response

```json
{
  "success": true,
  "messageId": "resend_message_id"
}
```

## Local Development

1. **Start Supabase locally**:
   ```bash
   supabase start
   ```

2. **Serve the function locally**:
   ```bash
   supabase functions serve send-welcome-email
   ```

3. **Test with curl**:
   ```bash
   curl -X POST http://localhost:54321/functions/v1/send-welcome-email \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "name": "Test User",
       "score": 95,
       "template": "instant-access",
       "magicLink": "https://example.com/auth/callback?token=test"
     }'
   ```

## Environment Variables

- `RESEND_API_KEY` (required): Resend API key
- `FROM_EMAIL` (optional): Email address to send from (default: `hook@baitlist.com`)

## Notes

- The function handles CORS for cross-origin requests
- Email templates are HTML-formatted with inline styles for better email client compatibility
- Error handling includes detailed logging for debugging
- The function validates all required fields before sending emails