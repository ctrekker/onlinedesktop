<?php
    require '/core/lib/security/database.php';
    
    if(isset($_POST["username"])&&isset($_POST["password"])) {
        if(!empty($_POST["username"])&&!empty($_POST["password"])) {
            $encpassword=md5($_POST["password"]);
            $sql="SELECT * FROM `users` WHERE `username`='$_POST[username]' AND `password`='$encpassword'";
            if($result=$server->query($sql)) {
                if($result->num_rows>0) {
                    ini_set('session.use_only_cookies', 1);
                    $cookieParams = session_get_cookie_params();
                    session_set_cookie_params($cookieParams["lifetime"],
                        $cookieParams["path"], 
                        $cookieParams["domain"], 
                        $secure,
                        $httponly);
                    session_start();
                    session_unset();
                    session_regenerate_id(true);
                    $row=$result->fetch_assoc();
                    $_SESSION["ip"]=$_SERVER["REMOTE_ADDR"];
                    $_SESSION["id"]=$row["id"];
                    $_SESSION["username"]=$_POST["username"];
                    $_SESSION["password"]=$encpassword;
                    $_SESSION["enciv"]=$row["enciv"];
                    $_SESSION["enckey"]=$row["enckey"];
                    header("Location: ./user/");
                }
                else {
                    header("Location: ./?err=Incorrect username or password!");
                }
            }
            else {
                echo $server->error;
            }
        }
        else {
            error(1002);
        }
    }
    else {
        error(1001);
    }
    
    //UTILITIES
    function error($num) {
        $errorf=fopen("errors.txt", "r");
        $errorv=fread($errorf, filesize("errors.txt"));
        $error_line=explode("\n", $errorv);
        $error_data=false;
        foreach($error_line as $error) {
            if((int)explode(":", $error)[0]==$num) {
                $error_data=explode(":", $error);
            }
        }
        if(!!$error_data) {
            $str=array(
                "error"=>$error_data[1],
                "errno"=>$error_data[0],
                "message"=>$error_data[2]
            );
            echo json_encode($str);
        }
        else {
            error(1000);
        }
    }
?>