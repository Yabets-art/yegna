<?php
require "./connect.php";

// Validate email format
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Validate password (example: non-empty)
function isValidPassword($password) {
    return !empty($password);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve the data sent from JavaScript
    $jsonData = file_get_contents('php://input');
    $postData = json_decode($jsonData, true);
    $bdconnect = connect();

    try {
        if (array_key_exists('login', $postData)) {
            if (array_key_exists('buylogin', $postData['login'])) {
                $email = $postData['login']['buylogin']['email'];
                $password = $postData['login']['buylogin']['password'];

                if (!isValidEmail($email) || !isValidPassword($password)) {
                    echo json_encode(array("value" => false, "message" => "Invalid email or password format."));
                    exit();
                }

                $stmt = $bdconnect->prepare("SELECT * FROM buyeruser WHERE email = ? AND password = ?");
                $stmt->bind_param("ss", $email, $password);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    echo json_encode(array("value" => true, "info" => $result->fetch_assoc()));
                } else {
                    echo json_encode(array("value" => false));
                }
                $stmt->close();
            } else if (array_key_exists('selllogin', $postData['login'])) {
                $email = $postData['login']['selllogin']['email'];
                $password = $postData['login']['selllogin']['password'];

                if (!isValidEmail($email) || !isValidPassword($password)) {
                    echo json_encode(array("value" => false, "message" => "Invalid email or password format."));
                    exit();
                }

                $stmt = $bdconnect->prepare("SELECT id, email, location, phonenumber, userimg, username FROM selleruser WHERE email = ? AND password = ?");
                $stmt->bind_param("ss", $email, $password);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    echo json_encode(array("value" => true, "info" => $result->fetch_assoc()));
                } else {
                    echo json_encode(array("value" => false));
                }
                $stmt->close();
            }
        } else if (array_key_exists('sign', $postData)) {
            if (array_key_exists('buysign', $postData['sign'])) {
                $data = $postData['sign']['buysign'];
                $email = $data['email'];
                $password = $data['password'];

                if (!isValidEmail($email) || !isValidPassword($password)) {
                    echo json_encode(array("value" => false, "message" => "Invalid email or password format."));
                    exit();
                }

                $stmt = $bdconnect->prepare("SELECT id, email, location, phonenumber, userimg, username FROM buyeruser WHERE email = ?");
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    echo json_encode(array("value" => false, "message" => $data['name'] . " already exists"));
                } else {
                    $stmt = $bdconnect->prepare("INSERT INTO buyeruser (username, email, phonenumber, password, location, userimg, gender) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    $stmt->bind_param("sssssss", $data['name'], $data['email'], $data['phonenumber'], $data['password'], $data['location'], $data['img'], $data['gender']);
                    if ($stmt->execute()) {
                        $newUserId = $stmt->insert_id;
                        $stmt->close();

                        $stmt = $bdconnect->prepare("SELECT * FROM buyeruser WHERE id = ?");
                        $stmt->bind_param("i", $newUserId);
                        $stmt->execute();
                        $result = $stmt->get_result();
                        echo json_encode(array("value" => true, "message" => $data['name'] . " created successfully", "info" => $result->fetch_assoc()));
                    }
                }
                $stmt->close();
            } else if (array_key_exists('selllogin', $postData['sign'])) {
                $data = $postData['sign']['selllogin'];
                $email = $data['email'];
                $password = $data['password'];

                if (!isValidEmail($email) || !isValidPassword($password)) {
                    echo json_encode(array("value" => false, "message" => "Invalid email or password format."));
                    exit();
                }

                $stmt = $bdconnect->prepare("SELECT id, email, location, phonenumber, userimg, username FROM selleruser WHERE email = ?");
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    echo json_encode(array("value" => false, "message" => $data['name'] . " already exists"));
                } else {
                    $stmt = $bdconnect->prepare("INSERT INTO selleruser (username, email, phonenumber, password, location, userimg, gender, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                    $stmt->bind_param("ssssssss", $data['name'], $data['email'], $data['phonenumber'], $data['password'], $data['location'], $data['img'], $data['gender'], $data['type']);
                    if ($stmt->execute()) {
                        $newUserId = $stmt->insert_id;
                        $stmt->close();

                        $stmt = $bdconnect->prepare("SELECT id, email, location, phonenumber, userimg, username FROM selleruser WHERE id = ?");
                        $stmt->bind_param("i", $newUserId);
                        $stmt->execute();
                        $result = $stmt->get_result();
                        echo json_encode(array("value" => true, "message" => $data['name'] . " created successfully", "info" => $result->fetch_assoc()));
                    }
                }
                $stmt->close();
            }
        }
    } catch (Exception $e) {
        echo json_encode(array("alert" => $e->getMessage()));
    }
}
?>
