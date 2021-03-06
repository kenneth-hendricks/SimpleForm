from flask import Flask, render_template, request, send_file, jsonify, session
import flask.ext.login as flask_login
from models import db, Form, User as User, Option, Question, Response, QuestionAnswer, Answer
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.config.update(SEND_FILE_MAX_AGE_DEFAULT=0)
db.init_app(app)
login_manager = flask_login.LoginManager()
login_manager.init_app(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.secret_key = "super secret key"

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

@app.route('/')
def index():
    return send_file("templates/index.html")

@app.route('/current_user', methods=['GET'])
def current_user():
    session_user = flask_login.current_user
    if session_user.is_authenticated:
        user = User.query.get(session_user.get_id())
        return jsonify(userData={'username': user.username, 'user_id': user.id})
    else:
        return "not logged in"

@app.route('/logout', methods=['POST'])
def logout():
    print session
    flask_login.logout_user()
    print session
    return "success"
    


@app.route('/login', methods=['POST'])
def login():
    userData = request.get_json()
    user = User.query.filter_by(username = userData['username']).first()
    if user and check_password_hash(user.password, userData['password']):
        db.session.add(user)
        db.session.commit()
        flask_login.login_user(user) 
        print session

        return jsonify(userData={'username': user.username, 'user_id': user.id})
    else:
        return "failure"

@app.route('/register_user', methods=['POST'])
def register_user():
    userData = request.get_json()

    if User.query.filter_by(username = userData['username']).first():
        return "username taken"
    else:
        user = User(userData['username'], generate_password_hash(userData['password']))
        db.session.add(user)
        db.session.commit()
        return "success"

@app.route('/check_username', methods=['POST'])
def check_username():
    userData = request.get_json()
    if User.query.filter_by(username = userData['username']).first():
        return "used"
    else:
        return "unused"


@app.route('/recent_forms', methods=['GET'])
@flask_login.login_required
def recent_forms():
    user_id = flask_login.current_user.get_id()
    recentForms = Form.query.filter_by(user_id=user_id).order_by(Form.created_date.desc()).limit(5).all()
    return jsonify(forms=[f.serialize_with_responses for f in recentForms])

@app.route('/recent_responses', methods=['GET'])
@flask_login.login_required
def recent_responses():
    user_id = flask_login.current_user.get_id()
    recentResponses = Response.query.filter(Response.form.has(user_id=user_id)).order_by(Response.created_date.desc()).limit(5).all()
    return jsonify(responses=[r.serialize for r in recentResponses])


@app.route('/forms/<int:user_id>', methods=['GET'])
def forms(user_id):
    forms = Form.query.filter_by(user_id=user_id).order_by(Form.created_date.desc()).all()
    return jsonify(forms=[f.serialize_with_responses for f in forms])

@app.route('/response/<int:response_id>', methods=['GET'])
def response(response_id):
    response = Response.query.filter_by(id=response_id).first()
    if response:
        return jsonify(response.serialize)
    return "response not found"

@app.route('/get_form/<int:form_id>', methods=['GET'])
def get_form(form_id):
    form = Form.query.filter_by(id=form_id).first()
    if form:
        return jsonify(form=form.serialize)
    return "form not found"

@app.route('/delete_form/<int:form_id>', methods=['POST'])
def delete_form(form_id):
    Form.query.filter_by(id=form_id).delete()
    db.session.commit()
    return "success"

@app.route('/submit_response', methods=['POST'])
def submit_response():
    responseData = request.get_json()
    print responseData
    question_answers = []
    for qaData in responseData['question_answers']:
        answers = []
        for answerData in qaData['answers']:
            if answerData != "":
                answer = Answer(answerData)
                db.session.add(answer)
                answers.append(answer)

        question_answer = QuestionAnswer(answers)
        db.session.add(question_answer)
        question_answers.append(question_answer)
        Question.query.filter_by(id=qaData['questionId']).first().question_answers.append(question_answer)

    response = Response(question_answers)
    db.session.add(response)
    Form.query.filter_by(id=responseData['formId']).first().responses.append(response)
    db.session.commit()

    return 'success'

@app.route('/submit_form', methods=['POST'])
def submit_form():
    formData = request.get_json()
    user = User.query.get(formData['user_id'])
    questions = []
    for questionData in formData['questions']:
        options = []
        for optionData in questionData['options']:
            option = Option(optionData)
            db.session.add(option)
            options.append(option)
        question = Question(questionData['title'], questionData['type'], options)
        db.session.add(question)
        questions.append(question)    
    form = Form(formData['title'], formData['description'], questions)
    db.session.add(form)
    user.forms.append(form)
    db.session.commit()
    return 'success'

if __name__ == '__main__':
    app.run(debug=True)