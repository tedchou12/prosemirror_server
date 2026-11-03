# prosemirror-server-php
A PHP Collaboration Server for Prosemirror.
It includes the WebSocket for communicating with Prosemirror Client: https://github.com/tedchou12/prosemirror_client
It also includes the Prosemirror library from https://github.com/MO-Movia/licit/ to parse the differences.

# Converter (prosemirror_parser)
The `prosemirror_parser` binary converts one format per run:

| Feature | Command |
| --- | --- |
| Steps -> final JSON | `prosemirror_parser doc=data/doc.txt step=data/step.txt out=data/out.txt` |
| HTML -> JSON | `prosemirror_parser html=data/html.txt out=data/doc.json` |
| JSON -> HTML | `prosemirror_parser json=data/doc.json to=html out=data/out.html` |
| JSON -> Markdown | `prosemirror_parser json=data/doc.json to=markdown out=data/out.md` |
| Markdown -> JSON | `prosemirror_parser md=data/out.md to=json out=data/doc.json` |

`to=` accepts `json`, `html`, or `markdown` (`md` is an alias). Output goes to
stdout unless `out=<file>` is given; `-` reads that input from stdin. Run with
`--help` for full usage.

The binaries are built with esbuild + @yao-pkg/pkg and bundle only the
components needed for conversion, keeping each binary ~55-67MB instead of ~200MB.
The Linux binary is statically linked, so it runs on any x64 Linux distro
(Amazon Linux 2/2023, Ubuntu, Debian, Alpine — any glibc or musl).

# To Begin
1. Generate the converter binaries:
```
cd prosemirror_parser
npm install --legacy-peer-deps
npm run build
mv prosemirror_parser-linux ../prosemirror_server
mv prosemirror_parser-macos ../prosemirror_server
mv prosemirror_parser-win.exe ../prosemirror_server
```
2. Start the websocket server:
```
cd prosemirror_server
php index.php
```

