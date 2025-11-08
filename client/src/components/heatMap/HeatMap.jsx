import React from "react";
import ActivityCalendar from "react-activity-calendar";
import mockHeatmapData from "../utils/MockDataHeatMap";
import "./HeatMap.css";

const customTheme = {
    light: ['#ebedf0', '#fde68a', '#facc15', '#eab308', '#ca8a04'],
};

export const HabitHeatMap = ({className}) => {
    return(
        <ActivityCalendar
            className={className}
            data={mockHeatmapData}
            theme={customTheme}
            colorScheme="light"
            blockSize={20}
            blockMargin={4}
            fontSize={18}
            showWeekdayLabels={true}
            hideColorLegend={false}
            hideMonthLabels={false}
            hideTotalCount={false}
        />
    );
}