# Jekill Parcel
A plugin for Jekyll static site generator to add the support for [ParcelJS](https://parceljs.org).

*DISCLAIMER*: keep in mind that I can't offer an out-of-the-box solution, you will need to edit your theme to link the generated assets. This tool is meant to offer the automation to execute parcel build when the source assets changes.

## Setup
- Install parcel globally: `yarn global add parcel-bundler` (or with npm: `npm install -g parcel-bundler`)
- Add `jekyll-parcel` to your *_config.yml*:
```yml
plugins:
  - jekyll-parcel

exclude: # update exclude list with src folder
  - .cache/
  - src/
# ...
```
- Edit your theme to include the generated assets
- Run your project as usual (build or serve)

## Options
You can change some options adding to your *_config.yml* a `jekyll-parcel` key with:
- `init`: an extra command to run during the startup (build or serve)
- `build`: an array of hashes with these keys:
  - `path`: folder to watch for changes;
  - `script`: command to run when a change is detected in path above.

Example:
```yml
jekyll-parcel:
  init: parcel build --out-dir assets src/index.js
  builds:
    -
      path: src
      script: parcel build --out-dir assets src/index.js
```

If no options are specified the above configuration is used by default.

## Advanced setup
- If you prefer, add parcel-bundler to your project (see Parcel docs)
- Setup your assets scripts, example (*package.json*):
```json
  "scripts": {
    "build_css": "parcel build --out-dir assets src/css/main.css",
    "build_js": "parcel build --out-dir assets src/js/main.js",
    "build": "yarn run build_css && yarn run build_js"
  }
```
- Update your site config, example:
```yml
jekyll-parcel:
  init: yarn build
  builds:
    -
      script: yarn build_css
      path: src/css
    -
      script: yarn build_js
      path: src/js
```
