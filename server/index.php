<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

require_once dirname(__FILE__) . '/lib/websocket/vendor/autoload.php';
require_once dirname(__FILE__) . '/server.php';

// use prosemirror_server;

class websocket {

  function __construct()
  {
    $this->port = 9300;
  }

  function run()
  {
    $this->server = IoServer::factory(
        new HttpServer(
            new WsServer(
                new prosemirror_server()
            )
        )
      , $this->port
    );

    $this->server->run();
  }
}

$websocket = new websocket();
$websocket->run();

?>
