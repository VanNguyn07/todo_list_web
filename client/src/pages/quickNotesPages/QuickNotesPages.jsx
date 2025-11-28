import React, { useState } from "react";
// Import CSS (File CSS bạn vừa gửi)
import "./QuickNotesPages.css";

// Import Editor Mới (React Simple Wysiwyg)
import {
  Editor,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnBulletList,
  BtnNumberedList,
  BtnClearFormatting,
  Separator
} from "react-simple-wysiwyg";

// Import Calendar
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Import Icons
import {
  Search, Trash2, Pin, Calendar as CalIcon,
  PenLine, Tag, X, FilterX, BarChart3, Plus, NotebookPen
} from "lucide-react";

export const QuickNotesPages = () => {
  // --- DỮ LIỆU MẪU ---
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Marketing Ideas",
      content: "<div>Create short videos about the <font color='#e11d48'><b>production</b></font> process...</div>",
      color: "#fff0f0",
      date: new Date(),
      pinned: true,
      tags: ["Work", "Idea"],
    },
    {
      id: 2,
      title: "Learn React Hooks",
      content: "<div>Deep dive into useEffect and useMemo.</div>",
      color: "#f0f4ff",
      date: new Date(),
      pinned: false,
      tags: ["Study"],
    },
  ]);

  // --- STATE ---
  const [search, setSearch] = useState("");
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  // Form Data
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    tags: [],
    date: new Date(),
    color: "#ffffff",
  });

  const bgColors = ["#ffffffff", "#f0f4ffff", "#fff0f0", "#f0fff4", "#fff9db", "#f3e8ff"];
  // Màu chữ cho Toolbar Editor
  const textColors = ["#1e293b", "#e11d48", "#2563eb", "#16a34a", "#d97706", "#9333ea"];

  // --- HÀM XỬ LÝ ---
  
  // Hàm đổi màu chữ trong Editor (bôi đen rồi chọn màu)
  const applyColor = (e, color) => {
    e.preventDefault();
    document.execCommand('foreColor', false, color);
  };

  const handleKeyDownTag = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInput.trim() && !noteForm.tags.includes(tagInput.trim())) {
        setNoteForm({ ...noteForm, tags: [...noteForm.tags, tagInput.trim()] });
        setTagInput("");
      }
    }
  };
  const removeTag = (tagToRemove) => {
    setNoteForm({
      ...noteForm,
      tags: noteForm.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleSaveNote = () => {
    // Validate nội dung rỗng
    const cleanContent = noteForm.content.replace(/<(.|\n)*?>/g, "").trim();
    if (!noteForm.title && !cleanContent) return;

    if (editingId) {
      setNotes(notes.map((note) => note.id === editingId ? { ...note, ...noteForm } : note));
      setEditingId(null);
    } else {
      const newNote = { id: Date.now(), ...noteForm, pinned: false };
      setNotes([newNote, ...notes]);
    }
    resetForm();
  };

  const handleEditClick = (note) => {
    setNoteForm({
      title: note.title,
      content: note.content,
      tags: note.tags || [],
      date: note.date,
      color: note.color,
    });
    setEditingId(note.id);
    setIsInputExpanded(true);
  };

  const resetForm = () => {
    setNoteForm({ title: "", content: "", tags: [], date: new Date(), color: "#ffffff" });
    setTagInput("");
    setIsInputExpanded(false);
    setEditingId(null);
    setShowDatePicker(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this note?")) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const handlePin = (id) => {
    setNotes(notes.map((note) => note.id === id ? { ...note, pinned: !note.pinned } : note));
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? note.tags && note.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="app-container">
      {/* ĐÃ XÓA SIDEBAR TRÁI */}

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <div className="greeting-section">
          <div className="title-notes">
            {/* Dùng Icon NotebookPen cho đẹp */}
            <NotebookPen size={40} />
            <h1>Notes Dashboard</h1>
          </div>
          {selectedTag ? (
             <p style={{color: '#6366f1', fontWeight: '600'}}>
                Filtering: #{selectedTag} 
                <span onClick={() => setSelectedTag(null)} style={{marginLeft: '10px', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px'}}>(Clear)</span>
             </p>
          ) : (
             <p>Manage your work and ideas efficiently</p>
          )}
        </div>

        <header className="header">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search your content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* INPUT FORM */}
        <div className={`note-input-container ${isInputExpanded ? "expanded" : ""}`}>
          {isInputExpanded && (
            <div className="input-top-row">
              <input
                type="text"
                placeholder="Title..."
                className="input-title"
                value={noteForm.title}
                spellCheck="true"
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              />

              <div style={{ position: "relative" }}>
                <button className="date-picker-trigger" onClick={() => setShowDatePicker(!showDatePicker)}>
                  <CalIcon size={14} /> {formatDate(noteForm.date)}
                </button>
                {showDatePicker && (
                  <div style={{ position: "absolute", top: "110%", right: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                    <Calendar
                      onChange={(date) => { setNoteForm({ ...noteForm, date }); setShowDatePicker(false); }}
                      value={noteForm.date}
                      className="custom-calendar"
                      locale="en-US"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {isInputExpanded ? (
            <div className="simple-editor-container">
              {/* Editor Provider */}
              <EditorProvider>
                <Editor
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  placeholder="To write your content here..."
                  spellCheck={false}
                >
                  <Toolbar>
                    <BtnBold /><BtnItalic /><BtnUnderline /><Separator />
                    <BtnBulletList /><BtnNumberedList /><Separator />
                    {/* Nút chọn màu chữ trên Toolbar */}
                    {textColors.map(c => (
                        <button
                            key={c}
                            className="toolbar-color-btn"
                            style={{backgroundColor: c}}
                            onMouseDown={(e) => applyColor(e, c)} 
                            title={`Text color: ${c}`}
                        />
                    ))}
                    <Separator />
                    <BtnClearFormatting />
                  </Toolbar>
                </Editor>
              </EditorProvider>
            </div>
          ) : (
            <div className="input-create-wrapper" onClick={() => setIsInputExpanded(true)}>
              <Plus size={20} className="icon-plus" />
              <input
                placeholder="Create new your notes..."
                readOnly
                value=""
                className="input-create"
              />
            </div>
          )}

          {isInputExpanded && (
            <div className="tags-input-area">
              <Tag size={16} color="#94a3b8" />
              {noteForm.tags.map((tag, idx) => (
                <div key={idx} className="tag-item">
                  {tag} <X size={12} className="remove-tag" onClick={() => removeTag(tag)} />
                </div>
              ))}
              <input
                type="text"
                placeholder="Tag + Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
              />
            </div>
          )}

          {isInputExpanded && (
            <div className="input-actions">
              <div className="color-pickers-group">
                <div className="color-row">
                  <span className="color-label">Background:</span>
                  {bgColors.map((c) => (
                    <div
                      key={c}
                      className={`color-dot ${noteForm.color === c ? "selected" : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setNoteForm({ ...noteForm, color: c })}
                    />
                  ))}
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-close-quick-notes" onClick={resetForm}>Cancel</button>
                <button className="btn-add-quick-notes" onClick={handleSaveNote}>
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LIST NOTES */}
        <div className="notes-grid">
          {sortedNotes.length > 0 ? (
            sortedNotes.map((note) => (
              <div key={note.id} className="note-card" style={{ backgroundColor: note.color }}>
                <div className="card-header">
                  <h3>{note.title || "Untitled"}</h3>
                  <button className={`btn-icon ${note.pinned ? "pinned" : ""}`} onClick={() => handlePin(note.id)}>
                    <Pin size={16} />
                  </button>
                </div>

                {note.tags && note.tags.length > 0 && (
                  <div className="card-tags">
                    {note.tags.map((tag, idx) => (<span key={idx} className="tag">#{tag}</span>))}
                  </div>
                )}

                {/* Render nội dung HTML */}
                <div className="card-content" dangerouslySetInnerHTML={{ __html: note.content }} />

                <div className="card-footer">
                  <span className="date"><CalIcon size={12} /> {formatDate(note.date)}</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn-icon edit-btn" onClick={() => handleEditClick(note)}><PenLine size={16} /></button>
                    <button className="btn-icon delete" onClick={() => handleDelete(note.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#94a3b8", marginTop: "40px" }}>
              <p>No notes found.</p>
              {selectedTag && <button onClick={() => setSelectedTag(null)} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", marginTop: "10px" }}>Clear filter</button>}
            </div>
          )}
        </div>
      </main>

      {/* --- 3. RIGHT SIDEBAR --- */}
      <aside className="right-sidebar">
        <div className="widget stats-dashboard">
          <div className="widget-header">
            <h4>Analytics</h4>
            <BarChart3 size={16} color="#6366f1" />
          </div>
          <div className="stats-grid-quick-notes">
            <div className="stat-box">
              <span className="stat-value-quick-notes">{notes.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-box">
              <span className="stat-value-quick-notes">{notes.filter((n) => n.pinned).length}</span>
              <span className="stat-label">Pinned</span>
            </div>
            <div className="stat-box">
              <span className="stat-value-quick-notes">{[...new Set(notes.flatMap((n) => n.tags || []))].length}</span>
              <span className="stat-label">Tags</span>
            </div>
          </div>
        </div>

        <div className="widget">
          <div className="widget-header"><h4>Calendar</h4></div>
          <Calendar className="custom-calendar" locale="en-US" />
        </div>

        <div className="widget">
          <div className="widget-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h4>Tags List</h4>
              {selectedTag && <FilterX size={14} color="#ef4444" style={{ cursor: "pointer" }} onClick={() => setSelectedTag(null)} title="Clear Filter" />}
            </div>
            <Tag size={16} color="#64748b" />
          </div>
          <div className="tags-cloud">
            {[...new Set(notes.flatMap((n) => n.tags || []))].map((tag) => (
              <span key={tag} className="tag-chip" style={{ backgroundColor: selectedTag === tag ? "#6366f1" : "#f1f5f9", color: selectedTag === tag ? "white" : "#475569" }} onClick={() => handleTagFilter(tag)}>#{tag}</span>
            ))}
            {notes.flatMap((n) => n.tags || []).length === 0 && (
              <span style={{ fontSize: "13px", color: "#999" }}>No tags yet</span>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};