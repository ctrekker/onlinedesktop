<?php
    session_start();
    
    if(isset($_SESSION["id"])&&isset($_POST["appname"])&&isset($_POST["key"])&&isset($_POST["action"])) {
        $path0="/APPSTORAGE/".$_POST["appname"]."/";
        $filep=$path0.$_POST["key"].".osv";
        if($_POST["action"]=="SET"&&isset($_POST["value"])) {
            $fullpath=$_SERVER["DOCUMENT_ROOT"]."/user/storage/".$_SESSION["id"]."/".$path0;
            if(!file_exists($fullpath)) mkdir($fullpath, 0777, true);
            
            $_POST["path"]=$filep;
            $_REQUEST["path"]=$filep;
            $_POST["content"]=$_POST["value"];
            include '../set.php';
        }
        else if($_POST["action"]=="GET") {
            header("Location: ../get.php?path=".$filep);
        }
    }
?>