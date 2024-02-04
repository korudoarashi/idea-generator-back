import { faker } from '@faker-js/faker/locale/pt_BR';
import request from 'supertest';
import app, { server } from '../../src/app';
import { prismaClient } from '../../src/helpers/databank.helper';

const baseUrl = '/api';

describe('Ideas (via API)', () => {
  const url = `${baseUrl}/idea`;

  afterAll(async () => {
    await prismaClient.idea.deleteMany({});
    server.close();
  });

  test('Creating Idea', async () => {
    const mockText = faker.lorem.words({
      min: 3,
      max: 10
    });

    const response = await request(app)
      .post(`${url}/create`)
      .send({
        text: mockText
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toEqual(expect.objectContaining({
      id: expect.any(String),
      text: mockText
    }));

    const ideaSearchedById = await prismaClient.idea.findFirst({
      where: {
        id: response.body.result?.id
      }
    });

    expect(response.body.result).toEqual(ideaSearchedById);
  });

  test('Search Idea by Id', async () => {
    const idea = await prismaClient.idea.findFirst({});
    const searchResponse = await request(app)
      .get(`${url}/search/${idea?.id || 0}`);

    expect(searchResponse.statusCode).toBe(200);
    expect(searchResponse.body.result).toEqual(idea);
  });

  test('Get all Ideas', async () => {
    const response = await request(app)
      .get(`${url}/`);

    expect(response.statusCode).toBe(200);
    expect(response.body.results?.length).toEqual(await prismaClient.idea.count());
    expect(response.body.results).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        text: expect.any(String)
      })
    ]));
    expect(response.body.results).toEqual(await prismaClient.idea.findMany({}));
  });

  test('Getting random Idea', async () => {
    const response = await request(app)
      .get(`${url}/random`);

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toEqual(expect.objectContaining({
      id: expect.any(String),
      text: expect.any(String)
    }));

    const ideaSearchedById = await prismaClient.idea.findFirst({
      where: {
        id: response.body.result?.id
      }
    });

    expect(response.body.result).toEqual(ideaSearchedById);
  });

  test('Updating random Idea', async () => {
    const response = await request(app)
      .get(`${url}/random`);

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toEqual(expect.objectContaining({
      id: expect.any(String),
      text: expect.any(String)
    }));

    const previousText = response.body.result?.text;
    const mockText = faker.lorem.words({
      min: 3,
      max: 10
    });

    const newText = previousText + '-' + mockText;

    const updatedIdeaResponse = await request(app)
      .put(`${url}/update`)
      .send({
        id: response.body.result?.id,
        text: newText
      });

    expect(updatedIdeaResponse.statusCode).toBe(200);
    expect(updatedIdeaResponse.body.updated).toBeTruthy();

    const ideaSearchedById = await prismaClient.idea.findFirst({
      where: {
        id: response.body.result?.id
      }
    });

    expect(ideaSearchedById).toBeTruthy();
    expect(ideaSearchedById?.text).toBe(newText);
  });

  test('Deleting random Idea', async () => {
    const response = await request(app)
      .get(`${url}/random`);

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toEqual(expect.objectContaining({
      id: expect.any(String),
      text: expect.any(String)
    }));

    const deletedIdeaResponse = await request(app)
      .delete(`${url}/delete`)
      .send({
        id: response.body.result?.id
      });

    expect(deletedIdeaResponse.statusCode).toBe(200);
    expect(deletedIdeaResponse.body.deleted).toBeTruthy();

    const ideaSearchedById = await prismaClient.idea.findFirst({
      where: {
        id: response.body.result?.id
      }
    });

    expect(ideaSearchedById).toBeFalsy();
  });
});
