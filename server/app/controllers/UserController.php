<?php

namespace app\controllers;

use app\utils\Database;

class UserController
{
    public static function SignUp($data)
    {
        $database = Database::connect();
        $mb_alias = $data['username'];
        $mb_username = strtolower($mb_alias);
        $mb_password = $data['password'];
        $check = mysqli_query($database, "SELECT * FROM `users` WHERE `username` = '$mb_username'");
        $check = mysqli_fetch_assoc($check);
        if (!$check) {
            mysqli_query($database, "INSERT INTO `users`(`username`, `password`, `alias`) VALUES ('$mb_username', '$mb_password', '$mb_alias')");
            self::SignIn([
                'username' => $mb_username,
                'password' => $mb_password,
            ]);
        } else {
            echo json_encode([
                'status' => 400,
                'value' => 'This username already taken',
                'data' => null,
            ]);
        }
    }

    public static function SignIn($data)
    {
        $database = Database::connect();
        $mb_username = strtolower($data['username']);
        $mb_password = $data['password'];
        $check = mysqli_query($database, "SELECT * FROM `users` WHERE `username` = '$mb_username'");
        $check = mysqli_fetch_assoc($check);
        if ($check) {
            if ($mb_password == $check['password']) {
                $encrypt_password = openssl_encrypt(
                    $check['password'],
                    "AES-128-CTR",
                    $check['username'],
                    0,
                    '1234567891011121'
                );
                echo json_encode([
                    'status' => 200,
                    'value' => 'User sended',
                    'data' => [
                        'id' => $check['id'],
                        'username' => $check['username'],
                        'alias' => $check['alias'],
                        'avatar' => $check['avatar'],
                        'timestamp' => $check['timestamp'],
                        'password' => $encrypt_password,
                        'description' => $check['description'],
                        'follows' => $check['follows'],
                    ],
                ]);
            } else {
                echo json_encode([
                    'status' => 404,
                    'value' => 'This password is wrong',
                    'data' => null,
                ]);
            }
        } else {
            echo json_encode([
                'status' => 404,
                'value' => 'This user not found',
                'data' => null,
            ]);
        }
    }

    public static function UserAvatarEdit($data)
    {
        $check = self::UserGet([
            'username' => $data['username'],
            'password' => $data['password'],
        ]);
        if ($check) {
            $database = Database::connect();
            $username = $data['username'];
            $avatar = $data['avatar'];
            mysqli_query($database, "UPDATE `users` SET `avatar`='$avatar' WHERE `username` = '$username'");
            $check = mysqli_query($database, "SELECT * FROM `users` WHERE `username` = '$username'");
            $check = mysqli_fetch_assoc($check);
            $encrypt_password = openssl_encrypt(
                $check['password'],
                "AES-128-CTR",
                $check['username'],
                0,
                '1234567891011121'
            );
            echo json_encode([
                'status' => 200,
                'value' => 'Avatar edited',
                'data' => [
                    'id' => $check['id'],
                    'username' => $check['username'],
                    'alias' => $check['alias'],
                    'avatar' => $check['avatar'],
                    'timestamp' => $check['timestamp'],
                    'password' => $encrypt_password,
                    'description' => $check['description'],
                    'follows' => $check['follows'],
                ],
            ]);
        }
    }

    public static function UserDescriptionEdit($data)
    {
        $check = self::UserGet([
            'username' => $data['username'],
            'password' => $data['password'],
        ]);
        if ($check) {
            $database = Database::connect();
            $username = $data['username'];
            $description = $data['description'];
            mysqli_query($database, "UPDATE `users` SET `description`='$description' WHERE `username` = '$username'");
            $check = mysqli_query($database, "SELECT * FROM `users` WHERE `username` = '$username'");
            $check = mysqli_fetch_assoc($check);
            $encrypt_password = openssl_encrypt(
                $check['password'],
                "AES-128-CTR",
                $check['username'],
                0,
                '1234567891011121'
            );
            echo json_encode([
                'status' => 200,
                'value' => 'Description edited',
                'data' => [
                    'id' => $check['id'],
                    'username' => $check['username'],
                    'alias' => $check['alias'],
                    'avatar' => $check['avatar'],
                    'timestamp' => $check['timestamp'],
                    'password' => $encrypt_password,
                    'description' => $check['description'],
                    'follows' => $check['follows'],
                ],
            ]);
        }
    }

    public static function UserSearch($data)
    {
        $database = Database::connect();
        $username = strtolower($data['username']);
        $check = mysqli_query($database, "SELECT * FROM `users` WHERE `username` = '$username'");
        $check = mysqli_fetch_assoc($check);
        if ($check) {
            echo json_encode([
                'status' => 200,
                'value' => 'User sended',
                'data' => $check,
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'value' => 'User not found',
                'data' => null,
            ]);
        }
    }

    public static function UserFollow($data)
    {
        $check = self::UserGet([
            'username' => $data['username'],
            'password' => $data['password'],
        ]);
        if ($check) {
            $database = Database::connect();
            $user_following = $data['user_following'];
            $username = $data['username'];
            $check = mysqli_fetch_assoc(mysqli_query($database, "SELECT * FROM `users` WHERE `username` = '$username'"));
            $follows_array = $check['follows'];
            if ($follows_array == null) {
                $follows_array = $user_following;
            } else {
                $follows_array = $follows_array . ", " . $user_following;
            }
            mysqli_query($database, "UPDATE `users` SET `follows`='$follows_array' WHERE `username` = '$username'");
            echo json_encode([
                'status' => 200,
                'value' => 'Follow done',
                'data' => $follows_array,
            ]);
        }
    }

    public static function UserUnfollow($data)
    {
        $database = Database::connect();
        $mb_username = strtolower($data['username']);
        $check = mysqli_query($database, "SELECT * FROM `users` WHERE `username` = '$mb_username'");
        $check = mysqli_fetch_assoc($check);
        if ($check) {
            $user_unfollowing = $data['user_unfollowing'];
            $follows = $check['follows'];
            $follows = explode(', ', $follows);
            foreach ($follows as $key => $value) {
                if ($value == $user_unfollowing) {
                    unset($follows[$key]);
                }
            }
            $follows = implode(", ", $follows);
            mysqli_query($database, "UPDATE `users` SET `follows`='$follows' WHERE `username` = '$mb_username'");
            echo json_encode([
                'status' => 200,
                'value' => 'User unfollowed',
                'data' => null,
            ]);
        }
    }

    public static function UserUpdate($data)
    {
        $database = Database::connect();
        $mb_username = strtolower($data['username']);
        $check = mysqli_query($database, "SELECT * FROM `users` WHERE `username` = '$mb_username'");
        $check = mysqli_fetch_assoc($check);
        if ($check) {
            $mb_password = $data['password'];
            $decrypt_password = openssl_decrypt(
                $mb_password,
                "AES-128-CTR",
                $mb_username,
                0,
                '1234567891011121'
            );
            if ($check['password'] == $decrypt_password) {
                $encrypt_password = openssl_encrypt(
                    $check['password'],
                    "AES-128-CTR",
                    $check['username'],
                    0,
                    '1234567891011121'
                );
                echo json_encode([
                    'status' => 200,
                    'value' => 'User sended',
                    'data' => [
                        'id' => $check['id'],
                        'username' => $check['username'],
                        'alias' => $check['alias'],
                        'avatar' => $check['avatar'],
                        'timestamp' => $check['timestamp'],
                        'password' => $encrypt_password,
                        'description' => $check['description'],
                        'follows' => $check['follows'],
                    ],
                ]);
            }
        }
    }

    public static function UserGet($data)
    {
        $database = Database::connect();
        $mb_username = strtolower($data['username']);
        $check = mysqli_query($database, "SELECT * FROM `users` WHERE `username` = '$mb_username'");
        $check = mysqli_fetch_assoc($check);
        if ($check) {
            $mb_password = $data['password'];
            $decrypt_password = openssl_decrypt(
                $mb_password,
                "AES-128-CTR",
                $mb_username,
                0,
                '1234567891011121'
            );
            if ($check['password'] == $decrypt_password) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
