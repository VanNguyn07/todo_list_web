import React, {useMemo} from "react";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts'
import {processTaskDataForChart} from "../utils/chatHelper";

export const WeeklyProcessChart = ({allTasks}) => {
    // useMemo giúp tối ưu, chỉ tính toán lại khi 'allTasks' thay đổi
    const processedData = useMemo(() => {
        return processTaskDataForChart(allTasks);
    }, [allTasks]);

    return(
    <ResponsiveContainer width="100%" height="100%">
        <BarChart
            data={processedData}
            margin={{
                top: 20, 
                right: 30,
                left: 0,
                bottom:5,
            }}>

            <CartesianGrid
                strokeDasharray="3 3" stroke="#e0e0e0"
            />

            <XAxis
                dataKey="name" stroke="#666" fontSize={12}
            />

            <YAxis
                stroke="#666" fontSize={12}
            />

            <Tooltip
                wrapperStyle={{
                    backgroundColor: '#fff', 
                    border:'1px solid #ccc', 
                    borderRadius: '8px'
            }}/>

            <Bar
                dataKey="task" fill="#8884d8" radius={[4, 4, 0, 0]}
            />
        </BarChart>
    </ResponsiveContainer>
    );
}   