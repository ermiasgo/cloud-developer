import * as AWS from 'aws-sdk'
const AWSXRay= require('aws-xray-sdk') 
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate';
const XAWS = AWSXRay.captureAWS(AWS)
//const logger = createLogger('TodosAccess')
console.log("Inside todosAcess.ts ") 
// // TODO: Implement the dataLayer logic
const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX
console.log("TABLE")
console.log(todosTable)
const docClient: DocumentClient = createDynamoDBClient()

    export async function createTodo(todo: TodoItem): Promise<TodoItem> {
        await docClient.put({
        TableName: todosTable,
        Item: todo
        }).promise()

        return todo
    }
//getTodoById

    export async function getTodoById(todoId: string): Promise<TodoItem>{

          const result = await docClient.query({
            TableName : todosTable,
            IndexName: index, 
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues: {
                ':todoId': todoId
            }
        }).promise()    
        //const item = result.Items;

        //if(item.length!== 0) 
        return result.Items[0] as TodoItem

       // return null
    }
//  const dbQuery = {
//             TableName: this.todosTable,
//             Key:{
//                 todoId: todoItem.todoId,
//                 userId: todoItem.userId
//             },
//             UpdateExpression: 'set attachmentUrl = :attachmentUrl',
//             ExpressionAttributeValues: {
//                 ':attachmentUrl': todoItem.attachmentUrl
//             }
//         }

//         logger.info("Todo attachmentUrl has been updated")
//         await this.docClient.update(dbQuery).promise()


    export async function updateTodo(todo: TodoItem): Promise<TodoItem>{

          const result = await docClient.update({
            TableName : todosTable,
            Key: {
              userId: todo.userId,
              todoId: todo.todoId
            }, 
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': todo.attachmentUrl
            }
        }).promise()    
        
        return result.Attributes as TodoItem

    }


    export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]>{

          const result = await docClient.query({
            TableName : todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()    
        return result.Items as TodoItem[]

    }

    function createDynamoDBClient() {

        if (process.env.IS_OFFLINE) {
            console.log('Creating a local DynamoDB instance')
            return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
            })
        }

        return new XAWS.DynamoDB.DocumentClient()
    }