const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const generateInvoice = async (order) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  // Get fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Colors
  const primaryColor = rgb(0.2, 0.4, 0.8);
  const textColor = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.9, 0.9, 0.9);

  // Header
  page.drawText('FISH MARKET INVOICE', {
    x: 50,
    y: height - 80,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });

  page.drawText(`Order #${order._id.toString().slice(-8)}`, {
    x: 50,
    y: height - 110,
    size: 12,
    font: font,
    color: textColor,
  });

  page.drawText(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, {
    x: 50,
    y: height - 130,
    size: 12,
    font: font,
    color: textColor,
  });

  // Customer Details
  page.drawText('CUSTOMER DETAILS', {
    x: 50,
    y: height - 170,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });

  page.drawText(`Name: ${order.customerName}`, {
    x: 50,
    y: height - 190,
    size: 12,
    font: font,
    color: textColor,
  });

  page.drawText(`Phone: ${order.customerPhone}`, {
    x: 50,
    y: height - 210,
    size: 12,
    font: font,
    color: textColor,
  });

  page.drawText(`Address: ${order.customerAddress}`, {
    x: 50,
    y: height - 230,
    size: 12,
    font: font,
    color: textColor,
  });

  // Order Items Header
  page.drawText('ORDER ITEMS', {
    x: 50,
    y: height - 270,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });

  // Table Header
  const tableY = height - 300;
  page.drawRectangle({
    x: 50,
    y: tableY - 20,
    width: 500,
    height: 20,
    color: lightGray,
  });

  page.drawText('Item', { x: 60, y: tableY - 15, size: 10, font: boldFont, color: textColor });
  page.drawText('Qty', { x: 200, y: tableY - 15, size: 10, font: boldFont, color: textColor });
  page.drawText('Price', { x: 250, y: tableY - 15, size: 10, font: boldFont, color: textColor });
  page.drawText('Total', { x: 400, y: tableY - 15, size: 10, font: boldFont, color: textColor });

  // Order Items
  let currentY = tableY - 40;
  // Use currentPage so new pages receive drawing calls
  let currentPage = page;
  order.items.forEach((item, index) => {
    if (currentY < 100) {
      // Add new page if needed and switch currentPage
      const newPage = pdfDoc.addPage([600, 800]);
      currentPage = newPage;
      currentY = newPage.getSize().height - 100;
      // Optionally re-draw section header on new page
      currentPage.drawText('ORDER ITEMS (continued)', {
        x: 50,
        y: currentY + 20,
        size: 14,
        font: boldFont,
        color: primaryColor,
      });
      currentY -= 10;
    }

    currentPage.drawText(item.fishName, { x: 60, y: currentY, size: 10, font: font, color: textColor });
    currentPage.drawText(`${item.quantity} ${item.priceUnit}`, { x: 200, y: currentY, size: 10, font: font, color: textColor });
    currentPage.drawText(`₹${item.price}`, { x: 250, y: currentY, size: 10, font: font, color: textColor });
    currentPage.drawText(`₹${(item.quantity * item.price).toFixed(2)}`, { x: 400, y: currentY, size: 10, font: font, color: textColor });
    
    currentY -= 20;
  });

  // Totals
  const totalsY = Math.max(currentY - 40, 150);
  page.drawText('SUBTOTAL:', { x: 350, y: totalsY, size: 12, font: boldFont, color: textColor });
  page.drawText(`₹${order.subtotal.toFixed(2)}`, { x: 450, y: totalsY, size: 12, font: font, color: textColor });

  page.drawText('DELIVERY CHARGE:', { x: 350, y: totalsY - 20, size: 12, font: boldFont, color: textColor });
  page.drawText(`₹${order.deliveryCharge.toFixed(2)}`, { x: 450, y: totalsY - 20, size: 12, font: font, color: textColor });

  page.drawText('TOTAL:', { x: 350, y: totalsY - 40, size: 14, font: boldFont, color: primaryColor });
  page.drawText(`₹${order.total.toFixed(2)}`, { x: 450, y: totalsY - 40, size: 14, font: boldFont, color: primaryColor });

  // Footer
  page.drawText('Thank you for your order!', {
    x: 50,
    y: 50,
    size: 12,
    font: font,
    color: textColor,
  });

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  
  // Create invoices directory if it doesn't exist
  const invoicesDir = path.join(__dirname, '../invoices');
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const fileName = `invoice_${order._id}_${Date.now()}.pdf`;
  const filePath = path.join(invoicesDir, fileName);
  
  fs.writeFileSync(filePath, pdfBytes);
  
  return filePath;
};

module.exports = { generateInvoice };
