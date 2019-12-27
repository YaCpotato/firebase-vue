<template>
  <div id="app">
    <div class="container is-fluid">
      <div class="control">
        <button type="button ope-button" v-on:click="activeTaskModal()" class="button is-primary is-small modal-button" aria-haspopup="true">タスク作成</button>
      </div>
    </div>

  <div class="container columns">
      <div class="column">
        <draggable tag="ul">
          <div class="card" v-for="(todo,key) in queuedTodos" :key="key">
            <header class="card-header">
            </header>
            <div class="card-content">
              <div class="content">
                {{ todo.name }}
              </div>
            </div>
            <footer class="card-footer">
              <a href="#" class="card-footer-item">Save</a>
              <a href="#" class="card-footer-item">Edit</a>
              <a href="#" class="card-footer-item">Delete</a>
            </footer>
          </div>
        </draggable>
      </div>
      <div class="column">
        <draggable tag="ul">
          <div class="card" v-for="(todo,key) in openedTodos" :key="key">
            <header class="card-header">
            </header>
            <div class="card-content">
              <div class="content">
                {{ todo.name }}
              </div>
            </div>
            <footer class="card-footer">
              <a href="#" class="card-footer-item">Save</a>
              <a href="#" class="card-footer-item">Edit</a>
              <a href="#" class="card-footer-item">Delete</a>
            </footer>
          </div>
        </draggable>
      </div>
      <div class="column">
          <draggable tag="ul">
          <div class="card" v-for="(todo,key) in WiPTodos" :key="key">
            <header class="card-header">
            </header>
            <div class="card-content">
              <div class="content">
                {{ todo.name }}
              </div>
            </div>
            <footer class="card-footer">
              <a href="#" class="card-footer-item">Save</a>
              <a href="#" class="card-footer-item">Edit</a>
              <a href="#" class="card-footer-item">Delete</a>
            </footer>
          </div>
        </draggable>
      </div>
      <div class="column">
          <draggable tag="ul">
          <div class="card" v-for="(todo,key) in doneTodos" :key="key">
            <header class="card-header">
            </header>
            <div class="card-content">
              <div class="content">
                {{ todo.name }}
              </div>
            </div>
            <footer class="card-footer">
              <a href="#" class="card-footer-item">Save</a>
              <a href="#" class="card-footer-item">Edit</a>
              <a href="#" class="card-footer-item">Delete</a>
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
    .column
      .card
        margin: 10px
        .card-content
          width:20%
  .modal
    .button
      width: 5%
      margin: 10px
    .input
      width: 10%
      padding: 5px
      margin: 10px

</style>
