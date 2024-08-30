<?php
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'root', '', 'calendar_app');

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['event_title'], $data['event_date'])) {
    $event_title = $conn->real_escape_string($data['event_title']);
    $event_date = $conn->real_escape_string($data['event_date']);
    $start_time = isset($data['start_time']) ? $conn->real_escape_string($data['start_time']) : null;
    $end_time = isset($data['end_time']) ? $conn->real_escape_string($data['end_time']) : null;
    $description = isset($data['description']) ? $conn->real_escape_string($data['description']) : null;

    $sql = "INSERT INTO events (event_title, event_date, start_time, end_time, description) VALUES ('$event_title', '$event_date', '$start_time', '$end_time', '$description')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}

$conn->close();
?>
