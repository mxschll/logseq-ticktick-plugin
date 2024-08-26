<?php

$TICKTICK_AUTH_URL = "https://ticktick.com/oauth/token";

$corsHeaders = [
    'Access-Control-Allow-Origin' => '*',
    'Access-Control-Allow-Headers' => 'authorization, x-client-info, apikey, content-type',
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header("Location: https://github.com/mxschll/logseq-ticktick-plugin");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    foreach ($corsHeaders as $name => $value) {
        header("$name: $value");
    }
    echo 'ok';
    exit();
}

$ip = $_SERVER['REMOTE_ADDR'];
$now = time();
$limitFile = 'ratelimit_' . md5($ip) . '.txt';

// Clean up old files
cleanupOldFiles();

if (file_exists($limitFile)) {
    $lastAccessTime = (int)file_get_contents($limitFile);
    $cooldownTime = 60; // 60 seconds cooldown time

    if ($now - $lastAccessTime < $cooldownTime) {
        http_response_code(429);
        foreach (array_merge(["Content-Type" => "application/json"], $corsHeaders) as $name => $value) {
            header("$name: $value");
        }
        echo json_encode(['error' => 'rate_limit_exceeded', 'error_description' => 'Rate limit exceeded']);
        exit();
    }
}

file_put_contents($limitFile, $now);

$data = json_decode(file_get_contents('php://input'), true);
$client_id = $data['client_id'] ?? null;
$client_secret = $data['client_secret'] ?? null;
$code = $data['code'] ?? null;
$redirect_uri = $data['redirect_uri'] ?? null;

if (!$client_id || !$client_secret || !$code || !$redirect_uri) {
    http_response_code(400);
    foreach (array_merge(["Content-Type" => "application/json"], $corsHeaders) as $name => $value) {
        header("$name: $value");
    }
    echo json_encode(['error' => 'missing_parameter', 'error_description' => 'Missing parameter: client_id, client_secret, code, redirect_uri']);
    exit();
}

$ch = curl_init($TICKTICK_AUTH_URL);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'client_id' => $client_id,
    'client_secret' => $client_secret,
    'code' => $code,
    'redirect_uri' => $redirect_uri,
    'grant_type' => 'authorization_code',
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($status !== 200) {
    http_response_code(400);
    foreach (array_merge(["Content-Type" => "application/json"], $corsHeaders) as $name => $value) {
        header("$name: $value");
    }
    echo json_encode(['error' => 'unauthorized', 'error_description' => 'Unauthorized']);
    exit();
}

http_response_code(200);
foreach (array_merge(["Content-Type" => "application/json"], $corsHeaders) as $name => $value) {
    header("$name: $value");
}
echo json_encode(json_decode($response, true));

function cleanupOldFiles() {
    $expirationTime = 3600; // 1 hour
    $now = time();

    foreach (glob("ratelimit_*.txt") as $file) {
        if (is_file($file)) {
            if ($now - filemtime($file) >= $expirationTime) {
                unlink($file);
            }
        }
    }
}
