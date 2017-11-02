<template>
  <q-layout
    ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
  >
  <toolbar slot="header"></toolbar>
  <template v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  ">
    <leftdrawer slot="left"></leftdrawer>
    <rigthdrawer slot="right"></rigthdrawer>
  </template> 
  <connection-alert></connection-alert>
    <router-view :key="$route.path" />
  </q-layout>
</template>
<script>
/* eslint no-use-before-define: 0 */
import 'bootstrap/dist/css/bootstrap.css'
import 'formiojs/dist/formio.full.min.css'
// import 'bootstrap-rtl-ondemand/dist/css/bootstrap-rtl.min.css'
import toolbar from 'layout/toolbar'
import leftdrawer from 'layout/left_drawer'
import rigthdrawer from 'layout/right_drawer'
import connectionAlert from 'modules/Connection/components/alert'
/*
import contentHeader from 'layout/content-header.vue'
*/
import {mapActions} from 'vuex'
import {sync} from 'database/Database'
import Connection from 'modules/Wrappers/Connection'
import { SYNC_INTERVAL } from 'config/env'
import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QSearch,
  QTabs,
  QRouteTab,
  QBtn,
  QIcon,
  QItemSide,
  QItemMain,
  QSideLink,
  QListHeader,
  QScrollArea,
  Toast
} from 'quasar'
import layoutStore from 'layout/layout-store'
export default {
  name: 'app',
  mounted () {
    this.$eventHub.on('lenguageSelection', (lenguage) => {
      this.toggleRtl(lenguage)
    })
    this.$eventHub.on('connectionStatusChanged', (status) => {
      this.$store.dispatch('changeIsOnlineStatus', status)
    })

    this.$eventHub.$on('openLeftDrawer', () => {
      this.$refs.layout.toggleLeft()
    })

    this.$eventHub.$on('openRightDrawer', () => {
      this.$refs.layout.toggleRight()
    })

    this.$eventHub.on('FAST-DATA_SYNCED', (data) => {
       Toast.create.positive({ html: data.count + ' SUBMISSION(s) SYNCED' })
    })

    Connection.initEventListeners(this)
    this.setSyncInterval()
  },
  methods: {
    ...mapActions(['sendOfflineData']),
    toggleRtl: function (lenguageDirecction) {
      this.ltr = lenguageDirecction === 'ltr'
    },
    /**
       * [setSyncInterval description]
       */
    setSyncInterval: function () {
      let rInterval = function (callback, delay) {
        let dateNow = Date.now,
          requestAnimation = window.requestAnimationFrame,
          start = dateNow(),
          stop,
          intervalFunc = function () {
            // eslint-disable-next-line no-use-before-define
            dateNow() - start < delay || (start += delay, callback())
            // eslint-disable-next-line no-use-before-define
            stop || requestAnimation(intervalFunc)
          }
        requestAnimation(intervalFunc)
        return {
          clear: function () {
            stop = 1
          }
        }
      }
      rInterval(() => {
        return sync(this)
      }, SYNC_INTERVAL)
    }
  },
  data () {
    return {
      backgroundColor: 'whitesmoke',
      timeout: {},
      ltr: true,
      layoutStore
    }
  },
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QSearch,
    QTabs,
    QRouteTab,
    QBtn,
    QIcon,
    QItemSide,
    QItemMain,
    QSideLink,
    QListHeader,
    QScrollArea,
    toolbar,
    leftdrawer,
    rigthdrawer,
    connectionAlert,
    Toast
  }
}
</script>
<style>
  html {
font-size:inherit!important;
line-height:inherit!important;
}

.panel-primary>.panel-heading {
color:#fff;
background-color:#0d6cac!important;
border-color:#0d6cac!important;
}

.panel-danger>.panel-heading {
color:#fff;
background-color:#ad2121;
border-color:#ad2121;
}

.alert-danger {
background-color:transparent;
border-color:#f7a4af;
color:#FFF!important;
}

.alert {
border:none;
color:red!important;
}

.formio-errors .help-block {
color:red!important;
}

.choices__list {
color:#000;
}

ul.list-group.list-group-striped {
color:#666;
}

.fileSelector {
color:#666;
}

.row {
margin-right:0!important;
margin-left:0!important;
}

label {
font-size:.8rem!important;
}

legend {
font-size:16px!important;
color:#0d6cac!important;
}

.q-tab-pane {
border:none!important;
}

.q-tabs-inverted.q-tabs-position-top .q-tabs-panes {
border-top:none!important;
}

button.btn.btn-default.btn-wizard-nav-cancel {
display:none;
}

.score-panel {
display:none;
}

p {
color:#000;
}

.panel {
color:#000;
}

.choices__list.choices__list--dropdown {
position:inherit;
max-height:200px;
}

ul.list-inline { 
    position: sticky;
    bottom: -63px;
    z-index: 99;
    width: 100%;
    min-height: 63px;
}

button.btn.btn-primary.btn-wizard-nav-next,
button.btn.btn-primary.btn-wizard-nav-previous{
    color: #337ab7;
    background-color:  whitesmoke;
    border-color: #337ab7;
    height: 60px;
    width: 200px;
}
button.btn.btn-primary.btn-wizard-nav-next:hover,
button.btn.btn-primary.btn-wizard-nav-previous:hover,
button.btn.btn-primary.btn-wizard-nav-next:active,
button.btn.btn-primary.btn-wizard-nav-previous:active {
    background-color: #337ab7;
    color: white;
}

button.btn.btn-primary.btn-wizard-nav-submit,
button.btn.btn-primary.submitForm {
    color: #3c8d41;
    background-color:  whitesmoke;
    border-color: #3c8d41;
    height: 60px;
    width: 200px;
}
button.btn.btn-primary.btn-wizard-nav-submit:hover {
    background-color: #3c8d41;
    color: white;
}

button.btn.btn-default.saveAsDraft {
    position: inherit !important;
    bottom: 0px;
    color: #20a0ff;
    background-color: whitesmoke;
    border-color: #20a0ff;
    height: 60px;
    width: 200px;
    z-index: 999;
}

ul.pagination {
    display: none;
}

table.table.datagrid-table.table-bordered.form-group.formio-data-grid.table-striped.table-bordered {
    color: black;
}

div.formio-component-datagrid {
    overflow-x: auto;
}

input.form-control {
    min-width: 150px;
}


.transition-generic {
    transition: all .1s !important;
}



#follow-up-main {
    height: 100%;
    overflow-x: hidden;
}
  [data-reactroot].main-app-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
.login-main-container {
    overflow: hidden;
}

.login-main-container {
    overflow: hidden;
}
.login-main-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: visible;
    display: flex;
}
.login-main-container {
    flex-grow: 1;
    flex-direction: column;
}
.appTitleHolder{
    text-align: center;
}
.login-form-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-main-container .big-logo {
    opacity: .25;
}
.login-main-container .big-logo {
    opacity: .15;
    display: block;
}
.login-main-container .big-logo {
    position: absolute;
    height: 1124px;
    width: 1124px;
    display: none;
    opacity: 0;
    left: -562px;
    z-index: -1;
    text-align: center;
}


.fao-logo-login {
    height: 59px;
    width: 300px;
    background-size: contain;
    background-repeat: no-repeat;
}
    
.login-form-holder h1 {font-size: 5em; margin-bottom: 0.2em; color:#065276;}
.login-form-holder h4 {font-size: 2.5em; color:#065276; margin-bottom: 1.5em;}    
    
.login-form-holder button {
    width: 20%;
    height: 45px;
    margin-bottom: 2.5em;
    margin-top: 1em;
}
.btn.btn-primary {
    background-color: #1976d3;
}
.q-btn {
    padding: 6px 10px;
    font-size: 15px;
    position: relative;
    /*
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;
    -ms-border-radius: 25px;
    border-radius: 25px;
    */
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: rgba(255,255,255,0);
}
    
._new-user a {border-bottom: 1px solid #c3c7ca; padding: 0px 10px 5px; font-size: 0.95em;}
input.col.q-input-target.text-left:focus {
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
    
    
body {
    font-family: 'Open Sans', sans-serif !important;
    background-color: #f3f3f5;
    color: #333;
    overflow-x: hidden;
}
body, html {
    height: 100%;
}

.bigAppName {font-size: 3em; margin-bottom: 0.2em; color: #065276;}
.appDescription {font-size: 1.7em; color: #065276; font-weight: 300;}

._backlink {text-align: center; margin-top: 2em;}
._backlink a {border-bottom: 1px solid #c3c7ca; padding: 0px 10px 5px; font-size: 1em;}   

.centered{
       margin: auto; position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
       right: 0;
}


.form-control {
    min-height: 35px !important;
    height: auto;
    font-size: 20px !important;
}

label.control-label {
    color: #666;
    font-size: medium !important;
    font-weight: 300 !important;
}

.radio label {
    font-weight: normal !important;
    font-size: medium !important;
}

input[type=radio] {
    display:none; 
    margin:10px;
}

table input[type=radio] {
    display:block; 
    margin:10px;
}

input[type=radio] + span, input[type=checkbox] + span {
    margin: -2px;
    padding: 4px 12px;
    background-color: rgb(231, 231, 231);
    border-radius: 5px;
    min-width: 230px;
    min-height: 30px;
    text-align: center;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    margin-bottom: 1px !important;
    margin-top: 1px !important;
}

input[type=radio]:checked + span, input[type=checkbox]:checked + span { 
   background-image: none;
    background-color: #0e6da5;
    color: white;
    cursor: pointer;
    padding: 2px 12px 3px 12px;
    text-decoration: none;
    display: inline-block;
    border-radius: 5px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    margin-bottom: 1px !important;
    margin-top: 1px !important;
}

.alert-danger {
    color: #a94442;
    background-color: rgba(255, 255, 255, 0.52) !important;
    border-color: #ebccd1;
}

.el-table__body-wrapper {
    overflow: scroll !important;
    position: relative !important;
    -webkit-overflow-scrolling: touch !important;
}


.formioPagination .q-item-label {
    color: black;
    font-weight: 300;
}

.saving {
  box-shadow: 1px 1px 1px 1px rgba(222, 15, 15, 0.88) !important;
}

.q-collapsible.q-item-division.relative-position {
    color: black;
}

.activePage {
  background-color:#0e6da5;
  color: white;
}
.activePage .q-item-main .q-item-label  {
  background-color:#0e6da5;
  color: white !important;
  font-weight: 400;
}
.activePage.q-item.q-item-division.relative-position.q-item-multiline.q-item-link:hover {
    background: #0e6da5;
}

.field-required:after {
    content: " *";
    color: red;
    font-size: x-large;
}


.layout-aside-left {background:#00283c !important; color:#ffffff; opacity:0.8;}
.layout-aside-left .q-list {padding: 1px 0; border: none !important;}
.layout-aside-left .q-item-side {color:#ffffff; text-align: center;}

.router-link-exact-active.router-link-active {
    background-color: rgb(0, 82, 132) !important;
}

.layout-aside-left .q-list-header {line-height: 60px;}
.layout-aside-left .q-list-header center {font-size: 1.8em;}
.layout-aside-left .q-item {padding: 15px 16px;}
.layout-aside-left .q-item-side {min-width: 40px;}

.router-link-active {background: none !important;}
    
.panel {
    border-color: transparent !important; 
}
.FormioContainer {
    background: #F0F4F5;
}
.layout-page-container {
    background: #F0F4F5;
}

input.form-control {
    background: transparent !important;
} 

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
}


.layout-header {
    box-shadow: none !important;
}

.form-group {
    margin-bottom: 10px !important;
}

label {
    margin-bottom: 0px !important;
}

.btn.btn-primary {
    background-color: #337ab7;
    border-radius: 0px !important;
    border-color: transparent;
}
</style>