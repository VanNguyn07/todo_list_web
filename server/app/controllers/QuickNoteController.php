<?php
header('Content-Type: application/json');
class QuickNoteController
{
    private $response = ['success' => false, 'message' => ''];
    private $quickNotesModel;

    public function __construct($database)
    {
        $this->quickNotesModel = new QuickNoteModel($database);
    }

    public function handleSaveNotes()
    {
        $contentNotes = trim($_POST['contentNotes']);
        if (empty($contentNotes)) {
            $this->response['message'] = 'Please fill in the content for the quick notes!';
            $this->response['field'] = 'contentNotes';
            echo json_encode($this->response);
            exit();
        }

        $isSuccess = $this->quickNotesModel->saveNotes($contentNotes);
        if ($isSuccess['success'] === true) {
            $this->response['success'] = true;
            $this->response['message'] = 'Save quick notes successfully!';
        } else {
            $this->response['success'] = false;
            $this->response['message'] = 'Lỗi CSDL: ' . $isSuccess['message'];
        }

        echo json_encode($this->response);
        exit();
    }

    public function hanldeGetNotes(){
        $result = $this->quickNotesModel->getNote();
        if($result['success']){
            $this->response['success'] = true;
            $this->response['content'] = $result['data'];
        }else {
            $this->response['success'] = false;
            $this->response['message'] = $result['message'];
        }

        echo json_encode($this->response);
        exit();
    }   
}
