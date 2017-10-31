#!/bin/sh
quasar build
cp ./CNAME ./dist/CNAME
cd dist
surge ./