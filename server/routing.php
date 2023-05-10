<?php

use app\utils\Route;
use app\controllers\UserController;
use app\controllers\PostController;

Route::get('/', 'home');

Route::post('/signup', UserController::class, 'SignUp', true);
Route::post('/signin', UserController::class, 'SignIn', true);
Route::post('/userget', UserController::class, 'UserGet', true);
Route::post('/userdescriptionedit', UserController::class, 'UserDescriptionEdit');
Route::post('/useravataredit', UserController::class, 'UserAvatarEdit');
Route::post('/usersearch', UserController::class, 'UserSearch');
Route::post('/userfollow', UserController::class, 'UserFollow');
Route::post('/userupdate', UserController::class, 'UserUpdate');
Route::post('/userunfollow', UserController::class, 'UserUnfollow');

Route::post('/postsshow', PostController::class, 'PostsShow', true);
Route::post('/postshow', PostController::class, 'PostShow', true);
Route::post('/postpublish', PostController::class, 'PostPublish', true);
Route::post('/postdelete', PostController::class, 'PostDelete', true);
Route::post('/postlike', PostController::class, 'PostLike', true);

Route::init();