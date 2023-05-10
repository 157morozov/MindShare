<?php

namespace app\controllers;

use app\utils\Database;
use app\controllers\UserController;

class PostController
{
    public static function PostLike($data)
    {
        $database = Database::connect();
        $post_id = $data['post_id'];
        mysqli_query($database, "UPDATE `posts` SET `likes`=likes+1 WHERE `id`='$post_id'");
        echo json_encode([
            'status' => 200,
            'value' => 'Post liked',
            'data' => null,
        ]);
    }

    public static function PostsShow($data)
    {
        $database = Database::connect();
        $username = strtolower($data['username']);
        $check = mysqli_query($database, "SELECT * FROM `users` WHERE `username`='$username'");
        $check = mysqli_fetch_assoc($check);
        $follows = $check['follows'];
        $posts = [];
        if (!($follows == null)) {
            $follows = explode(', ', $follows);
            foreach ($follows as $user) {
                $data = mysqli_query($database, "SELECT * FROM `posts` WHERE `author_username`='$user'");
                $data = mysqli_fetch_all($data);
                $posts = array_merge($posts, $data);
            }
        }
        echo json_encode([
            'status' => 200,
            'value' => 'Posts get',
            'data' => $posts,
        ]);
    }

    public static function PostShow($data)
    {
        $database = Database::connect();
        $author_username = strtolower($data['username']);
        $post = mysqli_query($database, "SELECT * FROM `posts` WHERE `author_username`='$author_username'");
        $post = mysqli_fetch_all($post);
        echo json_encode([
            'status' => 200,
            'value' => 'Posts get',
            'data' => $post,
        ]);
    }

    public static function PostPublish($data)
    {
        $check = UserController::UserGet([
            'username' => $data['username'],
            'password' => $data['password'],
        ]);
        if ($check) {
            $database = Database::connect();
            $author_username = $data['username'];
            $author_avatar = $data['avatar'];
            $title = $data['post_title'];
            $image = $data['post_image'] ?? null;
            mysqli_query($database, "INSERT INTO `posts`(`author_username`, `author_avatar`, `title`, `image`) VALUES ('$author_username', '$author_avatar','$title', '$image')");
            echo json_encode([
                'status' => 200,
                'value' => 'Post published',
                'data' => null,
            ]);
        } else {
            echo json_encode([
                'status' => 401,
                'value' => 'User not authorized',
                'data' => null,
            ]);
        }
    }

    public static function PostDelete($data)
    {
        if (isset($_SESSION['user']['username'])) {
            $database = Database::connect();
            $post_id = $data['id'];
            $post = mysqli_query($database, "SELECT * FROM `posts` WHERE `id`='$post_id'");
            $post = mysqli_fetch_assoc($post);
            if ($post) {
                if ($post['author_id'] == $_SESSION['user']['id']) {
                    mysqli_query($database, "DELETE FROM `posts` WHERE `id`='$post_id'");
                    header("Access-Control-Allow-Origin: *");
                    header("Access-Control-Allow-Credentials: true");
                    header("Access-Control-Max-Age: 1000");
                    header("Access-Control-Allow-Headers: *");
                    header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");
                    echo json_encode([
                        'status' => 200,
                        'value' => 'Post deleted',
                        'data' => null,
                    ]);
                } else {
                    header("Access-Control-Allow-Origin: *");
                    header("Access-Control-Allow-Credentials: true");
                    header("Access-Control-Max-Age: 1000");
                    header("Access-Control-Allow-Headers: *");
                    header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");
                    echo json_encode([
                        'status' => 403,
                        'value' => 'Only the owner of a post can delete it',
                        'data' => null,
                    ]);
                }
            } else {
                header("Access-Control-Allow-Origin: *");
                header("Access-Control-Allow-Credentials: true");
                header("Access-Control-Max-Age: 1000");
                header("Access-Control-Allow-Headers: *");
                header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");
                echo json_encode([
                    'status' => 404,
                    'value' => 'Post not found',
                    'data' => null,
                ]);
            }
        } else {
            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Credentials: true");
            header("Access-Control-Max-Age: 1000");
            header("Access-Control-Allow-Headers: *");
            header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");
            echo json_encode([
                'status' => 401,
                'value' => 'User not authorized',
                'data' => null,
            ]);
        }
    }
}
