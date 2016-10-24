xcopy E:\Storage\Programming\Apps\onlinedesktop\core E:\Storage\Programming\Apps\onlinedesktop\build\final\core /e/y
xcopy E:\Storage\Programming\Apps\onlinedesktop\user E:\Storage\Programming\Apps\onlinedesktop\build\final\user /e/y
copy E:\Storage\Programming\Apps\onlinedesktop\*.php E:\Storage\Programming\Apps\onlinedesktop\build\final
copy E:\Storage\Programming\Apps\onlinedesktop\*.txt E:\Storage\Programming\Apps\onlinedesktop\build\final
java -jar closure-compiler.jar --js .\core\lib\js\OS.js --js_output_file .\build\final\core\lib\js\OS.js --compilation_level SIMPLE_OPTIMIZATIONS