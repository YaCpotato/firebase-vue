<template>
<section class="hero is-success is-fullheight">
  <!-- Hero head: will stick at the top -->
  <div class="hero-head">
    <header class="navbar">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item">
            <img src="https://bulma.io/images/bulma-type-white.png" alt="Logo">
          </a>
          <span class="navbar-burger burger" data-target="navbarMenuHeroC">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
        <div id="navbarMenuHeroC" class="navbar-menu">
          <div class="navbar-end">
            <a class="navbar-item is-active">
              Home
            </a>
            <a class="navbar-item">
              Examples
            </a>
            <a class="navbar-item">
              Documentation
            </a>
            <span class="navbar-item">
              <a class="button is-success is-inverted">
                <span class="icon">
                  <i class="fab fa-github"></i>
                </span>
                <span>Download</span>
              </a>
            </span>
          </div>
        </div>
      </div>
    </header>
  </div>

  <!-- Hero content: will be in the middle -->
  <div class="hero-body">
    <div class="container has-text-centered">
      <h1 class="title">
        Project管理
      </h1>
      <nav class="tabs is-boxed is-fullwidth">
      <div class="container">
        <ul>
          <li class="is-active"><a>Zenhub的なやつ</a></li>
          <li><a>Twitterからインポート</a></li>
          <li><a>タスク一括管理</a></li>
          <li><a>スケジュール管理</a></li>
          <li><a>本管理</a></li>
        </ul>
      </div>
    </nav>
      <div id="app">
    <div class="container is-fluid">
      <div class="control">
        <button type="button ope-button" v-on:click="activeTaskModal()" class="button is-primary is-small modal-button" aria-haspopup="true">タスク作成</button>
      </div>
    </div>

  <div class="container columns">
      <div class="column">
        <QueuedLane />
      </div>
      <div class="column">
        <OpenedLane />
      </div>
      <div class="column">
        <WiPLane />
      </div>
      <div class="column">
        <DoneLane />
      </div>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Modal title</p>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <label>Name</label>
        <input class="input is-primary is-small" type="text" v-model="newTodoName">
        <div class="control">
          <label>Phase</label>
          <label for="queue">Queue</label>
          <input type="radio" id="queue" value='q' v-model="newTodoPhase">
          <label for="open">Open</label>
          <input type="radio" id="open" value='o' v-model="newTodoPhase">
          <label for="wip">WiP</label>
          <input type="radio" id="wip" value='w' v-model="newTodoPhase">
          <label for="done">Done</label>
          <input type="radio" id="done" value='d' v-model="newTodoPhase">
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" v-on:click="deactiveTaskModal(1)">Save</button>
        <button class="button" v-on:click="deactiveTaskModal(0)">Cancel</button>
      </footer>
    </div>
  </div>
  </div>
  </div>
    </div>
  </div>

  <!-- Hero footer: will stick at the bottom -->
  <div class="hero-foot">
    
  </div>
</section>
</template>

<script>
import firebase from 'firebase'
import 'bulma'
import $ from 'jquery'
import QueuedLane from './components/QueuedLane'
import OpenedLane from './components/OpenedLane'
import WiPLane from './components/WiPLane'
import DoneLane from './components/DoneLane'

export default {
  name: 'App',
  components: {
    QueuedLane,
    OpenedLane,
    WiPLane,
    DoneLane
  },
  data () {
    return {
      database: null,
      todosRef: null,
      newTodoName: '',
      newTodoPhase:0,
      queuedTodos: [],
      openedTodos: [],
      WiPTodos: [],
      doneTodos: [],
      queuedTodosRef: null,
      openedTodosRef: null,
      WiPTodosRef: null,
      doneTodosRef: null
    }
  },
  created: function() {
    this.database = firebase.database();
    var _this = this;

    this.todosRef = this.database.ref('todos')
    this.queuedTodos = this.database.ref('todos').orderByChild('phase').startAt('q').endAt('q');
    this.queuedTodos.on('value', function(snapshot) {
      _this.queuedTodos = snapshot.val();
    });

    this.openedTodos = this.database.ref('todos').orderByChild('phase').startAt('o').endAt('o');
    this.openedTodos.on('value', function(snapshot) {
      _this.openedTodos = snapshot.val();
    });

    this.WiPTodos = this.database.ref('todos').orderByChild('phase').startAt('w').endAt('w');
    this.WiPTodos.on('value', function(snapshot) {
      _this.WiPTodos = snapshot.val();
    });

    this.doneTodos = this.database.ref('todos').orderByChild('phase').startAt('d').endAt('d');
    this.doneTodos.on('value', function(snapshot) {
      _this.doneTodos = snapshot.val();
    });
  },
  methods: {
    deleteTodo: function(todo,key){
            this.database.ref('todos').child(key).remove();
    },
    activeTaskModal: function(){
      $("div.modal").addClass("is-active");
    },
    deactiveTaskModal: function(mode){
      if(mode != 0){
        if (this.newTodoName === "" || this.newTodoPhase === "" ) { return; }
          this.todosRef.push({
            name: this.newTodoName,
            phase: this.newTodoPhase
          })
          this.newTodoName = "";
          this.newTodoPhase = 'q';
      }
      $("div.modal").removeClass("is-active");
    },
    backPhase: function(todo,key){
      if(todo.phase === 'd'){
        todo.phase = 'w'
      }else if(todo.phase === 'w'){
        todo.phase = 'o'
      }else if(todo.phase === 'o'){
        todo.phase = 'q'
      }else if(todo.phase === 'q'){
        alert('rejected')
      }
      var updates = {};
      updates['/todos/' + key] = todo;
      this.database.ref().update(updates);
    },
    advancePhase: function(todo,key){
      if(todo.phase === 'q'){
        todo.phase = 'o'
      }else if(todo.phase === 'o'){
        todo.phase = 'w'
      }else if(todo.phase === 'w'){
        todo.phase = 'd'
      }else if(todo.phase === 'd'){
        alert('completed')
      }
      var updates = {};
      updates['/todos/' + key] = todo;
      this.database.ref().update(updates);
    },
  }
}
</script>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
  .container
    margin: 10px;
    .column
      border-left: solid 1px #000000
      border-right: solid 1px #000000
      border-collapse: collapse;
      .card
        margin: 10px;
        .card-content
          width:20%

</style>
