# prosemirror-server-php
A PHP Collaboration Server for Prosemirror.
It includes the WebSocket for communicating with Prosemirror Client: https://github.com/tedchou12/prosemirror_client
It also includes the Prosemirror library from https://github.com/MO-Movia/licit/ to parse the differences.

# To Begin
1. Start by generating the prosemirror delta parser binary executables.
```
cd prosemirror_parser
npm run build
mv prosemirror_parser-linux ../server
mv prosemirror_parser-macos ../server
mv prosemirror_parser-win.exe ../server
```
2. Start the websocket server
```
cd server
php websocket.php
```


