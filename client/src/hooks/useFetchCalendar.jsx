import { useState, useEffect, useCallback } from "react"; // 1. Thêm useCallback

export const useFetchEvent = () => {
  const [events, setEvents] = useState([]);

  // 2. Dùng useCallback để "gói" hàm fetch lại
  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/fetchCalendarApi.php?action=get_all_event`
      );
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.eventForm)) {
        const formattedDate = data.eventForm.map((event) => ({
          ...event,
          date: new Date(event.date),
          startTime: event.start_time, 
          endTime: event.end_time,
          completed: event.completed === "true"
        }));
        setEvents(formattedDate);
      } else {
        throw new Error(data.message || "Lỗi không xác định từ API");
      }
    } catch (err) {
      console.error("Error fetch ", err);
    }
  }, []); // useCallback với mảng rỗng

  // 3. useEffect bây giờ chỉ gọi hàm fetchTasks 1 lần lúc đầu
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]); // Phụ thuộc vào fetchTasks (vẫn chỉ chạy 1 lần)

  // 4. Trả về thêm hàm fetchTasks để bên ngoài gọi
  return { events, setEvents, refetch: fetchEvents };
};
