
@echo off
call npm i typescript -g
call npm i yarn -g
call tsc
call cd src && call git clone  git@github.com:RajanZhan/lib.git
call cd ../
call cd output 
call yarn install
            