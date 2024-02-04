from dotenv import load_dotenv

from flask import Flask, render_template
from flask_socketio import SocketIO

load_dotenv()

from agent.agent import query

app = Flask(__name__)
socketio = SocketIO(app)


@app.route("/")
def projects():
    return render_template("project.html", title="Project")


@socketio.on("message")
def handle_json(json):
    response = query(json['address'])
    print(str(response))


if __name__ == "__main__":
    socketio.run(app)
