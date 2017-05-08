<h1 align="center">Progressive Universal React</h1>
<p align="center">A production ready progressive universal react starter kit.</p>

## About
This is Version 1.0 of my personal starter kit containing most of what I believe to be the newest and cutting edge technologies today in web app development.

## Motive
The reason for building this starterkit came from going through countless starter kits on Github, articles on Medium, and video tutorials. Part of it is a learning process (#javascriptfatigue), but the main goal is to utilize this starter kit in future projects.

## Features
<dl>
  <dt>React, React Router 4, ES2017</dt>
  <dd>Has the most bare minimum structure for a React application while using the newest version of React Router. Also supports most ES2017 features.</dd>

  <dt>Universal Rendering with Express server</dt>
  <dd>A very basic express server which initially serves a static string template and loads in the client scripts upon page render. Causes FOUC in development environment ONLY.</dd>

  <dt>Hot reloading development environment</dt>
  <dd>Watches for any configuration changes and immediately will be reflected in your live development session by hot reloading the client and node servers. Also uses React Hot Loader to reflect any changes to components or styles without a full page reload.</dd>

  <dt>Webpack 2</dt>
  <dd>Makes use of a lot of webpack's plugins and techniques such as treeshaking, HappyPack and vendorDLL packages to significantly improve bundle speeds and sizes.</dd>

  <dt>Progressive Web Application</dt>
  <dd>Utilizes a Service Worker to deliver an offline first web application. Once the SW script is loaded, the application will continue to be available to the user even without a network connection.</dd>

  <dt>Basic CSS module and SASS support</dt>
  <dd>Using CSS modules as the base with SASS syntax goodies and autoprefixing with postcss configurations. FOUC avoided in production bundles with ExtractTextPlugin.</dd>

  <dt>SEO support</dt>
  <dd>Strong support of SEO meta tag management to be indexed by google's search engine.</dd>

  <dt>Custom Demo environment</dt>
  <dd>Utilizes ngrok to set up a secure public URL for convenient demoing purposes.</dd>

  <dt>NOT included</dt>
  <dd>ESLint, Flow type checking, and Redux.</dd>
</dl>

## Scripts
  - Task and dependency management is run with yarn (https://yarnpkg.com/en/docs/install). IF you do not wish to use yarn, feel free to use npm instead. There will be no difference in the end product using either tool. Replace all "yarn" commands below with the appropriate npm command "npm run" or "npm install".

```bash
git clone https://github.com/charharhar/progressive-universal-react.git
cd progressive-universal-react
yarn || npm install
```
Clones this repository into your local directory <br />
Navigate into the cloned directory <br />
Install all the application's dependencies <br />

```bash
yarn develop
```
Starts the development servers for client and node bundles. Listens on http://localhost:3000 while the client bundle is being served from port 7000.

```bash
yarn tunnel
```
Builds a production bundle which outputs to /tunnel/ and generates a secure URL (check the CLI for URL). Ngrok hosts on a different port from your development ports. That way you can continue to develop while your demo server is running in a different session.

```bash
yarn build
yarn start
```
The build script builds a production bundle which outputs both client and server bundles to /build/. 
The start script starts a pm2 instance on port 3000.

```bash
yarn prod:start
```
This script simply combines the above two scripts into one.

```bash
yarn prod:stop
```
Kills the pm2 instance to free up port 3000. Simply executing ctrl+c will not terminate your production server.

```bash
yarn analyze:client
yarn analyze:server
```
Uses webpack bundle analyzer to run a server which hosts the production bundles for either the client or server.

```bash
yarn clear
```
Runs a simple script that removes all output directories (/build/ and /tunnel/).

## Todos
  - Create .env file for better application configuration such as server ports, secret keys for services, and database configs (if used).
  - Add customizable scripts for analytical and social media support such as facebook and google analytics.
  - Decide on what helpful libraries to include such as Modernizr, Bootstrap.
  - Incorporate NONCE values with uuid for better CSP configuration in regards to inline scripts.
  - Continue hashing out and improving on the react application structure.
  - Redux branch (at some point...).

## Project Structure
  - [client](/client/) -- Entry point for the client bundle. This is where the application is imported into and wrapped with the Router and Hot Reloader. Offline service worker is registered here at the bottom of the script.
  - [public](/public/) -- Contains all the public assets such as images, favicons, and manifest.json file.
  - [server](/server/) -- Entry point for the server bundle. Includes some middlewares such as security, static path declaration, composing the application template string and also creating the HTTP server.
  - [shared](/shared/) -- This is where most of the application code exists. Everything from reusable components to routes exist in this directory.
    - [components](/shared/components/) -- All the reusable components that will be used throughout the application. Each component is separated into its own directory with modularized style sheets. At the root there is a ./index.js file - it is an extra step to export your components but keeps your code organized and import statements shorter.
    - [config](/shared/config/) -- Extract all static strings such as image paths and route names to variables to be exported and used in the components.
    - [routes](/shared/routes/) -- Each "route" or "scene" or "screen" in this directory makes up for the component that will be rendered in each matching path.
  - [tools](/tools/) -- Primary configuration center for the entire application. 
    - There is a central configuration object which is exported from ./config.js and used throughout the app. Most of the applications namespace is managed here.
    - Utility functions exported from ./utils.js that provides some simple methods to make life easier during configuration.
    - [webpack](/tools/webpack/) -- Inside exists a configuration factory that outputs the correct bundle depending on the parameters passed to it. VendorDll config for faster development rebundling speeds. Service Worker configuration for production for awesome progressive web app support.
    - [scripts](/tools/scripts/) -- Using npm scripts as a task manager, all of the scripting commands are extracted into their own file.
      - [develop](/tools/scripts/develop/) -- Hot development servers created here using chokidar to watch for changes made to any file in the /tools/ directory. Client server built with express and webpack middlewares. Node server spawned with child_process.

## Additional
  - Get proper favicon support using http://www.favicon-generator.org/
  - Update application/json+ld data in /tools/config.js with correct data
  - Give proper title and description for the application

## Credits
Special thanks to https://github.com/ctrlplusb/react-universally. A huge part of this starter kit is inspired by what they have done. Instead of cloning their work, I decided to rewrite my own while using theirs as a reference. Part of it is to learn and understand what is going on while also being able to set up the kit catering to my preferences. In the end, this is almost a clone of their starter kit. If you magically stumble across this boiler plate and want to learn more, I strongly suggest looking at their highly commented code instead.
