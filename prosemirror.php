<?php
set_time_limit(0);
error_reporting(E_ERROR);
if (isset($_GET['debug'])) {
  ini_set('display_errors', true);
} else {
  ini_set('display_errors', false);
}

require('lib/prosemirror/autoload.php');

// $content = file_get_contents('docs/data/1.txt');
// $content = json_decode($content, true);
//
// $renderer = new ProseMirrorToHtml\Renderer();
//
// echo $renderer->render($content['doc_json']);
//
// exit();

$content = '';

$renderer = new HtmlToProseMirror\Renderer();

$content = $renderer->render($content);
$content = json_encode($content);
echo $content;
