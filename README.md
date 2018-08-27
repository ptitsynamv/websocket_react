# websocket_react

You create DB: websocket User: email = admin@admin.com, password = qwerty


"Error: listen EADDRINUSE :::4000"

sudo kill $(sudo lsof -t -i:4000)
killall -9 node