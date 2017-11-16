import Loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter'
import {
  APP_FANTACY_NAME
} from 'src/config/env'
import Promise from 'bluebird'
import Auth from 'modules/Auth/api/Auth'
import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'
import _debounce from 'lodash/debounce'
import Connection from 'modules/Wrappers/Connection'
import store from 'config/store'
import LocalUser from 'database/collections/scopes/LocalUser'
// import {  Platform} from 'quasar'
/*
import collections from './collections/collections'





/*
|--------------------------------------------------------------------------
| LockiDB Config
|--------------------------------------------------------------------------
| This is the configuration for the Local DB creation.
| Also you will find the sync methods for
| the external server (FORM.io)
|
*/
var DB;
const _create = function () {
  /*
    var userAgent = navigator && navigator.userAgent && navigator.userAgent.toLowerCase()
    // If running on Electron
    if (userAgent && userAgent.indexOf(' electron/') > -1) {
      database.adapter = 'websql'
    }
    // If running on Mobile Browser
    else if (Platform.is.mobile) {
      database.adapter = 'localstorage'
    }
    // If running on Cordova App
    else if (Platform.is.cordova) {
      database.adapter = 'websql'
    } else {
      db = initializeWebDB();
    }
  */
  return new Promise((resolve) => {
    var idbAdapter = new LokiIndexedAdapter('FAST');

    var pa = new Loki.LokiPartitioningAdapter(idbAdapter, {
      paging: true
    });

    var db = new Loki(APP_FANTACY_NAME, {
      adapter: pa,
      autosave: true,
      autosaveInterval: 2000,
      autoload: true,
      autoloadCallback: databaseInitialize
    });

    console.log('#####################')
    console.log('Using IndexedDB')
    console.log('#####################')

    function databaseInitialize() {
      var submissions = db.getCollection("submissions");
      var forms = db.getCollection("forms");
      var translations = db.getCollection("translations");
      var users = db.getCollection("users");

      if (submissions === null) {
        db.addCollection("submissions")
      }
      if (forms === null) {
        db.addCollection("forms");
      }
      if (translations === null) {
        db.addCollection("translations");
      }
      if (submissions === null) {
        db.addCollection("submissions");
      }
      if (users === null) {
        db.addCollection("users");
      }
      db.saveDatabase()
      resolve(db)
    }
  })
}


export async function get() {
  if (!DB) {
    DB = await _create()
  }
  return DB
}


const syncSubmissions = async({
  db,
  vm
}) => {
  let usersAreSync = await areUsersSynced()

  if (usersAreSync) {
    let filter = await db.submissions.find().exec()
    // updated incomplete submission
    filter = _filter(filter, function (o) {
      return (o.data.sync === false && o.data.draft === false && o.data.user_email === Auth.userEmail() && !o.data.queuedForSync && !o.data.syncError)
    })
    console.log('Offline submissions are', filter)
    filter = _orderBy(filter, ['data.created'], ['asc'])
    if (filter.length > 0) {
      store.dispatch('sendOfflineData', {
        offlineSubmissions: filter,
        vm: vm
      })
    }
  }
}

const DsyncSubmissions = _debounce(syncSubmissions, 1000)


const getUsersToSync = async() => {
  let filter = await LocalUser.find({
    'data.sync': false
  })
  return _filter(filter, function (o) {
    return (o.data.sync === false)
  })
}



const areUsersSynced = async() => {
  let users = await getUsersToSync()
  return !!users && Array.isArray(users) && users.length === 0
}

const syncUsers = async({
  db,
  isOnline
}) => {
  let filter = await getUsersToSync()

  if (filter.length > 0) {
    store.dispatch('sendOfflineData', {
      offlineSubmissions: filter,
      isOnline
    })
  }
}

const DsyncUsers = _debounce(syncUsers, 1000)



export const sync = async function (vm) {
  const db = await get()
  const isOnline = Connection.isOnline() /*  Connection.isTabInUse() ? await Connection.heartBeat(vm) : Connection.isOnline() */

  if (Auth.check() && isOnline) {
    await DsyncSubmissions({
      db,
      vm
    })
  }

  if (isOnline) {
    await DsyncUsers({
      db,
      isOnline
    })
  }
}
