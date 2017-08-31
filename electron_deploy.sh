#!/bin/sh
rm -rf electron
quasar build
quasar wrap electron
cd electron && npm install && quasar build darwin
