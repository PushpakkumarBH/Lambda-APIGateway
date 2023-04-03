const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userPath='/users';
const dynamoDBT='users';

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
            response = await 
updateuser(requestBody.id,requestBody.updateKey,requestBody.updateValue);
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

async function updateuser(id,updateKey,updateValue){
    const params={
        TableName:dynamoDBT,
        Key:{
            'id':id
        },
        updateExpression:'set ${updateKey} = :value',
        ExpressionAttributeValues:{
            ':value': updateValue
        },
        returnValues: 'UPDATED_NEW'
    }
    return await dynamodb.update(params).promise().then(response =>{
        const body = {
            Operation: 'UPDATE',
            Message: 'SUCCESS',
            Item: response
        }
    return buildresponse(200,body);
    }, (error) =>{
        console.log(error);
    })
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
