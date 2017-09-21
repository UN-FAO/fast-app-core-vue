#!/bin/sh
rm -rf cordova
quasar build
quasar wrap cordova -Y
cd cordova && \
	cordova plugin add cordova-plugin-battery-status && \
 	cordova plugin add cordova-plugin-geolocation --variable GEOLOCATION_USAGE_DESCRIPTION="Get places close to you" && \
 	cordova plugin add cordova-plugin-contacts --variable CONTACTS_USAGE_DESCRIPTION="Connect to your friends" && \
 	cordova plugin add cordova-plugin-sqlite-2 && \
 	cordova plugin add cordova-plugin-network-information && \
 	cordova plugin add cordova-sms-plugin && \
	cordova platform add android #&& \
	cordova run android
	# cordova platform add https://github.com/apache/cordova-ios.git && cordova run --buildConfig=../build.json ios --device
