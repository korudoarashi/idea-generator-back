import { Idea, Prisma } from '@prisma/client';
import { prismaClient } from '../helpers/databank.helper';

const client = prismaClient.idea;
type Model = Idea;

const ideaService = {
  create: (text: string): Promise<Model> => {
    return client.create({
      data: {
        text
      }
    });
  },
  getAll: (): Promise<Model[]> => {
    return client.findMany({});
  },
  get: (id: string): Promise<Model | null> => {
    return client.findFirst({
      where: {
        id
      }
    });
  },
  getRandom: async (): Promise<Array<Model | null>> => {
    return await prismaClient.$queryRaw(
      Prisma.sql`SELECT *
      FROM idea
      ORDER BY random()
      LIMIT 1;`
    );
  },
  update: async (id: string, text: string): Promise<boolean> => {
    const updatedRecords = await client.updateMany({
      where: {
        id
      },
      data: {
        text
      }
    });

    return updatedRecords.count > 0;
  },
  delete: async (id: string): Promise<boolean> => {
    const deletedRecords = await client.deleteMany({
      where: {
        id
      }
    });

    return deletedRecords.count > 0;
  },
};

export default ideaService;
