<!-- Template note: same layout as VIRO_README.md. Search for "EDIT:" for the spots that need your repo-specific details. -->

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:050816,50:0E7490,100:7E22CE&height=190&section=header&text=FraudShield&fontSize=58&fontColor=FFFFFF&animation=fadeIn&fontAlignY=36&desc=Explainable%20Cost-Sensitive%20Fraud%20Detection%20%C2%B7%20SHAP%20%C2%B7%20FastAPI&descAlignY=58&descSize=16" width="100%" alt="FraudShield banner" />

<a href="https://fraudshield-sable.vercel.app">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=21&duration=3000&pause=900&color=22D3EE&center=true&vCenter=true&width=900&lines=Fraud+detection+on+284%2C807+transactions+(~0.17%25+fraud);Leakage-safe+evaluation+%2B+threshold+optimization;PR-AUC+0.803+%C2%B7+86.9%25+precision+%C2%B7+76.8%25+recall;Every+prediction+explained+with+SHAP" alt="Typing SVG" />
</a>

<br/>

<a href="https://fraudshield-sable.vercel.app"><img src="https://img.shields.io/badge/%F0%9F%8C%90%20Live%20demo-fraudshield-22D3EE?style=for-the-badge&labelColor=050816" alt="Live demo" /></a>
<a href="https://fraudshield-sable.vercel.app/research"><img src="https://img.shields.io/badge/%F0%9F%93%84%20Research-page-7E22CE?style=for-the-badge&labelColor=050816" alt="Research page" /></a>
<a href="https://github.com/AsjidSiddique/Fraudshield"><img src="https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="Source" /></a>
<a href="https://asjid-siddique-chi.vercel.app/projects/fraudshield"><img src="https://img.shields.io/badge/Portfolio-case%20study-050816?style=for-the-badge&logo=vercel&logoColor=22D3EE" alt="Portfolio case study" /></a>

<br/>

<img src="https://skillicons.dev/icons?i=python,sklearn,pytorch,numpy,pandas,fastapi,nextjs,vercel,git&theme=dark" alt="Tools" />
<br/>
<img src="https://img.shields.io/badge/SHAP-8957E5?style=flat-square" alt="SHAP" />
<img src="https://img.shields.io/badge/Random_Forest-0E7490?style=flat-square" alt="Random Forest" />
<img src="https://img.shields.io/badge/PyTorch_MLP-EE4C2C?style=flat-square&logo=pytorch&logoColor=white" alt="PyTorch MLP" />
<img src="https://img.shields.io/github/last-commit/AsjidSiddique/Fraudshield?style=flat-square&color=0E7490" alt="Last commit" />

</div>

---

## 🧭 About

**FraudShield** is an end-to-end machine-learning system for **highly imbalanced fraud detection**. Instead of chasing accuracy (meaningless when only ~0.17% of transactions are fraud), it focuses on what matters: **leak-free evaluation, a principled decision threshold, and explanations for every prediction.**

---

## 🏆 Results (untouched final test set)

<div align="center">

| Transactions | Fraud rate | PR-AUC | Precision | Recall | F1 |
|:-:|:-:|:-:|:-:|:-:|:-:|
| **284,807** | **~0.17%** | **0.803** | **86.9%** | **76.8%** | **81.6%** |

</div>

> Selected model: **Random Forest**. Precision / recall / F1 are measured at the threshold optimized on the **validation** set, then applied once to the final test set.

---

## ✨ Highlights

- 🧪 **No data leakage** — preprocessing is fitted on the training split only; the final test set is never touched during tuning
- ⚖️ **Right metrics for imbalance** — ROC-AUC, **PR-AUC**, precision, recall and F1 (not accuracy)
- 🎚️ **Threshold optimization** — the decision threshold is chosen on validation data, not left at an arbitrary 0.5
- 🤖 **Model comparison** — Logistic Regression · Random Forest · HistGradientBoosting · PyTorch MLP
- 🔍 **Explainable** — SHAP shows which features push each transaction toward fraud
- 🌐 **Deployable** — FastAPI inference service with a Next.js front end

---

## 🏗️ Pipeline

```mermaid
flowchart LR
    A[(284,807<br/>transactions)] --> B[Train / val / test<br/>split]
    B --> C[Train-only<br/>preprocessing]
    C --> D[Train 4 models<br/>LR · RF · HGB · MLP]
    D --> E[Compare on validation<br/>ROC-AUC · PR-AUC · F1]
    E --> F[Pick Random Forest<br/>PR-AUC 0.803]
    F --> G[Optimize threshold<br/>on validation]
    G --> H{{One-time evaluation<br/>on untouched test set}}
    F --> I[SHAP<br/>explanations]
    H --> J[FastAPI<br/>inference]
    I --> J
    J --> K([Next.js demo])
```

---

## 🤖 Models compared

| Model | Family | Why it's in the comparison | Outcome |
|---|---|---|---|
| **Logistic Regression** | Linear | Simple, interpretable baseline | Compared |
| **Random Forest** | Tree ensemble (bagging) | Strong on tabular, imbalanced data | ✅ **Selected** — PR-AUC **0.803** · precision **86.9%** · recall **76.8%** · F1 **81.6%** |
| **HistGradientBoosting** | Gradient-boosted trees | Modern boosted-tree contender | Compared |
| **PyTorch MLP** | Neural network | Tests whether deep learning beats trees on this data | Compared |

**Evaluation metrics:** ROC-AUC · **PR-AUC** · precision · recall · F1 · cost-sensitive evaluation  
**Explainability:** **SHAP** on the selected model  
**Serving:** FastAPI inference service

> Full per-model numbers are on the [research page](https://fraudshield-sable.vercel.app/research). <!-- EDIT: add the other models' PR-AUC values here if you want them in the README -->

---

## 🧰 Tech stack

| Area | Tools |
|---|---|
| Language | Python |
| Classical ML | Scikit-learn (Logistic Regression, Random Forest, HistGradientBoosting) |
| Deep learning | PyTorch (MLP) |
| Data | Pandas · NumPy |
| Explainability | SHAP |
| Serving | FastAPI |
| Front end | Next.js · Vercel |

---

## 🚀 Getting started

```bash
git clone https://github.com/AsjidSiddique/Fraudshield.git
cd Fraudshield
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt                       # EDIT: your requirements file
```

```bash
# EDIT: replace with your real entry points / notebooks
python scripts/train.py            # train + compare models
python scripts/evaluate.py         # final test-set metrics
uvicorn api.main:app --reload      # FastAPI inference service
```

> 📦 **Data:** place the transactions CSV at `data/` — <!-- EDIT: add dataset name + link/licence -->

---

## 🗂️ Project structure

<!-- EDIT: paste the output of `tree -L 2 -I "node_modules|.venv|__pycache__"` -->

```text
Fraudshield/
├── data/          # dataset (not committed)
├── src/           # preprocessing, models, evaluation, SHAP
├── api/           # FastAPI service
├── web/           # Next.js front end
└── docs/          # figures and results
```

---

## ⚠️ Notes & limitations

- This is a **research / portfolio project**: the dataset and cost assumptions are **illustrative**, not a real banking production system.
- Features in this kind of dataset are anonymized, so SHAP explanations show *which* features matter, not human-readable business reasons.

---

## 🔗 Links

| | |
|---|---|
| **🌐 Live demo** | [fraudshield-sable.vercel.app](https://fraudshield-sable.vercel.app) |
| **💻 Source code** | [github.com/AsjidSiddique/Fraudshield](https://github.com/AsjidSiddique/Fraudshield) |
| **📄 Research page** | [fraudshield-sable.vercel.app/research](https://fraudshield-sable.vercel.app/research) |
| **🗂️ Portfolio case study** | [asjid-siddique-chi.vercel.app/projects/fraudshield](https://asjid-siddique-chi.vercel.app/projects/fraudshield) |
| **🧑‍💻 My portfolio** | [asjid-siddique-chi.vercel.app](https://asjid-siddique-chi.vercel.app) |
| **📑 Resume** | [asjid-siddique-chi.vercel.app/resume](https://asjid-siddique-chi.vercel.app/resume) |
| **💼 LinkedIn** | [linkedin.com/in/asjidsiddique469](https://www.linkedin.com/in/asjidsiddique469/) |
| **🐙 GitHub profile** | [github.com/AsjidSiddique](https://github.com/AsjidSiddique) |

### 🚀 More projects

| Project | What it is | Source | Portfolio |
|---|---|---|---|
| **PCBDefect-X** | Deep-learning PCB defect detection | [GitHub](https://github.com/AsjidSiddique/PCBDefect-X) | [Case study](https://asjid-siddique-chi.vercel.app/projects/pcbdefect-x) |
| **Viro.pk** | Production e-commerce platform | [GitHub](https://github.com/AsjidSiddique/VIRO) | [Case study](https://asjid-siddique-chi.vercel.app/projects/viro) |
| **OS Kernel Simulator** | CPU scheduling & paging simulator | [GitHub](https://github.com/AsjidSiddique/OS-Kernel-Simulator) | [Case study](https://asjid-siddique-chi.vercel.app/projects/os-kernel-simulator) |

---

## 👨‍💻 Author

<div align="center">

**Asjid Siddique** — Software Engineering student @ NUST · Building toward AI/ML research

<a href="https://asjid-siddique-chi.vercel.app"><img src="https://img.shields.io/badge/Portfolio-050816?style=for-the-badge&logo=vercel&logoColor=22D3EE" alt="Portfolio" /></a>
<a href="https://github.com/AsjidSiddique"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
<a href="https://www.linkedin.com/in/asjidsiddique469/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
<a href="mailto:asjadsaddique4@gmail.com"><img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>

<br/><br/>

⭐ If you find this useful, a star on the repo means a lot.

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:7E22CE,50:0E7490,100:050816&height=110&section=footer" width="100%" alt="footer" />

</div>
