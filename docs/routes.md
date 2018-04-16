# Routes
The following route definition lists the possbilities and requirements to connect to this OpenID Connect provider.

Eligible scopes for the given route are listed using the format *{scope, other_scope}*, mandatory properties (e.g. POST bodies) are displayed as demo object below.

All requests have to be authenticated using a valid bearer token.

## /api/clients
CRUD operations for clients:

### GET / {'client'}
Returns a list of clients for the current user

### POST / {'client', 'client:create'}
Creates a client for the current user. For the complete list of possible properties, please look up the [official client spec](https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata).

```json
{
  "recirect_uris": ["https://something.com/callback"],
  "response_types": ["code"],
  "grant_types": ["authorization_code"],
  "client_name": "Your client name here"
}
```

### GET /:id {'client'}
Returns a certain client based on a valid `client_id` as `:id`.

### GET /:id/reset {'client', 'client:update'}
Resets the `client_secret` of a certain client based on a valid `client_id` as `:id`.

### PUT /:id {'client', 'client:update'}
Updates client with valid `client_id` as `:id` based on the submitted body. Body has to consist of only valid properties based on the [official client spec](https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata).

### DELETE /:id {'client', 'client:delete'}
Deletes the client with `client_id` as `:id` completely from the database.

## /api/tokens
Currently only one route available for managing access tokens:

### GET / {'token'}
List currently valid tokens

## /api/users
*Not available yet*