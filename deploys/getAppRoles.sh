#!/bin/sh
DEPLOY_APP_ID=$(cat package.json \
  | grep deployAppID \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

curl -i -H "Accept: application/json" -H "Content-Type: application/json" --header "x-token: 1c9GwcPSfroUNGGF3wPnaG3FiEaybx" https://api.form.io/project/${DEPLOY_APP_ID}/role  -o src/modules/Formio/api/roles.json
sed -i.bak -e '1,18d' src/modules/Formio/api/roles.json
rm -rf src/modules/Formio/api/roles.json.bak
