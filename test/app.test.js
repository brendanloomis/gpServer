const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const app = res.body[0];
                expect(app).to.include.all.keys(
                    'App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 'Type', 'Price', 'Content Rating', 'Genres', 'Last Updated', 'Current Ver', 'Android Ver'
                );
            });
    });

    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'MISTAKE' })
            .expect(400, 'sort must be one of Rating or App');
    });

    it('should be 400 if genres is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'MISTAKE' })
            .expect(400, 'genres must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card');
    });

    it('should sort by Rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;

                let i = 0;
                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];

                    if(appAtIPlus1.Rating > appAtI.Rating) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });

    });

    it('should sort by App', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'App' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;

                let i = 0;
                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];

                    if(appAtIPlus1.App < appAtI.App) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should filter by genres', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'Action' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let filtered = true;
               
                for(let i = 0; i < res.body.length; i++) {
                    let genres = res.body[i].Genres;
                    if (!genres.includes('Action')) {
                        filtered = false;
                    }
                };
                expect(filtered).to.be.true;
            });
    });

})