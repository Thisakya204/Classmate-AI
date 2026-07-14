import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Send, Loader2, BookOpen, Trash2, MessageSquare, ChevronDown, ChevronUp, FolderOpen, X } from 'lucide-react';
import API_BASE_URL from '../config';

export default function PDFChat({ settings, activeDoc, setActiveDoc, documents, setDocuments }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [expandedSources, setExpandedSources] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingAnswer]);

  // Load documents list on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents`);
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error("Failed to load documents", err);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    const allowedExtensions = ['.pdf', '.docx', '.pptx', '.txt', '.md'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      alert("Please upload a PDF, Word (.docx), PowerPoint (.pptx), Text (.txt), or Markdown (.md) file!");
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading document...');
    
    const formData = new FormData();
    formData.append('file', file);

    const activeKey = settings.provider === 'openai' ? settings.openaiKey : settings.geminiKey;

    try {
      setUploadStatus('Extracting & chunking notes...');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'X-API-Key': activeKey || '',
          'X-Provider': settings.provider
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await res.json();
      setUploadStatus('Vectorizing text chunks...');
      
      // Refresh docs
      await fetchDocuments();
      setActiveDoc(data.doc_id);
      setIsSidebarOpen(false); // close drawer on mobile after upload
      
      // Initialize chat with greeting
      setMessages([
        {
          role: 'ai',
          content: `Hi there! I have finished analyzing your document: **${data.filename}** (${data.page_count} pages, ${data.chunk_count} chunks). Ask me anything about it!`
        }
      ]);
    } catch (err) {
      console.error(err);
      alert(`Error indexing notes: ${err.message}. Make sure your API Key is set in Settings!`);
    } finally {
      setUploading(false);
      setUploadStatus('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteDoc = async (docId, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this indexed document?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/documents/${encodeURIComponent(docId)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        if (activeDoc === docId) {
          setActiveDoc(null);
          setMessages([]);
        }
        fetchDocuments();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!query.trim() || !activeDoc || loadingAnswer) return;

    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoadingAnswer(true);

    const activeKey = settings.provider === 'openai' ? settings.openaiKey : settings.geminiKey;

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': activeKey || '',
          'X-Provider': settings.provider
        },
        body: JSON.stringify({
          query: userMsg.content,
          doc_id: activeDoc
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to get answer');
      }

      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'ai',
        content: data.answer,
        sources: data.sources
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `⚠️ **Error:** Failed to query document. ${err.message}`
      }]);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const toggleSources = (msgIndex) => {
    setExpandedSources(prev => ({
      ...prev,
      [msgIndex]: !prev[msgIndex]
    }));
  };

  return (
    <div className="pdfchat-layout">

      {/* Mobile overlay to close sidebar drawer */}
      <div
        className={`pdfchat-sidebar-overlay${isSidebarOpen ? ' open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar for Document Registry */}
      <div className={`pdfchat-sidebar${isSidebarOpen ? ' open' : ''}`}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px' }}>Lecture Notes</h2>
          <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-tertiary))' }}>Upload and switch between study materials.</p>
        </div>

        {/* Upload Zone */}
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.02)',
            transition: 'var(--transition-smooth)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'hsl(var(--accent-purple))';
            e.currentTarget.style.background = 'rgba(168, 85, 247, 0.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFileUpload(e.target.files[0])} 
            style={{ display: 'none' }} 
            accept=".pdf,.docx,.pptx,.txt,.md"
          />
          {uploading ? (
            <>
              <Loader2 className="animate-spin text-glow-purple" style={{ color: 'hsl(var(--accent-purple))' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'white', marginTop: '4px' }}>{uploadStatus}</div>
            </>
          ) : (
            <>
              <Upload size={24} style={{ opacity: 0.6 }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Drop your notes here</div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-tertiary))', marginTop: '2px' }}>or click to browse (.pdf, .docx, .pptx, .txt, .md)</div>
              </div>
            </>
          )}
        </div>

        {/* Documents List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--text-tertiary))', marginBottom: '4px' }}>Indexed Documents</div>
          {documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', fontSize: '0.85rem', color: 'hsl(var(--text-tertiary))', background: 'rgba(255, 255, 255, 0.01)', borderRadius: 'var(--radius-md)' }}>
              No lecture notes indexed yet. Upload a document to start!
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.filename}
                onClick={() => {
                  setActiveDoc(doc.filename);
                  setIsSidebarOpen(false); // close drawer on mobile after selection
                  setMessages([{
                    role: 'ai',
                    content: `Switched active lecture notes to **${doc.filename}**. What would you like to know from these notes?`
                  }]);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: activeDoc === doc.filename ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255,255,255,0.02)',
                  border: activeDoc === doc.filename ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', marginRight: '8px' }}>
                  <FileText size={16} style={{ flexShrink: 0, color: activeDoc === doc.filename ? 'hsl(var(--accent-purple))' : 'white', opacity: activeDoc === doc.filename ? 1 : 0.6 }} />
                  <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: activeDoc === doc.filename ? '600' : '400' }}>
                    {doc.filename}
                  </span>
                </div>
                <button
                  onClick={(e) => handleDeleteDoc(doc.filename, e)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="pdfchat-main">
        
        {/* Chat Window Greeting Header */}
        <div
          className="pdfchat-chat-header"
          style={{
            padding: '1.2rem 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {/* Mobile: Button to open document drawer */}
          <button
            className="pdfchat-mobile-doc-toggle"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FolderOpen size={15} />
            Notes
          </button>

          <MessageSquare size={20} className="text-glow-purple" style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeDoc ? `${activeDoc}` : "Chat with your Notes"}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>
              {activeDoc ? "AI answering from uploaded notes" : "Open Notes to upload or select"}
            </p>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div
          className="pdfchat-messages"
          style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {messages.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '16px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <BookOpen size={48} style={{ opacity: 0.4 }} />
              <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                {!activeDoc ? "No Active Lecture Notes" : "No Active Chat"}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'hsl(var(--text-secondary))', maxWidth: '320px', lineHeight: '1.5' }}>
                {!activeDoc 
                  ? "To start studying, please upload a document (.pdf, .docx, .txt) or select an existing one."
                  : `Ask a question about "${activeDoc}" to start a Q&A session.`
                }
              </p>
              {!activeDoc && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="btn-primary"
                  style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9rem'
                  }}
                >
                  <FolderOpen size={16} />
                  Upload or Select Notes
                </button>
              )}
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  width: '100%',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {/* Bubble */}
                <div 
                  className={msg.role === 'user' ? 'chat-bubble chat-bubble-user' : 'chat-bubble chat-bubble-ai'}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {/* Robust simple markdown support for bold text */}
                  {msg.content.split('**').map((text, i) => i % 2 === 1 ? <strong key={i}>{text}</strong> : text)}
                </div>

                {/* Sources Accordion */}
                {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                  <div style={{ marginTop: '6px', width: '80%' }}>
                    <button
                      onClick={() => toggleSources(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'hsl(var(--accent-teal))',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 0'
                      }}
                    >
                      {expandedSources[idx] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {expandedSources[idx] ? "Hide citations" : `View ${msg.sources.length} matching sources`}
                    </button>
                    
                    {expandedSources[idx] && (
                      <div className="glass-panel" style={{
                        marginTop: '6px',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid rgba(6, 182, 212, 0.15)'
                      }}>
                        {msg.sources.map((src, sIdx) => (
                          <div key={sIdx} style={{ fontSize: '0.8rem', borderBottom: sIdx < msg.sources.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: '6px' }}>
                            <div style={{ fontWeight: '700', color: 'white', marginBottom: '2px', display: 'flex', justifyContent: 'space-between' }}>
                              <span>Page {src.page}</span>
                              <span style={{ opacity: 0.5, fontWeight: '400' }}>Relevance: {Math.round(src.score * 100)}%</span>
                            </div>
                            <p style={{ color: 'hsl(var(--text-secondary))', fontStyle: 'italic', lineHeight: '1.4' }}>
                              "...{src.text.slice(0, 220)}..."
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}

          {loadingAnswer && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--text-tertiary))', fontSize: '0.85rem' }}>
              <Loader2 className="animate-spin text-glow-teal" size={16} /> Thinking and scanning notes...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div 
          onClick={() => {
            if (!activeDoc) {
              setIsSidebarOpen(true);
            }
          }}
          style={{ width: '100%' }}
        >
          <form
            onSubmit={handleSendMessage}
            className="pdfchat-input-form"
            style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(11,11,15,0.3)',
              display: 'flex',
              gap: '12px'
            }}
          >
            <input
              type="text"
              placeholder={activeDoc ? "Ask a question about your lecture notes..." : "Tap here to select notes & start chat..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!activeDoc || loadingAnswer}
              className="form-input"
              style={{ 
                flex: 1, 
                cursor: !activeDoc ? 'pointer' : 'text',
                pointerEvents: !activeDoc ? 'none' : 'auto'
              }}
            />
            <button
              type="submit"
              disabled={!activeDoc || !query.trim() || loadingAnswer}
              className="btn-primary"
              style={{ padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
