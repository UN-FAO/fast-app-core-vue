#!/bin/bash
function get_env()
{
    VAR=$(grep $1 .env | xargs)
    IFS="=" read -ra VAR <<< "$VAR"
    local  __resultvar=$1
    local  myresult=${VAR[1]}
    if [[ "$__resultvar" ]]; then
        eval $__resultvar="'$myresult'"
    else
        echo "$myresult"
    fi
}


get_env CONFIG_URL
get_env APP_CONFIG_ID
get_env OFFLINE_START

rm -rf ./src/config/offline/*

if [ "$OFFLINE_START" == "true" ]; then
    # GET APP CONFIGURATION
    CONFIG_URL=$CONFIG_URL$APP_CONFIG_ID
    curl $CONFIG_URL -o ./src/config/offline/Configuration.json

    # GET APP URL
    APP_URL=$(node -pe 'JSON.parse(process.argv[1]).data.APP_URL' "$(cat ./src/config/offline/Configuration.json)")
    # GET APP ROLES
    ROLES=$(node -pe 'JSON.stringify({...JSON.parse(process.argv[1]).roles, updated: Math.round((new Date()).getTime() / 1000)})' "$(curl -s $APP_URL/access)")
    echo "$ROLES" >> ./src/config/offline/Roles.json
    # GET APP TRANSLATIONS
    curl $APP_URL/translations/submission?limit=99999 -o ./src/config/offline/Translations.json

    UPDATED=$(node -pe 'JSON.stringify({date: Math.round((new Date()).getTime() / 1000)})')
    echo "$UPDATED" >> ./src/config/offline/lastUpdate.json
fi
