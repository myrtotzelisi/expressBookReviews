const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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


public_users.get('/',function (req, res) {
        //Write your code here
    const bookPromise = new Promise((resolve, reject)=>{
        const receivedBooks = books;//we already have the books
        if(receivedBooks){
            resolve({books}) ;
        }else {
            reject('Books not found')
        }
      }); 
      bookPromise.then((books)=> {return res.status(200).json({books})} )
.catch((error)=> {
    return res.status(500).json({message: 'Unable to retrieve books:'+ error})
}) ;    
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbnBooks = new Promise ((resolve, reject)=> {
    const isbn = parseInt(req.params.isbn);
    let book_isbn = books[isbn]; 
    if (book_isbn) {
        resolve(book_isbn)
    } else {
        reject('Book with ISBN: '+ isbn + 'not found')
    }
  })
  isbnBooks.then((book)=> { return res.status(200).json(book); })
  .catch((error)=> {return res.status(404).json(error);}  )
 });
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorBooks = new Promise ((resolve, reject)=>{
    const author = req.params.author;
    let book_author = []
    const keys = Object.keys(books);//Obtain all the keys for the ‘books’ object.
    for (let i = 0; i < keys.length; i++ ) {
      if (books[keys[i]].author === author) {
          book_author.push(books[keys[i]]);
      }}
      if(book_author.length>0){
        resolve(book_author)
      } else {
        reject('No book with this author')
      }
  })
  authorBooks.then((book_author)=> {return res.status(200).json(book_author);})
  .catch((error)=> { return res.status(403).json({message: 'Unable to retrieve books:'+ error}); })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleBooks = new Promise ((resolve,reject)=>{
    const title = req.params.title;
    let book_title = []
    const keys = Object.keys(books);//Obtain all the keys for the ‘books’ object.
    for (let i = 0; i < keys.length; i++ ) {
      if (books[keys[i]].title === title) {
          book_title.push(books[keys[i]]);
      }}
      if (book_title.length>0){
        resolve(book_title)
      }else {
        reject('No book with this title')
      };
  })
  titleBooks.then((book_title)=> {return res.status(200).json(book_title);})
    .catch((error)=> {
        return res.status(404).json({message: 'Unable to retrieve books:'+ error});
    })
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  let book_isbn = books[isbn]; 
  return res.status(200).json(book_isbn.reviews);
});

module.exports.general = public_users;
