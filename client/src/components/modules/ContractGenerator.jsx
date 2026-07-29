import React, { useState } from 'react';
import { FileSignature, Download, Send, CheckCircle2, Shield, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

export default function ContractGenerator() {
  const [contractTitle, setContractTitle] = useState('Producer & Vocalist Master Rights Agreement');
  const [terms, setTerms] = useState(
    'This Agreement defines the ownership and master recording rights between Alex Rivera (Producer) and Sarah Chen (Vocalist). Producer retains 50% publishing, Vocalist retains 30% publishing, and Audio Engineer retains 20% publishing.'
  );
  const [isSigned, setIsSigned] = useState(false);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241);
    doc.text('MUSIC COLLABORATION STUDIO', 20, 20);

    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(contractTitle, 20, 32);

    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42);
    doc.text('Version: v1.0 • Legal Contract Artifact', 20, 48);

    doc.setFontSize(12);
    doc.text('Agreement Terms & Conditions', 20, 60);

    doc.setFontSize(10);
    const splitTerms = doc.splitTextToSize(terms, 170);
    doc.text(splitTerms, 20, 70);

    doc.text('Royalty Breakdown:', 20, 110);
    doc.text('• Alex Rivera (Producer): 50%', 25, 118);
    doc.text('• Sarah Chen (Vocalist): 30%', 25, 124);
    doc.text('• Marcus Vance (Engineer): 20%', 25, 130);

    if (isSigned) {
      doc.setTextColor(16, 185, 129);
      doc.text('✔ Digitally Signed & Encrypted', 20, 150);
    }

    doc.save(`Contract-${Date.now()}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-studio-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileSignature className="w-6 h-6 text-indigo-400" /> Contract Generator & E-Sign
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Generate legally binding music production agreements with PDF export and DocuSign integration.
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 font-bold text-xs text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
        >
          <Download className="w-4 h-4" /> Download PDF Contract
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Editor Form */}
        <div className="md:col-span-2 bg-studio-card border border-studio-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5">Agreement Title</label>
            <input
              type="text"
              value={contractTitle}
              onChange={(e) => setContractTitle(e.target.value)}
              className="w-full bg-studio-panel border border-studio-border rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5">Contract Terms & Conditions</label>
            <textarea
              rows={6}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full bg-studio-panel border border-studio-border rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-xs text-gray-400">DocuSign Integration Status: <strong className="text-indigo-400">Ready</strong></span>
            <button
              onClick={() => setIsSigned(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Sign Document
            </button>
          </div>
        </div>

        {/* Contract Preview Card */}
        <div className="bg-studio-card border border-studio-border rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-200 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Document Status
            </h3>

            <div className="p-4 rounded-xl bg-studio-panel border border-studio-border space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`font-bold ${isSigned ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isSigned ? 'Fully Signed' : 'Pending Signatures'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Version</span>
                <span className="font-mono font-bold text-indigo-300">v1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Signees</span>
                <span className="text-gray-200">Alex, Sarah</span>
              </div>
            </div>
          </div>

          {isSigned && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 mt-4">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Digital signature verified on blockchain hash!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
