<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendar_app";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'];
    $description = $_POST['description'];
    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];
    $time = $_POST['time'];

    $sql = "INSERT INTO events (title, description, start_date, end_date, time) 
            VALUES ('$title', '$description', '$start_date', '$end_date', '$time')";

    if ($conn->query($sql) === TRUE) {
        echo "New event created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
