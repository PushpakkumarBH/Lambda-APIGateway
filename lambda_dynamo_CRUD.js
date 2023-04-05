const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userPath='/users';
const dynamoDBT='user';

exports.handler = async (event) => {
    let response;
    console.log(event);
    switch(event.httpMethod){
        case 'GET':
            response= getuser();
            break;
        case 'POST':
            response= await saveuser(JSON.parse(event.body));
            break;
        case 'PUT':
            const requestBody= JSON.parse(event.body);
            response = await updateuser(requestBody.id,requestBody.updateKey,requestBody.updateValue);
            break;
        case 'DELETE':
            response = await deleteuser(JSON.parse(event.body).id);
            break;
        default:
            response=buildresponse(404,'404 method not found');
    }
    return response;
};

async function deleteuser(id){
    const params={
        TableName: dynamoDBT,
        Key:{
            'id':id
        },
        returnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then(response => {
        const body={
            Operation:'DELETE',
            Message:'SUCCESS',
            Item: response
        }
        return buildresponse(200,body);
    },(error) => {
        console.log(error);
    })
}

async function updateuser(id, updateKey, updateValue) {
    const params = {
        TableName: dynamoDBT,
        Key: {
            'id': id
        },
        UpdateExpression: 'set #key = :value',
        ExpressionAttributeNames: {
            '#key': updateKey
        },
        ExpressionAttributeValues: {
            ':value': updateValue
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const response = await dynamodb.update(params).promise();
        const body = {
            Operation: 'UPDATE',
            Message: 'SUCCESS',
            Item: response
        };
        return buildresponse(200, body);
    } catch (error) {
        console.log(error);
        return buildresponse(500, { message: error.message });
    }
}


async function getuser(data){
    const params={
        TableName: dynamoDBT
    }
    const allusers = await dynamodb.scan(params).promise();
    const body = {
        users: allusers
    }
    return buildresponse(200,body);
}

async function saveuser(data){
    const params= {
        TableName: dynamoDBT,
        Item: data
    }
    return await dynamodb.put(params).promise().then(() =>{
        const body = {
            Operation: 'SAVE',
            Message: 'SUCCESS',
            Item: data
        }
    return buildresponse(200,body);
    }, (error) =>{
        console.log(error);
    })
}

function buildresponse(status,body) {
    return {
        statusCode: status,
        headers: {
            'Content-Type': 'application\json'
        },
        body: JSON.stringify(body)
    }
}
