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
        'HOME': '/users/home',
        'LIKE': '/users/user/like',
        'USER_HOME': '/users/user/home'}


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return tostring(str(o))
        return json.JSONEncoder.default(self, o)


def tostring(id_string):
    if id_string[0] == '\"':
        return id_string[1:-1]
    return id_string


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
        'dream_created': dream_created,
        'liked_dreams': []
    })
    new_user = users.find_one({'_id': user_id})
    if new_user:
        json_id = tostring(JSONEncoder().encode(user_id))
        # print()
        # users.update({'_id': user_id}, {'_id': json_id})
        # print(users.find_one({'_id': json_id}))
        # new_user['_id'] = json_id
        # print(users.find_one({'_id': json_id}))
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
    is_active = 'false'

    user_id = get_jwt_identity()['_id']
    print(user_id)
    current_user = users.find_one({'_id': ObjectId(user_id)})
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
        users.update({'_id': ObjectId(user_id)}, {'dream_created': 'true'})
        print(users.find_one({'_id': ObjectId(user_id)}))
        # dreams.update({'_id': new_dream}, {'_id': tostring(JSONEncoder().encode(new_dream))})
        # print(new_dream['_id'])
        return jsonify(message="Dream added successfully"), 201
    return jsonify(message="Some problems with adding new Dream"), 409


@app.route(REFS['HOME'], methods=['POST'])
def get_all_dreams():
    sort_type = request.get_json()['sort_type']
    list_size = request.get_json()['list_size']
    dreams_db = mongo.db.dreams

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

    result = jsonify(dreams=dreams_array), 200
    return result


@app.route(REFS['USER_HOME'], methods=['POST'])
@jwt_required
def get_all_dreams_logged():
    dreams_db = mongo.db.dreams
    users = mongo.db.users

    sort_type = request.get_json()['sort_type']
    list_size = request.get_json()['list_size']
    user_id = get_jwt_identity()['_id']
    current_user = users.find_one({'_id': ObjectId(user_id)})

    if not current_user:
        return jsonify(message='This user does not exist'), 422

    if sort_type == 'likes':
        print('likes')
        sorted_dreams = dreams_db.find({'is_active': 'true'}).sort('number_of_likes', direction=pymongo.DESCENDING)
        sorted_dreams.limit(list_size)
    elif sort_type == 'create_time':
        print('datetime')
        sorted_dreams = dreams_db.find({'is_active': 'true'}).sort('create_time', direction=pymongo.DESCENDING)
        sorted_dreams.limit(list_size)
    else:
        print('else')
        return jsonify(message='Wrong sorting code'), 422

    try:
        likes_array = current_user['liked_dreams']
    except KeyError:
        likes_array = []

    dreams_array = []
    for dream in sorted_dreams:
        dream['_id'] = JSONEncoder().encode(dream['_id'])
        if dream['_id'] in likes_array:
            dream['_liked'] = 'true'
        else:
            dream['_liked'] = 'false'
        print(dream['_liked'])
        dreams_array.append(dream)
    result = jsonify(dreams=dreams_array), 200
    return result


@app.route(REFS['LIKE'], methods=['POST'])
@jwt_required
def dream_like():
    dreams = mongo.db.dreams
    users = mongo.db.users
    dream_id = request.get_json()['_id']
    action = request.get_json()['action']

    user_id = get_jwt_identity()['_id']
    current_user = users.find_one({'_id': ObjectId(user_id)})
    dream = dreams.find_one({'_id': ObjectId(dream_id)})
    print(dream)
    try:
        likes_array = current_user['liked_dreams']
    except KeyError:
        likes_array = []
    if not dream:
        return jsonify(message='Dream not found'), 404

    if action == 'like':
        if dream_id in likes_array:
            return jsonify(message='This dream is already liked'), 422
        dreams.update({'_id': ObjectId(dream_id)}, {'$inc': {'number_of_likes': 1}})
        user_dream = dreams.find_one({'author_id': ObjectId(user_id)})
        if len(likes_array) == 0 and user_dream['is_active'] != 'true':
            dreams.update({'_id': user_dream['_id']}, {'is_active': 'true'})
            print("second dream update")
            print(dreams.find_one({'_id': user_dream['_id']}))
        likes_array.append(dream_id)
        users.update({'_id': ObjectId(user_id)}, {'liked_dreams': likes_array})

    elif action == 'unlike':
        if dream_id not in likes_array:
            return jsonify(message='This dream has not been liked'), 422
        dreams.update({'_id': ObjectId(dream_id)}, {'$dec': {'number_of_likes': 1}})
        likes_array.remove(dream_id)
        if len(likes_array) == 0:
            dreams.update({'_id': ObjectId(dream_id)}, {'is_active': 'false'})
        users.update({'_id': ObjectId(user_id)}, {'liked_dreams': likes_array})
    else:
        return jsonify(message="Wrong like action"), 422

    return jsonify(message='dream was liked successfully'), 200
    # менять юзеру статус лайка и активность поста 


@app.route('/profile/<profid>', methods=['GET'])
def profile(profid):
    dreams = mongo.db.dreams
    user_id = tostring(profid)
    dream = dreams.find_one({'author_id': user_id})
    if not dream:
        return jsonify("Can't find users dream"), 404
    title = dream['title']
    description = dream['description']
    price = dream['price']
    is_active = dream['is_active']
    number_of_likes = dream['number_of_likes']
    author_name = dream['author_name']
    result = jsonify(profile={
        'title': title,
        'description': description,
        'price': price,
        'is_active': is_active,
        'number_of_likes': number_of_likes,
        'author_name': author_name,
    }), 201
    return result


if __name__ == '__main__':
    app.run(debug=True)
