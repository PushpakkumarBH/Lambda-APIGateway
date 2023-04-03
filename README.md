# Lambda-APIGateway
Integrated Serverless Nodejs api's using AWS Lambda and API Gateway.

Used Postman to check results:
## for 'GET' request
'''
just put url and send for 'GET' request
'''

## for 'POST' request
'''jsx
{
    "name":"Pushpakkumar",
    "username":"pushpak",
    "email":"pushpak@gmail.com",
    "phone":999999999,
    "id":2
}
'''

## for 'PUT' request
'''jsx
{
    "id": 2,
    "updateKey": "name",
    "updateValue": "pushpakkumar"
}
'''

## for 'DELETE' request
'''jsx
{
    "id":2
}
'''

# Try these functions out in this url @

'''jsx
https://odthc2ri54.execute-api.us-east-1.amazonaws.com/dev/users
'''
