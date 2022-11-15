import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { getUserId } from '../lambda/utils'
// import * as createError from 'http-errors'

// // TODO: Implement businessLogic
  console.log("Inside todos.ts ") 
  const itemId = uuid.v4()
    export function toDoBuilder(todoReq: CreateTodoRequest, event: APIGatewayProxyEvent)
    {
        const todo =   {
        todoId: itemId,
        userId: getUserId(event),
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: "",
        ...todoReq
        }
        
        return todo
    }