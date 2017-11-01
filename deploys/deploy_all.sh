#!/bin/sh
quasar build
sh ./deploys/cordova/deploy_all.sh && sh ./deploys/electron/deploy_all.sh && sh ./deploys/web/deploy_all.sh