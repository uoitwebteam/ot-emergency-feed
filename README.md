# Ontario Tech Emergency Feed

This repository contains the source files for the OT emergency notification system, which is responsible for displaying messages and redirecting users during campus emergencies or service disruptions.

The repository is subdivided into two portions –
- `server`:
  - a long-polling microservice for checking service disruptions and emergency notifications RSS sources
  - checks for data at intellegent intervals using RxJS, and sends data only when it has changed (via `Websocket` messages)
  - new subscribers get a fresh copy of the latest data to check if it has been viewed yet
- `client`:
  - a frontend script that listens to messages from the server and interprets their contents
  - renders various HTML templates for received messages if on the emergency feed page
  - checks for "emergency takeovers" and redirects users to the feed when applicable

All library source material is stored in a separate repository and can be found in [Mighty Polling ⚡️ Socket Server](https://github.com/wosevision/mighty-polling-socket-server) – for documentation relating to how this system is set up (and how to set up others), please see the README of that repository. This project is just one practical implementation.

## The simple 🐻 necessities

### Setup

1. Clone this repo and make it your working directory:
	```sh
	git clone https://github.com/uoitwebteam/ot-emergency-feed.git
	cd ot-emergency-feed
	```
2. Run a package installer from the root directory. You have two options to choose from:
	```sh
	npm install # slow, womp womp
	# or...
	yarn # FAST! / hipster npm install
	```

### Scripts

**For client development:**
-   ```sh
    npm run start
    # or...
    yarn start
    ```
    The server process will be started in the background, and the frontend will start a separate process on a different port to enable live-reloading during frontend development and file serving from `/client`.

**For server development:**
-   ```sh
    npm run build
    # or...
    yarn build
    ```
    This script does not start a server, but instead just prepares frontend assets for production by compiling with Webpack into `/public` (for serving with the `express.static` middleware).

-   ```sh
    npm run dev-server
    # or...
    yarn dev-server
    ```
    The server process is started with `nodemon`, which auto-restarts the server when changes are made to it. All frontend files must be compiled into `/public` for serving, so `build` is also run in the background.

-   ```sh
    npm run server
    # or...
    yarn server
    ```
    The server process is started analagously to how it would be started in production. All frontend files must be compiled into `/public` for serving, so `build` is also run in the background.