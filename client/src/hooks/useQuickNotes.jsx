import React, { useState, useEffect } from "react";

export const useQuickNotes = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      const formData = new FormData();
      const API_URL = "/api/quickNotesApi.php";

      formData.append("action", "get_quick_notes");
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          setContent(data.content || "");
        }
      } catch (error) {
        console.log("Error fetch quick notes", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("action", "save_quick_notes");
    formData.append("contentNotes", content);

    try {
      const API_URL = "/api/quickNotesApi.php";
      fetch(API_URL, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Lỗi HTTP! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Server response:", data);
          if (data.success) {
            alert(data.message);
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error("Lỗi fetch:", error);
          alert("Lỗi kết nối: " + error.message);
        });
    } catch (error) {
      console.error("Lỗi khi thêm task:", error);
      alert("Lỗi kết nối. Vui lòng thử lại.");
    }
  };

  return {
    content,
    handleChange,
    handleSubmit,
    setContent,
    isLoading,
  };
};
