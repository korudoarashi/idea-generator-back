import { Router } from 'express';
import { ideaRouter } from './ideas.route';

const router = Router();

router.use(ideaRouter);

export const baseRouter = Router().use('/api', router);
