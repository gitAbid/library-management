# Library Management

This is library management project build with nodejs, expressjs and mongodb. It provides uses, books and author
management features. It also provide JWT and Role based authentication for apis.

### Environment

* node js : v14.15.1
* npm: 6.14.8
* mongoDB: latest

* Create `.env` file in root directory and setup these environment variables

    ```
    MONGO_URL =  #set mongodb connection url
    SERVER_PORT =  #set application running port
    TOKEN_SECRET =  #set token secret key used to generate jwt token
    TOKEN_SECRET_ISSUER = #set token issuer key used to generate jwt token
    ```

### Build & Run

* Goto project root directory and run `npm install` to download all dependency

* Run `npm start` command to start the application

### API Specifications

There're 2 types of api endpoint in this application in perspective of security.

* **Authorized** : for this kind of api there will be role assigned beside api end point and need authorization header

  ```http request
  Authorization: Bearer <TOKEN> #generate token for user using  [http://localhost:<SERVER_PORT>/users/authenticate] endpoint
  ```
* **Unauthorized** : everyone can access this

#### USERS

* BaseUrl :`http://localhost:<SERVER_PORT>/users`

    * `/` [GET] [Authorized] [ADMIN] : gets all users details

    * `/register` [POST] [Unauthorized] : register new user
      ```javascript
      #Sample Requesr
      {
         "name":"Admin",
         "username":"admin",
         "password":"pass",
         "role":"ADMIN" # Two kind of role is available MEMBER and ADMIN
      }
      ```
    * `/authenticate`[POST] [Unauthorized] : authenticate and get token for accessing other protected endpoint
      ```json
      #Sample request
      {
        "username":"admin",
        "password":"pass",
      }
      ```
    * `/profile` [GET] [Authorized] [ADMIN,MEMBER]: get profile details of user based on token

    * `/profile/upload` [POST] [Authorized] [ADMIN,MEMBER] : upload profile pictures for user based on token
      ```json
        #Required Header
        file: <FILE_TO_BE_UPLOADED> 
      ```

#### BOOKS

* BaseUrl :`http://localhost:<SERVER_PORT>/books`

    * `/` [GET] [Authorized] [ADMIN,MEMBER] : gets all books
    * `/` [POST] [Authorized] [ADMIN] : add book
      ```json
       #Sample request
       {
        "authors": [], #Optional array of author Ids
        "loanCount": 0, #Optional managed by loan management
        "title": "Harry Poter 9",
        "isbn": "ISH9T90",
        "description": "Harry Potter is a series of seven fantasy novels written by British author, J. K. Rowling. The novels chronicle the lives of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry",
        "category": "Fantasy Fiction, Drama, Young adult fiction, Mystery, Thriller, Bildungsroman",
        "inventoryCount": 2,
       }
      ```
    * `/:bookId`[GET] [Authorized] [ADMIN,MEMBER]: get book details by bookId
    * `/:bookId`[DELETE] [Authorized] [ADMIN] : delete book by bookId
    * `/:bookId`[PUT] [Authorized] [ADMIN] : update book info by bookId and all mandatory field
      required [Can't update loanCount through PUT]
      ```json
      #Sample Request
      {
        "title": "Harry Poter 9",
        "isbn": "ISH9T90",
        "description": "Harry Potter is a series of seven fantasy novels written by British author, J. K. Rowling. The novels
        chronicle the lives of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are
        students at Hogwarts School of Witchcraft and Wizardry",
        "category": "Fantasy Fiction, Drama, Young adult fiction, Mystery, Thriller, Bildungsroman",
        "inventoryCount": 2, 
      }

    * `/:bookId`[PATCH] [Authorized] [ADMIN] : update book property by bookId
      ```json
      #Sample Request
      {
         "inventoryCount": 3,
      }
      ```
    * `/:bookId/authors`[GET] [Authorized] [ADMIN,MEMBER]: browse authors by bookId

#### AUTHORS

* BaseUrl :`http://localhost:<SERVER_PORT>/authors`

    * `/` [GET] [Authorized] [ADMIN,MEMBER] : gets all authors
    * `/` [POST] [Authorized] [ADMIN] : add author
      ```json
       #Sample request
       {
        "name": "J. K. Rowling 3",
        "bio": "Joanne Rowling CH, OBE, HonFRSE, FRCPE, FRSL, better known by her pen name J. K. Rowling, is a British author and philanthropist. She is best known for writing the Harry Potter fantasy series, which has won multiple awards and sold more than 500 million copies, becoming the best-selling book series in history",
        "country": "United Kingdom",
        "age": 55,
        "birthday": "1965-08-31"
       }
      ```
    * `/:authorId`[GET] [Authorized] [ADMIN,MEMBER]: get author details by authorId
    * `/:authorId`[DELETE] [Authorized] [ADMIN] : delete author by authorId
    * `/:authorId`[PUT] [Authorized] [ADMIN] : update author info by authorId and all mandatory field required

      ```json
      #Sample Request
      {
        "name": "J. K. Rowling",
        "bio": "Joanne Rowling CH, OBE, HonFRSE, FRCPE, FRSL, better known by her pen name J. K. Rowling, is a British author and philanthropist. She is best known for writing the Harry Potter fantasy series, which has won multiple awards and sold more than 500 million copies, becoming the best-selling book series in history",
        "country": "United Kingdom",
        "age": 56,
        "birthday": "1965-08-31"
      }
      ```

    * `/:authorId`[PATCH] [Authorized] [ADMIN] : update author property by authorId
      ```json
      #Sample Request
      {
        "bio": "Joanne Rowling CH, OBE, HonFRSE, FRCPE, FRSL, better known by her pen name J. K. Rowling, is a British author and philanthropist. She is best known for writing the Harry Potter fantasy series, which has won multiple awards and sold more than 500 million copies, becoming the best-selling book series in history",
      }
      ```
    * `/:authorId/books`[GET] [Authorized] [ADMIN,MEMBER]: browse books by authorId

#### BOOK-LOAN

* BaseUrl :`http://localhost:<SERVER_PORT>/book-loans`
    * `/` [GET] [Authorized] [ADMIN,MEMBER] : see all loan applications
    * `/export` [GET] [Authorized] [ADMIN] : download all loan applications to csv
    * `/:bookId/request` [POST] [Authorized] [ADMIN,MEMBER] : request for book loan by bookId
    * `/:loanId/accept` [POST] [Authorized] [ADMIN] : accept book loan by loanId
    * `/:bookId/reject` [POST] [Authorized] [ADMIN] : reject book loan by loanId
    * `/:bookId/return` [POST] [Authorized] [ADMIN] : return loaned book 