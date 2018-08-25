#!/bin/sh
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

DEPLOY_APP_NAME=$(cat package.json \
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
rm -rf electron
quasar wrap electron
rm -f ./electron/src/main.js
cp ./deploys/electron/src/main.js ./electron/src/main.js
rm -f ./electron/icons/icon.png
rm -f ./electron/icons/icon.ico
rm -f ./electron/icons/icon.icns
cp ./deploys/electron/src/icon.png ./electron/icons/icon.png
cp ./deploys/electron/src/icon.ico ./electron/icons/icon.ico
cp ./deploys/electron/src/icon.icns ./electron/icons/icon.icns
sed -i.bak "/\"name\": \"quasar-electron-app\"/s/\"quasar-electron-app\"/\"$APPNAME\"/" ./electron/package.json
sed -i.bak "/\"productName\": \"Quasar Electron App\"/s/\"Quasar Electron App\"/\"$PRODUCTNAME\"/" ./electron/package.json
sed -i.bak "/\"version\": \"0.0.1\"/s/\"0.0.1\"/\"$VERSION\"/" ./electron/package.json
sed -i.bak "/\"author\": \"Your name <your@email.com>\"/s/\"Your name <your@email.com>\"/\"$AUTHOR\"/" ./electron/package.json
sed -i.bak "/\"description\": \"Quasar App wrapped with Electron\"/s/\"Quasar App wrapped with Electron\"/\"$DESCRIPTION\"/" ./electron/package.json
cd electron && npm install && quasar build darwin && quasar build win32
