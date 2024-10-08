import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function handler(req, res) {
  const { txRef } = req.query;

  if (!txRef) {
    return res.status(400).json({ error: 'Transaction reference is required.' });
  }

  try {
    // Step 1: Find the transaction by transaction reference (txRef)
    const transaction = await prisma.transaction.findUnique({
      where: { txRef },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    // Step 2: Generate the absolute path for the receipt PDF
    // This resolves to something like '/your-project-root/public/receipts/receipt-{txRef}.pdf'
    const receiptFilePath = path.resolve('public', 'receipts', `receipt-${txRef}.pdf`);

    // Step 3: Check if the receipt file exists
    if (!fs.existsSync(receiptFilePath)) {
      return res.status(404).json({ error: 'Receipt file not found.' });
    }

    // Step 4: Send the file as a download
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${txRef}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    
    const fileStream = fs.createReadStream(receiptFilePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error fetching receipt:', error);
    return res.status(500).json({ error: 'Failed to retrieve the receipt.' });
  }
}

export default handler;
