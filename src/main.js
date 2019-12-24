import Vue from 'vue'
import App from './App.vue'
//import router from './router'
//import store from './store'
import firebase from 'firebase'

Vue.config.productionTip = false

// Initialize Firebase

var config = {
        apiKey: "AIzaSyAEnpuSfcnyVMsgGGMgqD4V76CQpQ5hg18",
        authDomain: "twitter-sample-c234a.firebaseapp.com",
        databaseURL: "https://twitter-sample-c234a.firebaseio.com",
        projectId: "twitter-sample-c234a",
        storageBucket: "twitter-sample-c234a.appspot.com",
        messagingSenderId: "373676135055",
        appId: "1:373676135055:web:4ec028efcb242d37e256fa",
        measurementId: "G-T710EEC2C4"
};
// eslint-disable-next-line no-console
console.log(config)
firebase.initializeApp(config);
firebase.analytics();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})