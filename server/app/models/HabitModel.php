<?php
class HabitModel
{
    private $pdo;
    private $table_habit = "habits";

    public function __construct($database)
    {
        $this->pdo = $database;
    }

    public function insertHabit($name, $period, $target, $unit, $icon_key)
    {
        $sql = "INSERT INTO " . $this->table_habit . " (name, period, target, unit, icon_key) VALUES (?, ?, ?, ?, ?)";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $result = $prepareStmt->execute([$name, $period, $target, $unit, $icon_key]);
            if ($result) {
                return ['success' => true];
            } else {
                return ['success' => false, 'message' => "Can not add habit!"];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getAllHabit()
    {
        $sql = "SELECT * FROM " . $this->table_habit . " ORDER BY completed ASC, period ASC, id DESC ";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $prepareStmt->execute();
            $habitFromDb = $prepareStmt->fetchAll(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $habitFromDb];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage(), 'data' => []];
        }
    }

    public function updateStatus($id, $current, $completed)
    {
        $isCompleted = filter_var($completed, FILTER_VALIDATE_BOOLEAN);
        $status = $isCompleted ? 'true' : 'false';
        $sql = " UPDATE " . $this->table_habit . " SET current = ?, completed = ? WHERE id = ?";

        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $result = $prepareStmt->execute([$current, $status, $id]);
            if ($result) {
                return ['success' => true, "message" => "Update status is successfully!"];
            } else {
                return ['success' => false, "message" => "Update status is not successfully!"];
            }
        } catch (PDOException $e) {
            error_log("SQL update status Error: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function deleteHabit($id)
    {
        $sql = " DELETE FROM " . $this->table_habit . " WHERE id = ?";

        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $result = $prepareStmt->execute([$id]);

            if ($result) {
                return ['success' => true];
            } else {
                return ['success' => false, "message" => "Delete Habit Failed!"];
            }
        } catch (PDOException $e) {
            error_log("SQL delete Error: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function updateHabit($id, $name, $period, $target, $unit, $icon_key)
    {
        $sql = " UPDATE " . $this->table_habit . " SET name = ?, period = ?, target = ?, unit = ?, icon_key = ? WHERE id = ?";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $result = $prepareStmt->execute([$name, $period, $target, $unit, $icon_key, $id]);

            if($result){
                return['success' => true];
            }else {
                return['success' => false, "message" => "Update habit is not successfully"];
            }
        }catch(PDOException $e){
             error_log("SQL update habit Error: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
