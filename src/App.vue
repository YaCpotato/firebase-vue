<template>
  <div id="app">
    <div class="container is-fluid">
      <div class="control">
        <input class="input is-primary" type="text" v-model="newTodoName">
        <button type="submit" v-on:click="createTodo()" class="button is-primary">タスク作成</button>
      </div>
    </div>

    <div class="table-container">
      <table class="table is-striped">
        <thead>
          <th></th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="(todo,key) in todos" :key="key">
            <td> {{ todo.name }} </td>
            <td> <button type="submit" v-on:click="deleteTodo(key)">削除</button> </td>
          </tr>
        </tbody>
      </table>
  </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import 'bulma'

export default {
  name: 'App',
  data () {
    return {
      database: null,
      todosRef: null,
      newTodoName: '',
      todos: []
    }
  },
  created: function() {
    this.database = firebase.database();
    this.todosRef = this.database.ref('todos');

    var _this = this;
    this.todosRef.on('value', function(snapshot) {
      _this.todos = snapshot.val(); // データに変化が起きたときに再取得する
    });
  },
  
  methods: {
    createTodo: function() {
      if (this.newTodoName == "") { return; }
      this.todosRef.push({
        name: this.newTodoName,
        isComplete: false,
      })
      this.newTodoName = "";
    },
    deleteTodo: function (key) {
      this.database.ref('todos').child(key).remove();
    },
  },
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
</style>
