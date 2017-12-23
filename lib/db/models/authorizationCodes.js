/*
 * - grantId {string} the original id assigned to a grant (authorization request)
 * - header {string} oidc-provider tokens are themselves JWTs, this is the header part of the token
 * - payload {string} second part of the token
 * - signature {string} the signature of the token
 * 
 {
  "_id": "NzlmZDYxYmQtMjkyMC00Y2JhLWFjYjctYjAwM2FmZjI3ZjI3",
  "header": "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0",
  "payload": "eyJhY2NvdW50SWQiOiJhc2RmIiwiYXV0aFRpbWUiOjE1MTQwMzk4MTQsImNsYWltcyI6e30sImNsaWVudElkIjoiMmE0Y2ViYjYtOTA0Mi00ZDVkLWFhNmYtZDE1YTQ5YjAxZTZmIiwiZ3JhbnRJZCI6IjQ1Y2Y5NjBiLWJkZDYtNGJlMC1iZTMwLTdhMWEwODFmOTI3YyIsImp0aSI6Ik56bG1aRFl4WW1RdE1qa3lNQzAwWTJKaExXRmpZamN0WWpBd00yRm1aakkzWmpJMyIsImtpbmQiOiJBdXRob3JpemF0aW9uQ29kZSIsInJlZGlyZWN0VXJpIjoiaHR0cHM6Ly9ob21lLmRldjozMDAxL2NhbGxiYWNrIiwic2NvcGUiOiJvcGVuaWQiLCJpYXQiOjE1MTQwNDA1NjYsImV4cCI6MTUxNDA0MTE2NiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIn0",
  {  
   "accountId":"asdf",
   "authTime":1514039814,
   "claims":{  },
   "clientId":"2a4cebb6-9042-4d5d-aa6f-d15a49b01e6f",
   "grantId":"45cf960b-bdd6-4be0-be30-7a1a081f927c",
   "jti":"NzlmZDYxYmQtMjkyMC00Y2JhLWFjYjctYjAwM2FmZjI3ZjI3",
   "kind":"AuthorizationCode",
   "redirectUri":"https://home.dev:3001/callback",
   "scope":"openid",
   "iat":1514040566,
   "exp":1514041166,
   "iss":"http://localhost:3000"
}
  "signature": "B5VRIp6hqTJU864jkabYJeS1w1OMlNX9XuzNLmLi2LQzfCVTjjEUiw84qo5y-p0DPNrBXZ745QX-GWzkiwyH0w",
  "grantId": "45cf960b-bdd6-4be0-be30-7a1a081f927c",
  "expiresAt": {
      "$date": "2017-12-23T14:59:26.272Z"
  }
}
 */
