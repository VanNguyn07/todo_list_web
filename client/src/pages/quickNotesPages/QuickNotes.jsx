import React, { useState } from "react";
// Import CSS
import "./QuickNotes.css";

// Import Editor Mới (React Simple Wysiwyg)
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnBulletList, BtnNumberedList, BtnClearFormatting } from 'react-simple-wysiwyg';

// Import Calendar
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Import Icons
import {
  Search, Trash2, Pin, LayoutGrid, Star, Calendar as CalIcon,
  Settings, Bell, PenLine, Tag, X, FilterX, BarChart3
} from "lucide-react";

export const QuickNotesPages = () => {
  // --- DỮ LIỆU MẪU ---
  const [notes, setNotes] = useState([
    { 
      id: 1, 
      title: "Ý tưởng Marketing", 
      content: "<div>Làm video ngắn về quy trình <b>sản xuất</b>...</div>", 
      color: "#fff0f0", // Màu nền
      textColor: "#e11d48", // Màu chữ (đỏ)
      date: new Date(), 
      pinned: true,
      tags: ["Work", "Idea"]
    },
    { 
      id: 2, 
      title: "Học React Hook", 
      content: "<div>Tìm hiểu sâu về useEffect và useMemo.</div>", 
      color: "#f0f4ff", // Màu nền
      textColor: "#1e293b", // Màu chữ (đen mặc định)
      date: new Date(), 
      pinned: false,
      tags: ["Study"]
    },
  ]);

  // --- STATE ---
  const [search, setSearch] = useState("");
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null); 

  // Form Data (Thêm textColor)
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    tags: [],
    date: new Date(),
    color: "#ffffff",
    textColor: "#1e293b" // Mặc định màu đen xám
  });

  // Bảng màu nền (Pastel)
  const bgColors = ["#ffffff", "#f0f4ff", "#fff0f0", "#f0fff4", "#fff9db", "#f3e8ff"];
  // Bảng màu chữ (Đậm hơn)
  const textColors = ["#1e293b", "#e11d48", "#2563eb", "#16a34a", "#d97706", "#9333ea"];

  // --- HÀM XỬ LÝ ---

  const handleKeyDownTag = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim() && !noteForm.tags.includes(tagInput.trim())) {
        setNoteForm({ ...noteForm, tags: [...noteForm.tags, tagInput.trim()] });
        setTagInput("");
      }
    }
  };
  const removeTag = (tagToRemove) => {
    setNoteForm({ ...noteForm, tags: noteForm.tags.filter(t => t !== tagToRemove) });
  };

  const handleSaveNote = () => {
    const cleanContent = noteForm.content.replace(/<(.|\n)*?>/g, '').trim();
    if (!noteForm.title && !cleanContent) return;

    if (editingId) {
      setNotes(notes.map(note => 
        note.id === editingId ? { ...note, ...noteForm } : note
      ));
      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now(),
        ...noteForm,
        pinned: false
      };
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
      textColor: note.textColor || "#1e293b"
    });
    setEditingId(note.id);
    setIsInputExpanded(true);
  };

  const resetForm = () => {
    setNoteForm({ title: "", content: "", tags: [], date: new Date(), color: "#ffffff", textColor: "#1e293b" });
    setTagInput("");
    setIsInputExpanded(false);
    setEditingId(null);
    setShowDatePicker(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Xóa ghi chú này?")) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const handlePin = (id) => {
    setNotes(notes.map((note) =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ));
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const filteredNotes = notes.filter((note) => {
      const matchesSearch = 
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase());
      const matchesTag = selectedTag ? (note.tags && note.tags.includes(selectedTag)) : true;
      return matchesSearch && matchesTag;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned === b.pinned) return 0; 
    return a.pinned ? -1 : 1;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="app-container">
      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <div className="greeting-section">
          <h1>Notes Dashboard ✍️</h1>
          {selectedTag ? (
              <p style={{color: '#6366f1', fontWeight: '600'}}>
                  Đang lọc theo thẻ: #{selectedTag} 
                  <span onClick={() => setSelectedTag(null)} style={{marginLeft: '10px', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px'}}>
                      (Xóa lọc)
                  </span>
              </p>
          ) : (
              <p>Quản lý công việc và ý tưởng của bạn.</p>
          )}
        </div>

        <header className="header">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* INPUT FORM */}
        <div className={`note-input-container ${isInputExpanded ? 'expanded' : ''}`}>
          
          {isInputExpanded && (
            <div className="input-top-row">
                {/* Title Input nhận màu chữ */}
                <input
                    type="text"
                    placeholder="Tiêu đề..."
                    className="input-title"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    style={{ color: noteForm.textColor }}
                />
                
                <div style={{position: 'relative'}}>
                    <button className="date-picker-trigger" onClick={() => setShowDatePicker(!showDatePicker)}>
                        <CalIcon size={14} /> {formatDate(noteForm.date)}
                    </button>
                    {showDatePicker && (
                        <div style={{position: 'absolute', top: '110%', right: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.15)'}}>
                             <Calendar onChange={(date) => { setNoteForm({...noteForm, date}); setShowDatePicker(false); }} value={noteForm.date} className="custom-calendar"/>
                        </div>
                    )}
                </div>
            </div>
          )}

          {isInputExpanded ? (
              <div className="simple-editor-container">
                  {/* Editor Container nhận màu chữ */}
                  <div style={{ color: noteForm.textColor }}>
                    <EditorProvider>
                      <Editor 
                        value={noteForm.content} 
                        onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                        placeholder="Viết nội dung tại đây..."
                      >
                        <Toolbar>
                          <BtnBold /><BtnItalic /><BtnUnderline /><BtnBulletList /><BtnNumberedList /><BtnClearFormatting />
                        </Toolbar>
                      </Editor>
                    </EditorProvider>
                  </div>
              </div>
          ) : (
            <textarea
                placeholder="Tạo ghi chú mới..."
                onClick={() => setIsInputExpanded(true)}
                readOnly
                value=""
                style={{cursor: 'text'}}
            />
          )}

          {isInputExpanded && (
             <div className="tags-input-area">
                <Tag size={16} color="#94a3b8" />
                {noteForm.tags.map((tag, idx) => (
                    <div key={idx} className="tag-item">
                        {tag} <X size={12} className="remove-tag" onClick={() => removeTag(tag)}/>
                    </div>
                ))}
                <input type="text" placeholder="Tag + Enter..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleKeyDownTag}/>
             </div>
          )}

          {isInputExpanded && (
            <div className="input-actions">
              <div className="color-pickers-group">
                  {/* Chọn Màu Nền */}
                  <div className="color-row">
                    <span className="color-label">Nền</span>
                    {bgColors.map(c => (
                        <div key={c} className={`color-dot ${noteForm.color === c ? 'selected' : ''}`} style={{backgroundColor: c}} onClick={() => setNoteForm({...noteForm, color: c})}/>
                    ))}
                  </div>
                  {/* Chọn Màu Chữ */}
                  <div className="color-row">
                    <span className="color-label">Chữ</span>
                    {textColors.map(c => (
                        <div key={c} className={`color-dot ${noteForm.textColor === c ? 'selected' : ''}`} style={{backgroundColor: c}} onClick={() => setNoteForm({...noteForm, textColor: c})}/>
                    ))}
                  </div>
              </div>

              <div className="action-buttons">
                <button className="btn-close" onClick={resetForm}>Hủy</button>
                <button className="btn-add" onClick={handleSaveNote}>
                  {editingId ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LIST NOTES */}
        <div className="notes-grid">
          {sortedNotes.length > 0 ? sortedNotes.map((note) => (
            <div key={note.id} className="note-card" style={{ backgroundColor: note.color }}>
              <div className="card-header">
                {/* Title nhận màu chữ */}
                <h3 style={{ color: note.textColor || '#1e293b' }}>{note.title || "Không tiêu đề"}</h3>
                <button className={`btn-icon ${note.pinned ? 'pinned' : ''}`} onClick={() => handlePin(note.id)}>
                  <Pin size={16} />
                </button>
              </div>

              {note.tags && note.tags.length > 0 && (
                  <div className="card-tags">
                      {note.tags.map((tag, idx) => (<span key={idx} className="tag">#{tag}</span>))}
                  </div>
              )}
              
              {/* Content nhận màu chữ */}
              <div 
                className="card-content"
                style={{ color: note.textColor || '#1e293b' }}
                dangerouslySetInnerHTML={{ __html: note.content }} 
              />
              
              <div className="card-footer">
                <span className="date"><CalIcon size={12}/> {formatDate(note.date)}</span>
                <div style={{display: 'flex', gap: '8px'}}>
                    <button className="btn-icon edit-btn" onClick={() => handleEditClick(note)}><PenLine size={16} /></button>
                    <button className="btn-icon delete" onClick={() => handleDelete(note.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          )) : (
            <div style={{gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', marginTop: '40px'}}>
                <p>Không tìm thấy ghi chú nào.</p>
                {selectedTag && <button onClick={() => setSelectedTag(null)} style={{background:'none', border:'none', color:'#6366f1', cursor:'pointer', marginTop:'10px'}}>Xóa bộ lọc</button>}
            </div>
          )}
        </div>
      </main>

      {/* --- RIGHT SIDEBAR --- */}
      <aside className="right-sidebar">
        {/* NEW: STATS DASHBOARD WIDGET */}
        <div className="widget stats-dashboard">
           <div className="widget-header">
             <h4>Thống kê</h4>
             <BarChart3 size={16} color="#6366f1"/>
           </div>
           <div className="stats-grid-quick-notes">
               <div className="stat-box">
                  <span className="stat-value-quick-notes">{notes.length}</span>
                  <span className="stat-label">Tổng Note</span>
               </div>
               <div className="stat-box">
                  <span className="stat-value-quick-notes">{notes.filter(n => n.pinned).length}</span>
                  <span className="stat-label">Đã ghim</span>
               </div>
               <div className="stat-box">
                  <span className="stat-value-quick-notes">{[...new Set(notes.flatMap(n => n.tags || []))].length}</span>
                  <span className="stat-label">Chủ đề</span>
               </div>
               <div className="stat-box">
                  <span className="stat-value-quick-notes">Free</span>
                  <span className="stat-label">Gói</span>
               </div>
           </div>
        </div>

        <div className="widget">
          <div className="widget-header">
            <h4>Lịch biểu</h4>
          </div>
          <Calendar className="custom-calendar" locale="vi-VN"/>
        </div>

        <div className="widget">
          <div className="widget-header">
            <div style={{display:'flex', alignItems:'center', gap: '8px'}}>
                <h4>Danh sách Tags</h4>
                {selectedTag && <FilterX size={14} color="#ef4444" style={{cursor:'pointer'}} onClick={() => setSelectedTag(null)} title="Xóa lọc"/>}
            </div>
            <Tag size={16} color="#64748b" />
          </div>

          <div className="tags-cloud">
            {[...new Set(notes.flatMap(n => n.tags || []))].map(tag => (
                <span 
                    key={tag} 
                    className="tag-chip"
                    style={{
                        backgroundColor: selectedTag === tag ? '#6366f1' : '#f1f5f9',
                        color: selectedTag === tag ? 'white' : '#475569'
                    }}
                    onClick={() => handleTagFilter(tag)}
                >
                    #{tag}
                </span>
            ))}
            {notes.flatMap(n => n.tags || []).length === 0 && (
                <span style={{fontSize: '13px', color: '#999'}}>Chưa có tags nào.</span>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};