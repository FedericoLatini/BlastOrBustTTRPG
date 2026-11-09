const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const rootDir = path.resolve(__dirname, '..');
const pdfDir = path.resolve(rootDir, 'pdf');
const tempProfileDir = path.join(os.tmpdir(), 'blast_or_bust_edge_profile');

if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

function compilePdf(htmlFileName, targetPdfName) {
  const htmlFile = path.resolve(rootDir, htmlFileName);
  const targetPdf = path.resolve(pdfDir, targetPdfName);
  const baseName = targetPdfName.replace('.pdf', '');
  const buildPdf = path.join(os.tmpdir(), `temp_${baseName}.pdf`);

  if (fs.existsSync(buildPdf)) {
    try { fs.unlinkSync(buildPdf); } catch (e) {}
  }

  const command = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${buildPdf}" --user-data-dir="${tempProfileDir}" "file:///${htmlFile.replace(/\\/g, '/')}"`;

  console.log(`\nCompiling PDF from ${htmlFileName} -> pdf/${targetPdfName}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    if (fs.existsSync(buildPdf)) {
      try {
        fs.copyFileSync(buildPdf, targetPdf);
        console.log(`Updated PDF at: ${targetPdf}`);
      } catch (lockErr) {
        const fallbackPdf = path.resolve(pdfDir, `${baseName}_latest.pdf`);
        fs.copyFileSync(buildPdf, fallbackPdf);
        console.log(`Note: Target PDF is currently open/locked in viewer. Saved fallback to: ${fallbackPdf}`);
      }
      try { fs.unlinkSync(buildPdf); } catch (e) {}
    }
  } catch (err) {
    console.error(`Error compiling ${htmlFileName}:`, err);
  }
}

const target = process.argv[2];
if (target === 'core') {
  compilePdf('core_rules.html', 'Blast_or_Bust_Core_Rules_EN.pdf');
} else if (target === 'module_1' || target === 'mod1') {
  compilePdf('module_1.html', 'Blast_or_Bust_Module_1_EN.pdf');
} else if (target === 'module_2' || target === 'mod2') {
  compilePdf('module_2.html', 'Blast_or_Bust_Module_2_EN.pdf');
} else if (target === 'campaign' || target === 'camp') {
  compilePdf('campaign_ash_casket.html', 'Blast_or_Bust_Campaign_Ash_Casket_EN.pdf');
} else {
  compilePdf('core_rules.html', 'Blast_or_Bust_Core_Rules_EN.pdf');
  compilePdf('module_1.html', 'Blast_or_Bust_Module_1_EN.pdf');
  compilePdf('module_2.html', 'Blast_or_Bust_Module_2_EN.pdf');
  compilePdf('campaign_ash_casket.html', 'Blast_or_Bust_Campaign_Ash_Casket_EN.pdf');
}
