import { useUpdateTask } from "../../hooks/useUpdateTask";
import { useAddTaskForm } from "../../hooks/useAddTaskForm";
import { Plus, Trash2, X, Save, Check } from "lucide-react";
import DatePicker from "react-datepicker";
// Import CSS bắt buộc của react-datepicker
import "react-datepicker/dist/react-datepicker.css";
export const UpdateAndCreateTask = (taskPageData, onTaskUpdate) => {
  const {
    formState,
    refetch,
    subtaskInput,
    setSubtaskInput,
    handleAddSubtask,
    handleDateChange,
    handleDeleteSubtask,
    handleInputChange,
    handleSubtaskNameChange,
    closeModal,// <-- Lúc này closeModal mới chung một nhịp với cha là TaskPages
  } = taskPageData;

  const { handleSubmitUpdate } = useUpdateTask();
  const { handleSubmitCreate } = useAddTaskForm();

  const onSuccessAction = () => {
    closeModal();
    refetch();
    if (onTaskUpdate) onTaskUpdate();
  };

  const handleCreateAndUpdate = async () => {
    //tạo bản sao object
    const coppyObject = { ...formState };

    try {
      if (formState.idTask) {
        await handleSubmitUpdate(
          { idTask: formState.idTask, taskForm: coppyObject },
          () => {
            onSuccessAction();
          }
        );
      } else {
        await handleSubmitCreate({ taskForm: coppyObject }, () => {
          onSuccessAction();
        });
      }
    } catch (error) {
      console.log("Error when save ", error);
    }
  };

  const handleSubmitForm = () => {
    return (
      <div className="modal-backdrop-task" onClick={closeModal}>
        <div
          className="modal-container"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="modal-header">
            <h2>
              {formState.idTask ? "✏️ Update Your Task" : "✨ Create New Task"}
            </h2>
            <button onClick={closeModal} className="modal-close-btn">
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            {/* Title Input */}
            <div className="input-group">
              <label>Work title</label>
              <input
                type="text"
                name="titleTask"
                value={formState.titleTask}
                onChange={handleInputChange}
                placeholder="Nhập tên task..."
              />
            </div>

            {/* Category & Date */}
            <div className="row-group">
              <div className="input-group">
                <label>Category</label>
                <select
                  name="categoryTask"
                  value={formState.categoryTask}
                  onChange={handleInputChange}
                >
                  <option value="" disabled selected>
                    Category
                  </option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                </select>
              </div>
              <div className="input-group">
                <label>Deadline:</label>
                <DatePicker
                  selected={formState.deadlineTask}
                  onChange={handleDateChange}
                  placeholderText="Click to select date"
                  name="deadlineTask"
                  showTimeSelect
                  dateFormat="dd/MM/yyyy HH:mm"
                  minDate={new Date()} // Không cho chọn ngày trong quá khứ
                  isClearable // Hiển thị nút (x) để xóa ngày đã chọn
                  // Chỉ hiển thị lịch khi bấm vào icon
                  showIcon
                  icon="fa fa-calendar"
                  // Hiển thị tháng và năm để chọn nhanh
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                ></DatePicker>
              </div>
            </div>

            {/* Description */}
            <div className="input-group">
              <label>Descriptions</label>
              <textarea
                name="description"
                rows="2"
                value={formState.description || ""}
                onChange={handleInputChange}
                placeholder="Ghi chú thêm..."
              />
            </div>

            {/* --- SUBTASK MANAGER (PHẦN QUAN TRỌNG) --- */}
            <div className="subtask-manager-section">
              <label>Work list (Subtasks)</label>

              {/* Input thêm mới */}
              <div className="add-subtask-row">
                <Plus size={18} className="add-icon-input" />
                <input
                  type="text"
                  placeholder="Type a sub-task and press Enter..."
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={handleAddSubtask}
                />
              </div>

              {/* List Subtask có thể sửa/xóa */}
              <div className="modal-subtask-list">
                {formState.detailTask.map((sub) => (
                  <div key={sub.id} className="modal-subtask-item">
                    {/* Checkbox giả */}
                    <div
                      className={`mini-checkbox ${
                        sub.completed ? "checked" : ""
                      }`}
                    >
                      {sub.completed && <Check size={12} strokeWidth={4} />}
                    </div>

                    {/* Input sửa tên trực tiếp */}
                    <input
                      type="text"
                      className="edit-sub-input"
                      value={sub.title}
                      onChange={(e) =>
                        handleSubtaskNameChange(sub.id, e.target.value)
                      }
                    />

                    {/* Nút xóa subtask */}
                    <button
                      className="btn-mini delete"
                      onClick={() => handleDeleteSubtask(sub.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {formState.detailTask.length === 0 && (
                  <p className="empty-subtask-text">
                    Don't have sub-task created
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-cancel" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleCreateAndUpdate}>
              {formState.idTask ? (
                <>
                  <Save size={18} /> Save
                </>
              ) : (
                <>
                  <Plus size={18} /> Create
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  return { handleSubmitForm };
};
