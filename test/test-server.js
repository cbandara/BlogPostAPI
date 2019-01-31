const chai = require("chai")
const chaiHttp = require("chai-http")
const faker = require("faker")
const mongoose = require('mongoose')

const expect = chai.expect

const {BlogPost, Author} = require('../models')
const {app, runServer, closeServer} = require("../server")
const {TEST_DATABASE_URL} = require("../config")

chai.use(chaiHttp)

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database')
    mongoose.connection.dropDatabase()
    .then(result => resolve(result))
    .catch(err => reject(err))
  })
}

const testAuthor = {
  userName: "cbandara",
  _id: "5af50c84c082f1e92f83420c",
  firstName: "Charutha",
  lastName: "Bandara"
}

function seedAuthorData() {
  return Author.insertMany([
    testAuthor
  ])
}

function seedBlogPostData() {
  console.info('seeding blog post data')
  const seedData = []
  for (let i=1; i<=10; i++) {
    seedData.push({
      author: testAuthor._id,
      title: faker.lorem.sentence(),
      content: faker.lorem.text()
    })
  }
  return BlogPost.insertMany(seedData)
}

describe("Blog Posts", function() {
  before(function() {
    return runServer (TEST_DATABASE_URL);
  })

  beforeEach(function() {
    return seedAuthorData()
      .then(() => {
        return seedBlogPostData()
      })
  })

  afterEach(function () {
    return tearDownDb()
  })

  after(function () {
    return closeServer();
  })

  describe('GET endpoint', function () {
    it("should list items on GET", function() {
      return chai.request(app)
        .get("/posts")
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.be.above(0);
          res.body.forEach(function(item) {
            expect(item).to.be.a("object");
            expect(item).to.have.all.keys(
              "id",
              "title",
              "content",
              "author",
              "created",
              "comments"

            )
          })
        })
    })
  })

  describe('POST endpoint', function() {
    it("should add a blog post on POST", function() {
      const newPost = {
        title: "Lorem ipsum",
        content: "foo bar",
        author: testAuthor._id,
        created: Date.now()
      }

      const expectedKeys = ["id","comments"].concat(Object.keys(newPost));

      return chai.request(app)
        .post("/posts")
        .send(newPost)
        .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a("object");
            expect(res.body).to.have.all.keys(expectedKeys);
            expect(res.body.title).to.equal(newPost.title);
            expect(res.body.content).to.equal(newPost.content);
            expect(res.body.author).to.equal(testAuthor.firstName + " " + testAuthor.lastName);
        })
    })

    it("should error if POST missing expected values", function() {
      const badRequestData = {};
      return chai
        .request(app)
        .post("/posts")
        .send(badRequestData)
        .then(function(res) {
          expect(res).to.have.status(400);
        });
    })
  })
    

  describe('PUT endpoint', function() {
    it("should update blog posts on PUT", function() {
      return (
        chai
          .request(app)
          // first have to get
          .get("/posts")
          .then(function(res) {
            const updatedPost = Object.assign(res.body[0], {
              title: "connect the dots",
              content: "la la la la la",
              author: testAuthor._id
            });
            console.log(updatedPost)
            return chai
              .request(app)
              .put(`/posts/${res.body[0].id}`)
              .send(updatedPost)
              .then(function(res) {
                expect(res).to.have.status(204);
              });
          })
      );
    });
  })
  
  describe('DELETE endpoint', function() {
    it("should delete posts on DELETE", function() {
      return (
        chai
          .request(app)
          // first have to get
          .get("/posts")
          .then(function(res) {
            return chai
              .request(app)
              .delete(`/posts/${res.body[0].id}`)
              .then(function(res) {
                expect(res).to.have.status(204);
              });
          })
      );
    });  
  })

})