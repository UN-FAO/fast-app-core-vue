#!/bin/sh
echo "Script executed from: ${PWD}"
PACKAGE_VERSION=$(cat ./../../package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

DEPLOY_APP_NAME=$(cat ./../../package.json \
  | grep deployAppName \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

####################################################
#  Project Setup Variables
###################################################
	APPNAME="FAST"
	PRODUCTNAME=$DEPLOY_APP_NAME
	VERSION=$PACKAGE_VERSION
	AUTHOR="Ignacio Cabrera <ignacio.cabrera@fao.org>"
	DESCRIPTION="Collection application for Form.io"
###################################################

echo ${PRODUCTNAME}
quasar build
npm run es5
sh ./deploys/cordova/deploy_all.sh && \
sh ./deploys/electron/deploy_all.sh && \
sh ./deploys/web/deploy_all.sh && \
rm -rf ./deploys/all && \
mkdir ./deploys/all && \
###################################################
# Copy the Cordova project to the deploy folder
#
	cp ./cordova/platforms/android/build/outputs/apk/android-debug.apk ./deploys/all/${PRODUCTNAME}_v${VERSION}.apk && \
###################################################
# Copy the Electron Mac project to the deploy folder
#
	cp -R ./electron/dist/${PRODUCTNAME}-darwin-x64/${PRODUCTNAME}.app ./deploys/all/${PRODUCTNAME}_v${VERSION}.app && \
###################################################
# Copy the Electron Win32 project to the deploy folder
#
	cp -R ./electron/dist/${PRODUCTNAME}-win32-x64 ./deploys/all/${PRODUCTNAME}-win_v${VERSION} && \
###################################################
# Copy the Web projecto to the deploy folder
#
	cp -R ./dist ./deploys/all/${PRODUCTNAME}-web_v${VERSION}
###################################################
# Zip the different deploys
#
	zip -r ${PRODUCTNAME}_v${VERSION}.zip ./deploys/all/*
###################################################
# Move the zip into the Deploy Folder
#
	mv ${PRODUCTNAME}_v${VERSION}.zip ./deploys/all/${PRODUCTNAME}_v${VERSION}.zip
