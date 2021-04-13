## Preprocessor
### Download
- download file
```
git clone https://github.com/hzaybr/uidd2020.git
```
```
cd uidd2020/preprocessor
```
### Install
- install npm
```
npm i
```
- install pug-cli
```
npm i pug-cli
```
- install node-sass
```
npm i node-sass
```
- install babel
```
npm install --save-dev @babel/core @babel/cli
```

### Compile
- compile pug to html
```
npx pug ./aboutus.pug -o ./dist/
```
- compile sass to css
```
npx sass ./aboutus.sass ./dist/aboutus.css
```
- compile ts to js
```
./node_modules/.bin/babel ./exercise.ts --out-dir ./dist/ --extensions ".ts"
```
### Result
- The aboutus.html, aboutus.css and exercise.js are in the dist file
  https://hzaybr.github.io/uidd2020/preprocessor/dist/aboutus.html



