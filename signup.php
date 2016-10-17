<?php
    require '/core/lib/security/secure.php';
    require '/core/lib/security/database.php';

    session_start();
    $_SESSION["username"]=$_POST["username"];
    $_SESSION["firstname"]=$_POST["firstname"];
    $_SESSION["lastname"]=$_POST["lastname"];
    $_SESSION["email"]=$_POST["email"];
    if(valid("username")&&valid("password")&&valid("passwordc")&&valide("email")&&valid("firstname")&&valid("lastname")) {
        $username=prepare_input("username");
        $password=prepare_input("password");
        $passwordc=prepare_input("passwordc");
        $firstname=prepare_input("firstname");
        $lastname=prepare_input("lastname");
        $email=prepare_input("email");

        if($password!=$passwordc) {
            header("Location: ./?err=Password and Confirm Password must be the same!");
        }

        $sql="SELECT `username`, `email` FROM `users`";
        if($result=$server->query($sql)) {
            $available_u=true;
            $available_e=true;
            while($row=$result->fetch_assoc()) {
                if($row["username"]==$username) {
                    $available_u=false;
                }
                else if($row["email"]==$email) {
                    $available_e=false;
                }
            }
            if($available_u&&$available_e) {
                $key=openssl_random_pseudo_bytes($keySize, $strong);
                $iv=mcrypt_create_iv($ivSize, MCRYPT_DEV_URANDOM);
                $sql="INSERT INTO `users` (`email`, `firstname`, `lastname`, `username`, `password`, `enckey`, `enciv`) VALUES ('$email', '$firstname', '$lastname', '$username', '".md5($password)."', '$key', '$iv')";
                if($server->query($sql)) {
                    echo "<form action='login.php' method='post' id='login-form'><input type='hidden' name='username' value='$username'/><input type='hidden' name='password' value='$password'/></form>";
                    echo "<script>document.getElementById('login-form').submit()</script>";
                }
                else {
                    header("Location: ./?err=Couldn't connect to database!");
                }
            }
            else {
                if(!$available_u) {
                    header("Location: ./?err=Username is already being used!");
                }
                if(!$available_e) {
                    header("Location: ./?err=Email is already being used!");
                }
            }
        }
        else {
            header("Location: ./?err=Couldn't connect to database!");
        }
    }
    else {
        header("Location: ./?err=Some fields had invalid inputs! See help for info on what is allowed and what isn\'t.");
    }

    function valid($name) {
        if(isset($_POST[$name])) $post=$_POST[$name];
        else return false;
        if(empty($post)) return false;
        if(!preg_match("/^\w+$/", $post)) return false;
        
        return true;
    }
    function valide($name) {
        if(isset($_POST[$name])) $post=$_POST[$name];
        else return false;
        if(empty($post)) return false;
        if(!filter_var($post, FILTER_VALIDATE_EMAIL)) return false;

        return true;
    }
    function prepare_input($data) {
        $data = $_POST[$data];
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
?>