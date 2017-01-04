Webpack in 5 minutes (with Vue.js + Vuex + vue-router)
===========================

A minimalistic setup suitable for basic development using Webpack (with Vue.js + Vuex + vue-router).

## 1. About

Whenever I create new projects, I always faced with the demand of having a minimalistic Webpack setups ready,  
so that I can just reuse it elsewhere. Now, I hope this thing will make my life a little bit easier,  
and so it will for those who have the similar issues as I have.

In addition to the basic features available in [webpack-in-5min](https://github.com/minagawah/webpack-in-5min), this specific repository allows you  
to use `gulp` command to perform the same tasks.

For this specific variation, it includes some basic setups for projects using Vue.js, Vuex, and vue-router,  
Notice, vue-router currently does not work well with Hot Module Reloading (HMR), and you need to  
manually refresh the browser as you change your source codes.

If you prefer NOT to use `gulp`, or you want to uninstall some packages, there is [a guide to remove unnecessary packages](#remove_unnecessary_packages).

[Demo](http://tokyo800.jp/samples/webpack-in-5min-vuejs/)

To demonstrate the page transition using vue-router, we have a rotating 3D cube using Three.js  
for the first page, and a keyword search on Wikipedia in which the events are handled by Vuex.

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

* **[webpack-in-5min](https://github.com/minagawah/webpack-in-5min)**  
This is the basic setup using Webpack.
* **[webpack-in-5min-with-gulp](https://github.com/minagawah/webpack-in-5min-with-gulp)**  
There are things `gulp` is good at doing where Webpack cannot.
* **[webpack-in-5min-vuejs](https://github.com/minagawah/webpack-in-5min-vuejs)**  
Vue + Vuex + vue-router is usually the basic combination that satisfies my basic needs.
* **webpack-in-5min-vuejs-graphql**  
Above settings plus a GraphQL client (probablly using Apollo).
* **webpack-in-5min-react**  
This should be useful for my work.

If you are interested in Vue.js, I have several other repos using Vue.js:

* **[vue-change-canvas-demo](https://github.com/minagawah/vue-change-canvas-demo)**  
Demonstrates how we handle several canvas scenes switched back and forth. Some of the animations  
uses Vue.js's features. Check out how easy it is to implement using their features (see the **[Demo](http://tokyo800.jp/samples/vue-change-canvas-demo)** ).
* **[vue-word-animation-demo](https://github.com/minagawah/vue-word-animation-demo)**  
As everyone uploads photos to a server, this client program keep watches the uploaded photos,  
and once we retrieve some, these photos are gathered into one place in the galaxy to form  
a huge text (see the **[Demo](http://tokyo800.jp/samples/vue-word-animation-demo)** ).

## 6. Notes

### Installed "npm" packages

What it means when you do `npm install`:

```
npm install --save-dev babel-core babel-runtime babel-preset-es2015 babel-preset-stage-0 babel-plugin-transform-runtime babel-loader webpack webpack-dev-server url-loader file-loader html-loader style-loader css-loader stylus stylus-loader exports-loader imports-loader eslint eslint-loader babel-eslint eslint-plugin-html eslint-friendly-formatter html-webpack-plugin extract-text-webpack-plugin webpack-cleanup-plugin copy-webpack-plugin uglify-save-license lodash.merge yargs del gulp gulp-util gulp-shell gulp-rename run-sequence

npm install --save seedrandom vue vue-router vuex vue-resource three
```

meaning, you have installed the followings for `devDependencies`:

```
babel-core
babel-runtime
babel-preset-es2015
babel-preset-stage-0
babel-plugin-transform-runtime
babel-loader
webpack
webpack-dev-server
url-loader
file-loader
html-loader
style-loader
css-loader
stylus
stylus-loader
exports-loader
imports-loader
eslint
eslint-loader
babel-eslint
eslint-plugin-html
eslint-friendly-formatter
html-webpack-plugin
extract-text-webpack-plugin
webpack-cleanup-plugin
copy-webpack-plugin
uglify-save-license
lodash.merge
yargs
del
gulp
gulp-util
gulp-shell
gulp-rename
run-sequence
```

For `Dependencies`:

```
seedrandom
vue
vue-router
vuex
vue-resource
three
```

### <a name="remove_unnecessary_packages"></a>Removing Unnecessary Packages

#### Uninstalling "gulp"

If you prefer not to use `gulp` at all, and want to entirely use `npm` command instread, you can uninstall the following packages:

```
del
gulp
gulp-rename
gulp-shell
gulp-util
run-sequence
```

#### Uninstalling "Three.js"

If you are not using Three.js, you can install if from your `Dependencies`:

```
three
```

likely, we have `exports-loader` and `import-loader` insalled so that Three.js can load its submodules:

```
const THREE = require('three');
THREE.OrbitControls = require('imports?THREE=three!exports?THREE.OrbitControls!../../node_modules\/three\/examples\/js\/controls\/OrbitControls');
```

So, if you think it is no use, you can uninstall the followings from your `devDependencies`:

```
exports-loader
imports-loader
```


#### Uninstalling Other Packages

If you want to further minimize the project structure, there are some other packages you may want to consider removing:

```
seedrandom
copy-webpack-plugin
extract-text-webpack-plugin
uglify-save-license
eslint-friendly-formatter
stylus
stylus-loader
lodash.merge
yargs
```
##### # seedrandom

`seadrandom` is in use to replace JS's native `Math.random` and it is used in `utils.js`.

##### # copy-webpack-plugin

This is being in use just to copy `html5shiv.min.js` to the build directory independent of the bundled app.

##### # extract-text-webpack-plugin

Making CSS files as external resources for `production`. If you want to embed CSS in your bundled app, you can stop using this plugin.

##### # uglify-save-license

When your source codes are uglified with `UglifyJsPlugin` for `production`, this will set an exception to  
LICENSE description for each library being in use, so that others can easily recognize the terms written inside the codes.
##### # eslint-friendly-formatter

This will give a fancy lookiing result on your terminal console when you lint your source codes.

##### # stylus

Remove this if you are not using Stylus.

##### # stylus-loader

Remove this if you are not using Stylus.

##### # lodash.merge

Upon bundling your app, `webpack.config.dev.js` or `webpack.config.prod.js` first requires `webpack.config.common.js`  
as its basic webpack configuration, and combine it with the environment specific configurations.  
Due to the limitation of `Object.assign` which allows you to create only the shallow copy of the objects combined,  
we need a tool to deep merge objects. Remove this package if you have alternative ways to distinguish  
environment specific settings, or want to replace it with some other deep merge tools.

##### # yargs

When you run `npm` command, webpack determines the environment from the specified options, namely,  
`--env.dev` or `--env.prod`. When `webpack.config.babel.js` is read, some platforms do not properly understand  
the custom options, and when that happens, it needs alternative ways to handle the given values.  
If you have other ways to determine the running environment, you can remove it.

