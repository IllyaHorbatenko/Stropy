<?php

define('__ROOT__', dirname(__FILE__));
require_once __ROOT__ . '/PHPMailer/class.phpmailer.php';

if ($_POST) {

    $name = $_POST["name"];
    $phone = $_POST["phone"];
    $email = $_POST["email"];
    $form_name = $_POST["form_name"];
   

    $images = array();
    $json = array(); // подготовим массив ответа

    $id_form = $_POST['form_type'];
    $json['form_type'] = $id_form;

    if(isset($_POST["services"])) {
        $services = $_POST["services"];
    } else { 
        $services = "Отсутствует";   
    }

     if (isset($_POST['form_name']) and $_POST['form_name'] != "") {
        $form_name = $_POST['form_name'];
        $message .= '
        <h1>Вам сообщение!</h1>
        <div style="font-size: 18px; margin-bottom: 10px">Из формы: ' . '<span style="font-size: 18px"> ' . $form_name . '</span>' . '</div>';
    }

    if (isset($_POST['phone']) and $_POST['phone'] != "") {
        $phone = $_POST['phone'];
        $message .= '<div style="font-size: 18px; margin-bottom: 10px; padding-left: 10px">Телефон: ' . $phone . '</div>';
    }
    if (isset($_POST['email']) and $_POST['email'] != "") {
        $email = $_POST['email'];
        $message .= '<div style="font-size: 18px; margin-bottom: 10px; padding-left: 10px">Email: ' . $email . '</div>';
    }
    if (isset($_POST['name']) and $_POST['name'] != "") {
        $name = $_POST['name'];
        $message .= '<div style="font-size: 18px; margin-bottom: 10px; padding-left: 10px">Имя: ' . $name . '</div>';
    }


    $mailer = new PHPMailer();
    $subject = "Заявка с сайта Название сайта";
    $to = 'mini_van@ukr.net'; //ставьте свою почту для тестов 
 //   $mailer->IsSMTP();
    $mailer->Host = 'smtp.yandex.ru';
    $mailer->Port = 465;
    $mailer->SMTPSecure = "ssl";
    $mailer->SMTPAuth = true;
    $mailer->Username = 'efimenko-i-d@yandex.ua';
    $mailer->Password = 'TabvtyrjBujhm06';
    $mailer->From = 'you@example.com';
    $mailer->FromName = 'Your Name';
    $mailer->CharSet = "UTF-8";
    $mailer->Subject = $subject;
    $mailer->MsgHTML($message);
    $mailer->AddAddress($to);

    //Upload Files
    foreach ($_FILES as $image) {
        $ext = '.' . pathinfo($image['name'], PATHINFO_EXTENSION);

        while (true) {
            $filename = uniqid(rand(), true) . $ext;
            if (!file_exists(__ROOT__ . '\uploads\\' . $filename)) {
                break;
            }
        }

        move_uploaded_file($image['tmp_name'], __ROOT__ . '\uploads\\' . $filename);
        $file_to_attach = __ROOT__ . '\uploads\\' . $filename;
        $mailer->AddAttachment($file_to_attach, $filename);
        // $images[] = __ROOT__ . '\uploads\\' . $filename;
    }

    if ($mailer->Send()) {
        $json['error'] = 0;
    } else {
        $json['error'] = 1;
    }

    echo json_encode($json);
}