#!/bin/sh
####################################################
#  Project Setup Variables
###################################################
	APPNAME="FAST"
	PRODUCTNAME="SHARP"
	VERSION="0.2.2"
	AUTHOR="Ignacio Cabrera <ignacio.cabrera@fao.org>"
	DESCRIPTION="Collection application for Form.io"
###################################################
quasar build
sh ./deploys/cordova/deploy_all.sh && \
sh ./deploys/electron/deploy_all.sh && \
sh ./deploys/web/deploy_all.sh && \
rm -rf ./deploys/all && \
mkdir ./deploys/all && \
cp ./cordova/platforms/android/build/outputs/apk/android-debug.apk ./deploys/all/${PRODUCTNAME}_v${VERSION}.apk && \
cp -R ./electron/dist/${PRODUCTNAME}-darwin-x64/${PRODUCTNAME}.app ./deploys/all/${PRODUCTNAME}_v${VERSION}.app && \
cp -R ./dist ./deploys/all/${PRODUCTNAME}_v${VERSION}
zip -r ${PRODUCTNAME}_v${VERSION}.zip ./deploys/all/*
mv ${PRODUCTNAME}_v${VERSION}.zip ./deploys/all/${PRODUCTNAME}_v${VERSION}.zip