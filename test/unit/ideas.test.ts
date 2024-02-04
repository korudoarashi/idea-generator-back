import { faker } from '@faker-js/faker/locale/pt_BR';
import ideaService from '../../src/services/ideas.service';
import { prismaClient } from '../../src/helpers/databank.helper';

describe('Idea (Services)', () => {
  afterAll(async () => {
    prismaClient.idea.deleteMany();
  });

  test('Creating Idea', async () => {
    const mockText = faker.lorem.words({
      min: 3,
      max: 10
    });

    const idea = await ideaService.create(mockText);

    expect(idea).toEqual(expect.objectContaining({
      id: expect.any(String),
      text: mockText
    }));
  });

  test('Getting all Ideas', async () => {
    const ideas = await ideaService.getAll();

    expect(ideas.length).toBeGreaterThan(0);
    expect(ideas).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        text: expect.any(String)
      })
    ]));
  });

  test('Getting random Idea', async () => {
    const [idea] = await ideaService.getRandom();

    expect(idea).toBeTruthy();
    expect(idea).toEqual(expect.objectContaining({
      id: expect.any(String),
      text: expect.any(String)
    }));
  });

  test('Getting Idea by Id', async () => {
    const [idea] = await ideaService.getRandom();
    const searchedIdea = await ideaService.get(idea?.id || '0');

    expect(idea).toBeTruthy();
    expect(searchedIdea).toEqual(expect.objectContaining({
      id: expect.any(String),
      text: expect.any(String)
    }));
  });

  test('Updating Idea', async () => {
    const [idea] = await ideaService.getRandom();
    const newText = faker.lorem.word(10) + '-' + idea?.text;
    const hasUpdated = await ideaService.update(idea?.id || '0', newText);
    const searchedIdea = await ideaService.get(idea?.id || '0');

    expect(idea).toBeTruthy();
    expect(hasUpdated).toBeTruthy();
    expect(searchedIdea?.text).toBe(newText);
  });

  test('Deleting Idea', async () => {
    const [idea] = await ideaService.getRandom();
    const hasDeleted = await ideaService.delete(idea?.id || '0');
    const searchedIdea = await ideaService.get(idea?.id || '0');

    expect(idea).toBeTruthy();
    expect(hasDeleted).toBeTruthy();
    expect(searchedIdea).toBeFalsy();
  });
});
