// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
//https://z3hj0pbl16.execute-api.us-east-1.amazonaws.com/dev/todos
//https://hfeinhwzw2.execute-api.us-east-1.amazonaws.com/dev/todos
const apiId = 'hfeinhwzw2'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-udfyzzphizt143bs.us.auth0.com',            // Auth0 domain
  clientId: 'KNioR3708Dh8C6XoCTW9cuIDTOfYM5Pd',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'

}