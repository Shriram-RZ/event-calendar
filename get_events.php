<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendar_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$date = $_GET['date'];
$sql = "SELECT id, title, time, start_date, end_date FROM events WHERE DATE(start_date) <= ? AND DATE(end_date) >= ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $date, $date);
$stmt->execute();
$result = $stmt->get_result();

$events = [];
while($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode($events);
$stmt->close();
$conn->close();
?>
