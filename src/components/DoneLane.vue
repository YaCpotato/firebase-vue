<template>
    <div class="container">
        <draggable tag="ul">
            <div class="card" v-for="(todo,key) in doneTodos" :key="key">
                <div class="card-content">
                    <div class="content">
                        {{ todo.name }}
                    </div>
                </div>
                <footer class="card-footer">
                    <span class="card-footer-item" v-on:click="backPhase(todo,key)"><font-awesome-icon icon="angle-left" /></span>
                    <span class="card-footer-item">Delete</span>
                    <span class="card-footer-item">Edit</span>
                    <span class="card-footer-item" v-on:click="completeToDo(todo,key)"><font-awesome-icon icon="angle-right" /></span>
                </footer>
            </div>
        </draggable>
    </div>
</template>
<script>
import draggable from 'vuedraggable'

export default{
    components: {
        draggable
    },
    props:{
        doneTodos:{
            name:String,
            phase:String
        }
    },
    methods:{
        deleteTodo: function(todo,key){
            this.database.ref('todos').child(key).remove();
        },
        backPhase: function(todo,key){
            todo.phase = 'o'
            var updates = {};
            updates['/todos/' + key] = todo;
            this.database.ref().update(updates);
        },
        advancePhase: function(todo,key){
            todo.phase === 'd'
            var updates = {};
            updates['/todos/' + key] = todo;
            this.database.ref().update(updates);
        },
        completeToDo: function(){
            alert("completed")
        }
    }
}
</script>
<style>

</style>