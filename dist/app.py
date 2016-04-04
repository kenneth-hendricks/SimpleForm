from flask import Flask, render_template, request, send_file, jsonify
from models import db, Form, User, Option, Question, Response, QuestionAnswer, Answer
import os

app = Flask(__name__)
db.init_app(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']

@app.route('/')
def index():
    return send_file("templates/index.html")

@app.route('/forms', methods=['GET'])
def forms():
    forms = Form.query.all()
    return jsonify(forms=[f.serialize for f in forms])

@app.route('/response/<int:response_id>', methods=['GET'])
def response(response_id):
    response = Response.query.filter_by(id=response_id).first()
    if response:
        return jsonify(response.serialize)
    return "response not found"

@app.route('/form/<int:form_id>', methods=['GET'])
def form(form_id):
    form = Form.query.filter_by(id=form_id).first()
    if form:
        return jsonify(form.serialize)
    return "form not found"

@app.route('/delete_form/<int:form_id>', methods=['POST'])
def delete_form(form_id):
    Form.query.filter_by(id=form_id).delete()
    db.session.commit()
    return "success"

@app.route('/submit_response', methods=['POST'])
def submit_response():
    responseData = request.get_json()
    question_answers = []
    for answerData in responseData['answers']:
        answers = []
        for answerText in answerData['textArray']:
            if answerText != "":
                answer = Answer(answerText)
                db.session.add(answer)
                answers.append(answer)

        question_answer = QuestionAnswer(answers)
        db.session.add(question_answer)
        question_answers.append(question_answer)
        Question.query.filter_by(id=answerData['questionId']).first().question_answers.append(question_answer)

    response = Response(question_answers)
    db.session.add(response)
    Form.query.filter_by(id=responseData['formId']).first().responses.append(response)
    db.session.commit()

    return 'success'

@app.route('/submit_form', methods=['POST'])
def submit_form():
    formData = request.get_json()
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
    db.session.commit()
    return 'success'

if __name__ == '__main__':
    app.run(debug=True)