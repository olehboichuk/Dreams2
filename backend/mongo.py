from flask import Flask, jsonify, request, json, redirect
from flask_pymongo import PyMongo
import pymongo
from bson.objectid import ObjectId
from datetime import datetime, timedelta
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required,
                                get_jwt_identity, get_raw_jwt, decode_token, get_current_user)

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'meanloginreg'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/meanloginreg'
app.config['JWT_SECRET_KEY'] = 'secret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=60)

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)
REFS = {'REGISTER': '/users/register',
        'LOGIN': '/users/login',
        'DREAM': '/users/dream-register',
        'PAYMENT': '/users/payment',
        'HOME': '/users/home'}


# class InvalidUsage(Exception):
#     status_code = 400
#
#     def init(self, message, status_code=None, payload=None):
#         Exception.init(self)
#         self.message = message
#         if status_code is not None:
#             self.status_code = status_code
#         self.payload = payload
#
#     def to_dict(self):
#         rv = dict(self.payload or ())
#         rv['message'] = self.message
#         return rv
#
#
# @app.errorhandler(InvalidUsage)
# def handle_invalid_usage(error):
#     response = jsonify(error.to_dict())
#     response.status_code = error.status_code
#     return response


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


def tostring(id_string):
    if id_string[0] == '\"':
        return id_string[1:-1]


@app.route(REFS['REGISTER'], methods=['POST'])
def register():
    users = mongo.db.users
    first_name = request.get_json()['first_name']
    last_name = request.get_json()['last_name']
    email = request.get_json()['email']
    phone_number = request.get_json()['phone_number']
    password = bcrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')
    dream_created = 'false'
    # created = datetime.utcnow()

    response = users.find_one({'email': email})
    if response:
        return jsonify(message="User Already Exist"), 409

    user_id = users.insert({
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'phone_number': phone_number,
        'password': password,
        'dream_created': dream_created
    })
    new_user = users.find_one({'_id': user_id})
    if new_user:
        json_id = JSONEncoder().encode(user_id)
        token_created = datetime.utcnow()
        access_token = create_access_token(identity={
            '_id': json_id,
            'token_created': token_created
        })

        return jsonify({
            'token': access_token,
            'expiresIn': token_created + app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }), 201
    return jsonify(message="Some problems with adding new User"), 409


@app.route(REFS['LOGIN'], methods=['POST'])
def login():
    users = mongo.db.users
    email = request.get_json()['email']
    password = request.get_json()['password']

    response = users.find_one({'email': email})

    if response:
        if bcrypt.check_password_hash(response['password'], password):
            dream_created = response['dream_created']
            json_id = JSONEncoder().encode(response['_id'])
            token_created = datetime.utcnow()
            access_token = create_access_token(identity={
                '_id': json_id,
                'token_created': token_created
            })
            result = jsonify({'token': access_token,
                              'expiresIn': token_created + app.config['JWT_ACCESS_TOKEN_EXPIRES'],
                              'dream_created': dream_created}), 200
            # result = redirect(REFS['DREAM'])
        else:
            result = jsonify({"error": "Invalid username or password"}), 422
    else:
        result = jsonify({"result": "No results found"}), 422
    return result


@app.route(REFS['DREAM'], methods=['POST'])
@jwt_required
def dream_register():
    dreams = mongo.db.dreams
    users = mongo.db.users

    title = request.get_json()['title']
    description = request.get_json()['description']
    price = request.get_json()['price']
    number_of_likes = 0
    is_active = 'true'

    user_id = get_jwt_identity()['_id']
    current_user = users.find_one({'_id': ObjectId(tostring(user_id))})
    user_name = current_user['first_name'] + ' ' + current_user['last_name']

    dream_id = dreams.insert({
        'title': title,
        'description': description,
        'price': price,
        'number_of_likes': number_of_likes,
        'is_active': is_active,
        'author_id': user_id,
        'create_time': datetime.utcnow(),
        'author_name': user_name
    })

    new_dream = dreams.find_one({'_id': dream_id})
    if new_dream:
        users.update({'_id': user_id}, {'dream_created': 'true'})
        return jsonify(message="Dream added successfully"), 201
    return jsonify(message="Some problems with adding new Dream"), 409


@app.route(REFS['HOME'], methods=['POST'])
def get_all_dreams():
    sort_type = request.get_json()['sort_type']
    # page_size = request.get_json()['page_size']
    list_size = request.get_json()['list_size']
    dreams_db = mongo.db.dreams
    sorted_dreams = []

    if sort_type == 'likes':
        print("likes")
        sorted_dreams = dreams_db.find({'is_active': 'true'}).sort('number_of_likes', direction=pymongo.DESCENDING)
        sorted_dreams.limit(list_size)
    elif sort_type == 'create_time':
        print("datetime")
        sorted_dreams = dreams_db.find({'is_active': 'true'}).sort('create_time', direction=pymongo.DESCENDING)
        sorted_dreams.limit(list_size)
    else:
        print("else")
        return jsonify(message="Wrong sorting code"), 422

    dreams_array = []
    for dream in sorted_dreams:
        dream['_id'] = JSONEncoder().encode(dream['_id'])
        dreams_array.append(dream)
    # dreams_array.reverse()
    result = jsonify(dreams=dreams_array), 200
    return result


@app.route(REFS['HOME'], methods=['POST'])
@jwt_required
def dream_like():
    dreams = mongo.db.dreams
    dream_id = request.get_json()['_id']
    action = request.get_json()['action']

    dream = dreams.find_one({'_id': dream_id})
    if action == 'like':
        dreams.update({'_id': dream_id}, {'$inc': {'likes': 1}})
    elif action == 'unlike':
        dreams.update({'_id': dream_id}, {'$dec': {'likes': 1}})
    return jsonify(message="jopa"), 200
    # менять юзеру статус лайка и активность поста 


if __name__ == '__main__':
    app.run(debug=True)
