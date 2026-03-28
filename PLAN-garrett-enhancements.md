# PLAN-garrett-enhancements.md

## Overview
This plan outlines the enhancements for the Garrett Ranking tool in ScholarStack, focusing on **Option A (The Transparent Mathematician)** and **Option C (The Publication-Ready Visualizer)**. The goal is to provide researchers with a verifiable, high-quality tool for academic publications.

## Project Type: WEB

## Success Criteria
1. **Build Success**: `npm run build` completes without errors.
2. **Methodology Audit**: An expandable section in the Results view showing step-by-step calculation (Percent Position -> Garrett Value) for up to 300 respondents.
3. **APA Export**: One-click "Table Export" matching APA citation standards.
4. **Interactive Visualization**: A functional rank distribution heatmap and high-resolution SVG export capability.
5. **Formulas**: 100% adherence to Garrett Ranking formula: $100 \times (R_{ij} - 0.5) / N_j$.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion.
- **Backend/Logic**: TypeScript (Pure formula implementation).
- **Visualization**: Chart.js 4.x, React-Chartjs-2.
- **Exporting**: jsPDF (PDF), XLSX (Excel), SVG-Crowbar or similar (SVG).

## Task Breakdown

### Phase 1: Environment & Stability (P0)
| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|--------------------------|
| 1.1 | Fix Build Environment | `devops-engineer` | clean-code | P0 | None | `package.json` → `node_modules` → `npm run build` passes |
| 1.2 | Verify Build Health | `test-engineer` | webapp-testing | P0 | 1.1 | build artifacts → success output → `python .agent/scripts/checklist.py .` |

### Phase 2: Methodology Audit (P1)
| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|--------------------------|
| 2.1 | UI: Audit Toggle | `frontend-specialist` | frontend-design | P1 | 1.2 | `GarrettModule.tsx` → Expandable Section → Section toggles correctly |
| 2.2 | Logic: Conversion Data | `backend-specialist` | api-patterns | P1 | 2.1 | `garrett.ts` → Detailed conversion array → UI displays correct numbers |
| 2.3 | UI: Excel Audit Export | `frontend-specialist` | clean-code | P1 | 2.2 | results data → "Audit.xlsx" download → Excel contains all steps |

### Phase 3: Academic Visualization (P2)
| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|--------------------------|
| 3.1 | UI: APA Table Component | `frontend-specialist` | frontend-design | P2 | 2.3 | results data → APA-styled table → Table matches APA font/spacing |
| 3.2 | Logic: SVG Export | `frontend-specialist` | clean-code | P2 | 3.1 | Chart context → SVG blob → High-res SVG download successful |
| 3.3 | UI: Refine Heatmap | `frontend-specialist` | frontend-design | P2 | 3.2 | Ranking distribution → Color-coded heatmap → Visual clarity for 300 reps |

## Phase X: Verification
- [ ] `npm run build` completes successfully.
- [ ] No purple/violet hex codes used (Design Rule).
- [ ] No standard template layouts used (Design Rule).
- [ ] Socratic Gate was respected during creation.
- [ ] `python .agent/scripts/verify_all.py .` returns success.

---
## ✅ PHASE X COMPLETE
- Lint: [ ]
- Security: [ ]
- Build: [ ]
- Date: 2026-03-25
