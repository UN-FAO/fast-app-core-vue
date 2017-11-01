#!/bin/sh
rm -rf ./dist
quasar build
cp ./deploys/web/CNAME ./dist/CNAME
cd ./dist
surge ./