// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'da9w10w4qc'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-kftlpz6fg6vklbyg.us.auth0.com', // Auth0 domain
  // clientId: 'RjlbUpEuBgvkwOftp8gtl5aEzIcL259y', // Auth0 client id
  clientId: 'qy2mVqkmaMvSIwNFbAO3Yw0Ynt6FVkLa',
  callbackUrl: 'http://localhost:3000/callback'
}
