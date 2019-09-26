const request = require('../request');
const db = require('../db');

describe.only('shows api', () => {

  beforeEach(() => {
    return Promise.all([
      db.dropCollection('cats'),
      db.dropCollection('shows'),
      db.dropCollection('locations')
    ]);
  });

  const felix = {
    name: 'felix',
    type: 'tuxedo',
    lives: 9,
    hasSidekick: false,
    year: 1919,
    media: []
  };

  const show = {
    title: 'Rainbow Cats',
    cats: [],
    locations: []
  };

  function postShow(show) {
    return request
      .post('/api/cats')
      .send(felix)
      .expect(200)
      .then(({ body }) => {
        show.cats[0] = body._id;
        return request.post('/api/shows')
          .send(show)
          .expect(200);
      })
      .then(({ body }) => body);
  }

  it('posts a show', () => {
    return postShow(show)
      .then(show => {
        expect(show).toEqual({
          _id: expect.any(String),
          __v: 0,
          ...show
        });
      });
  });

  it('gets a show by id', () => {
    return postShow(show)
      .then(savedShow => {
        return request
          .get(`/api/shows/${savedShow._id}`)
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              ...savedShow,
              cats: [{
                _id: expect.any(String),
                __v: 0,
                ...felix
              }]
            });
          });
      });
  });

});