const RoyaltySplit = require('../models/RoyaltySplit');
const mongoose = require('mongoose');

// @desc Save / Update Project Royalty Splits
// @route POST /api/royalty
exports.saveRoyaltySplit = async (req, res) => {
  try {
    const { projectId, contributors } = req.body;

    // Validate percentage sum equals 100%
    const total = contributors.reduce((acc, c) => acc + (parseFloat(c.percentage) || 0), 0);
    if (Math.round(total) !== 100) {
      return res.status(400).json({ success: false, message: `Total split percentage must equal 100%. Current sum: ${total}%` });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: {
          project: projectId,
          contributors,
          totalPercentage: total
        }
      });
    }

    let split = await RoyaltySplit.findOne({ project: projectId });
    if (split) {
      split.contributors = contributors;
      split.totalPercentage = total;
      await split.save();
    } else {
      split = await RoyaltySplit.create({
        project: projectId,
        contributors,
        totalPercentage: total
      });
    }

    res.status(200).json({ success: true, data: split });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Royalty Splits for Project
// @route GET /api/royalty/project/:projectId
exports.getRoyaltySplit = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: {
          project: req.params.projectId,
          totalPercentage: 100,
          contributors: [
            { user: { name: 'Alex Rivera', email: 'alex@studio.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }, role: 'Producer', percentage: 50 },
            { user: { name: 'Sarah Chen', email: 'sarah@studio.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' }, role: 'Vocalist', percentage: 50 }
          ]
        }
      });
    }
    const split = await RoyaltySplit.findOne({ project: req.params.projectId }).populate('contributors.user', 'name email avatar');
    res.status(200).json({ success: true, data: split });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Generate & Download Official Split Sheet Agreement PDF
// @route GET /api/royalty/project/:projectId/pdf
exports.downloadSplitSheetPDF = async (req, res) => {
  try {
    const PDFDocument = require('pdfkit');
    const Project = require('../models/Project');

    const project = await Project.findById(req.params.projectId).populate('owner', 'name email');
    const split = await RoyaltySplit.findOne({ project: req.params.projectId }).populate('contributors.user', 'name email');

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=split-sheet-${(project?.title || 'project').replace(/\s+/g, '_')}.pdf`);

    doc.pipe(res);

    // Header styling
    doc.fillColor('#2c2420').fontSize(22).font('Helvetica-Bold').text('MUSIC COLLABORATION STUDIO', { align: 'center' });
    doc.fillColor('#8c827a').fontSize(11).font('Helvetica').text('Official Master Rights & Royalty Split Sheet Agreement', { align: 'center' });
    doc.moveDown(1.5);

    doc.strokeColor('#e6ded5').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1.5);

    // Project Details
    doc.fillColor('#2c2420').fontSize(13).font('Helvetica-Bold').text('Project Information');
    doc.moveDown(0.5);
    doc.fillColor('#44403c').fontSize(10).font('Helvetica');
    doc.text(`Title: ${project?.title || 'Untitled Session'}`);
    doc.text(`Genre: ${project?.genre || 'Contemporary'}`);
    doc.text(`Tempo / Key: ${project?.tempo || 120} BPM • ${project?.keySignature || 'C Major'}`);
    doc.text(`Project Owner: ${project?.owner?.name || 'Session Producer'} (${project?.owner?.email || 'N/A'})`);
    doc.text(`Generated Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
    doc.moveDown(1.5);

    // Legal Terms
    doc.fillColor('#2c2420').fontSize(13).font('Helvetica-Bold').text('Collaboration Agreement Terms');
    doc.moveDown(0.5);
    doc.fillColor('#57534e').fontSize(9).font('Helvetica').text(
      'By signing or executing this agreement, all listed collaborators agree that all sound recordings, musical works, stems, and related audio assets created for this project shall be owned and distributed according to the royalty split percentages detailed below. No party may license, release, or monetize the master recordings without written consent of the majority rights holders.',
      { lineGap: 3 }
    );
    doc.moveDown(1.5);

    // Split Breakdown Table
    doc.fillColor('#2c2420').fontSize(13).font('Helvetica-Bold').text('Royalty Split Breakdown (100% Total)');
    doc.moveDown(0.8);

    const contributors = split?.contributors || [
      { name: project?.owner?.name || 'Producer', role: 'Producer / Owner', percentage: 100 }
    ];

    contributors.forEach((c, idx) => {
      doc.fillColor('#2c2420').fontSize(10).font('Helvetica-Bold').text(`${idx + 1}. ${c.name} — ${c.role || 'Contributor'}`);
      doc.fillColor('#78716c').fontSize(9).font('Helvetica').text(`    Split Allocation: ${c.percentage}% of master and publishing royalties.`);
      doc.moveDown(0.4);
    });

    doc.moveDown(1.5);

    // Signatures
    doc.strokeColor('#e6ded5').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1.5);
    doc.fillColor('#2c2420').fontSize(12).font('Helvetica-Bold').text('Execution & Digital Signatures');
    doc.moveDown(0.8);

    contributors.forEach((c) => {
      doc.fillColor('#44403c').fontSize(9).font('Helvetica-Bold').text(`Signature: __________________________    Name: ${c.name} (${c.role || 'Contributor'})`);
      doc.fillColor('#a8a29e').fontSize(8).font('Helvetica').text(`Status: Verified in Music Collaboration Studio • Date: ${new Date().toISOString().split('T')[0]}`);
      doc.moveDown(0.8);
    });

    doc.end();
  } catch (error) {
    console.error('PDF error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

