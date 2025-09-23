const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const sendWhatsAppMessage = async (phoneNumber, message, pdfPath = null) => {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    if (!accessToken || !phoneNumberId) {
      throw new Error('WhatsApp credentials not configured');
    }

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    let payload = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: {
        body: message
      }
    };

    // If PDF is provided, send as document
    if (pdfPath && fs.existsSync(pdfPath)) {
      const formData = new FormData();
      formData.append('messaging_product', 'whatsapp');
      formData.append('to', phoneNumber);
      formData.append('type', 'document');
      formData.append('document', fs.createReadStream(pdfPath));
      formData.append('filename', `Invoice_${Date.now()}.pdf`);

      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          ...formData.getHeaders()
        }
      });

      return response.data;
    } else {
      // Send text message
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    }
  } catch (error) {
    console.error('WhatsApp API Error:', error.response?.data || error.message);
    throw error;
  }
};

const sendOrderConfirmation = async (order) => {
  const message = `🎣 *New Fish Order Received!*

📋 *Order Details:*
• Order ID: #${order._id.toString().slice(-8)}
• Customer: ${order.customerName}
• Phone: ${order.customerPhone}
• Address: ${order.customerAddress}

🛒 *Items:*
${order.items.map(item => `• ${item.fishName} - ${item.quantity} ${item.priceUnit} @ ₹${item.price}`).join('\n')}

💰 *Total: ₹${order.total}* (Subtotal: ₹${order.subtotal} + Delivery: ₹${order.deliveryCharge})

📅 Order placed at: ${new Date(order.createdAt).toLocaleString()}

Please check the attached invoice for complete details.`;

  return await sendWhatsAppMessage(process.env.SELLER_PHONE_NUMBER || '+1234567890', message, order.pdfPath);
};

module.exports = { sendWhatsAppMessage, sendOrderConfirmation };
