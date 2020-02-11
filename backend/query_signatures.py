# HEADERS
# Content-Type | application/json
register_request = {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone_number": "string",
    "password": "string",     # encoded
    "wish_created": "string"  # 'true' or 'false' - tells if the dream-creation part was completed
}

register_response = {
    409: {"message": "User already exist"},
    422: {"message": "Some problems with adding new User"},
    201: {
        "token": "тут jwt-токен",
        "expiresIn": "тут термін придатності токена"
    }
}


# HEADERS
# Content-Type | application/json
# Authorization | Bearer $access-token$ - jwt-token from register-response
dream_register_request = {
    "title": "string",
    "description": "string",
    "price": 0000  # integer
}

dream_register_response = {
    201: {"message": "Dream added successfully"},
    409: {"message": "Some problems with adding new Dream"}
}


# HEADERS
# Content-Type | application/json
login_request = {
    "email": "string",
    "password": "string"  # encoded
}

login_response = {
    422: {
        "error": "Invalid username or password",   # or
        "result": "No results found"
    },
    200: {
        "token": "тут jwt-токен",
        "expiresIn": "тут термін придатності токена",
        "dream_created": "тут термін придатності токена"
    }
}


# HEADERS
# Content-Type | application/json
get_all_dreams_request = {
    "sort_type": "string",   # "likes" OR "create_time"
    "list_size": "integer"   # amount of all dreams to display
}

get_all_dreams_response = {
    422: {"message": "Wrong sorting code"},
    200: {"dreams": "[dreams array]"}   # all info about active dreams, including if each was liked by current user
}


# HEADERS
# Content-Type | application/json
# Authorization | Bearer $access-token$ - jwt-token from register-response
get_all_dreams_logged_request = {
    "sort_type": "string",  # "likes" OR "create_time" OR "my_likes
    "list_size": "integer"  # amount of all dreams to display
}

get_all_dreams_logged_response = {
    422: {"message": "Wrong sorting code"},
    200: {"dreams": "[dreams array]"}   # all info about active dreams, including if each was liked by current user
}


# HEADERS
# Content-Type | application/json
# Authorization | Bearer $access-token$ - jwt-token from register-response
dream_like_request = {
    "_id": "string",      # id of dream
    "action": "string"    # "like" OR "unlike"
}

dream_like_response = {
    404: {
        "message": {
            "User not found",   # or
            "Dream not found"
        }
    },
    422: {
        "message": {
            "User may not like his own dream",   # or
            "Wrong like action",                 # or
            "This dream is already liked",       # or
            "This dream has not been liked yet"
        }
    },
    200: {"message": "Dream is liked"}
}

send_email_reset_password = {
    "email": "email",

    404: {
        "message":{
        "There is no such email"
        }
    },
    405: {
        "message":{
        "Something go wrong"
        }
    },

    201: {
        "message":{
            "Success check your email for a link to reset your password."
        }
    }

}

pwreset_post = {
    "new_password":"new_password",

    422 : {
        "message":{
            "Link for password reset is not avaliable anymore"
        }
    },
    200:{
        "user_id":{
            "user_id"
        }
    }
}
