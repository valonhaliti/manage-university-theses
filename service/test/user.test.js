import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import db from '../src/api/db/dbConnection';
const expect = chai.expect;
chai.should();
chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

describe('User', function() {
    // clean test database and insert one record in db with id = 2
    before(function(done) {
        let deleteQuery = 'DELETE FROM user WHERE id > 1;';
        db
            .query(deleteQuery)
            .then(() => {
                let insertQuery =  'INSERT INTO `user` (`id`,`firstname`,`lastname`,`type`,`email`,`password`,`registration_year`,`is_deleted`) ';
                insertQuery += `VALUES (2,'Marcel','Proust',0,'test@example.com','topSecret',2017,0)`;
                db.query(insertQuery).then(() => done()).catch(err => done(err));
            }).catch(err => done(err));
    });

    const auth = {};
    before(loginUser(auth));

    describe('SIGN UP USER', function() {
        it('should create a user in database', function(done) {
            requester
                .post('/user/signup')
                .send({
                    "email": "test123@example.com",
                    "password": "topSecret",
                    "firstname": "James",
                    "lastname": "Joyce",
                    "type": 0,
                    "registration_year": 2018
                })
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res).to.have.status(201);
                    done();
                });
        });

        it('should not create a user in database with existing email', function(done) {
            requester
                .post('/user/signup')
                .send({
                    "email": "test123@example.com",
                    "password": "topSecret",
                    "firstname": "James",
                    "lastname": "Joyce",
                    "type": 0,
                    "registration_year": 2018
                })
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res).to.have.status(409);
                    expect(res.body.message).to.equal('Mail exists.');
                    done();
                });
        });
    });
    
    describe('Login', function() {
        it('should login with succes, given correct username and password', function(done) {
            requester
                .post('/user/login')
                .send({
                    "email": "test123@example.com",
                    "password": "topSecret"
                })
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('should give 401 status code when trying to login with incorrect username and password', function(done) {
            requester
                .post('/user/login')
                .send({
                    "email": "test123@example.com",
                    "password": "iAmHacker"
                })
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });

    describe('GET /user', function() {
        it('should GET with success users', function(done) {
            requester
                .get('/user')
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array');
                    done();
                });
        });

        it('should GET with success students (users have type=0 in database)', function(done) {
            requester
                .get('/user')
                .query({ type: '0' })
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array');
                    expect(Object.keys(res.body.data[0]).length).to.equal(5);
                    done();
                });
        }); 

        it('should GET with success user with id = 2', function(done) {
            requester
                .get('/user/2')
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body.data[0].firstname).to.equal('Marcel');
                    done();
                });
        }); 
    });

    describe('PUT /user', function() {
        it('should require authorization', function(done) {
            requester
                .put('/user/2')
                .send({firstname: 'James'})
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('should PUT (Update) with success the user with id = 1', function(done) {
            requester
                .put('/user/1')
                .set('Authorization', `Bearer ${auth.token}`)
                .send({firstname: 'James'})
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res).to.have.status(201);
                    done();
                });
        });
    });

    describe('DELETE /user', function() {
        it('should require authorization', function(done) {
            requester
                .del('/user/2')
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it(`should DELETE with success user with id 2`, function(done) {
            requester
                .del('/user/2')
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
