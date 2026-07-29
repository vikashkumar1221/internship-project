const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateContractPDF = (contractData, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Header Banner
      doc
        .fillColor('#6366f1')
        .fontSize(22)
        .text('MUSIC COLLABORATION STUDIO', { align: 'center' });
      doc
        .fillColor('#333333')
        .fontSize(14)
        .text(contractData.title || 'Producer & Contributor Agreement', { align: 'center' });
      doc.moveDown(2);

      // Metadata
      doc.fontSize(10).fillColor('#666666');
      doc.text(`Agreement Date: ${new Date().toLocaleDateString()}`);
      doc.text(`Version: v${contractData.versionNumber || 1}.0`);
      doc.text(`Contract ID: ${contractData._id || 'MCS-CONTRACT-2026-X'}`);
      doc.moveDown(1.5);

      // Terms Section
      doc.fontSize(12).fillColor('#111827').text('Terms & Legal Agreement', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#374151').text(contractData.terms || 'Standard Master Rights & Royalty Sharing Agreement.');
      doc.moveDown(2);

      // Royalty Split Table
      doc.fontSize(12).fillColor('#111827').text('Royalty Split Breakdown', { underline: true });
      doc.moveDown(0.5);

      if (contractData.splitBreakdown && contractData.splitBreakdown.length > 0) {
        contractData.splitBreakdown.forEach((split) => {
          doc
            .fontSize(10)
            .fillColor('#4b5563')
            .text(`• ${split.name} (${split.role || 'Contributor'}): ${split.percentage}% Split`);
        });
      } else {
        doc.fontSize(10).text('• Producer (Primary Owner): 100% Split');
      }

      doc.moveDown(2);

      // Signatures
      doc.fontSize(12).fillColor('#111827').text('Digital Signatures & Executions', { underline: true });
      doc.moveDown(1);

      if (contractData.signatures && contractData.signatures.length > 0) {
        contractData.signatures.forEach((sig) => {
          doc.fontSize(10).fillColor('#059669').text(`✔ Signed by User ID ${sig.user} at ${sig.signedAt || new Date()}`);
        });
      } else {
        doc.fontSize(10).fillColor('#dc2626').text('Pending Digital Signature Verification');
      }

      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateContractPDF };
