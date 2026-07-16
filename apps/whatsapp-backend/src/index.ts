import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { isEnabled } from '@paddle-club/feature-flags';
import { prisma } from '@paddle-club/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());

// Basic health check
app.get('/', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'whatsapp-automation-backend',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Webhook Verification (for Meta / Facebook Developer setup)
 */
app.get('/webhook', (req, res) => {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'paddle_club_verify_token';
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verified successfully.');
      return res.status(200).send(challenge);
    }
    return res.status(403).sendStatus(403);
  }
  return res.status(400).send('Missing params');
});

/**
 * Webhook traffic receiver
 */
app.post('/webhook', async (req, res) => {
  // Check if WhatsApp automation is enabled
  if (!isEnabled('FEATURE_WHATSAPP_AUTOMATION')) {
    console.log('[Webhook] WhatsApp automation is disabled via feature flag. Ignoring request.');
    return res.status(200).json({ status: 'ignored', reason: 'feature_flag_disabled' });
  }

  const { body } = req;

  // Logging incoming payload structure
  console.log('[Webhook] Received WhatsApp message payload:', JSON.stringify(body, null, 2));

  try {
    // Basic extraction (handles standard Meta Cloud API structure)
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const val = changes?.value;
    const messageObj = val?.messages?.[0];

    if (messageObj) {
      const fromPhone = messageObj.from; // e.g. "919876543210"
      const messageText = messageObj.text?.body || '';

      console.log(`[Webhook] Message from: ${fromPhone}, Text: "${messageText}"`);

      // Mock AI extraction if AI is enabled
      let aiResult = {};
      if (isEnabled('FEATURE_AI_AUTOMATION')) {
        console.log('[Webhook] AI processing is active. Parsing slot booking intent...');
        aiResult = {
          intent: 'book_court',
          entities: {
            court_preference: 'Court A',
            date: '2026-07-16',
            time: '19:00',
          },
          confidence: 0.92,
        };
      }

      // Log message in the database using shared Prisma client
      try {
        await prisma.whatsAppMessage.create({
          data: {
            phone: fromPhone,
            direction: 'INBOUND',
            message: messageText,
            aiResult: JSON.stringify(aiResult),
          },
        });
        console.log('[Webhook] Inbound message logged to database.');
      } catch (dbError) {
        console.error('[Webhook] Failed to save message log to database:', dbError);
      }

      // In real scenario: Call WhatsApp Send API with automated reply
      const replyMessage = isEnabled('FEATURE_AI_AUTOMATION')
        ? `Hello! Our AI scheduler detected you want to book a court. Let me check slots for Court A on 16 July at 7:00 PM.`
        : `Thanks for messaging The Paddle Club Agra! We have received your query and will reply shortly. To book instantly, visit: https://paddle-club-pwa.in`;

      console.log(`[Webhook] Queueing automated reply: "${replyMessage}"`);

      // Save outbound reply log to database
      try {
        await prisma.whatsAppMessage.create({
          data: {
            phone: fromPhone,
            direction: 'OUTBOUND',
            message: replyMessage,
          },
        });
      } catch (dbError) {
        console.error('[Webhook] Failed to save outbound reply log:', dbError);
      }
    }

    return res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('[Webhook] Error processing webhook traffic:', error);
    return res.status(500).send('SERVER_ERROR');
  }
});

app.listen(PORT, () => {
  console.log(`WhatsApp Backend running on port ${PORT}`);
  console.log(`- Feature Flags loaded:`);
  console.log(`  - FEATURE_WHATSAPP_AUTOMATION: ${isEnabled('FEATURE_WHATSAPP_AUTOMATION')}`);
  console.log(`  - FEATURE_AI_AUTOMATION: ${isEnabled('FEATURE_AI_AUTOMATION')}`);
});
