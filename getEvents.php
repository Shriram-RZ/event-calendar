<?php
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'root', '', 'calendar_app');

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

$sql = "SELECT * FROM events";
$result = $conn->query($sql);

$events = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
}

echo json_encode($events);

$conn->close();
?>
