reactjsx.com
============

## Why?
I'd like to find reusable React components.

React is amazing. It is as revolutionary as PHP+MySQL when they first came out. But the young community hasn't come up with an index of reusable components.

## How?
Login with Github and submit a repo.

## About this repo:
- To use:
```
cd reactjsx.com && npm install && bower install
grunt # this runs the connect server at localhost:8000
cd rx-search && npm install
grunt # this build the actual component
```
- It consists of only one web component ```<rx-search></rx-search>```
- I choose [web component](http://www.webcomponentsshift.com/#1) as a way to package my React code. I am still unsure what is the best way to package a React component.
- I render the React component in the attachedCallback of the web component.
- Browserify since CommonJS is straightforward.
- Browserify shim for jQuery, underscore and React so that if we add more components to the page in the future, we don't have to load those libs again.

## Server side rendering
- Working in progress
- A extremely naive solution is:
```
node server_side_render.js > server_side_render.html
```
