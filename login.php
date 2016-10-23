<?php
    require '/core/lib/security/database.php';

    $has_error=false;
    print gettype($_SERVER["REMOTE_ADDR"]);
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
                    log_success();
                    header("Location: ./user/");
                }
                else {
                    log_failure();
                    header("Location: ./?err=Incorrect username or password!");
                }
            }
            else {
                error(1003);
            }
        }
        else {
            error(1002);
        }
    }
    else {
        error(1001);
    }
    
    function log_success() {
        $sql="INSERT INTO `login_attempts` (`ip`, `username`, `attempt_result`) VALUES ('".$_SERVER["REMOTE_ADDR"]."', '".$_POST["username"]."', 'success')";
        $GLOBALS["server"]->query($sql);
    }
    function log_failure() {
        $sql="INSERT INTO `login_attempts` (`ip`, `username`, `attempt_result`) VALUES ('".$_SERVER["REMOTE_ADDR"]."', '".$_POST["username"]."', 'failure')";
        $GLOBALS["server"]->query($sql);
    }
    function log_error($error) {
        $sql="INSERT INTO `login_attempts` (`ip`, `username`, `attempt_result`, `attempt_error`) VALUES ('".$_SERVER["REMOTE_ADDR"]."', '".$_POST["username"]."', 'error', $error)";
        $GLOBALS["server"]->query($sql);
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
            log_error($str["errno"]);
            echo json_encode($str);
        }
        else {
            error(1000);
        }
    }
?>