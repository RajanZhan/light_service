@echo off
call npm run build-server
call  copy .\config.json %cd%\build\config.json 
call  copy %cd%\app.config.json %cd%\..\build\server\app.config.json /A
call  copy %cd%\package.json %cd%\..\build\server\package.json /A
call  Xcopy %cd%\static %cd%\..\build\server\static\ /S /A /Y
call  Xcopy %cd%\dist %cd%\..\build\server\dist\ /S /A /Y
call echo finished.
call pause