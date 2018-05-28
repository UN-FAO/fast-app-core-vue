#!/bin/sh
rm -rf ./dist
quasar build
npm run es5
cp ./deploys/web/CNAME ./dist/CNAME
cd ./dist
surge ./
