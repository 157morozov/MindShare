<?php

namespace app\utils;

class Route
{
    private static $queriesList = [];

    public static function get($uri, $page)
    {
        self::$queriesList[] = [
            'uri' => $uri,
            'page' => $page,
        ];
    }

    public static function post($uri, $controller, $method, $data = false, $file = false)
    {
        self::$queriesList[] = [
            'uri' => $uri,
            'class' => $controller,
            'method' => $method,
            'data' => $data,
            'file' => $file,
        ];
    }

    public static function init()
    {
        $current_query = $_GET['q'] ?? '';
        foreach (self::$queriesList as $query) {
            if ('/' . $current_query == $query['uri']) {
                switch ($_SERVER['REQUEST_METHOD']) {
                    case 'GET':
                        require_once('views/' . $query['page'] . '.php');
                        die();
                    case 'POST':
                        if ($_POST) {
                            $post = $_POST;
                        } else {
                            $post = json_decode(file_get_contents('php://input'), true);
                        }
                        switch ($query['method']) {
                            case 'SignUp':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                            case 'SignIn':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                            case 'UserGet':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method();
                                die();
                            case 'UserDestroy':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method();
                                die();
                            case 'UserDescriptionEdit':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                            case 'PostPublish':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                            case 'PostDelete':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                            case 'PostsShow':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                            case 'PostShow':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                            case 'UserAvatarEdit':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                            case 'UserSearch':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                            case 'UserFollow':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                            case 'UserUpdate':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                            case 'UserUnfollow':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                            case 'PostLike':
                                $action = new $query['class'];
                                $method = $query['method'];
                                $action->$method($post);
                                die();
                        }
                        die();
                }
            }
        }
    }
}
