<?php
require "./backjs/php/connect.php";

$db = connect();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

 $cardId = $_POST['cardId'];
 $approvalStatus = intval($_POST['approvalStatus']);

 // Update card status in the database
 $stmt = $db->prepare("UPDATE bought SET Approved = ? WHERE boughtprod  = ?");
 $stmt->bind_param("ii", $approvalStatus, $cardId);
 $stmt->execute();
 $stmt->close();
}

// Retrieve cards data from the database
$sql = "SELECT 	boughtprod , resitimg FROM bought where Approved = 0";
$result = $db->query($sql);
$cardsData = [];
if ($result->num_rows > 0) {
 while ($row = $result->fetch_assoc()) {
  $cardsData[] = $row;
 }
}
$db->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Card Layout</title>
 <link rel="stylesheet" href="./css/bill_checker.css">
</head>
<body>
 <div class="container" id="cardContainer">
  <?php for ($i = 0; $i < count($cardsData); $i++): ?>
   <div class="card">
    <img src="<?= htmlspecialchars($cardsData[$i]['resitimg']) ?>" alt="">
    <div class="buttons">
     <form action="" method="post">
      <input type="hidden" name="cardId" value="<?= $cardsData[$i]['boughtprod'] ?>">
      <input type="hidden" name="approvalStatus" value="1">
      <button type="submit" class="approved">Approved</button>
     </form>
     <form action="" method="post">
      <input type="hidden" name="cardId" value="<?= $cardsData[$i]['boughtprod'] ?>">
      <input type="hidden" name="approvalStatus" value="0">
      <button type="submit" class="disapproved">Disapproved</button>
     </form>
    </div>
   </div>
  <?php endfor; ?>
 </div>
</body>  
</html>
