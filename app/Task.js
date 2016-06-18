var taskComponent = require('../app/taskComponent.js');
var taskfactory = require('../app/taskfactory.js');

let Task = class Task {
  constructor(done, id, name, text) {
    this.done = done;
    this.id = id;
    this.name = name;
    this.text = text;
  }
  toHTML(callback) {
    return taskComponent.html(this, callback)
  }
  save() {
    let params = {
      'name': this.name,
      'done': this.done,
      'text': this.text
    }
    return taskfactory.jsonRequest('POST', 'tasks/new', params).then(value => {
      this.id = value.id
      return this;
    })
  }
  setDone() {
    this.done = (this.done ? false : true);
    return taskfactory.jsonRequest('POST', 'tasks/' + this.id + '/done').then(value => {
      return value;
    })
  }
}

let getAll = () => {
  let tasks = [];
  return taskfactory.jsonRequest('GET', 'tasks/').then(jsonTaskArray => {
    jsonTaskArray.forEach(j => {
      tasks.push(new Task(j.done, j.id, j.name, j.text))
    })
    return tasks;
  })
}

module.exports = {
  model: Task,
  getAll: getAll
}
