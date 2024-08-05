<?php 
require "./connect.php";
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $jsonData = file_get_contents('php://input');
    $postData = json_decode($jsonData, true);
    $bdconnect = connect();

if(array_key_exists('sell',$postData)){
if(array_key_exists('prodsell',$postData['sell'])){
 $bdconnect->query(sqlsel('buyandsell',$postData['sell']['prodsell']));
 $value =  $bdconnect->query("SELECT * FROM buyandsell WHERE prductvalue = '".$postData['sell']['prodsell']['price'] . "' and proddic = '" . $postData['sell']['prodsell']['dicx'] . "'")->fetch_row();

    $bdconnect->query(impment("sellchart",$postData['sell']['user'],$value[0]));
    echo json_encode(array("value" => true,"mesage" => "product added successfully","info" => $value));
 
}
}

elseif(array_key_exists('delete',$postData)){
    if ($bdconnect->query("DELETE FROM sellchart WHERE productid = ".$postData['delete']['id'])) {
    if($bdconnect->query("DELETE FROM buyandsell WHERE productid = ".$postData['delete']['id'])){
        echo json_encode(array("value" => true,"mesage" => "product deleted successfully"));
    }
}
}

elseif(array_key_exists('find',$postData)){
    if(array_key_exists('all',$postData['find'])){
    echo json_encode(array("value" => true, "info" => $bdconnect->query("SELECT * FROM ".$postData['find']['table'])->fetch_all()));
    }elseif(array_key_exists('owner',$postData['find'])){
        $result = $bdconnect->query("
        SELECT DISTINCT * 
        FROM buyandsell 
        WHERE productid IN (SELECT productid FROM sellchart WHERE id = ".$postData['find']['userid'].");"
)->fetch_all(MYSQLI_NUM);
echo json_encode(array("value" => true,"info" => $result));
    }
    else{
    $value =  $bdconnect->query("SELECT * FROM ".$postData['find']['table']." WHERE productid = ".$postData['find']['userid'])->fetch_assoc();
    echo json_encode(array("value" => true,"mesage" => "product found successfully","info" => $value));
    }
}
}
function sqlsel($table,$data){
    return "INSERT INTO ".$table." (prductvalue,prodimg,producttype,prodloc,proddic,prodname) VALUES ('".$data['price']."', '".$data['img']."', '".$data['type']."', '".$data['location']."', '".$data['dicx']."', '".$data['pname']."')";
    }

    function impment($table, $id, $pdid) {
        return "
        INSERT INTO ".$table." (id, productid) VALUES (
            (SELECT id FROM selleruser WHERE id = '".$id."'),
            (SELECT productid FROM buyandsell WHERE productid = ".$pdid.")
        );
        ";
    }
    