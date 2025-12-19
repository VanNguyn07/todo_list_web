import { useUpdateTask } from "../../hooks/useUpdateTask";
import { useAddTaskForm } from "../../hooks/useAddTaskForm";
import { Plus, Trash2, X, Save, Check } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../tasksPages/TaskPages.css";
export const UpdateAndCreateTask = ({taskPageData, onTaskUpdate}) => {
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
    handleToggleStatusSubtask,
    closeModal,
  } = taskPageData;

  const { handleSubmitUpdate } = useUpdateTask();
  const { handleSubmitCreate } = useAddTaskForm();

  const onSuccessAction = () => {
    refetch();
    closeModal();
    if (onTaskUpdate) onTaskUpdate();
  };

  const handleCreateAndUpdate = async () => {
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
                  <option value="" disabled>
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
                  showTimeSelect
                  dateFormat="dd/MM/yyyy HH:mm"
                  minDate={new Date()}
                  isClearable
                  showIcon
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                />
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

            {/* --- SUBTASK MANAGER (FIX TÊN BIẾN TẠI ĐÂY) --- */}
            <div className="subtask-manager-section">
              <label>Work list (Subtasks)</label>

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

              <div className="modal-subtask-list">
                {formState.sub_tasks &&
                  formState.sub_tasks?.map((sub) => {
                    const isCompleted =
                      sub.completed === "true" || sub.completed === true;
                    return (
                      <div
                        key={sub.idSubTask || sub.tempId}
                        className="modal-subtask-item"
                      >
                        <button
                          className={`mini-checkbox ${
                            isCompleted ? "checked" : ""
                          }`}
                          onClick={() => handleToggleStatusSubtask(sub.idSubTask, sub.tempId)}
                        >
                          {isCompleted && <Check size={12} strokeWidth={4} />}
                        </button>

                        <input
                          type="text"
                          className={`edit-sub-input ${
                            isCompleted ? "text-strikethrough" : ""
                          }`}
                          value={sub.content}
                          onChange={(e) =>
                            handleSubtaskNameChange(
                              sub.idSubTask,
                              sub.tempId,
                              e.target.value
                            )
                          }
                        />
                        <button
                          className="btn-mini delete"
                          onClick={() =>
                            handleDeleteSubtask(sub.idSubTask, sub.tempId)
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}

                {(!formState.sub_tasks || formState.sub_tasks.length === 0) && (
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
