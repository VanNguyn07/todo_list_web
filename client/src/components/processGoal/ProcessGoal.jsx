import React from "react";
import { differenceInDays, format } from 'date-fns';
import "./ProcessGoal.css";

const getProcessBar = (daysLeft) => {
    if (daysLeft <= 3) return 'urgent';
    if (daysLeft <= 7) return 'soon';
    return 'normal';
};

export const ProcessGoal = ({ title, deadline, tasksCompleted = 0, tasksTotal = 0 }) => {
    const deadlineDate = new Date(deadline);
    const daysLeft = differenceInDays(deadlineDate, new Date());
    const formattedDeadline = format(deadlineDate, 'dd/MM/yyyy');

    const percentage = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;
    const status = getProcessBar(daysLeft);

    return (
        <div className={`card ${status}`}>
            <div className="header">
                <span className={`icon ${status}`}><i className="fa-solid fa-bullseye-pointer"></i></span>
                <span className="title">{title}</span>
            </div>

            <div className="deadlineInfo">
                <p>
                    🔔 Hạn chót: <b>{formattedDeadline}</b>{" "}
                    {daysLeft > 0 ? ` (Còn ${daysLeft} ngày)` : " (Quá hạn)"}
                </p>
            </div>

            <div className="processContainer">
                <div className="processBar">
                    <div className="processFill" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>

            <span className="percentage">{percentage}%</span>

            <div className="taskInfo">
                Hoàn thành: {tasksCompleted} / {tasksTotal} tasks
            </div>
        </div>
    );
};