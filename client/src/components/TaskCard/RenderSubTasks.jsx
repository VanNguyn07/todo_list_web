import React from "react";
export const RenderSubTasks = (detailString) => {
  try {
    const subTask = JSON.parse(detailString);
    //Kiểm tra nếu đúng là Array thì map ra danh sách
    if (Array.isArray(subTask)) {
      return (
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '5px 0' }}>
          {subTask.map((sub) => (
            <li key={sub.id}>{sub.title}</li>
          ))}
        </ul>
      );
    }
  } catch {
    // 3. Trường hợp lỗi (Do dữ liệu cũ không phải JSON hoặc chuỗi rỗng)
    // Thì cứ hiển thị nó như văn bản bình thường
    return <p>{detailString}</p>;
  }
  // Trường hợp parse ra nhưng không phải array (ví dụ số hoặc string thường)
  return <p>{detailString}</p>;
};
