// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { getUploadUrl, TodosAccess } from '../dataLayer/todosAcesss'
import { TodoItem } from '../src/models/TodoItem'
import { TodoUpdate } from '../src/models/TodoUpdate'
import { CreateTodoRequest } from '../src/requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../src/requests/UpdateTodoRequest'


// import * as createError from 'http-errors'

const todosAcess = new TodosAccess()
// const mybucket = process.env.ATTACHMENT_S3_BUCKET

// TODO: Implement businessLogic
export async function createTodo(
    createTodoRequest:CreateTodoRequest, 
    userId:string) :Promise<TodoItem> {
    const todoId = uuid.v4()
    
    return todosAcess.createTodo({
        todoId:todoId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        // attachmentUrl: `http://${mybucket}.s3.amazonaws.com/${todoId}`,
        done: false,
        createdAt: new Date().toISOString()  
    })
}

export async function getTodosForUser(
    userId: string) {

    return todosAcess.getTodosForUser(userId)    
}

export async function deleteTodo(
    userId: string, 
    todoId: string){

    return todosAcess.deleteTodo(userId, todoId)
}

export async function updateTodo (
    updateTodoRequest: UpdateTodoRequest, 
    todoId: string, userId: string) {

    const todoUpdate:TodoUpdate = {
        ...updateTodoRequest
    }
    
    return todosAcess.updateTodo(todoUpdate, todoId, userId)   
}

export async function createAttachmentPresignedUrl(
    todoItem: TodoItem) {
    return todosAcess.createAttachmentPresignedUrl(todoItem)    
}

export async function generateUploadUrl(todoId: string) {
    return getUploadUrl(todoId)    
}

export async function getTodoById(todoId: string) {
    return todosAcess.getTodoById(todoId)    
}