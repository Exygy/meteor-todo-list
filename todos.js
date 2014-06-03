// Collection to keep the todos
Todos = new Meteor.Collection('todos');

// JS code for the server
if (Meteor.isServer) {
  //Publish and subscribe setting
  // Meteor.publish('todos', function() {
  //   return Todos.find();
  // });

  //Defines functions that can be invoked over the network by clients.
  Meteor.methods({
    addTodo: function(title) {
      Todos.insert({
        title: title, completed: false
      });
    },
    updateTodo: function(id, completed) {
      Todos.update(id, {
        $set: {
          completed: completed
        }
      });
    },
    clearCompleted: function() {
      Todos.remove({
        completed: true
      });
    }
  });
}

// JS code for the client (browser)
if (Meteor.isClient) {

  // subscribe
  // Meteor.subscribe('todos');

  Template.todo_input.events({
    'submit form': function(event, template) {
      event.preventDefault();
      var input = template.find('.todo-add');
      if (!input.value) return false; 
      Meteor.call('addTodo', input.value)
      input.value = '';
    },
    'click .clear': function() {
      console.log("Deleting " + Todos.find({completed: true}).count() + " items.");
      // remove all completed items
      Meteor.call('clearCompleted');
    }
  });


  Template.todo_list.helpers({
    // Get all the Todos
    todos: function() {
      return Todos.find();      
    },
    todosCount: function() {
      return Todos.find({completed: false}).count();
    },
    todosPlural: function() {
      return Todos.find({completed: false}).count() == 1 ? '' : 's';
    },
    todoAttributes: function() {
      return this.completed ? {checked: true} : {};
    }
  });

  Template.todo_list.events({
    // toggle completion when clicking on a Todo 'X'
    'click .todo-done': function() {
      Meteor.call('updateTodo', this._id, !this.completed)
    }
  });

}
