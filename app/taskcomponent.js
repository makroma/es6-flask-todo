module.exports = {

  html: function(task, callback) {
    let card = `<div class="mdl-card__title">
                  <h2 class="mdl-card__title-text">${task.name}</h2>
                </div>
                <div class="mdl-card__supporting-text">
                  ${task.text}
                </div>
                <div class="mdl-card__actions mdl-card--border">
                  <a id="done-${task.id}" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent set-done" href="#">Done</a>
                </div>`

    var div = document.createElement('div');
    div.setAttribute('id', 'card-' + task.id);
    div.setAttribute('class', 'mdl-cell mdl-card mdl-shadow--4dp portfolio-card')
    div.className += (task.done ? ' done' : '');
    div.innerHTML = card;

    div.getElementsByClassName('set-done')[0].addEventListener('click', function() {
      let id = this.id.split('done-')[1];
      callback(id)
    });

    return div;
  }
}
