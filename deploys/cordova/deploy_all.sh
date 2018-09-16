#!/bin/sh
rm -rf cordova
quasar wrap cordova -Y
rm -rf ./cordova/config.xml
cp ./deploys/cordova/src/config.xml ./cordova/config.xml
cd cordova && \
	# cordova plugin add cordova-plugin-battery-status && \
  # cordova plugin add cordova-plugin-splashscreen && \
  cordova plugin add cordova-plugin-android-permissions && \
  cordova plugin add cordova-plugin-whitelist && \
 	cordova plugin add cordova-plugin-geolocation --variable GEOLOCATION_USAGE_DESCRIPTION="Geolocate your submissions" && \
 	# cordova plugin add cordova-plugin-contacts --variable CONTACTS_USAGE_DESCRIPTION="Connect to your friends" && \
 	cordova plugin add cordova-plugin-network-information && \
 	# cordova plugin add cordova-sms-plugin && \
 	cordova plugin add cordova-plugin-file --force && \
 	cordova plugin add cordova-plugin-media && \
 	cordova plugin add cordova-plugin-camera && \
 	# cordova plugin add cordova-plugin-file-transfer && \
 	# cordova plugin add cordova-plugin-indexeddb-async && \
  # cordova plugin add cordova-plugin-wkwebview && \
  cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=fastapp && \
	cordova platform add android && \
	rm -rf ./platforms/android/platform_www/cordova.js
	cp ../deploys/cordova/src/cordova.js ./platforms/android/platform_www/cordova.js


	cordova build android --release --buildConfig=../deploys/cordova/build.json

  #&& \
	# cordova platform add https://github.com/apache/cordova-ios.git && cordova run --buildConfig=../build.json ios --device




