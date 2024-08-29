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
$title = $data['title'];
$description = $data['description'];
$startDate = $data['startDate'];
$endDate = $data['endDate'];
$time = $data['time'];

$sql = "INSERT INTO events (title, description, start_date, end_date, time) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $title, $description, $startDate, $endDate, $time);

if ($stmt->execute()) {
    echo "Event added successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
