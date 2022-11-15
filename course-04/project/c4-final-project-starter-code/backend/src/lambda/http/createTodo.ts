// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import 'source-map-support/register'
// import * as middy from 'middy'
// import { cors } from 'middy/middlewares'
// import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import { createTodo } from '../../helpers/todosAcess'
// import { toDoBuilder } from '../../helpers/todos'
// //import { createTodo } from '../../businessLogic/todos'
//     console.log("Hi create to do ") 
// export const handler = middy(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     const newTodo: CreateTodoRequest = JSON.parse(event.body)
//     // TODO: Implement creating a new TODO item
//     console.log("Inside handler ") 
//     console.log(newTodo) 
  
//     const todo = toDoBuilder(newTodo, event)

//     const createdTodo = await createTodo(todo)
//     return {
//         statusCode: 201,
//         body: JSON.stringify({
//           createdTodo
//     })
//   }
// }
// )

// handler.use(
//   cors({
//     credentials: true
//   })
// )



import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    const createdItem = await createTodo(newTodo, getUserId(event))
    
    return {
      statusCode: 201,
      body:JSON.stringify({
        'item': createdItem
      })
    }
    
  }
)

handler.use(
  cors({
    credentials: true
  })
)
