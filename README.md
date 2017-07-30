Webpack in 5 minutes (with Vue.js + Vuex + vue-router)
===========================

A minimalistic setup suitable for basic development using Webpack (with Vue.js + Vuex + vue-router).

1. [About This Project](#about)  
2. [Features](#features)  
3. [Installation](#installation)  
4. [Updates](#updates)  
5. [How To Build](#how_to_build)  
6. [Entry Points & URLs](#entry_points_urls)  
  6-1. [URL Routings Explained](#routings_explained)  
  6-2. [Other Routing Preferences](#extra_routings)  
7. [Notes](#notes)  
  7-1. [Installed "npm" packages](#installed_packages)  
  7-2. [Removing Unnecessary Packages](#remove_unnecessary_packages)


## 1. <a name="about"></a>About This Project

*If you need to **setup your new project immediately**,
you should use ["vue-cli"](https://github.com/vuejs/vue-cli).  
It is an awesome tool to let you to create your new projects right away!  
But if you want to **customize your project** the way you like,  
you are looking at the right project!*

When I start a new project, I do it from "scratch".  
Then, **I usually look up my previous projects to copy and paste  
whatever needed for my new project.**  
And, this project serves me the purpose.  
For it has a plenty of codes to satisfy my needs.

This project is a *"reference"* for my projects.  
**As it always saves my time, I hope it does to you the same.**  
Please feel free to copy and paste whichever you find it useful!

## 2. <a name="features"></a>Features

In the previous version, I used *"HTML Webpack Plugin"*
to dynamically generate HTML files.  
However, I found it more common to many of my projects that I start out  
with some kind of server-side rendered framework
(such as *"Laravel"* or *"Express"*) that are already existing.  
So, I decided instead to make this project having *Vue* app embedded
within static HTML files.  
(specifically, `public/sample.html` in the project)

Another feature that commonly used in many of my projects
is the routing functionality.  
For which *"vue-router"* is amazing to serve the purpose,
and I have in this project  
an example of `public/sample.html` having 2 routed pages.

Also, you will find good examples using *"Vuex"* to manage states.  
Especially, for *"vue-i18n"* being used in the project for internationalization,  
I am using *"Vuex"* to manage the states.

The first routed page, `#/webgl`, shows you an example of WebGL using *"Three.js"*.  
The second one, `#/wiki`, gives you an example of using *Wiki Search API*  
to show you how you can easily implement a reactive SPA app using *Vue*.

List of features:

- *ES6 with Babel*
- *Webpack 3.1.0*
- *Webpack Dev Server* <-- for the develoment build (HMR enabled)
- *uglify-save-license* <-- prevents vendor license descriptions from being uglified
- *eslint*
- *stylus*
- *Vue 2.3.4*
- *Vuex*
- *vue-router*
- *vue-i18n* <-- using *Vuex* for the state management
- *ThreeJS*

## 3. <a name="installation"></a>Installation

Make sure you have `babel-cli` installed globally.

```
npm install -g babel-cli
```

Clone it.

```
cd path/to/your/own/workspace
git clone https://github.com/minagawah/webpack-in-5min-vuejs.git
```

Since the project mainly intends to ***provide you with some sample codes and settings,  
simply running it is not very recommended.*** However, because you need to run it anyways  
in order to check how it goes, here's how you install npm modules:

Install npm packages.

```
cd webpack-in-5min-vuejs
npm install
```

## 4. <a name="updates"></a>Updates

**Ver. 1.2.3 --> 1.2.4**

- Some refactoring.
- Changed the compositions for i18n handling.
- Added more comments.

**Ver. 1.2.2 --> 1.2.3**

- Changed the way to load config.

**Ver. 1.2.1 --> 1.2.2**

- Fix for i18n

**Ver. 1.2.0 --> 1.2.1**

- Changed filenames for HTML files and routings.

**Ver. 1.1.2 --> 1.2.0**

- Webpack 1.14.0 --> 3.1.0
- No more *HTML Webpack Plugin* to auto-generate HTMLs, but the app is embedded within a static HTML file.
- Uses *vue-i18n* for internationalization.
- *gulp* is removed.
- Uses a single `webpack.config.babel.js` file to control *dev* and *prod*.


## 5. <a name="how_to_build"></a>How To Build

### For "development"

```
npm run dev
```

Launches `webpack-dev-server` at port `8080`.  
The app will be built, but ***you won't see them because they are on memory.***

### For "production"

```
npm run prod
```

You will find the built chunks under `public/dist/js` directory.  
Likewise, asset files are found under `public/dist/assets`.


## 6. <a name="entry_points_urls"></a>Entry Points & URLs

### 6-1. <a name="routings_explained"></a>URL Routings Explained

#### (a) We have "two" static pages

Notice we have two HTML files under `public` directory:

- index.html
- sample.html

The former provides a link, and pretty much does nothing more.  
The latter, however, is where you see all the *Vue* magic happens.  
So, it is apparent that you have at least two of the following URLs:

http://localhost:8080/index.html  
http://localhost:8080/sample.html

#### (b) We have "two" entry points for "sample.html"

Now, open `public/sample.html` and you will find the following code:

```
<script src="dist/js/vendor.js"></script>
<script src="dist/js/sample.js"></script>
```

It signifies that it may probablly generate `dist/js/sample.js` when you run the build.  
Looking at `webpack.config.babel.js`, you see two entry points defined:

```
entry: {
    sample: path.resolve(__dirname + '/src/entries/sample/index.js'),
    vendor: [
        'lodash.merge','seedrandom','whatwg-fetch','three',
        'vue','vuex','vue-resource','vue-i18n','vue-router'
    ]
}
```

As it literary denotes, "vender" contains all the third party modules, and will be compiled to `dist/js/vendor.js`.  
"sample" is what your `public/sample.html` refers to,
and it's pointing toward `src/entries/sample/index.js`.  
Again, as you open the program, you find *Vue* app is bound to an element with an ID called, *"#app"*.

```
const App = new Vue({
    ...
}).$mount('#app');
```

And, you may find the ID in `public/sample.html` accordingly:

```
<div id="app">
    <router-view></router-view>
</div>
```

#### (c) We also have "two" vue-routing pages for "sample.html"

Now, you may have noticed that we have `<router-view></router-view>` above.  
It means the app is using `vue-router` as well.  
Our `public/sample.html` does not only provide a *Vue* page,
but it also servers several other routed sub-pages.  
Here are the sub-pages provided:

http://localhost:8080/sample.html#/webgl  
http://localhost:8080/sample.html#/wiki


### 6-2. <a name="extra_routings"></a>Other Routing Preferences

#### (a) Using "Express" to serve Vue pages

Followings are the extra settings if you donnot want a static HTML (I mean of `public/sample.html`) serving the page,  
but you want your server-side framework (let's suppose you are using `Express`) to render the page.  
Also, say, you want to use `/app/v1/sample` for the base directory.

Like this:

http://localhost:8080/v1/app/sample/webgl  
http://localhost:8080/v1/app/sample/wiki

First of all, you need to configure the server-side routings in `Express`.

```
app.get('/v1/app/sample', (req, res) => { res.render('v1/app/sample'); });
```

In the above, we are expecting that you have `view/v1/app/sample.ect` for the rendered template.  
You may not have `view` directory, but here, I am just supposing that you do for the template directory...  
(or you may have different template extensions in accord with your templating engine choices)

Now, you want your *Vue* app to use `/` instead of `#`,
and you do that by adding `mode` attribute set to `history`.  
Also, you want your `base` directory to point to `/v1/app/sample` instead of `/`.  
Here is how it looks in `src/sample/index.js`:

```
const router = new VueRouter({
    mode: 'history',
    base: '/v1/app/sample',
    routes: [
        { path: '/', redirect: '/webgl' },
        {
            name: 'webgl',
            path: '/webgl',
            component: route_to_webgl
        },
        {
            name: 'wiki',
            path: '/wiki',
            component: route_to_wiki
        }
    ]
});
```

Now, it's working!


#### (b) Using "Express"... but with static HTMLs

You may be using *Express*, but sometimes, you want to use a *"static"* HTML to serve your *Vue* app.  
Let's say you wan to server the following URLs:

http://localhost:8080/v1/app/sample#/webgl  
http://localhost:8080/v1/app/sample#/wiki

When you want `public` directory to server your static files, you usuall have:

```
app.use(express.static(path.join(__dirname, 'public')));
```

You basically do the similar thing, except you need to be more specific:

```
app.use('/v1/app/sample', express.static(path.join(__dirname, 'public/v1/app/sample.html')));
```

For your *Vue* routing, you can just say:

```
base: '/v1/app/sample',
```

and you are done.

## 7. <a name="notes"></a>Notes

### 7-1. <a name="installed_packages"></a>Installed "npm" packages

What it means when you do `npm install`:

```
npm install --save-dev lodash.merge lodash.mergewith yargs babel-core babel-runtime babel-preset-es2015 babel-preset-stage-0 babel-plugin-transform-runtime babel-loader webpack webpack-dev-server url-loader file-loader html-loader style-loader css-loader stylus stylus-loader postcss-loader autoprefixer-stylus exports-loader imports-loader eslint eslint-loader babel-eslint eslint-plugin-html eslint-friendly-formatter extract-text-webpack-plugin@^3.0.0-rc.1 webpack-cleanup-plugin copy-webpack-plugin uglify-save-license

npm install --save lodash.merge lodash.mergewith seedrandom whatwg-fetch three web-animations-js vue vue-router vuex vue-resource vue-i18n
```

meaning, you have installed the followings for `devDependencies`:

```
lodash.merge
lodash.mergewith
yargs
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
postcss-loader
autoprefixer-stylus
exports-loader
imports-loader
eslint
eslint-loader
babel-eslint
eslint-plugin-html
eslint-friendly-formatter
extract-text-webpack-plugin@^3.0.0-rc.1
webpack-cleanup-plugin
copy-webpack-plugin
uglify-save-license
```

For `Dependencies`:

```
lodash.merge
lodash.mergewith
seedrandom
whatwg-fetch
three
web-animations-js
vue
vue-router
vuex
vue-resource
vue-i18n
```

### 7-2. <a name="remove_unnecessary_packages"></a>Removing Unnecessary Packages

#### (a) Uninstalling "Three.js"

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


#### (b) Uninstalling Other Packages

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

