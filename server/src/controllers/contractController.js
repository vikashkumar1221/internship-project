const Contract = require('../models/Contract');
const { generateContractPDF } = require('../services/pdfService');
const { createDocuSignEnvelope } = require('../services/docusignService');
const path = require('path');

// @desc Generate Legal Agreement & Export PDF
// @route POST /api/contracts/generate
exports.generateContract = async (req, res) => {
  try {
    const { projectId, title, terms, splitBreakdown } = req.body;

    const contract = await Contract.create({
      project: projectId,
      title: title || 'Producer & Contributor Agreement',
      terms: terms || 'Standard Master Sound Recording & Publishing Royalty Split Agreement.',
      splitBreakdown,
      status: 'Pending Signatures'
    });

    // Generate PDF File using PDFKit Service
    const pdfFileName = `Contract-${contract._id}.pdf`;
    const pdfPath = path.join(__dirname, '../../uploads', pdfFileName);
    await generateContractPDF(contract, pdfPath);

    contract.pdfFileUrl = `/uploads/${pdfFileName}`;
    await contract.save();

    res.status(201).json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Send for DocuSign E-Signature
// @route POST /api/contracts/:id/send-esignature
exports.sendForESignature = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    const envelope = await createDocuSignEnvelope(
      contract.title,
      req.user.email,
      req.user.name,
      null
    );

    contract.docusignEnvelopeId = envelope.envelopeId;
    contract.status = 'Pending Signatures';
    await contract.save();

    res.status(200).json({
      success: true,
      message: 'DocuSign E-Signature envelope initiated',
      envelope
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Contracts for Project
// @route GET /api/contracts/project/:projectId
exports.getContractsByProject = async (req, res) => {
  try {
    const contracts = await Contract.find({ project: req.params.projectId }).sort('-createdAt');
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
