<p align="center">
  <h1 align="center">Moodle</h1>
  <p align="center">
    Project Create with React and RailsAPI
    <br>
    <br>
    <a href="https://moodle-pedagogico.herokuapp.com/" target="_blank">Live Demo</a>
    .
    <a href="https://github.com/AnthonyTC89/moodle/issues">Report Bug</a>
    ·
    <a href="https://github.com/AnthonyTC89/moodle/issues">Request Feature</a>
  </p>
</p>

![Screenshot](/screenshots/01.png)

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Installation](#installation)

<!-- ABOUT THE PROJECT -->
## About The Project

This project is a Moodle.

### Built With
* [HTML](https://www.w3.org/html/)
* [CSS](https://www.w3.org/Style/CSS/)
* [Bootstrap](https://getbootstrap.com/)
* [JavaScript](https://www.javascript.com/)
* [ReactJS](https://reactjs.org/)
* [ReduxJS](https://redux.js.org/)
* [Ruby](https://www.ruby-lang.org/en/)
* [RailsAPI](https://rubyonrails.org/)
* [AWS S3](https://aws.amazon.com/s3/)

### Pre-Installation
  1. npm version 6.13.4 or more
  2. node version 8.17.0 or more
  3. ruby version 2.6.5 or more
  4. rails version 6.0.2.1 or more

### DataBase Setup
  1. Run: `sudo apt-get update && sudo apt-get install postgresql`
  2. Run: `sudo service postgresql start`
  3. Run: `sudo -i -u postgres`
  4. Run: `psql`
  5. Run: `CREATE USER <user> with encrypted password '<password>';` (with semicolon)
  6. Run: `ALTER USER <user> createdb;` 

### Local Environment Variables
  1. Back-end: (Ruby on Rails), create this file: `config/local_env.yml`
    * e.g: `DATABASE_USERNAME: <user>`
    * e.g: `DATABASE_PASSWORD: <password>`
  2. Front-end (React), create this file: `client/.env`
    * e.g: `REACT_APP_KEY_API=randomkey123`

### Installation
  1. clone the repository [moodle](https://github.com/AnthonyTC89/moodle)
  2. cd in to the folder and run `bundle install`
  3. run `rails db:create && rails db:migrate && rails db:seed`
    * (If there are problems with the service of postgresql check DB Section) 
  4. cd in to /client folder and run `npm install`
  5. return to root folder and run `rails start`
  6. wait until both servers will be initialized
  7. go to [localhost:3000](http://localhost:3000)
  
### Contact

* **[Anthony Tapia Cossio](https://github.com/AnthonyTC89) - [Linkedin](linkedin.com/in/anthony-tapia-cossio) - [Twitter](https://twitter.com/ptonypTC) - [Portfolio](https://portfolio-anthony.herokuapp.com/)**
