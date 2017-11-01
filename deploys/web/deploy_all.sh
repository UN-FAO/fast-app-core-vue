#!/bin/sh
cp ./deploys/web/CNAME ./dist/CNAME
cd ./dist
surge ./