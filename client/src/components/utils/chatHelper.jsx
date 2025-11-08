import {startOfWeek, endOfWeek, isWithinInterval, getDay} from 'date-fns';

export const processTaskDataForChart = (tasks) => {

    const weeklyData = [
        {name: 'Mon', task: 0},
        {name: 'Tue', task: 0},
        {name: 'Wed', task: 0},
        {name: 'Thu', task: 0},
        {name: 'Fri', task: 0},
        {name: 'Sat', task: 0},
        {name: 'Sun', task: 0},
    ];
    
    // 2. Lấy ngày bắt đầu và kết thúc của tuần NÀY
    const today = new Date();
    const weekStart = startOfWeek(today, {weekStartsOn: 1});
    const weekEnd = endOfWeek(today, {weekStartsOn: 1});

    // 3. Lọc và đếm các tasks

    tasks.forEach(element => {
        // Chỉ xử lý task đã hoàn thành VÀ có ngày hoàn thành
        if(element.isCompleted && element.completedAt) {
            const compeledDate = new Date(element.completedAt);

            // Kiểm tra xem ngày hoàn thành có nằm trong tuần này không
            if(isWithinInterval(compeledDate, {start: weekStart, end: weekEnd})) {
                const dayOfWeek = getDay(compeledDate);
                // Ánh xạ vào mảng weeklyData
                if(dayOfWeek === 0){
                    weeklyData[6].task += 1;
                }else {
                weeklyData[dayOfWeek - 1].task += 1
                }   
            }
        }
    });

    return weeklyData;
}