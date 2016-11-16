<?php
    require $_SERVER['DOCUMENT_ROOT'].'/core/lib/security/secure.php';
    require $_SERVER['DOCUMENT_ROOT'].'/core/lib/security/database.php';

    if (!isset($_SESSION)) session_start();

    $action="SET";
    require $_SERVER['DOCUMENT_ROOT'].'/core/lib/security/storagelog.php';

    //Make sure all required variables exist
    if(isset($_SESSION["username"])&&isset($_SESSION["password"])&&isset($_SESSION["id"])&&isset($_SESSION["ip"])&&isset($_POST["path"])&&isset($_POST["content"])) {
        //Make sure ip is same as original log in ip (to prevent spoofing)
        if($_SESSION["ip"]==$_SERVER["REMOTE_ADDR"]) {
            $id=$_SESSION["id"];
            
            $sql="SELECT `enckey`, `enciv` FROM `users` WHERE `id` = ".$_SESSION["id"];
            if($result=$server->query($sql)) {
                $encdata=$result->fetch_assoc();
                $binKey=$encdata["enckey"];
                $iv=$encdata["enciv"];

                if($_POST["path"]{0}!="/") $_POST["path"]="/".$_POST["path"];
                $encrypted=encrypt($_POST["content"], $binKey, $iv);
                $array=explode("/", $_POST["path"]);
                array_pop($array);

                if(strpos(implode("", $array), ".")===false) {
                    $lit_path=implode("/", $array);
                    $path="./storage/$id".$lit_path;
                    if(!file_exists($path)) {
                        mkdir($path, 0777, true);
                    }
                    file_put_contents("./storage/$id".$_POST["path"], $encrypted);
                }
                else {
                    echo "INVALID REQUEST!";
                    $uid=$_SESSION["id"];
                    $sql="INSERT INTO `storage_warnings` (`user`, `path`, `realpath`, `attempt`, `content`) VALUES ($uid, '".$_POST["path"]."', '".gettype(realpath($_POST["path"]))."', 'SET', '".$_POST["content"]."')";
                    $server->query($sql);
                }
            }
            else {
                echo $server->error;
            }
        }
    }
?>