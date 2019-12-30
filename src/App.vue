<template>
<div id="app">
  <Header />
    <div class="container">
      <div class="control">
        <button type="button ope-button" v-on:click="activeTaskModal()" class="button is-primary is-medium modal-button" aria-haspopup="true">タスク作成</button>
      </div>
    </div>
    <div class="container columns">
      <div class="column">
        <div class="container container-header has-background-link">
          Queue
        </div>
        <draggable tag="ul">
          <div class="card" v-for="(todo,key) in queuedTodos" :key="key">
            <header class="card-header queue-card">
              <br>
            </header>
            <div class="card-content">
              <div class="content">
                {{ todo.name }}
              </div>
            </div>
            <footer class="card-footer">
              <span class="card-footer-item" v-on:click="deleteTodo(todo,key)"><font-awesome-icon icon="trash-alt" /></span>
              <span class="card-footer-item">Edit</span>
              <span class="card-footer-item" v-on:click="advancePhase(todo,key)"><font-awesome-icon icon="angle-right" /></span>
            </footer>
          </div>
        </draggable>
      </div>
      <div class="column">
        <div class="container container-header has-background-info">
          Open
        </div>
        <draggable tag="ul">
          <div class="card" v-for="(todo,key) in openedTodos" :key="key">
            <header class="card-header open-card">
              <br>
            </header>
            <div class="card-content">
              <div class="content">
                {{ todo.name }}
              </div>
            </div>
            <footer class="card-footer">
              <span class="card-footer-item" v-on:click="backPhase(todo,key)"><font-awesome-icon icon="angle-left" /></span>
              <span class="card-footer-item">Edit</span>
              <span class="card-footer-item" v-on:click="advancePhase(todo,key)"><font-awesome-icon icon="angle-right" /></span>
            </footer>
          </div>
        </draggable>
      </div>
      <div class="column">
        <div class="container container-header has-background-primary">
          WiP
        </div>
          <draggable tag="ul">
          <div class="card" v-for="(todo,key) in WiPTodos" :key="key">
            <header class="card-header wip-card">
              <br>
            </header>
            <div class="card-content">
              <div class="content">
                {{ todo.name }}
              </div>
            </div>
            <footer class="card-footer">
              <span class="card-footer-item" v-on:click="backPhase(todo,key)"><font-awesome-icon icon="angle-left" /></span>
              <span class="card-footer-item">Edit</span>
              <span class="card-footer-item" v-on:click="advancePhase(todo,key)"><font-awesome-icon icon="angle-right" /></span>
            </footer>
          </div>
        </draggable>
      </div>
      <div class="column">
        <div class="container container-header has-background-success">
          Done
        </div>
          <draggable tag="ul">
          <div class="card" v-for="(todo,key) in doneTodos" :key="key">
            <header class="card-header done-card">
              <br>
            </header>
            <div class="card-content">
              <div class="content">
                {{ todo.name }}
              </div>
            </div>
            <footer class="card-footer">
              <span class="card-footer-item" v-on:click="backPhase(todo,key)"><font-awesome-icon icon="angle-left" /></span>
              <span class="card-footer-item">Complete</span>
              <span class="card-footer-item">Edit</span>
              <span class="card-footer-item" v-on:click="advancePhase(todo,key)"><font-awesome-icon icon="angle-right" /></span>
            </footer>
          </div>
        </draggable>
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
</template>

<script>
import firebase from 'firebase'
import 'bulma'
import $ from 'jquery'
import draggable from 'vuedraggable'

export default {
  name: 'App',
  components: {
    draggable
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
      padding:0px;!important
      .container-header
        border: solid 2px #000000
      .card
        margin: 1rem;
        .card-content
          width:20%
        .queue-card
          background-color: hsl(217, 71%, 53%)
        .open-card
          background-color: hsl(204, 86%, 53%)
        .wip-card
          background-color: hsl(171, 100%, 41%)
        .done-card
          background-color: hsl(141, 71%, 48%)

</style>
