from server import app
from flask import render_template, jsonify, request, json
from server.models import Task

tasks = []

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/tasks/', methods=['GET'])
def get_all_tasks():
    tasksString = json.dumps([ob.__dict__ for ob in tasks])
    print('TASKS:', tasksString)
    return tasksString


@app.route('/tasks/new', methods=['POST'])
def new_tasks():
    print("got post", request)
    f = Task(request.args.get('name'), request.args.get('text'))
    print("new task object: ", f.__dict__)
    tasks.append(f)
    return jsonify(f.__dict__)


@app.route('/tasks/<string:doneId>/done', methods=['POST'])
def done_tasks(doneId):
    print("got DONE post ", request)
    print("ID:", doneId)
    for task in tasks:
        print("task id:", str(task.id))
        if str(task.id) == doneId:
            task.done = False if task.done else True
            return jsonify(task.__dict__)
    return "Not found"
