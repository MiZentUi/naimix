import flask, json

app = flask.Flask("HelpResource")

@app.route("/")
def index():
    return flask.render_template("index.html")

@app.route("/get_tt")
def send_token():
    responce = app.response_class(response=f'{{"table": \"{json.loads(open("config.json", "r").read())["table_token"]}\"}}', status=200, mimetype="application/json")
    responce.headers['Access-Control-Allow-Origin'] = '*'
    return responce

if __name__ == "__main__":
    app.run(debug=True)