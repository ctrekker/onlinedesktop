<?php
    session_start();
    if(isset($_SESSION["ip"])) {
        if($_SESSION["ip"]!=$_SERVER["REMOTE_ADDR"]) {
            session_unset();
            session_destroy();
        }
        else {
            header("Location: /user");
        }
    }

    function getVal($name) {
        if(isset($_SESSION[$name])) echo $_SESSION[$name];
        else echo "";
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Login to OnlineDesktop</title>
    </head>
    <body>
        <div id="login" class="form-container">
            <form action="login.php" method="post">
                <label>Username: </label>
                <input type="text" name="username"/><br>
                <label>Password: </label>
                <input type="password" name="password"/><br>
                <input type="submit" value="Login"/>
            </form>
        </div>
        <div id="signup" class="form-container hidden">
            <form action="signup.php" method="post">
                <label>First Name: </label>
                <input type="text" name="firstname" value="<?php getVal('firstname'); ?>"/><br>
                <label>Last Name: </label>
                <input type="text" name="lastname" value="<?php getVal('lastname'); ?>"/><br>
                <label>Username: </label>
                <input type="text" name="username" value="<?php getVal('username'); ?>"/><br>
                <label>Password: </label>
                <input type="password" name="password"/><br>
                <label>Confirm Password: </label>
                <input type="password" name="passwordc"/><br>
                <label>Email: </label>
                <input type="text" name="email" value="<?php getVal('email'); ?>"/><br>
                <input type="submit" value="Create Account"/>
            </form>
        </div>

        <label class="err-msg"><?php
            if(isset($_GET["err"])) {
                echo htmlspecialchars($_GET["err"]);
            }
        ?></label>
    </body>
</html>