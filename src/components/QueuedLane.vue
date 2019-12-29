<template>
    <div class="container">
        <div class="card" v-for="(todo,key) in queuedTodos" :key="key">
            <div class="card-content">
                <div class="content">
                    {{ todo.name }}
                </div>
            </div>
            <footer class="card-footer">
                <span class="card-footer-item" v-on:click="deleteTodo(todo,key)"><font-awesome-icon icon="coffee" /></span>
                <span class="card-footer-item">Delete</span>
                <span class="card-footer-item">Edit</span>
                <span class="card-footer-item" v-on:click="advancePhase(todo,key)"><font-awesome-icon icon="angle-right" /></span>
            </footer>
        </div>
    </div>
</template>
<script>
export default{
    props:{
        queuedTodos:{
            name:String,
            phase:String
        }
    },
    methods:{
        deleteTodo: function(todo,key){
            this.database.ref('todos').child(key).remove();
        },
        advancePhase: function(todo,key){
        todo.phase === 'o'
        var updates = {};
        updates['/todos/' + key] = todo;
        this.database.ref().update(updates);
        },
    }
}
</script>
<style>

</style>