import React, { useState } from 'react';
import { Plus, X, Calendar, Search } from 'lucide-react'; 
import './updateTask.css';

const TaskInput = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [currentSubInput, setCurrentSubInput] = useState('');
  const [tempSubTasks, setTempSubTasks] = useState([]); // Mảng chứa các task con tạm thời

  // Xử lý khi ấn Enter trong ô Detail
  const handleKeyDownDetail = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Chặn xuống dòng mặc định
      if (!currentSubInput.trim()) return;

      // Thêm vào danh sách tạm
      const newSub = {
        id: Date.now(),
        title: currentSubInput.trim(),
        completed: false
      };
      setTempSubTasks([...tempSubTasks, newSub]);
      setCurrentSubInput(''); // Xóa trắng ô nhập để nhập cái tiếp theo
    }
  };

  // Xóa một task con khi đang nhập (nếu lỡ nhập sai)
  const removeTempSubTask = (id) => {
    setTempSubTasks(tempSubTasks.filter(item => item.id !== id));
  };

  // Submit Task Tổng (Nút Xanh lá)
  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề Task chính!");
      return;
    }

    // Nếu user nhập nội dung ở detail mà QUÊN ấn Enter, ta vẫn tính nó là 1 subtask cuối
    let finalSubTasks = [...tempSubTasks];
    if (currentSubInput.trim()) {
       finalSubTasks.push({
         id: Date.now(),
         title: currentSubInput.trim(),
         completed: false
       });
    }

    // Gửi dữ liệu ra ngoài cho Component cha
    onAddTask({
      title,
      subTasks: finalSubTasks
    });

    // Reset form
    setTitle('');
    setCurrentSubInput('');
    setTempSubTasks([]);
  };

  return (
    <div className="input-wrapper">
      <div className="input-row">
        {/* Ô Title */}
        <input
          type="text"
          className="input-box title-input"
          placeholder="Tên công việc chính..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        {/* Ô Detail thông minh */}
        <div className="detail-container">
          <div className="input-with-list">
             {/* Danh sách các task con đã thêm tạm thời */}
            <div className="temp-list">
              {tempSubTasks.map(sub => (
                <div key={sub.id} className="temp-item">
                  <span>• {sub.title}</span>
                  <button onClick={() => removeTempSubTask(sub.id)} className="remove-temp-btn"><X size={12}/></button>
                </div>
              ))}
            </div>

            <input
              type="text"
              className="input-box detail-input-real"
              placeholder={tempSubTasks.length > 0 ? "Nhập tiếp việc nhỏ rồi Enter..." : "Nhập chi tiết việc nhỏ (Ấn Enter để thêm dòng)..."}
              value={currentSubInput}
              onChange={(e) => setCurrentSubInput(e.target.value)}
              onKeyDown={handleKeyDownDetail}
            />
          </div>
        </div>
        
        {/* Nút Add lớn */}
        <button className="add-btn" onClick={handleSubmit}>
          <Plus color="white" size={24} />
        </button>
      </div>

      {/* Phần filter (Giữ nguyên như cũ) */}
      <div className="filter-row">
        <select className="filter-select"><option>By category</option></select>
        <div className="date-picker-group">
            <span style={{fontSize: '14px', fontWeight: 'bold', color: '#555'}}>Deadline:</span>
            <div className="date-input-dummy"><Calendar size={16} /> Select date</div>
        </div>
        <div className="search-box">
             <Search size={16} /> <input type="text" placeholder="Search task..." />
        </div>
      </div>
    </div>
  );
};

export default TaskInput;