import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import chaiNock from 'chai-nock';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import nock from 'nock';

import server from '../server';
import resetDatabase from '../utils/resetDatabase';

chai.use(chaiHttp);
chai.use(chaiNock);
chai.use(chaiAsPromised);

// tout les packages et fonction nescessaire au test sont importé ici, bon courage

// fait les Tests d'integration en premier
describe('empty database', () => {

    let emptyBooks = {
        books: []
    }

    beforeEach(() => {
        resetDatabase(path.normalize(`${__dirname}/../data/books.json`), emptyBooks);
    })

    it('should get empty books', done => {
        chai
            .request(server)
            .get('/book')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.books).to.be.a('array');
                expect(res.body.books.length).to.equal(0);
                done();
            });
    });

    it('should post a book', done => {
        chai
            .request(server)
            .post('/book')
            .send(
                {
                    id: '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a7',
                    title: 'Coco raconte Channel 3',
                    years: 1995,
                    pages: 405
                }
            )
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.equals("book successfully added");
                done();
            });
    });
});

describe('mocked database', () => {

    let book = {
        books: [{
            'id': '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9',
            'title': 'Coco raconte Channel 2',
            'years': 1990,
            'pages': 400
        }]
    }

    beforeEach(() => {
        resetDatabase(path.normalize(`${__dirname}/../data/books.json`), book);
    })

    it('should update a book', done => {

        chai
            .request(server)
            .put(`/book/${book.books[0].id}`)
            .send(
                {
                    title: 'Coco raconte Channel 9'
                }
            )
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.message).to.equals("book successfully updated");
                done();
            });
    });

    it('should delete a book', done => {
        chai
            .request(server)
            .delete(`/book/${book.books[0].id}`)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.message).to.equals("book successfully deleted");
                done();
            });
    });

    it('should get a book', done => {
        chai
            .request(server)
            .get(`/book/${book.books[0].id}`)
            .end((err, res) => {
                if (err) console.log(err);
                console.log(res.body);
                expect(res).to.have.status(200);
                expect(res.body.message).to.equals("book fetched");
                expect(res.body).to.be.a('object');
                expect(res.body.book.title).to.be.a('string');
                expect(res.body.book.title).to.equal('Coco raconte Channel 2');
                expect(res.body.book.years).to.be.a('number');
                expect(res.body.book.years).to.equal(1990);
                expect(res.body.book.pages).to.be.a('number');
                expect(res.body.book.pages).to.equal(400);
                done();
            });
    });

});
