const AWS = require('aws-sdk');
const e = require('express');
//This library can help us to create unique ids 
const { v4: uuidv4 } = require('uuid');


AWS.config.update({
    //Some Config files for AWS
    region: "eu-central-1",
    accessKeyId:'AKIA5DFICTNZLGZHHU5D:P',
    secretAccessKey: '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:P',
    endpoint: "https://dynamodb.eu-central-1.amazonaws.com"
  });
  
  let docClient = new AWS.DynamoDB.DocumentClient();
  //AWS Table Name
  var table = 'products';
  
    exports.add = async (req,res) => {
        //Getting data from postman body
        var productName  = req.body.productName;
        var isDiscount = req.body.isDiscount;
        var stock = req.body.stock;
        var categoryName = req.body.categoryName;

        var params = {
            //Connecting the table
            TableName:table,
            //The product schema
            Item:{
                'productId':uuidv4(),
                'stock': stock,
                'productName': productName,
                'isDiscount': isDiscount,
                Category:{
                    'categoryId': uuidv4(),
                    'categoryName': categoryName,
                }

            }
        };
        docClient.put(params, function(err, data){
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                res.send({status:false,message:' Error'})
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                res.send({status:true,message:'Item successfully added'})
            }
        });
    }
    exports.fetchAll = (req,res) =>{
        var params = {
            TableName:table,
            //Select all the items
            Select: "ALL_ATTRIBUTES"
        };
    
        docClient.scan(params, function(err,data){
            if(err){
                console.error("error")
            }else{
                console.log("getItem success", JSON.stringify(data,null,2));
                res.send({status:true,message:data})
            }
        });
    }


    exports.fetch = async (req,res) => {
        var productId  = req.params.id;
    
        var params = {
            TableName:table,
            Key:{
                //For fetching only one data we need unique productId
                "productId": productId,
            }
        };
        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                res.send({status:true,message:data})
            }
        });
      }

    exports.check = async (req,res) =>{
        var paramss = {
            TableName:table,
            //Checking the discount status
            FilterExpression: "isDiscount = :status",
            ExpressionAttributeValues: {
                //The status is true so it will show only discounted items
                ":status": 'true',
            }
        };
        docClient.scan(paramss, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Query succeeded.");
                res.send({status:true,message:data})
            }
        });
    }
    exports.delete = async (req,res) =>{
        var id  = req.params.id;
  
        var params = {
            TableName:table,
            Key:{
                "productId": id,
            },
            //In here our delete condition have to be false otherwise is not gonna delete the item
            ConditionExpression: "isDiscount = :status",
            ExpressionAttributeValues: {
                ":status": "false",
            }
        };
        
        console.log("Attempting a conditional delete...");
        docClient.delete(params, function(err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                res.send({status:false,message:'There is a problem...You tried to delete undiscount product'})
            } else {
                console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
                res.send({status:true,message:data})
            }
        });
    }
    exports.update = async (req,res) => {
        var productId = req.body.productId;
        var productName  = req.body.productName;
        var isDiscount = req.body.isDiscount;
        var stock = req.body.stock;
    
        var params = {
            TableName:table,
            Key:{
                "productId": productId
            },
            //Updating the item values by the parameters
            UpdateExpression: "set productName = :r, isDiscount=:p, stock=:f",
            ExpressionAttributeValues:{
                ":r": productName,
                ":p": isDiscount,
                ":f": stock
            },
            ReturnValues:"UPDATED_NEW"
        };
        console.log("Updating the item...");
        docClient.update(params, function(err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                res.send({status:false,message:'sorun var'})
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                res.send({status:true,message:data})
            }
        });
      }
