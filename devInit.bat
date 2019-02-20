
@echo off
call cd src && call git clone  git@github.com:RajanZhan/lib.git
call cd ../
call cd output 
call yarn install
            