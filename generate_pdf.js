const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tempDir = path.resolve(__dirname, 'temp_edge_profile');

function compilePdf(htmlFileName, targetPdfName) {
  const htmlFile = path.resolve(__dirname, htmlFileName);
  const targetPdf = path.resolve(__dirname, targetPdfName);
  const baseName = targetPdfName.replace('.pdf', '');
  const latestPdf = path.resolve(__dirname, `${baseName}_latest.pdf`);
  const buildPdf = path.resolve(__dirname, `temp_${baseName}.pdf`);

  if (fs.existsSync(buildPdf)) {
    try { fs.unlinkSync(buildPdf); } catch (e) {}
  }

  const command = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${buildPdf}" --user-data-dir="${tempDir}" "file:///${htmlFile.replace(/\\/g, '/')}"`;

  console.log(`\nCompiling PDF from ${htmlFileName} -> ${targetPdfName}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    if (fs.existsSync(buildPdf)) {
      fs.copyFileSync(buildPdf, latestPdf);
      console.log(`Saved latest build to: ${latestPdf}`);

      try {
        fs.copyFileSync(buildPdf, targetPdf);
        console.log(`Master target updated successfully at: ${targetPdf}`);
      } catch (lockErr) {
        console.log(`Note: Master PDF is currently open/locked in viewer. Latest copy: ${latestPdf}`);
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
} else {
  // Compile both by default
  compilePdf('core_rules.html', 'Blast_or_Bust_Core_Rules_EN.pdf');
  compilePdf('module_1.html', 'Blast_or_Bust_Module_1_EN.pdf');
}
