<?php
class QuickNoteModel
{
    private $pdo;
    private $table_name = 'quick_notes';

    public function __construct($database)
    {
        $this->pdo = $database;
    }

    public function saveNotes($contentNotes)
    {
        try {
            $checkSql = "SELECT id FROM " . $this->table_name . " LIMIT 1";
            $prepareStmt = $this->pdo->prepare($checkSql);
            $prepareStmt->execute();
            $row = $prepareStmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                $idToUpdate = $row['id'];
                $updateSql = "UPDATE " . $this->table_name . " SET contentNotes = ? WHERE id = ?";
                $updatePrepareStmt = $this->pdo->prepare($updateSql);
                $result = $updatePrepareStmt->execute([$contentNotes, $idToUpdate]);
                if ($result) {
                    return ['success' => true, 'message' => 'Update your quick notes successfully!'];
                }
            } else {
                $sql = "INSERT INTO " . $this->table_name . " (contentNotes) VALUES (?)";

                $prepareStmt = $this->pdo->prepare($sql);
                $result = $prepareStmt->execute([$contentNotes]);
                if ($result) {
                    return ['success' => true];
                }
                return ['success' => false, 'message' => 'Can not save content notes'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getNote()
    {
        try {
            $sql = "SELECT contentNotes FROM " . $this->table_name . " LIMIT 1";
            $prepareStmt = $this->pdo->prepare($sql);
            $prepareStmt->execute();
            $row = $prepareStmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                return ['success' => true, 'data' => $row['contentNotes']];
            }
            return ['success' => true, 'data' => ''];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
