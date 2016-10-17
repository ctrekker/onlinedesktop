<?php
    session_start();
    if(isset($_SESSION["ip"])) {
        if($_SESSION["ip"]!=$_SERVER["REMOTE_ADDR"]) {
            session_unset();
            session_destroy();
            header("Location: ../");
        }
    }
    else {
        header("Location: ../");
    }
?>
<!DOCTYPE html>
<html>
    <head>
        <title>OnlineDesktop - <?php echo $_SESSION["username"] ?></title>
        <meta http-equiv='cache-control' content='no-cache'>
        <meta http-equiv='expires' content='0'>
        <meta http-equiv='pragma' content='no-cache'>
        <style>
            body {
                margin: 0px;
                overflow: hidden;
            }
        </style>
        <script src="../core/lib/js/jquery.min.js"></script>
        <script type="text/javascript" src="../core/lib/js/OS.js"></script>
    </head>
    <body>
        <canvas id="desktop"></canvas>
    </body>
</html>