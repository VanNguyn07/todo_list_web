<?php 
$connect = mysqli_connect('localhost', 'root', '', 'sign_in');
//Nếu có lỗi xảy ra thì dừng đoạn mã và in thông báo lỗi
if(!$connect){
     die("Error: Could not connect to the database. An error" . mysqli_connect_error(). "ocurred.");
}
mysqli_set_charset($connect,'utf8')
?>