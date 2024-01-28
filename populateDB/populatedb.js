#!/usr/bin/env node */

const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const slugify = require('slugify');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const Article = require('./Article');
const Author = require('./Author');
const Comment = require('./Comment');
const { once } = require('events');

console.log(
  'Populating the designated MongoDB database with the provided data...'
);

mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGODB_URI;

const authors = [];
const articles = [];
const comments = [];

async function authorCreate(index, name, articles, username, password) {
  const url = nanoid();

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log(err);
        reject();
      } else {
        const author = new Author({
          name,
          articles,
          url,
          username,
          password: hashedPassword,
        });
        await author
          .save()
          .then(() => {
            authors[index] = author;
            console.log(`Added author: ${name}`);
            resolve();
          })
          .catch((nameErr) => console.log(nameErr));
      }
    });
  });
}

async function articleCreate(index, title, author, date, content, comments) {
  const slug = slugify(title, {
    remove: /[^\w\s-]/g,
    lower: true,
    trim: true,
  });
  const nano = nanoid(10);
  const url = `${slug}-${nano}`;

  const article = new Article({
    title,
    author,
    date,
    content,
    comments,
    url,
  });

  await article.save();
  articles[index] = article;
  console.log(`Added item: ${title}`);
}

async function commentCreate(index, author, date, content, article) {
  const url = nanoid();
  const comment = new Comment({
    author,
    date,
    content,
    article,
    url,
  });

  await comment.save();
  comments[index] = comment;
  console.log(`Added comment: ${content}`);
}

async function createAuthors() {
  console.log('Adding authors');
  await Promise.all([
    authorCreate(0, 'John Doe', [], 'admin', 'password'),
    authorCreate(1, 'Jane Smith', [], 'admin2', 'password2'),
  ]);
}

async function createArticles() {
  console.log('Adding articles');
  await Promise.all([
    articleCreate(
      0,
      'My First Blog!',
      authors[0],
      new Date('2024-01-10T09:30:55'),
      'This is just a test.',
      []
    ),
    articleCreate(
      1,
      'Best Practices for Blogging',
      authors[0],
      new Date('2024-01-11T12:32:32'),
      'The best practice for anything is to practice every day!',
      []
    ),
    articleCreate(
      2,
      '3 Tips For Crafting Compelling Content',
      authors[1],
      new Date('2024-01-13T14:03:29'),
      '1. Know Your Audience \n2. Use Attention-Grabbing Headlines \n3. Tell Captivating Personal Stories \n These three tips will help any new blogger get up to speed with writing great blogs in no time!',
      []
    ),
  ]);
}

async function createComments() {
  console.log('Adding comments');
  await Promise.all([
    commentCreate(
      0,
      'Mark Elliott',
      new Date('2024-01-10T09:33:39'),
      'Looks like the test was successful! Congrats!',
      articles[0]
    ),
    commentCreate(
      1,
      'bloggerFan123',
      new Date('2024-01-14T04:21:59'),
      `I can't wait to see what you do with this blog in the future`,
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
      3,
      'lukeSkywalker5',
      new Date('2024-01-12T10:12:41'),
      'this is the greatest blogging tip of all time',
      articles[1]
    ),
    commentCreate(
      4,
      'corndog fan',
      new Date('2024-01-14T02:23:12'),
      'i like corndogs',
      articles[1]
    ),
    commentCreate(
      5,
      'Anonymous',
      new Date('2024-01-15T00:16:48'),
      'this article made my blogs much better',
      articles[2]
    ),
    commentCreate(
      6,
      'bloggergirl',
      new Date('2024-01-16T10:19:00'),
      'my blog is way better now thank youuuu!!!',
      articles[2]
    ),
    commentCreate(
      7,
      'CMNDR45',
      new Date('2024-01-15T15:58:49'),
      'wow great advice very in depth',
      articles[2]
    ),
    commentCreate(
      8,
      'i.heart.sharks',
      new Date('2024-01-17T19:39:53'),
      'hello i am looking to hire someone to help with my shark blog pleas contact me',
      articles[2]
    ),
  ]);
}

async function populateAuthor(author) {
  const articles = await Article.find({
    author,
  })
    .exec()
    .catch((err) => console.log(err));

  const newAuthor = await Author.findById(author)
    .exec()
    .catch((err) => console.log(err));

  newAuthor.articles = articles;
  await newAuthor.save().catch((err) => console.log(err));
}

async function populateArticle(article) {
  const comments = await Comment.find({ article })
    .exec()
    .catch((err) => console.log(err));

  const newArticle = await Article.findById(article)
    .exec()
    .catch((err) => console.log(err));

  newArticle.comments = comments;
  await newArticle.save().catch((err) => console.log(err));
}

async function updateAllAuthors() {
  console.log('Poulating authors');
  await Promise.all([populateAuthor(authors[0]), populateAuthor(authors[1])]);
}

async function updateAllArticles() {
  console.log('Poulating articles');
  await Promise.all([
    populateArticle(articles[0]),
    populateArticle(articles[1]),
    populateArticle(articles[2]),
  ]);
}

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createAuthors();
  await createArticles();
  await createComments();

  // Populating array of references functions
  await updateAllAuthors();
  await updateAllArticles();

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

main().catch((err) => console.log(err));
