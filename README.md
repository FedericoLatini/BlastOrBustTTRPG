# Blast or Bust TTRPG

A ruthless push-your-luck tabletop RPG forged in the ash wastes of ***Ten Earth Shattering Blows*** (by Nuclearpasta).  
**Game Design & System Architecture:** Federico Latini

---

## 📂 Repository Structure

```text
BlastOrBustTTRPG/
├── index.html                        # Main Web Showcase & Module Hub
├── core_rules.html                   # Module 0: Core Engine, Referee Screen, Introductory Adventure & 6 Pre-gens
├── module_1.html                     # Module 1: Character Creation, Advancement, Relics & Blank Sheet
├── module_2.html                     # Module 2: Procedural Obstacle Generation & Escalating Tension Die
├── campaign_ash_casket.html          # Official 3-Session Campaign: The Ash-Casket of Oasis-Nine
├── pdf/                              # Print-ready A4 PDF Editions
│   ├── Blast_or_Bust_Core_Rules_EN.pdf
│   ├── Blast_or_Bust_Module_1_EN.pdf
│   ├── Blast_or_Bust_Module_2_EN.pdf
│   └── Blast_or_Bust_Campaign_Ash_Casket_EN.pdf
├── assets/
│   └── img/
│       ├── core/                     # Core Rulebook & Hub artwork
│       ├── characters/               # Character Archetype portraits
│       └── campaign/                 # 10 Graphic Novel illustrations for The Ash-Casket of Oasis-Nine
├── docs/
│   └── campaign_the_ash_casket.md    # Campaign Markdown source & Referee Master Reference
└── scripts/
    └── generate_pdf.js               # Headless Edge PDF compiler script
```

---

## 🛠️ Compiling PDFs

To recompile the print-ready PDFs from the HTML modules using Microsoft Edge Headless:

```bash
# Compile all PDFs into pdf/
node scripts/generate_pdf.js

# Or compile a single module:
node scripts/generate_pdf.js core
node scripts/generate_pdf.js mod1
node scripts/generate_pdf.js mod2
node scripts/generate_pdf.js campaign
```
