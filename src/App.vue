<template>
  <div id="app">
    <div class="container is-fluid">
      <div class="control">
        <button type="button ope-button" v-on:click="activeTaskModal()" class="button is-primary is-small modal-button" aria-haspopup="true">タスク作成</button>
      </div>
    </div>

  <div class="container">
    <ul>
      <draggable tag="ul">
        <div class="card" v-for="(todo,key) in queuedTodos" :key="key">
          <header class="card-header">
            <p class="card-header-title">
              {{ todo.name }}
            </p>
            <a href="#" class="card-header-icon" aria-label="more options">
              <span class="icon">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </a>
          </header>
          <div class="card-content">
            <div class="content">
              内容
            </div>
          </div>
          <footer class="card-footer">
            <a href="#" class="card-footer-item">Save</a>
            <a href="#" class="card-footer-item">Edit</a>
            <a href="#" class="card-footer-item">Delete</a>
          </footer>
        </div>
      </draggable>
    </ul>
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
          <div class="select is-multiple">
            <select multiple size="4" name="newTodoPhase">
              <option value=0>Queued</option>
              <option value=1>Open</option>
              <option value=2>WiP</option>
              <option value=3>Finish</option>
            </select>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" v-on:click="deactiveTaskModal(1)">Save</button>
        <button class="button" v-on:click="deactiveTaskModal(0)">Cancel</button>
      </footer>
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

    this.queuedTodosRef = this.database.ref('todos')
    this.queuedTodosRef.on('value', function(snapshot) {
      _this.queuedTodos = snapshot.val();
    }).orderByChild('phase').startAt(0).endAt(0);

    this.openedTodosRef = this.database.ref('todos').orderByChild('phase').startAt(1).endAt(1);
    this.openedTodosRef.on('value', function(snapshot) {
      _this.openedTodos = snapshot.val();
    });

    this.WiPTodosRef = this.database.ref('todos').orderByChild('phase').startAt(2).endAt(2);
    this.WiPTodosRef.on('value', function(snapshot) {
      _this.WiPTodos = snapshot.val();
    });

    this.doneTodosRef = this.database.ref('todos').orderByChild('phase').startAt(2).endAt(2);
    this.doneTodosRef.on('value', function(snapshot) {
      _this.doneTodos = snapshot.val();
    });
  },
  methods: {
    activeTaskModal: function(){
      $("div.modal").addClass("is-active");
    },
    deactiveTaskModal: function(mode){
      if(mode === 0){
        $("div.modal").removeClass("is-active");
      }else{
        if (this.newTodoName == "") { return; }
          this.queuedTodosRef.push({
            name: this.newTodoName,
            phase: this.newTodoPhase
          })
          this.newTodoName = "";
        $("div.modal").removeClass("is-active");
      }
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
    .card
      width:20%
      border-color: black
  .modal
    .button
      width: 5%
      margin: 10px
    .input
      width: 10%
      padding: 5px
      margin: 10px

</style>
