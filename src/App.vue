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
        <li v-for="(todo,key) in queuedTodos" :key="key">{{ todo.name }}</li>
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
          {{ newTodoPhase }}
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
      doneTodos: []
    }
  },
  created: function() {
    this.database = firebase.database();
    this.todosRef = this.database.ref('todos');
    var _this = this;
    this.todosRef.on('value', function(snapshot) {
      _this.queuedTodos = snapshot.val();
    });
  },
  methods: {
    deleteTodo: function (key) {
      this.database.ref('queuedTodos').child(key).remove();
    },
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
  .modal
    .button
      width: 5%
      margin: 10px
    .input
      width: 10%
      padding: 5px
      margin: 10px

</style>
