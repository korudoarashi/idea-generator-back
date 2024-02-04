import { RequestHandler } from 'express';
import ideaService from '../services/ideas.service';

const ideaController: Record<keyof typeof ideaService, RequestHandler> = {
  create: async (req, res) => {
    const {
      text
    } = req.body as {
      text?: string
    };

    if(!text || typeof text !== 'string')
      return res.status(400).send();

    const newIdea = await ideaService.create(text);

    if(!newIdea)
      return res.status(500).send();

    res.status(200).send({
      result: newIdea
    });
  },
  getAll: async (_, res) => {
    res.status(200).send({
      results: await ideaService.getAll()
    });
  },
  get: async (req, res) => {
    const {
      id
    } = req.params as {
      id?: string
    };

    if(!id || typeof id !== 'string')
      return res.status(400).send();

    const searchedIdea = await ideaService.get(id);

    if(!searchedIdea)
      return res.status(404).send({
        result: null
      });

    res.status(200).send({
      result: searchedIdea
    });
  },
  getRandom: async (_, res) => {
    const [randomIdea] = await ideaService.getRandom();

    if(!randomIdea)
      return res.status(404).send({
        result: null
      });

    return res.status(200).send({
      result: randomIdea
    });
  },
  update: async (req, res) => {
    const {
      id,
      text
    } = req.body as {
      id?: string,
      text?: string
    };

    if(!id || typeof id !== 'string')
      return res.status(400).send();

    if(!text || typeof text !== 'string')
      return res.status(400).send();

    const hasUpdated = await ideaService.update(id, text);

    res.status(200).send({
      updated: hasUpdated
    });
  },
  delete: async (req, res) => {
    const {
      id
    } = req.body as {
      id?: string
    };

    if(!id || typeof id !== 'string')
      return res.status(400).send();

    const hasDeleted = await ideaService.delete(id);

    res.status(200).send({
      deleted: hasDeleted
    });
  }
};

export default ideaController;
