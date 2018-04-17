#!/bin/sh
DEPLOY_APP_ID=$(cat package.json \
  | grep deployAppID \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

curl -i -H "Accept: application/json" -H "Content-Type: application/json" --header "x-token: L8rKVWr6JiI5rc7qPq4bn2HVsyJJi1" https://api.form.io/project/${DEPLOY_APP_ID}/role  -o src/modules/Formio/api/roles.json
sed -i.bak -e '1,18d' src/modules/Formio/api/roles.json
rm -rf src/modules/Formio/api/roles.json.bak
