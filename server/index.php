<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 1000");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");

session_start();

require_once "app/utils/Database.php";
require_once "app/controllers/UserController.php";
require_once "app/controllers/PostController.php";
require_once "app/utils/Route.php";
require_once "routing.php";
