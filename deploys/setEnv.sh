echo "Setting the project to use with: $1"
RED='\033[0;31m'
NC='\033[0m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'

###################################################
# Set the current App name in Package.json
#
node ./node_modules/json/lib/json.js -I -f package.json -e "this.deployAppName='${2}'"

###################################################
# Set the current App ID in Package.json
#
node ./node_modules/json/lib/json.js -I -f package.json -e "this.deployAppID='${3}'"

###################################################
# Copy the projects image into their dev locations
#
  rm -rf ./src/assets/imgs/loginBig.jpg
	cp ./deploys/projects/${1}/loginBig.jpg ./src/assets/imgs/loginBig.jpg

###################################################
# Copy the projects env into their dev locations
#
  rm -rf ./src/config/env.js
	cp ./deploys/projects/${1}/env.js ./src/config/env.js

###################################################
# Copy the projects custom CSS into their dev locations
#
  rm -rf ./src/assets/css/custom
	cp -R ./deploys/projects/${1}/css/custom ./src/assets/css

###################################################
# Copy the projects CNAME into their dev locations
#
  rm -rf ./deploys/web/CNAME
	cp ./deploys/projects/${1}/CNAME ./deploys/web/CNAME

#############################################################
# Copy the projects Cordova Config into their dev locations
#
  rm -rf ./deploys/cordova/src/config.xml
	cp ./deploys/projects/${1}/config.xml ./deploys/cordova/src/config.xml

echo "${GREEN} Project ${YELLOW}$1 ${GREEN}Ready to use!"
echo "${NC} You can start developing with: quasar dev"
