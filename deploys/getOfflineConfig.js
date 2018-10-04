const fs = require('fs');
const path = require('path');
const request = require('request');

function getEnv(env) {
  const lines = fs.readFileSync('.env').toString().trim().replace(/\r?\r/g, "").split(/\r|=|\n/);

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === env && i !== (lines.length - 1)) {
      return lines[i + 1];
    }
  }

  return '';
}

function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

const OFFLINE_START = getEnv('OFFLINE_START');
const APP_CONFIG_ID = getEnv('APP_CONFIG_ID');
const CONFIG_URL = getEnv('CONFIG_URL');

const dir = './src/config/offline';

async function main() {
  // Delete all files in folder
  fs.readdir(dir, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(dir, file), err => {
        if (err) throw err;
      });
    }
  });
  
  if (OFFLINE_START === 'true') {
    const url = CONFIG_URL + APP_CONFIG_ID;

    let res;
  
    // Get Configuration file from Form.io
    try {
      res = JSON.parse(await doRequest(url));
      fs.writeFile(dir + '/Configuration.json', JSON.stringify(res), 'utf8', function(err) {
        if (err) throw err;
      });
    } catch (err) {
      console.error(err);
    }

    // Get Roles file
    try {
      const rolesRes = JSON.parse(await doRequest(res.data.APP_URL + '/access'));
      const roles = {...rolesRes.roles, fastUpdated: Math.round((new Date()).getTime() / 1000)};
      fs.writeFile(dir + '/Roles.json', JSON.stringify(roles), 'utf8', function(err) {
        if (err) throw err;
      });
    } catch (err) {
      console.error(err);
    }

    // Get Translations
    try {
      const trans = JSON.parse(await doRequest(res.data.APP_URL + '/translations/submission?limit=99999'));
      fs.writeFile(dir + '/Translations.json', JSON.stringify(trans), 'utf8', function(err) {
        if (err) throw err;
      });
    } catch (err) {
      console.error(err);
    }

    // Get Pages
    try {
      const pages = JSON.parse(await doRequest(res.data.APP_URL + '/fast-app-pages/submission?limit=99999'));
      fs.writeFile(dir + '/Pages.json', JSON.stringify(pages), 'utf8', function(err) {
        if (err) throw err;
      });
    } catch (err) {
      console.error(err);
    }

    // Get Forms
    try {
      const forms = JSON.parse(await doRequest(res.data.APP_URL + '/form?limit=99999'));
      fs.writeFile(dir + '/Forms.json', JSON.stringify(forms), 'utf8', function(err) {
        if (err) throw err;
      });
    } catch (err) {
      console.error(err);
    }

    // Store last update
    const lastUpdate = JSON.stringify({date: Math.round((new Date()).getTime() / 1000)});

    fs.writeFile(dir + '/lastUpdate.json', lastUpdate, 'utf8', function(err) {
      if (err) throw err;
    });
  }
}

main();
