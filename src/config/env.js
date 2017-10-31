/*
|--------------------------------------------------------------------------
| APP VERSION
|--------------------------------------------------------------------------
|
| Here you may specify the version of the APP that you are 
| building. Managing versions will help you better
| understand whats are your users looking at!
|
*/ 
	export const FAST_VERSION = '0.1.5'
/*
|--------------------------------------------------------------------------
| FORM.IO CONFIGURATION
|--------------------------------------------------------------------------
|
| Here you may specify the URL to get to the FORM.IO project.
| This app will automaticaly pull all resources and 
| forms asociated with it.
|
*/ 
	export const APP_URL = 'https://uiorzjzflxyccmo.form.io'
	export const APP_NAME = 'uiorzjzflxyccmo'
/*
|--------------------------------------------------------------------------
| MD5 KEY 
|--------------------------------------------------------------------------
|
| Here you may specify which is the KEY to hash the users password.
| Password will never be stored locally, but we do stored the 
| hashed version of it.
|
*/ 
	export const MD5_KEY = 'my_super_secure_key'
/*
|--------------------------------------------------------------------------
| LOCAL DB PASSWORD and SYNC
|--------------------------------------------------------------------------
|
| Here you may specify the password to access hashed information in the 
| Local DB. All collections that store sentitive information  
| will use this password as hash. Sync URL will be use to
| sync LocalDB´s when using multiple Browser Windows.
|
*/ 
	export const LOCAL_DB_PASSWORD = 'onePassword123'
	export const SYNC_URL = 'http://localhost:3000/'

/*
|--------------------------------------------------------------------------
| SYNC CONFIGURATION
|--------------------------------------------------------------------------
|
| Here you may specify the URL to create the Hearbeat. Specfy 
| the SYNC_INTERVAL (miliseconds) to change how often
| the heartbeat and syncronization of offline 
| submissions should run.
|
*/ 
	export const HEARTBEAT_URL = 'https://dog.ceo/api/breeds/list/all'
	export const SYNC_INTERVAL = 5000

/*
|--------------------------------------------------------------------------
| MULTILANGUAGE
|--------------------------------------------------------------------------
|
| Here you may specify if this application require multilenguage settings
|
*/ 
	export const MULTILANGUAGE = true

/*
|--------------------------------------------------------------------------
| LOCAL DRAFT
|--------------------------------------------------------------------------
|
| Here you may specify if this application allows users to store
| submissions as local drafts before sending them to FORM.IO
|
*/ 
	export const LOCAL_DRAFT_ENABLED = true
/*
|--------------------------------------------------------------------------
| OFFLINE FIRST
|--------------------------------------------------------------------------
|
| Here you may specify if this application should use the OFFLINE
| first approach. This means storing every submission locally
| before submitting the data to FORM.IO
*/ 
	export const OFFLINE_FIRST = true
	export const OFFLINE_USE = true
