<?php
    require $_SERVER["DOCUMENT_ROOT"].'/core/lib/security/secure.php';
    require $_SERVER["DOCUMENT_ROOT"].'/core/lib/security/database.php';

    session_start();

    $action="GET";
    require $_SERVER["DOCUMENT_ROOT"].'/core/lib/security/storagelog.php';

    //See what content-type to use
    if(isset($_GET["content_type"])) {
        header("Content-Type: ".$_GET["content_type"]);
    }
    //Make sure all required variables exist
    if(isset($_SESSION["username"])&&isset($_SESSION["password"])&&isset($_SESSION["id"])&&isset($_SESSION["ip"])&&isset($_GET["path"])) {
        //Make sure ip is same as original log in ip (to prevent spoofing)
        if($_SESSION["ip"]==$_SERVER["REMOTE_ADDR"]) {
            $id=$_SESSION["id"];
            $path=$_GET["path"];
            //EXTREME IMPORTANTS!!!
            //d
            if(strpos(realpath("./storage/$id".$path), realpath("./storage/$id"))!==false) {
                $contents=file_get_contents("./storage/$id".$path);
                echo decrypt($contents, $_SESSION["enckey"], $_SESSION["enciv"]);
            }
            else {
                // echo "INVALID REQUEST!";
                // $uid=$_SESSION["id"];
                // $sql="INSERT INTO `storage_warnings` (`user`, `path`, `realpath`, `attempt`) VALUES ($uid, '$path', '".gettype(realpath($path))."', 'GET')";
                // $server->query($sql);
                echo ""; //?
            }
        }
    }
?>