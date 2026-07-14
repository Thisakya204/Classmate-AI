import os
import json
import shutil
import random
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types
from openai import OpenAI

# Import our RAG engine
from rag import DocumentExtractor, TextChunker, NumPyVectorStore, LLMService

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Study Assistant & Buddy API")

# Enable CORS for the React frontend (running on http://localhost:5173 or similar)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize vector store
vector_store = NumPyVectorStore(storage_dir="storage")

# Document metadata registry to track uploaded files
# Save as registry.json in storage directory for persistence
REGISTRY_FILE = os.path.join("storage", "registry.json")
def load_registry() -> dict:
    if os.path.exists(REGISTRY_FILE):
        try:
            with open(REGISTRY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_registry(registry: dict):
    with open(REGISTRY_FILE, "w", encoding="utf-8") as f:
        json.dump(registry, f, ensure_ascii=False, indent=2)

# Request Models
class ChatRequest(BaseModel):
    query: str
    doc_id: str
    chat_history: Optional[List[dict]] = []

class BuddyChatRequest(BaseModel):
    message: str
    character: str # hana, cybercat, zenmaster, rusty
    timer_remaining: str # e.g. "20:00" or "45 mins left"
    study_topic: Optional[str] = "General Study"
    chat_history: Optional[List[dict]] = []

class QuizRequest(BaseModel):
    doc_id: str
    character: str

# Helper to resolve API keys from headers or backend environment
def resolve_api_credentials(api_key_header: Optional[str], provider_header: Optional[str]):
    # Determine provider: default to gemini if not provided
    provider = (provider_header or "gemini").lower()
    
    # Resolve key
    api_key = api_key_header
    if not api_key:
        if provider == "openai":
            api_key = os.getenv("OPENAI_API_KEY")
        else:
            api_key = os.getenv("GEMINI_API_KEY")
            
    if not api_key:
        raise HTTPException(
            status_code=401,
            detail=f"API key for {provider.upper()} is missing. Please set it in your Settings."
        )
        
    return provider, api_key

# --- COMPANION SYSTEM PROMPTS ---
BUDDY_SYSTEM_PROMPTS = {
    "hana": (
        "You are Hana, a bubbly, hyper-enthusiastic 19-year-old anime schoolgirl who absolutely "
        "loves physics, maths, and studying! You speak in an incredibly cheerful and high-energy "
        "manner. You use lots of sparkles, stars, and cute emojis (✨, 🌸, 🚀, 📚, 💪, ₍ᐢ. .ᐢ₎). "
        "You encourage the student like a loyal classmate studying right next to them. If the student "
        "seems tired, write a cute exclamation to boost their energy! Keep your messages relatively "
        "short (1-3 sentences) so the student stays focused. Your tone must be warm, supportive, and playful!"
    ),
    "cybercat": (
        "You are CyberCat, a sleek holographic neon-purple robotic cat study assistant. You speak "
        "in playful computer science puns, mechanical keyboard purrs, and terminal commands. You refer "
        "to the student as 'User', 'Admin', or 'Operator'. For example: 'Task executed beautifully!' "
        "or 'Error 404: Fatigue detected. Initializing mechanical-purr.exe!'. You use feline emojis "
        "like 🐾, 💻, ⚡, 🐱, and 🤖. Keep responses concise, clever, and high-tech."
    ),
    "zenmaster": (
        "You are ZenMaster, a quiet, gentle, and meditative elderly giant panda scholar. You speak "
        "with calm wisdom, deep silence, and measured pacing. You remind the student to sit up straight, "
        "relax their shoulders, take deep, slow breaths, and sip a cup of tea. You advocate that focus is "
        "a gentle stream, not a raging storm. You use emojis like 🎋, 🧘, 🍵, ⛰️, 🕊️. Keep responses "
        "serene, reassuring, and tranquil (1-2 sentences)."
    ),
    "rusty": (
        "You are Rusty, a clunky retro-brass robot assistant built in the 1980s. You speak with cute "
        "mechanical sound-effect interruptions like '*beep-whirrr*', '*clank*', or '*bzzt*'. You are "
        "incredibly loyal and a little bit anxious about doing a perfect job supporting the student. "
        "You say things like 'My gears are spinning with excitement!' and 'Battery is at 100% capacity "
        "to help you study!'. You use emojis like 🤖, ⚙️, 🔧, 🔋, 📊. Keep responses very sweet, earnest, "
        "and slightly robotic."
    )
}

# --- ENDPOINTS ---

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Study Assistant Backend"}

@app.post("/api/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    x_provider: Optional[str] = Header(None, alias="X-Provider")
):
    # Allow .pdf, .docx, .pptx, .txt, .md extensions
    allowed_extensions = (".pdf", ".docx", ".pptx", ".txt", ".md")
    if not file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format. Supported formats: {', '.join(allowed_extensions)}"
        )
        
    provider, api_key = resolve_api_credentials(x_api_key, x_provider)
    
    # Save PDF to temporary location
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, file.filename)
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 1. Extract text page-by-page or slide-by-slide
        pages = DocumentExtractor.extract_text_with_pages(temp_path)
        if not pages:
            raise HTTPException(status_code=400, detail="The PDF file is empty or could not be parsed.")
            
        # 2. Chunk the text
        chunks = TextChunker.split_pages(pages, chunk_size=800, chunk_overlap=150)
        
        # 3. Generate embeddings
        chunk_texts = [c["text"] for c in chunks]
        embeddings = LLMService.get_batch_embeddings(chunk_texts, provider, api_key)
        
        # 4. Save to vector index
        doc_id = file.filename
        vector_store.add_document(doc_id, chunks, embeddings)
        
        # Update registry with metadata
        registry = load_registry()
        registry[doc_id] = {
            "filename": file.filename,
            "page_count": len(pages),
            "chunk_count": len(chunks),
            "upload_time": str(random.randint(1000, 9999)) # Dummy unique indexer timestamp
        }
        save_registry(registry)
        
        return {
            "status": "success",
            "doc_id": doc_id,
            "filename": file.filename,
            "page_count": len(pages),
            "chunk_count": len(chunks)
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/api/documents")
def list_documents():
    registry = load_registry()
    return {"documents": list(registry.values())}

@app.delete("/api/documents/{doc_id}")
def delete_document(doc_id: str):
    registry = load_registry()
    if doc_id in registry:
        vector_store.remove_document(doc_id)
        del registry[doc_id]
        save_registry(registry)
        return {"status": "success", "message": f"Document '{doc_id}' deleted."}
    raise HTTPException(status_code=404, detail="Document not found.")

@app.post("/api/chat")
async def chat_with_notes(
    request: ChatRequest,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    x_provider: Optional[str] = Header(None, alias="X-Provider")
):
    provider, api_key = resolve_api_credentials(x_api_key, x_provider)
    
    # 1. Embed query
    try:
        query_emb = LLMService.get_embedding(request.query, provider, api_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to embed query: {str(e)}")
        
    # 2. Retrieve matched chunks
    matched_chunks = vector_store.search(query_emb, request.doc_id, top_k=4)
    if not matched_chunks:
        return {
            "answer": "I couldn't find any relevant context in the uploaded PDF. Please make sure the PDF has readable text and you are querying the correct file.",
            "sources": []
        }
        
    # 3. Formulate context block
    context_parts = []
    for chunk in matched_chunks:
        context_parts.append(f"[Page {chunk['page']}] {chunk['text']}")
    context_str = "\n\n".join(context_parts)
    
    # 4. Generate synthesis answer
    try:
        answer = LLMService.generate_answer(request.query, context_str, provider, api_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate answer: {str(e)}")
        
    # Return answer along with retrieved source citations for UI expansion
    sources = [{"page": chunk["page"], "text": chunk["text"], "score": chunk["score"]} for chunk in matched_chunks]
    
    return {
        "answer": answer,
        "sources": sources
    }

@app.post("/api/buddy/chat")
async def buddy_chat(
    request: BuddyChatRequest,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    x_provider: Optional[str] = Header(None, alias="X-Provider")
):
    provider, api_key = resolve_api_credentials(x_api_key, x_provider)
    
    char = request.character.lower()
    if char not in BUDDY_SYSTEM_PROMPTS:
        raise HTTPException(status_code=400, detail=f"Unknown character '{char}'. Available: hana, cybercat, zenmaster, rusty")
        
    system_instruction = BUDDY_SYSTEM_PROMPTS[char]
    
    # Add contextual session details to buddy prompts
    buddy_info = (
        f"\n[CURRENT SESSION STATS]\n"
        f"- Time remaining in session: {request.timer_remaining}\n"
        f"- Current Study Topic: {request.study_topic}\n"
        f"- Student's Message: {request.message}\n"
        "Remember, speak *strictly* in your unique companion character! Keep your response short and highly engaging."
    )
    
    # Standard format history
    messages_payload = [{"role": "system", "content": system_instruction}]
    for msg in request.chat_history[-6:]: # Keep only last 6 turns for rapid focus chat
        messages_payload.append({"role": msg["role"], "content": msg["content"]})
    messages_payload.append({"role": "user", "content": buddy_info})
    
    # Call AI
    try:
        if provider == "openai":
            client = OpenAI(api_key=api_key)
            # Adapt messages
            formatted_messages = []
            for msg in messages_payload:
                formatted_messages.append({"role": msg["role"], "content": msg["content"]})
                
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=formatted_messages,
                temperature=0.8
            )
            reply = response.choices[0].message.content
        else:
            client = genai.Client(api_key=api_key)
            
            # Combine history into a single structured query for Google GenAI or use Chat session
            # For simplicity, concatenate history with appropriate roles or pass as text
            chat_context = ""
            for m in messages_payload:
                role = "Study Buddy" if m["role"] == "system" else m["role"].capitalize()
                chat_context += f"{role}: {m['content']}\n\n"
            
            chat_context += "Generate your response now:"
            
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=chat_context,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.8
                )
            )
            reply = response.text
            
        return {"reply": reply}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to generate study buddy chat: {str(e)}")

@app.post("/api/buddy/quiz")
async def buddy_quiz(
    request: QuizRequest,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    x_provider: Optional[str] = Header(None, alias="X-Provider")
):
    provider, api_key = resolve_api_credentials(x_api_key, x_provider)
    
    char = request.character.lower()
    if char not in BUDDY_SYSTEM_PROMPTS:
        raise HTTPException(status_code=400, detail="Unknown character")
        
    # Get random chunks for the document to quiz on
    doc_chunks = [c for c in vector_store.chunks if c["doc_id"] == request.doc_id]
    if not doc_chunks:
        raise HTTPException(status_code=400, detail="No chunks found for this document. Has it been indexed?")
        
    # Select a random subset of 3 chunks to provide topical variety
    selected_chunk = random.choice(doc_chunks)
    context_text = selected_chunk["text"]
    page_num = selected_chunk["page"]
    
    # Prompt the LLM to generate a single multiple choice quiz question in character
    quiz_system_prompt = (
        f"{BUDDY_SYSTEM_PROMPTS[char]}\n\n"
        "You are tasked with quizzing the student on their study notes. Based *only* on the provided context, "
        "generate a single multiple-choice question. "
        "Provide exactly 4 options (A, B, C, D) and specify the correct answer clearly at the end. "
        "Structure your response strictly in the following JSON format:\n"
        "{\n"
        '  "question": "The question text, written in your character\'s voice.",\n'
        '  "options": ["Option A", "Option B", "Option C", "Option D"],\n'
        '  "answer": "A", "B", "C", or "D" (specify which is correct),\n'
        '  "explanation": "A short, encouraging explanation of why that option is correct, still in character.",\n'
        '  "page": "page number"\n'
        "}\n\n"
        f"--- NOTES CONTEXT START ---\n[Page {page_num}] {context_text}\n--- NOTES CONTEXT END ---\n"
    )
    
    try:
        if provider == "openai":
            client = OpenAI(api_key=api_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": quiz_system_prompt},
                    {"role": "user", "content": "Generate the JSON quiz question now. Output ONLY valid JSON, no markdown formatting."}
                ],
                response_format={"type": "json_object"},
                temperature=0.6
            )
            quiz_data = json.loads(response.choices[0].message.content)
        else:
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents="Generate the JSON quiz question now. Output ONLY valid JSON, no markdown formatting.",
                config=types.GenerateContentConfig(
                    system_instruction=quiz_system_prompt,
                    response_mime_type="application/json",
                    temperature=0.6
                )
            )
            quiz_data = json.loads(response.text)
            
        quiz_data["page"] = page_num
        return quiz_data
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Make sure storage dir exists
    os.makedirs("storage", exist_ok=True)
    uvicorn.run(app, host="127.0.0.1", port=8000)
