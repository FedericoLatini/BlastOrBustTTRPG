const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlFile = path.resolve(__dirname, 'core_rules.html');
const targetPdf = path.resolve(__dirname, 'Blast_or_Bust_Core_Rules_EN.pdf');
const latestPdf = path.resolve(__dirname, 'Blast_or_Bust_Core_Rules_EN_latest.pdf');
const tempDir = path.resolve(__dirname, 'temp_edge_profile');

// Always compile to a fresh temporary build first
const buildPdf = path.resolve(__dirname, 'temp_build.pdf');
if (fs.existsSync(buildPdf)) {
  try { fs.unlinkSync(buildPdf); } catch (e) {}
}

const command = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${buildPdf}" --user-data-dir="${tempDir}" "file:///${htmlFile.replace(/\\/g, '/')}"`;

console.log('Compiling PDF from core_rules.html...');
try {
  execSync(command, { stdio: 'inherit' });
  if (fs.existsSync(buildPdf)) {
    // Always keep latest copy
    fs.copyFileSync(buildPdf, latestPdf);
    console.log('Saved latest build to:', latestPdf);

    // Try to update master target
    try {
      fs.copyFileSync(buildPdf, targetPdf);
      console.log('Master target updated successfully at:', targetPdf);
    } catch (lockErr) {
      console.log('Note: Master PDF is currently open/locked in viewer (Foxit/Acrobat).');
      console.log('Updated version is available at:', latestPdf);
    }
    try { fs.unlinkSync(buildPdf); } catch (e) {}
  }
} catch (err) {
  console.error('Error during PDF compilation:', err);
}
