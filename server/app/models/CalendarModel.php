<?php
class CalendarModel
{
    private $pdo;
    private $table_calendar = "calendars";

    public function __construct($database)
    {
        $this->pdo = $database;
    }

    public function insertEvent($name, $startTime, $endTime, $description, $date, $color)
    {
        $sql = " INSERT INTO " . $this->table_calendar . " (name, start_time, end_time, description, date, color) VALUES (?, ?, ?, ?, ?, ?)";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $result = $prepareStmt->execute([$name, $startTime, $endTime, $description, $date, $color]);

            if ($result) {
                return ['success' => true];
            } else {
                return ['success' => false, 'message' => "Can not add event!"];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    public function getAllEvent()
    {
        // 1. Tạm thời bỏ logic sắp xếp phức tạp đi, chỉ lấy tất cả ra xem có data không
        // Đảm bảo tên biến table_calendar đúng
        $sql = "SELECT * FROM " . $this->table_calendar . " ORDER BY id DESC";

        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $prepareStmt->execute();
            $eventFromDb = $prepareStmt->fetchAll(PDO::FETCH_ASSOC);

            // --- DEBUG: Nếu mảng rỗng thì do DB chưa có gì hoặc sai tên bảng ---
            return ['success' => true, 'data' => $eventFromDb];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage(), 'data' => []];
        }
    }

    public function updateStatusEvent($id, $completed)
    {
        $isCompleted = filter_var($completed, FILTER_VALIDATE_BOOLEAN);
        $status = $isCompleted ? 'true' : 'false';

        $sql = " UPDATE " . $this->table_calendar . " SET completed = ? WHERE id = ?";

        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $result = $prepareStmt->execute([$status, $id]);
            if ($result) {
                return ['success' => true, "message" => "Update status event is successfully!"];
            } else {
                return ['success' => false, "message" => "Update status event is not successfully!"];
            }
        } catch (PDOException $e) {
            error_log("SQL update status event Error: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function deleteEvent($id)
    {
        $sql = " DELETE FROM " . $this->table_calendar . " WHERE id = ?";

        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $result = $prepareStmt->execute([$id]);

            if ($result) {
                return ['success' => true];
            } else {
                return ['success' => false, "message" => "Delete Event Failed!"];
            }
        } catch (PDOException $e) {
            error_log("SQL delete event Error: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function updateEvent($id, $name, $description, $startTime, $endTime)
    {
        $sql = " UPDATE " . $this->table_calendar . " SET name = ?,  description= ?, start_time = ?, end_time = ? WHERE id = ?";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $result = $prepareStmt->execute([$name, $description, $startTime, $endTime, $id]);

            if($result){
                return['success' => true];
            }else {
                return['success' => false, "message" => "Update event is not successfully"];
            }
        }catch(PDOException $e){
             error_log("SQL update event Error: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

}
