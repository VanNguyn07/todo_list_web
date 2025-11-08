import React, {useState, useEffect} from "react";
import "./QuickNotes.css";
import Textarea from "../textArea/Textarea";

const QuickNotesWidget = ({className}) => {

    const [noteContent, setNoteContent] = useState(() => {
        localStorage.getItem('quicknote') || ""
    });

    useEffect(() => {
        localStorage.setItem('quicknote', noteContent);
    }, [noteContent]); //[noteContent]); là một dependencies là danh sách mà React sẽ track 

    const handleQuickNote = (event) => {
        setNoteContent(event.target.value)
    }

    return(
        <>
        <textarea className={className}
            value={noteContent}
            onChange={handleQuickNote}
            placeholder="Quick notes your idea!"
        />
        </>
    );
}

export default QuickNotesWidget