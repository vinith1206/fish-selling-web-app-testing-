const express = require('express');
const axios = require('axios');
const router = express.Router();

// WhatsApp Cloud API configuration
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`;

// POST /api/whatsapp/send - Send text message
router.post('/send', async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
      return res.status(500).json({ message: 'WhatsApp API not configured. Please set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID.' });
    }
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: message },
      },
      { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' } }
    );
    res.json({ success: true, messageId: response.data.messages[0].id });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ message: 'Error sending WhatsApp message' });
  }
});

// POST /api/whatsapp/send-pdf - Send PDF document (demo uses text with path)
router.post('/send-pdf', async (req, res) => {
  try {
    const { phone, pdfPath } = req.body;
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
      return res.status(500).json({ message: 'WhatsApp API not configured. Please set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID.' });
    }
    const message = `Your order invoice is ready! You can download it from: ${pdfPath}`;
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: message },
      },
      { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' } }
    );
    res.json({ success: true, messageId: response.data.messages[0].id });
  } catch (error) {
    console.error('Error sending WhatsApp PDF:', error);
    res.status(500).json({ message: 'Error sending WhatsApp PDF' });
  }
});

module.exports = router;





















