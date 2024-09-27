const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const validUser = users.filter(user => {
        return user.username === username && user.password===password;
    }) 
    return validUser.length>0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Type your username and password" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'fingerprint_customer', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = parseInt(req.params.isbn);
    let book_isbn = books[isbn]; 
    const newReview = req.query.review;
    let user = req.session.authorization['username'];
    // Directly add or update the review for this user. The reviews object stores each user's review, where the username is the key and the review message is the value.
    book_isbn.reviews[user] = newReview;

  return res.status(200).json({message: "Review submitted successfully", review: book_isbn.reviews[user]});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
      const isbn = parseInt(req.params.isbn);
      let book_isbn = books[isbn]; 
      let user = req.session.authorization['username'];
      // Directly delete the review for this user
      delete book_isbn.reviews[user];
    return res.status(200).json({message: "Review deleted successfully", reviews: book_isbn.reviews});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
