<h1 align="center">NewsPortal Backend</h1>



This is a NewsPortal Backend application for NewsPortal Mobile App. Built with NodeJs using the ExpressJs Framework.
Express.js is a web application framework for Node.js. [More about Express](https://en.wikipedia.org/wiki/Express.js)

## Built With
[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.18.3-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements
1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?
1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
4. Type `sequelize db:migrate` in CMD or Terminal
5. Open Postman desktop application or Chrome web app extension that has installed before
6. Choose HTTP Method and enter request url.(ex. localhost:8080/)
7. You can see all the end point [here](#end-point)

## End Point
**1. GET**

* `/private/news/user`(Get all news/article from user login)

* `/private/news/user/:idNews` (Get news/article from user login with specific id)

* `/private/news` (Get all news/article)

* `/private/news/:id` (Get news/article detail)

* `/private/users` (Get detail user login)

* `/users` (Get all users)

**2. POST**

* `/auth/register` (Create account)

* `/auth/login` (Login for user)

* `/private/news` (Create news/article)

**3. PATCH**

* `/private/news/:idNews` (Update news)

* `/private/users` (Update user's profile)

* `/private/users/change-password` (Update user's password)

**4. DELETE**

* `/private/news/:idNews` (Delete news by id)

* `/private/users` (Delete account)
  