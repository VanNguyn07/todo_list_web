    const mockTasks = [
        // --- Task hoàn thành TUẦN NÀY (sẽ xuất hiện) ---
        { id: 1, text: "Làm component Chart", isCompleted: true, completedAt: new Date("2025-11-10T10:00:00") }, 
        { id: 2, text: "Fix bug CSS", isCompleted: true, completedAt: new Date("2025-11-11T14:30:00") }, 
        { id: 2, text: "Fix bug CSS", isCompleted: true, completedAt: new Date("2025-11-11T14:30:00") }, 
        { id: 3, text: "Họp nhóm", isCompleted: true, completedAt: new Date("2025-11-13T17:00:00") }, 
        { id: 4, text: "Viết báo cáo", isCompleted: true, completedAt: new Date("2025-11-16T11:00:00") }, 
        { id: 4, text: "Viết báo cáo", isCompleted: true, completedAt: new Date("2025-11-16T11:00:00") },   

        // --- Task hoàn thành TUẦN TRƯỚC (sẽ bị lọc) ---
        { id: 5, text: "Task tuần trước", isCompleted: true, completedAt: new Date("2025-10-30T15:00:00") },

        // --- Task CHƯA hoàn thành (sẽ bị lọc) ---
        { id: 6, text: "Task đang làm...", isCompleted: false, completedAt: null },
    ]
export default mockTasks;