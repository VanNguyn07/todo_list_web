import React from "react";
import { intervalToDuration, format, parseISO, endOfDay, isAfter } from 'date-fns';
import "./ProcessGoal.css";

const getProcessBar = (duration) => {
    if (duration.days <= 3) return 'urgent';
    if (duration.days <= 7) return 'soon';
    return 'normal';
};

export const ProcessGoal = ({ title, deadline, tasksCompleted = 0, tasksTotal = 0 }) => {
    const deadlineDate = endOfDay(parseISO(deadline));
    const current = new Date();
    const isOverdue = !isAfter(deadlineDate, current);

    const duration = !isOverdue ? intervalToDuration({start: current, end: deadlineDate}) : {days: 0, hours: 0};
    const formattedDeadline = format(deadlineDate, 'dd/MM/yyyy');
    const percentage = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

    const status = getProcessBar(duration);

    return (
        <div className={`card ${status}`}>
            <div className="header">
                <span className={`icon ${status}`}><i className="fa-solid fa-bullseye-pointer"></i></span>
                <span className="title">{title}</span>
            </div>

            <div className="deadlineInfo">
                <p>
                    🔔 Deadline: <b>{formattedDeadline}</b>{" "}
                    {!isOverdue ? `Remaining: ${duration.days} days ${duration.hours} hours` : "(overdue)"}
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