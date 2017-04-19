<h1 align="center">Progressive Universal React</h1>
<p align="center">A production ready progressive universal react starter kit.</p>

## About
This is Version 1.0 of my personal starter kit containing most of (what I believe to be atleast) the newest and cutting edge technologies today in web app development.

## Motive
The reason for writing this starterkit came from going through countless starter kits on Github, articles on Medium, and video tutorials on Udemy and FrontendMasters. Part of it is a learning process and the other part is to eventually use this starter kit in my future projects.

## Features
<dl>
  <dt>React with React Router v4</dt>
  <dd>Has the most bare minimum structure for a React application while using the newest version of React Router. Also supports the most commonly used ES2017 features.</dd>

  <dt>Universal Rendering with Express server</dt>
  <dd>A very basic express server which initially serves a static string template and loads in the client scripts upon page render. Causes FOUC in development environment ONLY.</dd>

  <dt>Hot reloading development environment</dt>
  <dd>Any configuration changes made will be reflected in your development session with hot reloading client and node servers. Also uses React Hot Loader to reflect any changes to components or styles without a page reload.</dd>

  <dt>Webpack 2 bundling</dt>
  <dd>Makes use of a lot of webpack 2 plugins and techniques such as treeshaking, HappyPack and vendorDLL packages to significantly improve bundle speeds.</dd>

  <dt>Progressive Web Application support</dt>
  <dd>Utilizes Service Workers to deliver offline first web applications. Once the SW script is loaded, application will still be available to the user without network connection.</dd>

  <dt>Most basic CSS module and SASS support</dt>
  <dd>Using CSS modules as the base with SASS goodies and autoprefixing with postcss configurations. FOUC avoided in production bundles with ExtractTextPlugin.</dd>

  <dt>SEO support</dt>
  <dd>Strong support of SEO meta tag management to be indexed by google's search engine.</dd>

  <dt>Custom Demo environment</dt>
  <dd>Utilizes Ngrok to set up a secure public URL for demo purposes.</dd>

  <dt>NOT included</dt>
  <dd>ESLinting, Flow coverage, and Redux./</dd>
</dl>

## Scripts
```bash
yarn develop
```
Starts the development servers for client and node bundles. Listens on http://localhost:3000 with client bundle being served from port 7000.

```bash
yarn tunnel
```
Builds a production bundle which outputs to /tunnel/ and generates a secure URL (check CLI for url) which hosts on a different port from your development ports. That way you can continue to develop while your demo server is running on the side.

```bash
yarn build
yarn start
```
The build script builds a production bundle which outputs into /build/. 
The start script starts a pm2 instance on port 3000. To kill the instance see below.

```bash
yarn prod:start
```
This script simply combines the above two scripts into one.

```bash
yarn prod:stop
```
Kills the pm2 instance to free up port 3000.

```bash
yarn analyze:client
yarn analyze:server
```
Uses webpack bundle analyzer to run a server which hosts the production bundles for either the client or server.

```bash
yarn clear
```
Runs a simple script that removes all output directories.

## Credits
Special thanks to https://github.com/ctrlplusb/react-universally. A huge part of this starter kit is inspired by what they have done. Instead of cloning their work, I decided to rewrite my own while using theirs as a reference. Part of it is to learn and understand what is going on while also being able to set up the kit catering to my preferences. In the end, you can almost call this a clone of their starter kit. If you magically stumble across this boiler plate and want to learn more, I strongly suggest looking at their highly commented code instead.
