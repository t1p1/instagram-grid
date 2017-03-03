<?php

require "vendor/autoload.php";

use Abraham\TwitterOAuth\TwitterOAuth;
 
$q = $_GET["search"] ?: 't1sxsw';
$count = $_GET["count"] ?: '8';
$consumerkey = "O62GIHT19qp2GtXQgaovGBAez";
$consumersecret = "6lCSxEzjzdShdAWUSpvb7QEKMlAlvQc8CUpwCc5vTiK03R3f4T";
$accesstoken = "837419755984166912-GtyWNhaRwYM2Gq4uIH73l8xnmxQHLU8";
$accesstokensecret = "O2OKjUCuiI5vTzYYRzxVn7WbxYt447nq1GPkdgGkwcVTG";
 
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
 
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$statuses = $connection->get("search/tweets", ["q" => $q, "count" => $count]);
 
echo json_encode($statuses);
?>