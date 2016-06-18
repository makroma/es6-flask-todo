(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var taskComponent = require('../app/taskComponent.js');
var taskfactory = require('../app/taskfactory.js');

var Task = function () {
  function Task(done, id, name, text) {
    _classCallCheck(this, Task);

    this.done = done;
    this.id = id;
    this.name = name;
    this.text = text;
  }

  _createClass(Task, [{
    key: 'toHTML',
    value: function toHTML(callback) {
      return taskComponent.html(this, callback);
    }
  }, {
    key: 'save',
    value: function save() {
      var _this = this;

      var params = {
        'name': this.name,
        'done': this.done,
        'text': this.text
      };
      return taskfactory.jsonRequest('POST', 'tasks/new', params).then(function (value) {
        _this.id = value.id;
        return _this;
      });
    }
  }, {
    key: 'setDone',
    value: function setDone() {
      this.done = this.done ? false : true;
      return taskfactory.jsonRequest('POST', 'tasks/' + this.id + '/done').then(function (value) {
        return value;
      });
    }
  }]);

  return Task;
}();

var getAll = function getAll() {
  var tasks = [];
  return taskfactory.jsonRequest('GET', 'tasks/').then(function (jsonTaskArray) {
    jsonTaskArray.forEach(function (j) {
      tasks.push(new Task(j.done, j.id, j.name, j.text));
    });
    return tasks;
  });
};

module.exports = {
  model: Task,
  getAll: getAll
};

},{"../app/taskComponent.js":5,"../app/taskfactory.js":6}],2:[function(require,module,exports){
'use strict';

document.addEventListener('DOMContentLoaded', function () {
  require('../app/maincontroller.js');
});

},{"../app/maincontroller.js":3}],3:[function(require,module,exports){
'use strict';

(function () {
  var Task = require('../app/Task.js');
  var taskfactory = require('../app/taskfactory.js');
  var modaldirective = require('../app/modaldirective.js');
  var taskArea = document.getElementsByClassName('task-components')[0];
  var tasks = [];

  var setTaskDoneCallback = function setTaskDoneCallback(id) {
    tasks.forEach(function (task) {
      if (task.id === id) {
        task.setDone().then(function (task) {
          var card = document.getElementById('card-' + id);
          card.classList.remove("done");
          card.className += task.done ? ' done' : '';
        });
      }
    });
  };

  var setTasksToView = function setTasksToView() {
    return Task.getAll().then(function (tasksArray) {
      tasks = tasksArray;
      tasks.forEach(function (t) {
        taskArea.appendChild(t.toHTML(setTaskDoneCallback));
      });
      return tasks;
    });
  };

  /* RUN APP */
  setTasksToView().then(function (tasks) {
    console.log('Tasks ready to be done');
  });

  modaldirective.setAddNewTaskDialog(function (task) {
    tasks.push(task);
    taskArea.appendChild(task.toHTML(setTaskDoneCallback));
  });
})();

},{"../app/Task.js":1,"../app/modaldirective.js":4,"../app/taskfactory.js":6}],4:[function(require,module,exports){
'use strict';

var taskArea = document.getElementsByClassName('task-components')[0];
var Task = require('../app/Task.js').model;

module.exports = {
  setAddNewTaskDialog: function setAddNewTaskDialog(callback) {
    document.getElementById('add-task-form').addEventListener("submit", function (event) {
      event.preventDefault();
    }, true);

    var dialog = document.querySelector('dialog');
    var showModalButton = document.querySelector('.floating-action');
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    showModalButton.addEventListener('click', function () {
      dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function () {
      dialog.close();
    });
    dialog.querySelector('.add').addEventListener('click', function () {
      var name = document.querySelector('[name="name"]').value;
      var text = document.querySelector('[name="text"]').value;
      new Task(false, null, name, text).save().then(function (task) {
        callback(task);
      });
      dialog.close();
    });
  }
};

},{"../app/Task.js":1}],5:[function(require,module,exports){
'use strict';

module.exports = {

  html: function html(task, callback) {
    var card = '<div class="mdl-card__title">\n                  <h2 class="mdl-card__title-text">' + task.name + '</h2>\n                </div>\n                <div class="mdl-card__supporting-text">\n                  ' + task.text + '\n                </div>\n                <div class="mdl-card__actions mdl-card--border">\n                  <a id="done-' + task.id + '" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent set-done" href="#">Done</a>\n                </div>';

    var div = document.createElement('div');
    div.setAttribute('id', 'card-' + task.id);
    div.setAttribute('class', 'mdl-cell mdl-card mdl-shadow--4dp portfolio-card');
    div.className += task.done ? ' done' : '';
    div.innerHTML = card;

    div.getElementsByClassName('set-done')[0].addEventListener('click', function () {
      var id = this.id.split('done-')[1];
      callback(id);
    });

    return div;
  }
};

},{}],6:[function(require,module,exports){
'use strict';

module.exports = {
  jsonRequest: function jsonRequest(method, url, args) {
    var promise = new Promise(function (resolve, reject) {
      var client = new XMLHttpRequest();
      var uri = url;
      if (args && (method === 'POST' || method === 'PUT')) {
        uri += '?';
        var argcount = 0;
        for (var key in args) {
          if (args.hasOwnProperty(key)) {
            if (argcount++) {
              uri += '&';
            }
            uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
          }
        }
      }
      client.open(method, uri);
      client.send();
      client.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(JSON.parse(this.response));
        } else {
          reject(this.statusText);
        }
      };
    });
    return promise;
  }
};

},{}]},{},[2]);
