from dotenv import load_dotenv

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

load_dotenv()

from agent.agent import query
from layout.query import find_layouts

app = Flask(__name__)
socketio = SocketIO(app)


@app.route("/")
def projects():
    return render_template("project.html", title="Project")


@socketio.on("message")
def handle_json(json):
    def callback(msg, event="info"):
        emit(event, msg)
        print(msg)

    address = json["address"]
    callback("asking agent to find local building codes")
    build_code = query(address)
    callback(f"agent found: {str(build_code)}")
    for layout in find_layouts(address, build_code, callback):
        callback(layout, event="layout")


if __name__ == "__main__":
    socketio.run(app)
