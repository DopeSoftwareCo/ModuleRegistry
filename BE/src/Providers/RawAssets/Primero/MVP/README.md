# MVP Repo

## 🌟 Running with checker 🌟

The path to the repository is the MVP folder, not the base folder when cloned.

Ensure environment has node/npm

NPM/Node Installation:

-   [Download and install here](https://nodejs.org/en/download/prebuilt-installer)
-   [npm Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Check NPM/Node Installation:

-   `npm --version`
-   `node --version`
-   If npm & node are installed correctly you should see matching versions from the Download Node.js® page.
-   I am using node v22.1.0 and npm v10.7.0, not sure if the newest versions break any current configs or not.

Ensure correct permissions on run file (in MVP directory):

-   `chmod +x run`

The usual commands that the checker requests are available:

-   `./run install`
-   `./run test`
-   `./run {path to url file}`

## 🌟 Devs Start here! 🌟

### Dependencies

NPM/Node Installation:

-   [Download and install here](https://nodejs.org/en/download/prebuilt-installer)
-   [npm Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Check NPM/Node Installation:

-   `npm --version`
-   `node --version`
-   If npm & node are installed correctly you should see matching versions from the Download Node.js® page.
-   I am using node v22.1.0 and npm v10.7.0, not sure if the newest versions break any current configs or not.

Install Dependencies:

-   Open terminal in your IDE, use powershell, terminal of preference, etc..
-   cd into the MVP directory.
-   `cd path/to/MVP`
-   Install dependencies using npm
-   `npm install`

### Run

Running nodemon:

-   In your terminal in the MVP directory run the following command:
-   `npm run dev`
-   This command (in package.json under the key "scripts) will start nodemon and watch files within the src/ directory.
-   Any changes you make will be watched, and executed in your terminal.

Try out live changes (while npm run dev is still running):

-   Paste the following in src/index.ts.

```ts
console.log('some text');
```

-   Save your changes to see the new output in the console

### Optional Prettier Install

If using VSCode install the extension prettier. I have already added my config as a dev dependency. After enabling formatting on save your files will be auto-formatted according to that standard. I don't see this as required it just makes diffs on git much easier to read if we work within the same file and helps keep code readable.

If anyone needs any help, has any questions, etc don't hesitate to reach out!

put output.txt back for run file before submission

## 🌟 General MVP Information 🌟

### Running without building

Can use nodemon for this:

-   `npm install`
-   `npm run dev`

### Manual build

We have a build script for this:

-   `npm run build`

### Various test configs

We have two test configurations, to switch between the two swap the script that npm run test runs:

-   muted output: `test:jest:mute`
-   verbose output: `test:jest:verbose`

### Where is everything?

Inside MVP folder

-   Distribution `dist/`
-   Coverage `coverage/`
-   Logs `Logs/`
-   Entry `index.ts`
-   ISO dumps `REPO_DUMP/` (should remain empty)
-   File Results `results/`
-   Node Modules `node_modules/`
