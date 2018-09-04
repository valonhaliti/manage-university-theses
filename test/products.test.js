// //During the test the env variable is set to test
// process.env.NODE_ENV = 'test';
//
// //Require the dev-dependencies
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../app');
//
// chai.should();
// chai.use(chaiHttp);
//
// //Our parent block
// describe('Products', () => {
//     /**
//      * Test the GET all route
//      */
//     describe('GET /products', () => {
//         it('it should GET all the products', (done) => {
//             chai.request(app)
//                 .get('/products')
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.rows.should.be.a('array');
//                     // res.body.length.should.be.eql(0);
//                     done();
//                 });
//         });
//     });
//
//     /**
//      * Test the GET one product route
//      */
//     describe('POST /products/2', () => {
//         it('should GET product with id 2', (done) => {
//             chai.request(app)
//                 .get('/products/2')
//                 .end((err, res) => {
//                     res.should.have.status(200)
//                     res.body.res.should.be.a('array');
//                     res.body.res[0].id.should.be.eql(2);
//                     done();
//                 })
//         });
//     });
// });