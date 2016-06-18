(function() {
  var Task = require('../app/Task.js')
  var taskfactory = require('../app/taskfactory.js');
  var modaldirective = require('../app/modaldirective.js');
  var taskArea = document.getElementsByClassName('task-components')[0]
  var tasks = []

  var setTaskDoneCallback = (id) => {
    tasks.forEach(task => {
      if (task.id === id) {
        task.setDone().then(task => {
          var card = document.getElementById('card-' + id)
          card.classList.remove("done");
          card.className += (task.done ? ' done' : '');
        })
      }
    })
  }

  var setTasksToView = () => {
    return Task.getAll().then(tasksArray => {
      tasks = tasksArray;
      tasks.forEach(t => {
        taskArea.appendChild(t.toHTML(setTaskDoneCallback))
      })
      return tasks;
    })
  }

  /* RUN APP */
  setTasksToView().then(tasks => {
    console.log('Tasks ready to be done');
  })

  modaldirective.setAddNewTaskDialog(function(task) {
    tasks.push(task);
    taskArea.appendChild(task.toHTML(setTaskDoneCallback));
  });
})()
