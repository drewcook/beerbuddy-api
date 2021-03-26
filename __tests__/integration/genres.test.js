const request = require('supertest');
const { Genre } = require('../../models/Genre');
const { User } = require('../../models/User');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
  beforeEach(() => {
    // start server
    server = require('../../index');
  });

  afterEach(async () => {
    // close server
    await server.close();
    // cleanup table after each test run
    await Genre.deleteMany({});
  });

  describe('GET /', () => {
    test('should return all genres', async () => {
      // populate the table with a couple records
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' },
      ]);

      const res = await request(server).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    test('should return a genre if valid ID is passed', async () => {
      // populate an entry
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });

    test('should return 404 if an invalid ID is passed', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });

    test('should return 404 if genre does not exist', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/genres/${id}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    // Define the happy path, and then in each test, we change
    // one parameter that clearly aligns with the name of the test.
    let token;
    let name;

    const exec = async () => {
     return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    })

    test('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    test('should return 400 if genre is less than 5 characters', async () => {
      name = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should save the genre if it is valid', async () => {
      await exec();

      const genre = await Genre.find({name: 'genre1'});

      expect(genre).not.toBeNull();
    });

    test('should return the genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });

  describe('PUT /:id', () => {
    let token;
    let id;
    let name;

    beforeEach(() => {
      token = new User().generateAuthToken();
      id = mongoose.Types.ObjectId();
      name = 'newName'
    });

    const exec = () => {
      return request(server)
        .put(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send({ name });
    };

    test('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    test('should return 400 if genre is less than 5 characters', async () => {
      name = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 404 if genre does not exist', async () => {
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should return the updated genre if valid', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();
      id = genre._id;

      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'newName');
    });
  });

  describe('DELETE /:id', () => {
    let token;
    let id;

    beforeEach(() => {
      token = new User({ _id: 1, isAdmin: true }).generateAuthToken();
      id = mongoose.Types.ObjectId();
    });

    const exec = () => {
      return request(server)
        .delete(`/api/genres/${id}`)
        .set('x-auth-token', token);
    };

    test('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    test('should return 403 if client user is not admin', async () => {
      token = new User({ _id: 1, isAdmin: false }).generateAuthToken();
      const res = await exec();

      expect(res.status).toBe(403);
    });

    test('should return 404 if genre does not exist', async () => {
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should return the deleted genre if valid', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();
      id = genre._id;

      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });

    it('should delete the genre if input is valid', async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });
  });
});
