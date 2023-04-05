const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://<username>:<password>@database.9wqxuqj.mongodb.net/websiteDB', { 
useNewUrlParser: true, useUnifiedTopology: true });

// Schema for todo
const itemsSchema = new mongoose.Schema({
    name: String,
});

// Model for todo list
const Item = mongoose.model("Item", itemsSchema);

exports.handler = async (event) => {
    let response;
    switch (event.httpMethod) {
        case 'GET':
            response = await getuser();
            break;
        case 'POST':
            response = await saveuser(JSON.parse(event.body));
            break;
        case 'DELETE':
            response = await deleteuser(JSON.parse(event.body));
            break;
        case 'PUT':
            const reqBody = JSON.parse(event.body);
            response = await updateuser(reqBody.old_name,reqBody.new_value);
            break;
        default:
            response = buildresponse(404, '404 Method not found');
    }
    return response;
};

async function updateuser(old_value,new_value){
    try {
        const update=await Item.findOneAndUpdate({name:old_value},{name:new_value});
        const body={
            Operation:"UPDATE",
            Message:"SUCCESS",
            report:{
                old_value:old_value,
                new_value:new_value
            }
        }
        return buildresponse(200,body);
    } catch (e) {
        return buildresponse(402,"error updating values");
    }
}

async function deleteuser(data){
    try {
        /* code */
        const result = await Item.deleteOne({name:data.name});
        const body={
            Operation:"DELETE",
            Message:"SUCCESS",
            data:data
        }
        return buildresponse(200,body)
    } catch (e) {
        return buildresponse(402,e);
    }
    
}

async function saveuser(data){
    try{
        const user = new Item(data);
        const result = await user.save();
        const body={
            Operation:"SAVE",
            Message:"SUCCESS",
            data:data
        }
        return buildresponse(200,body);
    } catch (error){
        console.log(error);
        return buildresponse(402,'Not able to post the elements',error);
    }
}

async function getuser() {
    try {
        const result = await Item.find({});
        const body = {
            result: result
        };
        return buildresponse(200, body);
    } catch (error) {
        return buildresponse(402, 'Not able to find elements', error);
    }
}


async function buildresponse(status, body) {
    return {
        statusCode: status,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}

