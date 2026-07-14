# 🎓 AI-Powered Study Assistant & Companion Buddy

An immersive, full-stack academic dashboard built for students to supercharge their learning. It features a **RAG-based PDF Notes Chatbot** to query lecture slides, and an interactive **Study Buddy Pomodoro Timer** containing 4 unique AI companion personalities. The two modules are fused together via a **RAG Quiz Me** feature, where the chosen companion tests the student on their notes in character!

---

## ✨ Features

### 📄 Part 1: PDF Chat (RAG-based Q&A)
* **Drag-and-Drop Uploader:** Drop any school lecture slides or reading materials (PDF).
* **Document Registry:** Easily manage and swap between multiple indexed files in real-time.
* **Granular Context Citations:** Under every AI response, expand a custom panel showing the exact page number and text snippet used to synthesize the answer.
* **Zero-Setup Vector Search:** Uses a pure-Python, NumPy-driven vector store. There is no need for C++ compiled binary dependencies like FAISS/ChromaDB, ensuring 100% stability on Windows and new Python versions (3.14.0+).

### 👾 Part 2: Study Buddy (Companion Timer)
* **Animated SVG circular clock:** A beautiful glowing timer that depletes visually as focus ticks down.
* **Audio Synthesizer Buzzer:** Leverages the native browser Audio Context API to play clean alert tones upon timer completion without requiring local audio asset files.
* **4 Unique AI Companions:**
  1. **🌸 Hana (Anime Scholar):** Bubbly physics major, uses emojis, high-energy academic classmate.
  2. **🐱 CyberCat (Robo-Feline):** Cyberpunk cat who speaks in computer science puns and terminal purrs (`compiled.exe`).
  3. **🧘 ZenMaster (Sage Panda):** Calming mentor reminding you to take slow breaths, relax shoulders, and drink tea.
  4. **🤖 Rusty (Retro Robot):** Earnest but slightly anxious 1980s brass bot who clanks, beeps, and works hard for you.
* **Interactive Live Chat:** Talk to your companion during your session. They respond in character, referencing your exact timer remaining and study topic!

### 🛠️ The Connection: RAG Quiz Me!
* On-demand or post-session, click **"Quiz Me on Notes!"**.
* The active companion queries a random section of your uploaded lecture notes, constructs a multiple-choice question in their unique voice, and tests you.
* Picking an option reveals immediate companion feedback and academic explanations!

---

## 📦 Directory Structure

```
Study Assistant & Buddy/
├── backend/
│   ├── main.py            # FastAPI endpoints, CORS, uploads, buddy & quiz routes
│   ├── rag.py             # PDF text extraction, sliding window chunks, numpy vector indexing
│   ├── requirements.txt   # Backend python packages
│   └── .env.example       # Example server-side API Key setup
├── frontend/
│   ├── package.json       # React dependencies (Vite, React, Lucide-React)
│   ├── index.html         # Scaffolding document
│   └── src/
│       ├── main.jsx       # Mount script
│       ├── App.jsx        # Main component, tab routing, localStorage sync
│       ├── index.css      # Custom HSL palettes, glassmorphism UI, pulsing animations
│       └── components/
│           ├── PDFChat.jsx    # PDF dropzone, Chat window, accordion sources
│           ├── StudyBuddy.jsx # SVG timer, character gallery, companion chat, quiz overlays
│           └── Settings.jsx   # Locally saved client-side API Key settings panel
└── README.md              # Documentation
```

---

## 🚀 Quick Start Guide

### Step 1: Fire up the FastAPI Backend
1. Open your terminal in the `backend/` folder.
2. Activate the virtual environment:
   ```powershell
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   ```
3. Run the backend server using uvicorn:
   ```bash
   python main.py
   ```
   *The server runs locally at `http://localhost:8000`. You can inspect the interactive Swagger API docs at `http://localhost:8000/docs`!*

### Step 2: Spin up the React Frontend
1. Open another terminal in the `frontend/` folder.
2. Start the local dev server:
   ```bash
   npm run dev
   ```
3. Control-click the local URL displayed in the terminal (usually `http://localhost:5173`) to launch the application in your browser!

### Step 3: Configure AI & Learn!
1. In the app, navigate to **AI Settings** in the left sidebar.
2. Choose **Google Gemini** or **OpenAI**, paste your API Key, and click **Save Configuration**.
3. Head over to **Chat with Notes**, drop a PDF in, and start studying with your new companions!
