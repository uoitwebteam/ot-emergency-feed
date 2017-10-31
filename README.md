# UOIT Emergency Feed

This repository is subdivided into two portions –
- `server`:
  - a long-polling microservice for checking service disruptions and emergency notifications
  - checks for data at intellegent intervals using RxJS 
  - sends data only when updated (via websockets)
  - allows new subscribers to request the data for comparison
- `client`:
  - a frontend script that listens to messages from server
  - renders various HTML templates for received messages
  - checks for "emergency takeovers" and redirects users when needed

All library source material is stored in a separate repository and can be found in [Mighty Polling ⚡️ Socket Server](https://github.com/wosevision/mighty-polling-socket-server). This repository contains the practical implementation of that library.