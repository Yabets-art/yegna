<?php
require "./backjs/php/connect.php";

// Function to mark delivery as complete
function markDeliveryComplete($db, $boughtprod) {
    $stmt = $db->prepare("UPDATE bought SET dlivery = 1 WHERE boughtprod = ?");
    $stmt->bind_param("i", $boughtprod);
    $stmt->execute();   
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $db = connect();
    try {
        $completionCode = $_POST['completionCode'];
        $stmt = $db->prepare("SELECT * FROM bought WHERE code = ?");
        $stmt->bind_param("s", $completionCode);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            markDeliveryComplete($db, $row['boughtprod']);
            echo "<script>alert('Code validated. Delivery marked as complete.');</script>";
        } else {
            echo "<script>alert('Invalid code. Please try again.');</script>";
        }
    } finally {
        $db->close();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/dlivery.css">
    <title>Delivery Guy Dashboard</title>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Delivery Dashboard</h1>
            <div class="status">Status: <span id="status">On Duty</span></div>
        </header>

        <section class="deliveries">
            <h2>Today's Deliveries</h2>
            <ul class="delivery-list" id="deliveryList">
                <?php
                $db = connect();
                try {
                    $stmt = $db->query("SELECT * FROM bought WHERE dlivery = 0 and Approved = 1");
                    if ($stmt->num_rows > 0) {
                        while ($row = $stmt->fetch_assoc()) {
                            $stmt2 = $db->prepare("SELECT * FROM buyeruser WHERE id = ?");
                            $stmt2->bind_param("i", $row['userid']);
                            $stmt2->execute();
                            $result = $stmt2->get_result();
                            if ($result->num_rows > 0) {
                                $buyer = $result->fetch_assoc();
                                echo '<li>
                                        <div class="delivery">
                                            <p><strong>Address:</strong> ' . $buyer["location"] . '</p>
                                            <p><strong>Recipient:</strong> ' . $buyer["username"] . '</p>
                                            <p><strong>Contact:</strong> ' . $buyer["phonenumber"] . '</p>
                                            <button class="complete-btn" onclick="showPopup(\'popup-' . $row['boughtprod'] . '\')">start</button>
                                        </div>
                                    </li>
                                    <div id="popup-' . $row['boughtprod'] . '" class="popup">
                                        <div class="popup-content">
                                            <span class="close-btn" onclick="closePopup(\'popup-' . $row['boughtprod'] . '\')">&times;</span>
                                            <h2>Enter Completion Code</h2>
                                            <form method="post" action="dlivery.php">
                                                <input type="hidden" name="boughtprod" value="' . $row['boughtprod'] . '">
                                                <input type="text" id="completionCode" name="completionCode" placeholder="Enter code">
                                                <button type="submit" class="submit-btn">Submit</button>
                                            </form>
                                        </div>
                                    </div>';
                            }
                        }
                    } else {
                        echo "<center><h1>No deliveries for today</h1></center>";
                    }
                } finally {
                    $db->close();
                }
                ?>
            </ul>
        </section>

        <footer class="footer">
            <p>&copy; 2024 Delivery Services Inc.</p>
        </footer>
    </div>

    <script src="./js/delivery.js"></script>
</body>
</html>
