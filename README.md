# 🌍 GeoForge AI // Team NULLSEC

An Edge-to-Cloud hardware localization engine built for the **CREATE AND CONQUER HACKATHON 2026**.

## 🚀 The Innovation
Shipping pre-made humanitarian equipment across the world during a crisis is slow, carbon-heavy, and expensive. While open-source hardware blueprints exist, local aid workers cannot build them because exact components are unavailable locally. 

**GeoForge AI** is a localized blueprint adaptation engine. Utilizing an **Agora R1 Edge Hardware Kit** for real-time field vision/audio and a **Python FastAPI / Vector Database** backend, the system instantly translates restricted engineering parts lists into technically compatible, locally available materials. 

### 🎯 SDG Alignment
* **SDG 9 (Industry & Innovation):** Accelerates decentralized invention globally.
* **SDG 12 (Responsible Production):** Eliminates e-waste from mismatched component ordering.
* **SDG 17 (Partnerships):** Empowers grassroots execution through cross-border tech sharing.

---

## 👥 Team NULLSEC
* **Daniel Cosare** — *IoT, ML/AI & Edge Hardware (Agora R1 Kit)*
* **Jerome Benitez** — *Research, Development & Data Logic*
* **Ralph Silva** — *Lead Full-Stack Developer (React / FastAPI)*
* **Justine Nabuya** — *UI & UX Design*

---

## ⚙️ System Architecture

Our platform utilizes a decoupled Edge-to-Cloud SaaS architecture:

1. **The Edge (Input Layer):** The Agora R1 Kit (RiseLink BK7258) captures live workbench video and voice data via the Agora SDRTN.
2. **The Cloud (Backend):** Python (FastAPI) receives the stream, extracts component specifications using a Cascade Model, and queries Pinecone (Vector DB) for technically equivalent local parts.
3. **The Interface (Frontend):** A lightning-fast React (Vite) + Tailwind CSS dashboard displays the translated operational roadmap and localized checkout carts.

---

## 💻 Local Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* [Python](https://www.python.org/) (3.10+)
* Agora Developer Account & App ID

### 1. Start the FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
# Requires: fastapi, uvicorn, flask-cors, supabase, pinecone-client
python main.py
```
