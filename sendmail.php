<?php
// --- CORS headers ---
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Якщо браузер робить preflight (OPTIONS) → відповідаємо і зупиняємось
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name  = $_POST['name'] ?? '';
    $tel   = $_POST['tel'] ?? '';
    $msg   = $_POST['message'] ?? '';

    $mail = new PHPMailer(true);

    try {
        
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'knpcpmsdwebsite@gmail.com';  
        $mail->Password   = 'wkbn gkhe edfm ifdj'; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        
        $mail->setFrom('knpcpmsdwebsite@gmail.com', 'Старобільський КНП');
        
        $mail->addAddress('knpcpmsdwebsite@gmail.com');

        // Лист
        $mail->isHTML(true);
        $mail->Subject = "Нове повідомлення з сайту";
        $mail->Body    = "
            <b>Ім’я:</b> $name <br>
            <b>Телефон:</b> $tel <br>
            <b>Повідомлення:</b> $msg
        ";

        $mail->send();
        echo "OK";
    } catch (Exception $e) {
        echo "Помилка: {$mail->ErrorInfo}";
    }
}