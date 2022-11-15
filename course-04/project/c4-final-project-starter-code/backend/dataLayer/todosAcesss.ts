import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../src/models/TodoItem'
import { TodoUpdate } from '../src/models/TodoUpdate'
import { createLogger } from '../src/utils/logger'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })


const logger = createLogger('TodosAccess')

export class TodosAccess{
    constructor (
        private readonly docClient:DocumentClient =  createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly indexTable = process.env.TODOS_CREATED_AT_INDEX) {

    }
    
    async getTodosForUser(userId: string): Promise<TodoItem []>{

        // console.log("Getting all todo items for user")
        logger.info("Reading all todos for the user", userId)
        const getTodoForUserQuery = {
            TableName: this.todosTable,
            //IndexName: this.indexTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }

        const resultSet = await this.docClient.query(getTodoForUserQuery).promise()
        const items = resultSet.Items 
    
        // if(resultSet.Count !== 0 ){
        //     return resultSet.Items as TodoItem[]
        // }
            
        return items as TodoItem[]
    }
    
    async createAttachmentPresignedUrl(todoItem:TodoItem){
        
        logger.info("Creating attachmentUrl for todoId ", todoItem.todoId)

        const dbQuery = {
            TableName: this.todosTable,
            Key:{
                todoId: todoItem.todoId,
                userId: todoItem.userId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': todoItem.attachmentUrl
            }
        }

        logger.info("Todo attachmentUrl has been updated")
        await this.docClient.update(dbQuery).promise()
    }

    async updateTodo(todoUpdate: TodoUpdate, todoId: string, userId: string) {

        logger.info("Updating a todo Item for todoId", todoId)

        const updateTodoQuery = {
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            // UpdateExpression: "set name = :name, dueDate = :dueDate, done = :done",
            // Invalid UpdateExpression: Attribute name is a reserved keyword; reserved keyword: name/
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {
                "#a": "name",
                "#b": "dueDate",
                "#c": "done"
            },
            ExpressionAttributeValues:{
                ":a": todoUpdate.name,
                ":b" : todoUpdate.dueDate,
                ":c" : todoUpdate.done
            },
            ReturnValues: "ALL_NEW"
        }
        
        // const resultSet = 
        await this.docClient.update(updateTodoQuery).promise()
        logger.info("Todo Item has been updated")

        // return resultSet.Attributes as TodoUpdate;
    }
    
    async createTodo(todoItem: TodoItem) :Promise<TodoItem>{

        logger.info("Creating a todo Item")

        const createTodoQuery = {
            TableName: this.todosTable,
            Item: todoItem
        }

        await this.docClient.put(createTodoQuery).promise()
    
        logger.info("Todo item has been created")
        return todoItem
    }
    
    async getTodoById(todoId:string) :Promise<TodoItem>{ 

        logger.info("Getting a todo Item by todoId")

        const getTodoIdQuery = {
            TableName: this.todosTable,
            IndexName: this.indexTable,
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues:{
                ':todoId':todoId
            }
        }
    
        const resultSet = await this.docClient.query(getTodoIdQuery).promise()

        // if (resultSet.Count !== 0)
            // return resultSet.Items[0] as TodoItem
        return resultSet.Items[0] as TodoItem
    }
    
    async deleteTodo(userId: string, todoId: string) {

        logger.info("Delete a Todo Item for todoId", todoId)

        const deleteTodoQuery = {
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        }
        await this.docClient.delete(deleteTodoQuery).promise()
        logger.info("Todo item with id of ", todoId, " has been deleted")
    }
}

function createDynamoDBClient() {

    if (process.env.IS_OFFLINE) {

      console.log('Creating a local DynamoDB instance')
    
      return new XAWS.DynamoDB.DocumentClient({
    //   return new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }

    return new XAWS.DynamoDB.DocumentClient()
    // return new AWS.DynamoDB.DocumentClient()
}

const mybucket = process.env.ATTACHMENT_S3_BUCKET
// const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export function getUploadUrl(todoId: string){
  return s3.getSignedUrl('putObject', {
    Bucket: mybucket,
    Key: todoId,
    Expires: 300
  })
}