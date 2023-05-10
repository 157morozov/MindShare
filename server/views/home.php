<?php
var_dump($_SESSION ?? null);
?>

<form action="signup" method="post">
    <input name="username">
    <input name="password">
    <button type="submit">SignUp</button>
</form>

<form action="signin" method="post">
    <input name="username">
    <input name="password">
    <button type="submit">SignIn</button>
</form>

<form action="userget" method="post">
    <button type="submit">UserGet</button>
</form>

<form action="userdestroy" method="post">
    <button type="submit">UserDestroy</button>
</form>

<form action="postpublish" method="post">
    <input name="title">
    <textarea name="description"></textarea>
    <button type="submit">Publish</button>
</form>

<form action="postdelete" method="post">
    <input name="id">
    <button type="submit">Delete</button>
</form>

<form action="postsshow" method="post">
    <button type="submit">Posts Show</button>
</form>

<form action="postshow" method="post">
    <input name="id">
    <button type="submit">Post Show</button>
</form>