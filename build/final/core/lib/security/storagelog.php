<?php
    $sql="INSERT INTO `storage_attempts` (`ip`, `userid`, `username`, `action`, `path`) VALUES ('".$_SESSION["ip"]."', ".$_SESSION["id"].", '".$_SESSION["username"]."', '".$action."', '".$_REQUEST["path"]."')";
    $server->query($sql);
?>