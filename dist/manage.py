from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from models import db, Form, User, Option, Question, Response, QuestionAnswer, Answer
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://b3b69105f63173:165a3b64@us-cdbr-iron-east-03.cleardb.net/heroku_53706f7cc06df57'
db.init_app(app)

migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)


if __name__ == '__main__':
    manager.run()