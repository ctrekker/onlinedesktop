<?php   
    $server = new mysqli("localhost", "root", "", "onlinedesktop");
    if($server->connect_error) {
        die("Connection failed: ".$server->connect_error);
    }
?>