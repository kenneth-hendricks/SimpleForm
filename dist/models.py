from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Form(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(500))
    created_date = db.Column(db.DateTime)
    questions = db.relationship('Question', backref='form', lazy='dynamic')
    responses = db.relationship('Response', backref='form', lazy='dynamic')

    def __init__(self, title, description, questions = [], responses = []):
        self.title = title
        self.description = description
        self.questions = questions
        self.responses = responses
        self.created_date = datetime.utcnow()

    def __repr__(self):
        return '<Form %r>' % self.title

    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'created_date': self.created_date,
            'questions': self.serialize_questions,
            'responses': self.serialize_responses
        }

    @property
    def serialize_questions(self):
        return [ question.serialize for question in self.questions]

    @property
    def serialize_responses(self):
        return [ response.serialize for response in self.responses]

class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_date = db.Column(db.DateTime)
    form_id = db.Column(db.Integer, db.ForeignKey('form.id', ondelete='CASCADE'))
    question_answers = db.relationship('QuestionAnswer', backref='form', lazy='dynamic')

    def __init__(self, question_answers = []):
        self.created_date = datetime.utcnow()
        self.question_answers = question_answers

    def __repr__(self):
        return '<Response %r>' % self.id

    @property
    def serialize(self):
        return {
            'id': self.id,
            'created_date': self.created_date,
            'question_answers': self.serialize_question_answers
        }

    @property
    def serialize_question_answers(self):
        return [ question_answers.serialize for question_answers in self.question_answers]

class QuestionAnswer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    answers = db.relationship('Answer', backref='form', lazy='dynamic')
    response_id = db.Column(db.Integer, db.ForeignKey('response.id', ondelete='CASCADE'))
    question_id = db.Column(db.Integer, db.ForeignKey('question.id', ondelete='CASCADE'))

    def __init__(self, answers=[]):
        self.answers = answers

    def __repr__(self):
        return '<Option %r>' % self.text

    @property
    def serialize(self):
        return {
            'id': self.id,
            'question_id': self.question_id,
            'question_title': Question.query.filter_by(id=self.question_id).first().title,
            'answers' : self.serialize_answers
        }

    @property
    def serialize_answers(self):
        return [ answer.serialize for answer in self.answers]

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(100))
    question_answer_id = db.Column(db.Integer, db.ForeignKey('question_answer.id', ondelete='CASCADE'))

    def __init__(self, text):
        self.text = text

    def __repr__(self):
        return '<Option %r>' % self.text

    @property
    def serialize(self):
        return {
            'id': self.id,
            'text': self.text
        }



class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    type = db.Column(db.String(100))
    form_id = db.Column(db.Integer, db.ForeignKey('form.id', ondelete='CASCADE'))
    options = db.relationship('Option', backref='question', lazy='dynamic')
    question_answers = db.relationship('QuestionAnswer', backref='question', lazy='dynamic')

    def __init__(self, title, type, options = [], question_answers = []):
        self.title = title
        self.type = type
        self.options = options
        self.question_answers = question_answers

    def __repr__(self):
        return '<Question %r>' % self.title

    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'type': self.type,
            'options': self.serialize_options
        }

    @property
    def serialize_options(self):
        return [ option.serialize for option in self.options]

class Option(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(100))
    question_id = db.Column(db.Integer, db.ForeignKey('question.id', ondelete='CASCADE'))

    def __init__(self, text):
        self.text = text

    def __repr__(self):
        return '<Option %r>' % self.text

    @property
    def serialize(self):
        return {
            'id': self.id,
            'text': self.text
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)

    def __init__(self, username, email):
        self.username = username
        self.email = email

    def __repr__(self):
        return '<User %r>' % self.username

