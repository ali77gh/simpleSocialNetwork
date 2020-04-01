echo "makeing js files..."
rm -rf dist/ && tsc
echo "zipping..." 
zip pack dist public package.json jwt.key Dockerfile -9 > /dev/null
echo "zipping with db and logs..."
zip packWithDBAndLogs dist public package.json jwt.key Dockerfile database.db logs.txt -9 > /dev/null
echo "done :)"