import React from "react";
import "./QuickNotes.css";
import Textarea from "../textArea/Textarea";
import { useQuickNotes } from "../../hooks/useQuickNotes";
import Button from "../button/Button";

const QuickNotesWidget = ({ className }) => {
  const { content, handleChange, handleSubmit } = useQuickNotes();
  return (
    <>
      <div className="quick-note-widget">
        <div className="quick-note-top">
          <i className="fa-solid fa-file-lines"></i>
          <p>Quick notes</p>
          <Button className="btn-save-note" onClick={handleSubmit}>
            <i className="fa-solid fa-floppy-disk"></i>
            <span className="tooltip-text">Save</span>
          </Button>
          <Button className="btn-add-note">
            <i className="fa-solid fa-plus"></i>
            <span className="tooltip-text">Add</span>
          </Button>
        </div>
        <textarea
          className={className}
          value={content}
          onChange={handleChange}
          placeholder="Quick notes your idea!"
          spellCheck={false}
        />
      </div>
    </>
  );
};

export default QuickNotesWidget;
