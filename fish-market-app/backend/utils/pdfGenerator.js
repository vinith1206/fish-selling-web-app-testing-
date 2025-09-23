const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function generatePDF(order) {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const blue = rgb(0.12, 0.56, 1);
    const green = rgb(0.13, 0.77, 0.37);
    const darkGray = rgb(0.2, 0.2, 0.2);
    const lightGray = rgb(0.6, 0.6, 0.6);

    // Header
    page.drawText('FreshCatch', { x: 50, y: height - 80, size: 32, font: boldFont, color: blue });
    page.drawText('Fresh Fish Delivered Daily', { x: 50, y: height - 110, size: 14, font, color: lightGray });
    page.drawText(`Order ID: ${order.orderId}`, { x: width - 200, y: height - 80, size: 12, font: boldFont, color: darkGray });
    page.drawText(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { x: width - 200, y: height - 100, size: 10, font, color: lightGray });

    // Customer
    let yPos = height - 180;
    page.drawText('Customer Information', { x: 50, y: yPos, size: 16, font: boldFont, color: darkGray });
    yPos -= 30;
    page.drawText(`Name: ${order.customerName}`, { x: 50, y: yPos, size: 12, font, color: darkGray });
    yPos -= 20;
    page.drawText(`Phone: ${order.customerPhone}`, { x: 50, y: yPos, size: 12, font, color: darkGray });
    yPos -= 20;
    page.drawText(`Address: ${order.customerAddress}`, { x: 50, y: yPos, size: 12, font, color: darkGray });

    // Items header
    yPos -= 50;
    page.drawText('Order Items', { x: 50, y: yPos, size: 16, font: boldFont, color: darkGray });
    yPos -= 30;
    page.drawText('Item', { x: 50, y: yPos, size: 12, font: boldFont, color: darkGray });
    page.drawText('Qty', { x: 300, y: yPos, size: 12, font: boldFont, color: darkGray });
    page.drawText('Price', { x: 350, y: yPos, size: 12, font: boldFont, color: darkGray });
    page.drawText('Total', { x: 450, y: yPos, size: 12, font: boldFont, color: darkGray });
    page.drawLine({ start: { x: 50, y: yPos - 10 }, end: { x: width - 50, y: yPos - 10 }, thickness: 1, color: lightGray });

    // Items
    yPos -= 30;
    for (const item of order.items) {
      const fish = item.fish.name ? item.fish : { name: String(item.fish) };
      const itemTotal = item.price * item.quantity;
      page.drawText(fish.name, { x: 50, y: yPos, size: 10, font, color: darkGray });
      page.drawText(String(item.quantity), { x: 300, y: yPos, size: 10, font, color: darkGray });
      page.drawText(`₹${item.price}`, { x: 350, y: yPos, size: 10, font, color: darkGray });
      page.drawText(`₹${itemTotal}`, { x: 450, y: yPos, size: 10, font, color: darkGray });
      yPos -= 25;
    }

    // Totals
    yPos -= 20;
    page.drawLine({ start: { x: 50, y: yPos }, end: { x: width - 50, y: yPos }, thickness: 1, color: lightGray });
    yPos -= 30;
    page.drawText('Subtotal:', { x: 350, y: yPos, size: 12, font, color: darkGray });
    page.drawText(`₹${order.subtotal}`, { x: 450, y: yPos, size: 12, font, color: darkGray });
    yPos -= 20;
    page.drawText('Delivery Charge:', { x: 350, y: yPos, size: 12, font, color: darkGray });
    page.drawText(`₹${order.deliveryCharge}`, { x: 450, y: yPos, size: 12, font, color: darkGray });
    yPos -= 30;
    page.drawLine({ start: { x: 350, y: yPos }, end: { x: width - 50, y: yPos }, thickness: 2, color: blue });
    yPos -= 20;
    page.drawText('Total:', { x: 350, y: yPos, size: 14, font: boldFont, color: darkGray });
    page.drawText(`₹${order.total}`, { x: 450, y: yPos, size: 14, font: boldFont, color: green });

    // Footer
    yPos -= 60;
    page.drawText('Thank you for choosing FreshCatch!', { x: 50, y: yPos, size: 12, font: boldFont, color: blue });

    const pdfBytes = await pdfDoc.save();
    const outPath = path.join(__dirname, '../invoices', `invoice-${order.orderId}.pdf`);
    const invoicesDir = path.dirname(outPath);
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }
    fs.writeFileSync(outPath, pdfBytes);
    return outPath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

module.exports = { generatePDF };





















