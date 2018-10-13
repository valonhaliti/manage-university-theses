import fs from 'fs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import db from '../src/api/db/dbConnection';
const expect = chai.expect;
chai.should();
chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

describe('Thesis', function() {
  // clean test database and insert one record in db with id=1
  before(function(done) {
    let deleteQuery = 'DELETE FROM thesis WHERE id > 0;';
    db
      .query(deleteQuery)
      .then(() => {
        let insertQuery =  'INSERT INTO `thesis` (`id`, `title`, `description`, `category`) ';
        insertQuery += 'VALUES (1, "Clustering of words from social networks", "descr..", "Data science");';
        db.query(insertQuery).then(() => done()).catch(err => done(err));
      }).catch(err => done(err));
  });

  const auth = {};
  before(loginUser(auth));

  describe('POST /thesis', function() {
    it('should require authorization', function(done) {
      requester
        .post('/thesis')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should POST with success a thesis', function(done) {
      requester
        .post('/thesis')
        .set('Authorization', `Bearer ${auth.token}`)
        .field('title', "Clustering of words from social networks")
        .field('description', "In thesis are used algorithms like K-Means etc.")
        .field('category', "Data Science")
        .attach('thesisPDF', fs.readFileSync('samplefile.pdf'), 'samplefile.pdf')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.have.status(201);
          expect(res.body.message).to.equal('Thesis added in database successfully.');
          done();
        });
    });
  });

  describe('List (GET) /thesis', function() {
    it('should GET theses with success', function(done) {
      requester
        .get('/thesis')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body.data).to.be.an('array');
          done();
        });

    });
  });

  describe('GET /thesis', function() {
    it('should give 404 status, since there is no thesis with id = -1', function(done) {
      requester
        .get('/thesis/-1')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.have.status(404);
          done();
        })
    });

    it(`should GET with success thesis with id=1`, function(done) {
      requester
        .get(`/thesis/1`)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body.data[0].category).to.equal('Data science');
          done();
        });
    });
  });

  describe('PUT /thesis', function() {
    it('should require authorization', function(done) {
      requester
        .put('/thesis/1')
        .field('title', "Clustering of words from all social networks")
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should PUT (Update) with success a thesis', function(done) {
      requester
        .put('/thesis/1')
        .set('Authorization', `Bearer ${auth.token}`)
        .field('title', "Clustering of words from all social networks")
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.have.status(201);
          done();
        });
    });
  });

  describe('DELETE /thesis', function() {
    it('should require authorization', function(done) {
      requester
        .del('/thesis/1')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.have.status(401);
          done();
        });
    });

    it(`should DELETE with success thesis with id 1`, function(done) {
      requester
        .del('/thesis/1')
        .set('Authorization', `Bearer ${auth.token}`)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.have.status(201);
          expect(res.body.message).to.equal('Successfully deleted!');
          done();
        });
    });
  });
});

function loginUser(auth) {
  return function(done) {
    requester
      .post('/user/login')
      .send({
        email: 'valonfhaliti@gmail.com',
        password: 'valoni123'
      })
      .end(onResponse);
    function onResponse(err, res) {
      if (err) done(err);
      expect(res).to.have.status(200);
      auth.token = res.body.token;
      return done();
    }
  }
}
