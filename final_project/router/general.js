const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist =(username) => {
    let existingUser = users.filter((user) =>
        {
            return user.username === username;
        });
    return existingUser.length>0;
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Please provide username and password" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  let book_isbn = books[isbn]; 
  return res.status(200).json(book_isbn);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let book_author = []
  const keys = Object.keys(books);//Obtain all the keys for the ‘books’ object.
  for (let i = 0; i < keys.length; i++ ) {
    if (books[keys[i]].author === author) {
        book_author.push(books[keys[i]]);
    }}
  return res.status(200).json(book_author);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let book_title = []
  const keys = Object.keys(books);//Obtain all the keys for the ‘books’ object.
  for (let i = 0; i < keys.length; i++ ) {
    if (books[keys[i]].title === title) {
        book_title.push(books[keys[i]]);
    }}
  return res.status(200).json(book_title);});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  let book_isbn = books[isbn]; 
  return res.status(200).json(book_isbn.reviews);
});

module.exports.general = public_users;
