/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const express = require('express');
const mongoose = require('mongoose');

module.exports = function (app) {

  mongoose.connect(
		process.env.DB,
		{ useNewUrlParser: true, useUnifiedTopology: true },
	);

  let bookSchema = mongoose.Schema({
    title: {type: String, required: true},
    comments: [],
  });

  let Book = mongoose.model("Book", bookSchema);

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let books = await Book.find({});
      let array = [];
      books.forEach(book => {
        let obj = Object.assign({
          "_id": book._id,
          "title": book.title,
        "commentcount": book.comments.length
        })
        array.push(obj)
      })
      return res.json(array)
    })
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title){
        return res.json("missing required field title")
      }
      let newBook = new Book({
        title: title,
        comments: [],
      })

      let savedBook = await newBook.save();
      return res.json(savedBook);
    })
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      let removedBooks = await Book.deleteMany({});
      if(removedBooks){
        return res.json("complete delete successful")
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let book = await Book.findOne({_id: bookid});
      if(!book){
        return res.json("no book exists");
      }else if(book){
        //book = book[0]
        return res.json({
          "_id": book._id,
          "title": book.title,
          "comments": book.comments
        })
      }
    })
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment){
        return res.json("missing required field comment")
      }
      let updatedBook = await Book.findByIdAndUpdate(
        bookid,
        {$push: {comments: comment}},
        {new: true}
      );
      
      if(updatedBook){
        return res.json(updatedBook);
      }else{
        return res.json("no book exists");
      }
    })
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndRemove(bookid);
      if(deletedBook){
        return res.json("delete successful")
      }else{
        return res.json("no book exists")
      }
    });
  
};
