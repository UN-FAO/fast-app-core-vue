#!/bin/sh
rm -rf cordova
quasar build
quasar wrap cordova -Y
rm -rf cordova/config.xml
cp config.xml cordova/config.xml
cd cordova && \
	cordova plugin add cordova-plugin-battery-status && \
 	cordova plugin add cordova-plugin-geolocation --variable GEOLOCATION_USAGE_DESCRIPTION="Geolocate your submissions" && \
 	cordova plugin add cordova-plugin-contacts --variable CONTACTS_USAGE_DESCRIPTION="Connect to your friends" && \
 	cordova plugin add cordova-plugin-sqlite-2 && \
 	cordova plugin add cordova-plugin-network-information && \
 	cordova plugin add cordova-sms-plugin && \
 	cordova plugin add cordova-plugin-file && \
 	cordova plugin add cordova-plugin-media && \
 	cordova plugin add cordova-plugin-camera && \
 	cordova plugin add cordova-plugin-file-transfer && \
 	cordova plugin add cordova-plugin-indexeddb-async && \
	cordova platform add android #&& \
	cordova emulate android
	# cordova platform add https://github.com/apache/cordova-ios.git && cordova run --buildConfig=../build.json ios --device
