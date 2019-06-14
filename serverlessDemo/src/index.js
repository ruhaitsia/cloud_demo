console.log('function starts');

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = function(event, context, callback){
    console.log('processing event: %j', event);
    console.log('processing event category: %j', event.query.category);
    
    //get the input from api gateway
    let category = event.query.category? event.query.category : null;
    
    
    if(!category){
        let error = {
            code: "ParameterError",
            message: "Query parameter 'category' can't be null! "
        };
        context.done(JSON.stringify(error));
    }
    
    let queryParams = {
        TableName : "SearchTrends",
        KeyConditionExpression: "#ctgy = :categoryName",
        ExpressionAttributeNames:{
            "#ctgy": "category"
        },
        ExpressionAttributeValues: {
            ":categoryName": category
        }
    };

    //In dynamoDB query the data base on user input
    docClient.query(queryParams, function(err,data){
        if(err){
            callback(err, null);
        }else{
            callback(null,data);
        }
    });
}
