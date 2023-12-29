import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';
import { Category } from './../src/shared/enums/category.enum';

describe('Book & Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(() => {
    mongoose.connect(process.env.DB_URI).then(() => {
      mongoose.connection.db.dropDatabase();
    });
  })

  afterAll(() => {
    mongoose.disconnect();
  });

  const user = {
    name: 'Luis Fernando Suarez',
    email: 'luis@gmail.com',
    password: '123456'
  }

  const newBook = { // dato para simular el registro de un book
    title: 'New Book',
    description: 'Book descrption',
    author: 'Author',
    price: 100,
    category: Category.FANTASY
  }

  let jwtToken: string = '';
  let bookCreate;

  describe('Auth', ()=> {
    it('(POST) register a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
        })
    });
  
    it('(GET) login a user', async () => {
      return request(app.getHttpServer())
        .get('/auth/signin')
        .send({email: user.email, password: user.password})
        .expect(200)
        .then((res) => {
          expect(res.body.token).toBeDefined();
          jwtToken = res.body.token;
        })
    });
  });

  describe('Book', () => {
    it('(POST) - Create a new book', async () => {
      return request(app.getHttpServer())
        .post('/books')
        .send(newBook)
        .set("Authorization", 'Bearer ' + jwtToken)
        .expect(201)
        .then((res) => {
          expect(res.body._id).toBeDefined();
          expect(res.body.title).toEqual(newBook.title);
          bookCreate = res.body;
        })
    });

    it('(GET) - Get all books', async () => {
      return request(app.getHttpServer())
        .get('/books')
        .set("Authorization", 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBe(1);
        })
    });

    it('(GET) - Get books filteres by keyword', async () => {
      const query = { page: '1', keyword: 'book' };
      return request(app.getHttpServer())
        .get(`/books/filter?keyword=${query.keyword}&page=${query.page}`)
        .set("Authorization", 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body.filter.length).toBe(1);
        })
    });

    it('(GET) - Get a book', async () => {
      return request(app.getHttpServer())
        .get(`/books/${bookCreate?._id}`)
        .set("Authorization", 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(bookCreate._id)
        })
    });

    it('(PUT) - Update a book by Id', async () => {
      const book = { title: 'Update title' };

      return request(app.getHttpServer())
        .put(`/books/${bookCreate?._id}`)
        .send(book)
        .set("Authorization", 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toEqual(book.title)
        })
    });

    it('(DELETE) - Deleta a book by Id', async () => {
      return request(app.getHttpServer())
        .delete(`/books/${bookCreate?._id}`)
        .set("Authorization", 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.deleted).toEqual(true);
        })
    });
  });
});
