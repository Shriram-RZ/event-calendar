<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendar_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, title, time, start_date, end_date FROM events";
$result = $conn->query($sql);

$events = [];
while($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode($events);

$conn->close();
?>
