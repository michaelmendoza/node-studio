
from flask import Flask, render_template, jsonify
app = Flask(__name__)

data = [
  {'id': 0, 'name':'test0'},
  {'id': 1, 'name':'test1'}
]

@app.route("/")
def index():
  return render_template('index.html')

@app.route("/api", methods=["GET"])
def get_api():
  return jsonify({"api":data})

if __name__ == '__main__':
  app.run(debug=True)
