<?php
set_time_limit(0);
error_reporting(E_ERROR);
if (isset($_GET['debug'])) {
  ini_set('display_errors', true);
} else {
  ini_set('display_errors', false);
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
// $data = $_REQUEST;
// $method = 'get';
// if (isset($POST)) {
//   $method = 'post';
// }
//
// file_put_contents('data.txt', $data);
//
// $fp = fopen('data.txt', 'a');//opens file in append mode
//
// fwrite($fp, 'method:'.$method);
// fwrite($fp, 'url:'.$_SERVER['REQUEST_URI']);
// fwrite($fp, 'data:'.json_encode($data));
// fwrite($fp, '
// ');
// fclose($fp);
//
// $fp = fopen('content.txt', 'r');
// header('Content-Type: application/json');
// $content = stream_get_contents($fp);
//
// echo $content;

// $fp = fopen('data.txt', 'a');//opens file in append mode
//
// fwrite($fp, 'date:'.date('H:i:s'));
// fwrite($fp, 'method:'.$_SERVER['REQUEST_METHOD']);
// fwrite($fp, 'url:'.$_SERVER['REQUEST_URI']);
// fwrite($fp, 'data:'.json_encode($_POST));
// fwrite($fp, '
// ');
// fclose($fp);

$url = $_SERVER['REQUEST_URI'];
$url = str_replace('/prosemirror_server/server_5/docs/', '', $url);

$url_parts = explode('/', $url);

//root return doc
if ($url_parts[1] == '') {
  $doc_id = $url_parts[0];
  if ($doc_id) {
    $path   = 'data/' . $doc_id . '.txt';
    if (file_exists($path)) {
      $data = file_get_contents($path);
    } else {
      $data = array();
    }
    // $response = array('doc_json' => array('type'    => 'doc',
    //                                       'attrs'   => array('layout' => NULL,
    //                                                          'padding' => NULL,
    //                                                          'width' => NULL),
    //                                       'content' => json_decode($data, true),
    //                                     ),
    //                   'users' => 1,
    //                   'version' => 55);
    $response = json_decode($data, true);
    echo json_encode($response);
  }
  exit();
}

if ($url_parts[1] == 'schema') {
  die('in');
} else {
  $doc_id = $url_parts[0];
  if ($doc_id) {
    $path = 'data/' . $doc_id . '.history.txt';
  }

  if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $json = file_get_contents('php://input');
    $fp = fopen($path, 'a');
    fwrite($fp, $json);
    fwrite($fp, "\n");
    fclose($fp);
  } else {
    $query_parts = explode('?', $url_parts[1]);
    $queries = explode('&', $query_parts[1]);
    $result_queries = array();
    foreach ($queries as $query) {
      $query_data = explode('=', $query);
      $result_queries[$query_data[0]] = $query_data[1];
    }

    while (true) {
      $data = file_get_contents($path);
      $data = explode("\n", $data);
      foreach ($data as $row) {
        $json_row = json_decode($row, true);
        if ($json_row['version'] == $result_queries['version']) {
          $json_row['clientIDs'] = array($json_row['clientID']);
          $response = json_encode($json_row);
          echo $response;
          exit();
        }
      }
    }

    // $response = array('version'   => 69,
    //                   'steps'     => json_decode($data, true),
    //                   'clientIDs' => array('5b41e500-fc80-11ea-a57c-8bc70236411d'),
    //                   'users'     => 1);
    // $response = json_decode($response, true);

  }
}














//eof
