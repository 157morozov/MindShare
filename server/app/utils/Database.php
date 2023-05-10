<?php

namespace app\utils;

class Database
{
    private static $hostname = '127.0.0.1:3307';
    private static $username = 'root';
    private static $password = '';
    private static $database = 'QuickPics';

    public static function connect()
    {
        $database_connection = mysqli_connect(self::$hostname, self::$username, self::$password, self::$database);
        if ($database_connection) {
            return $database_connection;
        } else {
            die('Database connection failed');
        }
    }
}