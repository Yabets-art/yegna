<?php
require "./connect.php";

$storage = "upload/";

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $jsonData = file_get_contents('php://input');
    $postData = json_decode($jsonData, true);
    $bdconnect = connect(); 
    try{
    if(array_key_exists('buy',$postData)){
        if(array_key_exists('part',$postData['buy'])){
            echo json_encode(array(
                "value" => true, 
                "info" => $bdconnect->query("SELECT * FROM buyandsell WHERE producttype = '".$postData['buy']['part']."'")->fetch_all(MYSQLI_NUM)
            ));
            }
        else if(array_key_exists('byname',$postData['buy'])){
            echo json_encode(array("value" => true, "info" => $bdconnect->query("SELECT * FROM buyandsell WHERE prodname = '".$postData['buy']['byname']."'")->fetch_all(MYSQLI_NUM)));
        }
    }
    else if(array_key_exists("addtochart",$postData)){
        $bdconnect->query("INSERT INTO chartbuy (id, productid) VALUES ('".$postData['addtochart']['userid']."', '".$postData['addtochart']['productid']."')");
        echo json_encode(array("value" => true, "mesage" => "product added in chart successfully"));
    }elseif(array_key_exists("cadd",$postData)){
        $result = $bdconnect->query("
        SELECT DISTINCT * 
        FROM buyandsell 
        WHERE productid IN (SELECT productid FROM chartbuy WHERE id = ".$postData['cadd']['userid'].");"
)->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array("value" => true,"info" => $result));
    }
    elseif(array_key_exists("pay",$postData)){
        if( $bdconnect->query("
    INSERT INTO bought (userid, boughtprod, resitimg, code)
    VALUES (" . $postData['pay']['userid'] . ", '" . $postData['pay']['proid'] . "', '" . $postData['pay']['img'] . "', '" . $postData['pay']['code'] . "')
")){
        echo json_encode(array("value" => true,"mesage" => " product bought successfully"));
    }else{
        echo json_encode(array("value" => false,"mesage" => " something went wrong!"));
    }
}
}catch(Exception $e){
    echo json_encode(array("alert" => $e->getMessage()));

}finally{
    $bdconnect->close();
}
}


