<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendar_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
$ids = $data['ids'];

if (!empty($ids)) {
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $sql = "DELETE FROM events WHERE id IN ($placeholders)";
    $stmt = $conn->prepare($sql);

    $stmt->bind_param(str_repeat('i', count($ids)), ...$ids);

    if ($stmt->execute()) {
        echo "Selected events deleted successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>
