import React from "react";
import {format, parseISO, endOfDay, isAfter, differenceInDays, differenceInHours } from 'date-fns';
import "./ProcessGoal.css";

const getProcessBar = (totalDays, isOverdue) => {
    if (isOverdue) return 'overdue';
    if (totalDays <= 3) return 'urgent';
    if (totalDays <= 7) return 'soon';
    return 'normal';
};

export const ProcessGoal = ({ titleTask, deadlineTask, tasksCompleted = 0, tasksTotal = 0 }) => {
    const deadlineDate = endOfDay(parseISO(deadlineTask));
    const current = new Date();
    const isOverdue = !isAfter(deadlineDate, current);

    const totalDays = !isOverdue ? differenceInDays(deadlineDate, current) : 0;
    const totalHours = !isOverdue ? differenceInHours(deadlineDate, current) % 24 : 0;
    const formattedDeadline = format(deadlineDate, 'dd/MM/yyyy');
    const percentage = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

    const status = getProcessBar(totalDays);

    return (
        <div className={`card ${status}`}>
            <div className="header">
                <span className={`icon ${status}`}><i className="fa-solid fa-bullseye-pointer"></i></span>
                <span className="title">{titleTask}</span>
            </div>

            <div className="deadlineInfo">
                <p>
                    🔔 Deadline: <b>{formattedDeadline}</b>{" "}
                    {!isOverdue ? `Remaining: ${totalDays} days ${totalHours} hours` : "(overdue)"}
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