<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class prosemirror_server implements MessageComponentInterface {
  protected $clients;

  public function __construct() {
    $this->clients = new \SplObjectStorage;
    $this->compile = false;
    $this->default = array('doc_json' => array('type'    => 'doc',
                                      'attrs'   => array('layout' => NULL,
                                                         'padding' => NULL,
                                                         'width' => NULL),
                                      'content' => array(
                                                      array('type' => 'paragraph',
                                                            'attrs' => array('align' => NULL,
                                                                             'color' => NULL,
                                                                             'id' => NULL,
                                                                            'indent' => NULL,
                                                                            'lineSpacing' => NULL,
                                                                            'paddingBottom' => NULL,
                                                                            'paddingTop' => NULL,
                                                                            'objectId' => NULL),
                                                            'content' => array(
                                                                              array('type' => 'text',
                                                                                    'text' => ' '),
                                                                              ),
                                                         ),
                                                       ),
                                      ),
                            'users' => 1,
                            'version' => 0);
    $this->server_os = 'macos'; //or linux;
  }

  public function onCall(ConnectionInterface $conn, $id, $topic, array $params) {

  }

  public function onOpen(ConnectionInterface $conn) {
    $query = $conn->httpRequest->getUri()->getQuery();
    parse_str($query, $data);

    if ($data['doc_id']) {
      $doc_id = $data['doc_id'];
      $doc_path = sprintf('data/%d.txt', $doc_id);
      $step_path = sprintf('data/%d.history.txt', $doc_id);
      if (file_exists($doc_path) || file_exists($step_path)) {
        if (!file_exists($doc_path)) {
          file_put_contents($doc_path, json_encode($this->default));
        }
        $data = file_get_contents($doc_path);

        if ($this->compile) {
          $out_path = sprintf('data/%d.out.txt', $doc_id);
          if ($this->server_os == 'macos') {
            $server_path = 'prosemirror_server-macos';
          } else {
            $server_path = 'prosemirror_server-linux';
          }
          exec(sprintf('./%s doc=%s step=%s out=%s', $server_path, $doc_path, $step_path, $out_path));

          if (file_exists($out_path)) {
            $data = file_get_contents($out_path);
            $response = json_decode($data, true);

            $response = array('type' => 'init',
                              'data' => $response);
            $conn->send(json_encode($response));
          }
        } else {
          $doc_json = file_get_contents($doc_path);
          $doc_json = json_decode($doc_json, true);
          $data = array('doc_json' => $doc_json['doc_json'],
                        'users' => 1,
                        'version' => 0);

          $response = array('type' => 'init',
                            'data' => $data);
          $conn->send(json_encode($response));

          $step = sprintf('data/%d.history.txt', $doc_id);
          $step_rows = file($step);
          $version = 0;
          $steps = array();
          $client_ids = array();
          foreach ($step_rows as $step_row) {
            $step_data = json_decode($step_row, true);
            if ($step_data['version'] > $version) {
              $version = $step_data['version'];
            }
            $steps = array_merge($steps, $step_data['steps']);
            $client_ids[] = $step_data['clientID'];
          }
          $step_json = array('version' => $version, 'steps' => $steps, 'clientIDs' => $client_ids);
          $response = array('type' => 'step',
                            'data' => $step_json);
          $conn->send(json_encode($response));
        }
      } else {
        $response = array('type' => 'init',
                          'data' => $this->default);
        $conn->send(json_encode($response));
      }
    }

    $this->clients->attach($conn);
  }

  public function onMessage(ConnectionInterface $conn, $s_data) {
    $query = $conn->httpRequest->getUri()->getQuery();
    parse_str($query, $sq_data);

    if ($sq_data['doc_id']) {
      $path = 'data/' . $sq_data['doc_id'] . '.history.txt';
    }

    $data = json_decode($s_data, true);

    if ($data['type'] == 'content') {
      $data = $data['data'];
      $version = 0;
      $versions = array();
      $lines = file($path);
      foreach ($lines as $line) {
        if ($line) {
          $line_json = json_decode($line, true);
          $versions[] = $line_json['version'];
        }
      }

      $data['version'] = max($versions) + 1;

      $fp = fopen($path, 'a');
      fwrite($fp, json_encode($data));
      fwrite($fp, "\n");
      fclose($fp);

      foreach ($this->clients as $client) {
        if ($client) {
          $query = $conn->httpRequest->getUri()->getQuery();
          parse_str($query, $tq_data);

          if ($tq_data['doc_id'] == $sq_data['doc_id'] && $client != $conn) {
            $data['clientIDs'] = array($data['clientID']);
            $response = array('type' => 'step',
                              'data' => $data);
            $client->send(json_encode($response));
          }
        }
      }
    } else {
      $data = $data['data'];
      foreach ($this->clients as $client) {
        if ($client) {
          $query = $conn->httpRequest->getUri()->getQuery();
          parse_str($query, $tq_data);

          if ($tq_data['doc_id'] == $sq_data['doc_id'] && $client != $conn) {
            $response = array('type' => 'cursor',
                              'data' => $data);
            $client->send(json_encode($response));
          }
        }
      }
    }
  }

  public function onClose(ConnectionInterface $conn) {
    $query = $conn->httpRequest->getUri()->getQuery();
    parse_str($query, $data);
    // $session_id = base64_decode($data['session_id']);
    // $user_id = $data['user_id'];
    // $account = $GLOBALS['sessions']->chat_auth($session_id);
    // $channel_id = $data['channel_id'];
    // if ($channel_id) {
    //   $GLOBALS['members']->update_read($channel_id);
    // }
    // if ($account == $user_id) {
    //   $conn->close();
    // }

    $this->clients->detach($conn);
  }

  public function onError(ConnectionInterface $conn, \Exception $e) {
    echo "An error has occurred: {$e->getMessage()}\n";

    $conn->close();
  }
}
