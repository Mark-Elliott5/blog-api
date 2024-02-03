This blog-api project features:

- An Express-based RESTful API following a logical routing scheme
- GET/POST/PUT/DELETE CRUD operations with mongoose and body validation
- URL slugging with slugify
- NanoId generation to prevent collisions with identical article titles and author names
- Bcrypt hashing
- Passport user authentication with JSON Web Tokens

This API allows users to retrieve information via GET about authors, articles, and comments. Further, it allows authenticated users (authors with login credentials in the database) to create, update, and delete using the associated POST, PUT, and DELETE HTTP methods. In the event of an error, it returns a message depending on routing/body validation/authorization/database issues.

## Usage

> Author CRUD operations

```console
$ curl -X GET http://localhost:3000/api/v1/authors/
// Returns a list of all authors with sensitive data removed.

$ curl -X POST http://localhost:3000/api/v1/authors/ -d "{"name": "New Author", "username": "newAuthor", "password": "securePassword"}" -H "Content-Type: application/json"
// Creates a new author and returns success message.

$ curl -X PUT http://localhost:3000/api/v1/authors/nanoId-example-author -d "{"name": "Updated Author"}" -H "Authorization: Bearer {token}" -H "Content-Type: application/json"
// Updates an author with the supplied property/properties and returns a success message.

$ curl -X DELETE http://localhost:3000/api/v1/authors/nanoid-example-author -H "Authorization: Bearer {token}"
// Deletes an author and returns a success message.
```

> Article CRUD operations

```console
$ curl -X GET http://localhost:3000/api/v1/articles/
// Returns a list of all articles, with populated author data.

$ curl -X POST http://localhost:3000/api/v1/articles/ -d "{"title": "New Article", "author": "65b6052958048d9258613643", "content": "This is my new article!"}" -H "Authorization: Bearer {token}" -H "Content-Type: application/json"
// Posts a new article and returns success message.

$ curl -X GET http://localhost:3000/api/v1/articles/nanoid-example-article
// Returns a specific article with populated author and comments data.

$ curl -X PUT http://localhost:3000/api/v1/articles/nanoid-example-article -d "{"title": "Updated article"}" -H "Authorization: Bearer {token}" -H "Content-Type: application/json"
// Updates an article with the supplied property/properties and returns a success message.

$ curl -X DELETE http://localhost:3000/api/v1/articles/nanoid-example-article -H "Authorization: Bearer {token}"
// Deletes an article with the supplied property/properties and returns a success message.
```

> Comment CRUD operations

```console
$ curl -X GET http://localhost:3000/api/v1/articles/nanoid-example-article/comments/
// Returns a list of all comments for a given article.

$ curl -X POST http://localhost:3000/api/v1/articles/nanoid-example-article/comments/ -d "{"author": "Commenter", "content": "This is my new comment!"}" -H "Content-Type: application/json"
// Posts a new comment on a given article and returns success message. Note that authorization is not needed to post comments. Commenters enter their "author" name on a per comment basis and is not associated with a username in the database. Posting is rate limited to 1 attempt per 10 seconds. Returns a success message.

$ curl -X GET http://localhost:3000/api/v1/articles/nanoid-example-article/comments/id/
// Returns a specific comment.

$ curl -X PUT http://localhost:3000/api/v1/articles/nanoid-example-article/comments/id/ -d "{"content": "Edited comment"}" -H "Authorization: Bearer {token}" -H "Content-Type: application/json"
// Updates a comment with the supplied property/properties and returns a success message.

$ curl -X DELETE http://localhost:3000/api/v1/articles/nanoid-example-article/comments/id/ -H "Authorization: Bearer {token}"
// Deletes a given comment.
```
