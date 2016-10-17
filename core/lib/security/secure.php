<?php
    $ivSize = mcrypt_get_iv_size(MCRYPT_BLOWFISH, MCRYPT_MODE_CBC);
    $keySize = mcrypt_get_key_size(MCRYPT_BLOWFISH, MCRYPT_MODE_CBC)/2;
    function encrypt($data, $key, $iv) {
        $ciphertext = mcrypt_encrypt(MCRYPT_BLOWFISH, $key, $data, MCRYPT_MODE_CFB, $iv);
        return $ciphertext;
    }
    function decrypt($encrypted, $key, $iv) {
        $plaintext = mcrypt_decrypt(MCRYPT_BLOWFISH, $key, $encrypted, MCRYPT_MODE_CFB, $iv);
        return $plaintext;
    }
?>