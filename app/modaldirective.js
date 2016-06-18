var taskArea = document.getElementsByClassName('task-components')[0]
var Task = require('../app/Task.js').model

module.exports = {
  setAddNewTaskDialog: function(callback) {
    document.getElementById('add-task-form').addEventListener("submit", function(event) {
      event.preventDefault();
    }, true);

    var dialog = document.querySelector('dialog');
    var showModalButton = document.querySelector('.floating-action');
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    showModalButton.addEventListener('click', function() {
      dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });
    dialog.querySelector('.add').addEventListener('click', function() {
      let name = document.querySelector('[name="name"]').value
      let text = document.querySelector('[name="text"]').value
      new Task(false, null, name, text).save().then(task => {
        callback(task)
      })
      dialog.close();
    });
  }
}
