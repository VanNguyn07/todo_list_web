import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import {} from 'date-fns/locale';
import 'react-calendar/dist/Calendar.css';
import './CalendarPages.css';

// 1. IMPORT ICONS TỪ LUCIDE-REACT
import { 
  CalendarDays, 
  Plus, 
  Clock, 
  CheckCircle, 
  RotateCcw, 
  Trash2, 
  X ,
  Pen
} from 'lucide-react';

export const CalendarPages = () => {
  const [date, setDate] = useState(new Date());

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID của task calendar đang sửa
  const [newTask, setNewTask] = useState({
    title: '', desc: '', startTime: '09:00', endTime: '10:00', color: '#6366f1'
  });

  // State Dữ liệu
  const [tasks, setTasks] = useState([
    { id: 1, date: new Date(), title: 'Product Launch', desc: 'Sync with Marketing team', startTime: '09:00', endTime: '10:30', color: '#6366f1', completed: false },
    { id: 2, date: new Date(), title: 'Gym Time', desc: 'Leg day workout', startTime: '17:30', endTime: '18:30', color: '#ef4444', completed: true },
  ]);

  // --- LOGIC ---
  const tasksMap = useMemo(() => {
    const map = {};
    tasks.forEach(task => {
      const dateKey = format(task.date, 'yyyy-MM-dd');
      if (!map[dateKey]) map[dateKey] = { count: 0, completed: 0, isAllDone: false };
      map[dateKey].count += 1;
      if (task.completed) map[dateKey].completed += 1;
    });
    Object.keys(map).forEach(key => {
      map[key].isAllDone = map[key].count > 0 && map[key].count === map[key].completed;
    });
    return map;
  }, [tasks]);

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = format(date, 'yyyy-MM-dd');
      const data = tasksMap[dateKey];
      if (data && data.count > 0) {
        const statusClass = data.isAllDone ? 'cp-done' : '';
        if (data.count === 1) return <div className={`cp-dot ${statusClass}`}></div>;
        return <div className={`cp-badge ${statusClass}`}>{data.count}</div>;
      }
    }
    return null;
  };

  const currentTasks = tasks
    .filter(t => isSameDay(t.date, date))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalToday = currentTasks.length;
  const completedToday = currentTasks.filter(t => t.completed).length;
  const progress = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);

  // --- ACTIONS ---
  const openModal = () => {
    setNewTask({ title: '', desc: '', startTime: '09:00', endTime: '10:00', color: '#6366f1' });
    setIsModalOpen(true);
  };

  const onpenModalForUpdate = (taskId) => {
    setEditingId(taskId.id);
    setNewTask({
        title:taskId.title,
        desc:taskId.desc,
        startTime:taskId.startTime,
        endTime: taskId.endTime,
        color:taskId.color
    });
    setIsModalOpen(true);
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    const taskToAdd = { id: Date.now(), date: date, ...newTask, completed: false };
    setTasks([...tasks, taskToAdd]);
    setIsModalOpen(false);
  };

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id) => window.confirm('Are you sure you want to delete this task?') && setTasks(tasks.filter(t => t.id !== id));

  const colors = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

  return (
    <div className="cp-wrapper">
      {/* HEADER */}
      <header className="cp-header">
        <div className="cp-header-title">
          <CalendarDays size={50} />
          <p>My Calendar</p>
        </div>
        <div className="cp-header-subtitle">
          <p>Task Management & Schedule</p>
        </div>
      </header>

      <div className="cp-body">
        {/* SIDEBAR TRÁI */}
        <aside className="cp-sidebar">
          <Calendar onChange={setDate} value={date} tileContent={getTileContent} locale="en-US" next2Label={null} prev2Label={null} />
          
          <div className="cp-stats">
            <div className="cp-stats-head">
              <span>Daily Progress</span>
              <span>{completedToday}/{totalToday} Tasks</span>
            </div>
            <div className="cp-progress-track">
              <div className="cp-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div style={{fontSize: '0.8rem', color: '#64748b'}}>
              {progress === 100 ? "🎉 Amazing! You crushed it!" : "Stay focused, almost there!"}
            </div>
          </div>
        </aside>

        {/* NỘI DUNG PHẢI */}
        <main className="cp-content">
          <div className="cp-top-bar">
            <div className="cp-date-heading">
              <h2>{format(date, 'MMMM do, yyyy')}</h2>
              <span>{format(date, 'EEEE')}</span>
            </div>
            
            <button className="cp-btn-add" onClick={openModal}>
              <Plus size={20} /> Add New Task
            </button>
          </div>

          <div className="cp-task-list">
            {currentTasks.length > 0 ? (
              currentTasks.map(task => (
                <div key={task.id} className="cp-task-row">
                  {/* Cột thời gian */}
                  <div className="cp-time-col">
                    <span className="cp-time-start">{task.startTime}</span>
                    <span className="cp-time-end">{task.endTime}</span>
                  </div>

                  {/* Card Task */}
                  <div className={`cp-task-card ${task.completed ? 'completed' : ''}`} style={{ borderLeftColor: task.color }}>
                    <div className="cp-task-info">
                      <h4>{task.title}</h4>
                      {task.desc && <p>{task.desc}</p>}
                    </div>
                    
                    {/* Hover Actions */}
                    <div className="cp-task-actions">
                      <button className="cp-btn-icon" onClick={() => toggleTask(task.id)} title={task.completed ? "Undo" : "Complete"}>
                        {task.completed ? <RotateCcw size={18} /> : <CheckCircle size={18} />}
                      </button>

                      <button className="cp-btn-icon cp-btn-del" onClick={() => onpenModalForUpdate(task.id)} title="Update">
                        <Pen size={18} />
                      </button>

                      <button className="cp-btn-icon cp-btn-del" onClick={() => deleteTask(task.id)} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{textAlign: 'center', marginTop: '60px', color: '#94a3b8'}}>
                <Clock size={48} style={{opacity: 0.2, marginBottom: '16px'}} />
                <p>No tasks scheduled for today.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL POPUP */}
      {isModalOpen && (
        <div className="cp-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="cp-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cp-modal-header">
              <h3>New Task: {format(date, 'MMM do')}</h3>
              <button className="cp-btn-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="cp-form-group">
                <label className="cp-label">Task Title</label>
                <input autoFocus type="text" className="cp-input" placeholder="What do you need to do?" 
                  value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>

              <div className="cp-row-2 cp-form-group">
                <div className="cp-col">
                  <label className="cp-label">Start Time</label>
                  <input type="time" className="cp-input" value={newTask.startTime} onChange={e => setNewTask({...newTask, startTime: e.target.value})} />
                </div>
                <div className="cp-col">
                  <label className="cp-label">End Time</label>
                  <input type="time" className="cp-input" value={newTask.endTime} onChange={e => setNewTask({...newTask, endTime: e.target.value})} />
                </div>
              </div>

              <div className="cp-form-group">
                <label className="cp-label">Description (Optional)</label>
                <input type="text" className="cp-input" placeholder="Add details..." 
                  value={newTask.desc} onChange={e => setNewTask({...newTask, desc: e.target.value})} />
              </div>

              <div className="cp-form-group">
                <label className="cp-label">Color Label</label>
                <div className="cp-colors">
                  {colors.map(c => (
                    <div key={c} className={`cp-color-circle ${newTask.color === c ? 'selected' : ''}`} 
                      style={{ backgroundColor: c }} onClick={() => setNewTask({...newTask, color: c})}></div>
                  ))}
                </div>
              </div>

              <div className="cp-modal-footer">
                <button type="button" className="cp-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="cp-btn-save">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
