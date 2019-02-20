@echo off
call echo compiling...
call  node_modules/.bin/webpack --progress --colors --config   ./browserSrc/admin/webpack.config.js
#call  node_modules/.bin/webpack --progress --colors --config   ./browserSrc/app/webpack.config.js
call cd compileTool
call  npm run build
call cd ../
call  copy %cd%\config.json %cd%\build\config.json /A
call  copy %cd%\package.json %cd%\build\package.json /A
call  Xcopy %cd%\static %cd%\build\static\ /S /A /Y
call echo finished.
call pause
