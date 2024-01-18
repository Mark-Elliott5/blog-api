#!/usr/bin/env node */

const mongoose = require('mongoose');

const Article = require('./Article');
const Author = require('./Author');
const Comment = require('./Comment');

console.log(
  'This script populates supplement products (items) and categories to the provided MongoDB database.'
);

const userArgs = process.argv.slice(2);

mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

const authors = [];
const articles = [];
const comments = [];

async function authorCreate(index, name, articles) {
  const author = new Author({ name, articles });

  await author.save();
  authors[index] = author;
  console.log(`Added author: ${name}`);
}

async function articleCreate(index, title, author, date, content, comments) {
  const article = new Article({
    title,
    author,
    date,
    content,
    comments,
  });

  await article.save();
  articles[index] = article;
  console.log(`Added item: ${title}`);
}

async function commentCreate(index, author, date, content, article) {
  const comment = new Comment({
    author,
    date,
    content,
    article,
  });

  await comment.save();
  comments[index] = comment;
  console.log(`Added comment: ${content}`);
}

async function createAuthors() {
  console.log('Adding authors');
  await Promise.all([
    authorCreate(0, 'John Doe', []),
    authorCreate(1, 'Jane Smith', []),
  ]);
}

async function createArticles() {
  console.log('Adding articles');
  await Promise.all([
    articleCreate(
      0,
      'My First Blog!',
      [authors[0]],
      new Date('2024-01-10T09:30:55'),
      'This is just a test.',
      []
    ),
    articleCreate(
      0,
      'Best Practices for Blogging',
      [authors[0]],
      new Date('2024-01-11T12:32:32'),
      'The best practice for anything is to practice every day!',
      []
    ),
    articleCreate(
      1,
      '3 Tips For Crafting Compelling Content',
      [authors[1]],
      new Date('2024-01-13T14:03:29'),
      '1. Know Your Audience \n2. Use Attention-Grabbing Headlines \n3. Tell Captivating Personal Stories \n These three tips will help any new blogger get up to speed with writing great blogs in no time!',
      []
    ),
  ]);
}

async function createComments() {
  console.log('Adding articles');
  await Promise.all([
    commentCreate(
      0,
      'Mark Elliott',
      new Date('2024-01-10T09:33:39'),
      'Looks like the test was successful! Congrats!',
      articles[0]
    ),
    commentCreate(
      2,
      'Herkimer Snerd',
      new Date('2024-01-11T18:24:02'),
      'Thank you for this life-changing advice.',
      articles[1]
    ),
    commentCreate(
      0,
      'Anonymous',
      new Date('2024-01-15T00:16:48'),
      'this article made my blogs much better. thank you!',
      articles[2]
    ),
  ]);
}

async function populateAuthor(author) {
  const authorObjectId = author._id;

  const articles = await Article.find(
    { 'author._id': new mongoose.Types.ObjectId(authorObjectId) },
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        console.log(results);
      }
    }
  );

  await Author.findOneAndUpdate(
    { _id: authorObjectId },
    {
      $push: {
        articles: {
          $each: articles.map((article) => new ObjectId(article._id)),
        },
      },
    },
    (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Succesful update: ${doc}`);
      }
    }
  );
}

async function updateAllAuthors() {
  console.log('Poulating authors');
  await Promise.all([populateAuthor(author[0]), populateAuthor(author[1])]);
}

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createAuthors();
  await createArticles();
  await createComments();

  // populate functions
  await updateAllAuthors();

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

main().catch((err) => console.log(err));
