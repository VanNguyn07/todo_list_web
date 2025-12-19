import React from "react";
export const RenderSubTasks = (subTasks) => {
  if (!Array.isArray(subTasks) || subTasks.length === 0) {
    return <p className="no-subtasks">No sub-tasks available.</p>; // Phải có return ở đây
  }

  try {
    return (
      <ul className="subtask-list">
        {subTasks.map((sub) => (
          <li
            key={sub.idSubTask}
            className={String(sub.completed) === "true" ? "sub-done" : ""}
          >
            {sub.content}
          </li>
        ))}
      </ul>
    );
  } catch(error) {
    console.error("RenderSubTasks Error:", error);
    return <p>{String(subTasks)}</p>;
  }
};
