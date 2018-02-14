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
exports.APP_ENV = 'dev'
exports.FAST_VERSION = '0.5.13'
exports.SHARE_DATA_BETWEEN_USERS = true
exports.TAB_MENU = false
exports.HAS_SCORES = false
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
exports.APP_URL = 'https://yxxyynxtauhaaqp.form.io'
exports.APP_NAME = 'yxxyynxtauhaaqp'
/*
|--------------------------------------------------------------------------
| APP CONFIGURATION
|--------------------------------------------------------------------------
|
| Here you may specify the details of the app that you are building.
| This will automatically replace the defaults placeholders
| in the app.
|
*/
exports.APP_FANTACY_NAME = 'SSFK'
exports.APP_PHRASE = 'Trinidad and Tobago SSFK POC'
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
exports.MD5_KEY = 'my_super_secure_key'
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
exports.LOCAL_DB_PASSWORD = 'onePassword123'
exports.SYNC_URL = 'http://localhost:3000/'

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
exports.HEARTBEAT_URL = 'https://dog.ceo/api/breeds/list/all'
exports.SYNC_INTERVAL = 2000
/*
|--------------------------------------------------------------------------
| MULTILANGUAGE
|--------------------------------------------------------------------------
|
| Here you may specify if this application require multilenguage settings
|
*/
exports.MULTILANGUAGE = true

/*
|--------------------------------------------------------------------------
| LOCAL DRAFT
|--------------------------------------------------------------------------
|
| Here you may specify if this application allows users to store
| submissions as local drafts before sending them to FORM.IO
|
*/
exports.LOCAL_DRAFT_ENABLED = true
/*
|--------------------------------------------------------------------------
| OFFLINE FIRST
|--------------------------------------------------------------------------
|
| Here you may specify if this application should use the OFFLINE
| first approach. This means storing every submission locally
| before submitting the data to FORM.IO
*/
exports.OFFLINE_FIRST = true
exports.OFFLINE_USE = true

/*
|--------------------------------------------------------------------------
| PARALLEL SURVEYS
|--------------------------------------------------------------------------
|
| Here you may specify if this application allows the user to
| have multiple running surveys (group survey)
|
*/
exports.PARALLEL_SURVEYS = false
/*
|--------------------------------------------------------------------------
| LEFT HAND WIZARD NAVIGATION
|--------------------------------------------------------------------------
|
| Here you may specify if this application will automaticaly
| open the left hand wizard navigation while on create
|
*/
exports.NAVIGATION_OPENED = true
exports.NAVIGATION_AUTOCLOSE_ON_SELECTION = false
