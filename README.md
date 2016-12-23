Webpack in 5 minutes (with Vue.js + Vuex + vue-router)
===========================

A minimalistic setup suitable for basic development using Webpack (with Vue.js + Vuex + vue-router).

## 1. About

Whenever I create new projects, I always faced with the demand of having  
a minimalistic Webpack setups ready, so that I can just reuse it elsewhere.  
Now, I hope this thing will make my life a little bit easier,  
and so it will for those who have the similar issues as I have.

In addition to the basic features available in [webpack-in-5min](https://github.com/minagawah/webpack-in-5min),  
this specific repository allows you to use `gulp` command to perform the same tasks.

For this specific variation, it includes some basic setups for projects using  
**Vue.js** + **Vuex** + **vue-router**. Notice, **vue-router** currently does not work well  
with Hot Module Reloading (HMR), and you need to manually refresh the browser  
as you change your source codes.

[Demo](http://tokyo800.jp/samples/webpack-in-5min-vuejs/)

To demonstrate the page transition using **vue-router**, we have a rotating 3D cube using Three.js  
for the first page, and a keyword search on Wikipedia in which the events are handled by *Vuex*.

## 2. Features

Look into each file. I added a bunch of comments explaining what they actually do.

## 3. Installation

Clone it.

```
git clone https://github.com/minagawah/webpack-in-5min-vuejs.git
```

Install npm packages.

```
npm install
```

## 4. Usage

### development

Allows the app development using `webpack-dev-server`.

```
gulp
```

The above is the alias for `gulp dev` which launches "webpack-dev-server".  
(you may alternatively choose not to use `gulp` and type run `npm start`)


### production

Run a production build.

```
gulp prod
```

The above will create bundled files in `build` directory.
(you may alternatively choose not to use `gulp` and type run `npm run build`)

## 5. Other Variations

Future repositories yet to come:

* [webpack-in-5min](https://github.com/minagawah/webpack-in-5min)  
This is the basic setup using Webpack.
* [webpack-in-5min-with-gulp](https://github.com/minagawah/webpack-in-5min-with-gulp)  
There are things `gulp` is good at doing where Webpack cannot.
* [webpack-in-5min-vuejs](https://github.com/minagawah/webpack-in-5min-vuejs)  
Vue + Vuex + vue-router is usually the basic combination that satisfies my basic needs.
* [webpack-in-5min-vuejs-graphql]()  
Above settings plus a GraphQL client (probablly using Apollo).
* [webpack-in-5min-react]()  
This should be useful for my work.

## 6. Note

### npm install

What it means when you do `npm install`:

```
npm install --save-dev babel-core babel-runtime babel-preset-es2015 babel-preset-stage-0 babel-plugin-transform-runtime babel-loader webpack webpack-dev-server gulp gulp-util gulp-shell gulp-rename run-sequence del url-loader file-loader html-loader style-loader css-loader stylus stylus-loader exports-loader imports-loader shim-loader eslint eslint-loader babel-eslint eslint-plugin-html eslint-friendly-formatter html-webpack-plugin extract-text-webpack-plugin webpack-cleanup-plugin copy-webpack-plugin uglify-save-license deep-assign yargs

npm install --save seedrandom vue vue-router vuex vue-resource three
```

Notice, compared to the basic setup [webpack-in-5min](https://github.com/minagawah/webpack-in-5min), we have a few more npm packages installed for `devDependencies`:

```
del
gulp
gulp-rename
gulp-shell
gulp-util
run-sequence
```

Also, compared to [webpack-in-5min-with-gulp](https://github.com/minagawah/webpack-in-5min-with-gulp), we have more for `Dependencies`:

```
vue
vue-router
vuex
vue-resource
three
```

We are using `exports-loader` and `imports-loader` so that you can do something like this:

```
const THREE = require('three');
THREE.OrbitControls = require('imports?THREE=three!exports?THREE.OrbitControls!../../node_modules\/three\/examples\/js\/controls\/OrbitControls');
```

### jsonp

It uses `Vue.http.jsonp` to perform the wiki search.  
When its request timeouts, it alert you with the message:

```
Uncaught TypeError: request.abort is not a function
```
This is because the current release of `vue-resource` uses Promise instead of ajax,  
and does not provide `abort()` method available.  
Wait for them fix this issue someday, and you can ignore the message for now.
