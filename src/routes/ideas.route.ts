import { Router } from 'express';
import ideaController from '../controllers/ideas.controller';

const router = Router();

router.get('/', ideaController.getAll);
router.get('/search/:id', ideaController.get);
router.get('/random', ideaController.getRandom);
router.post('/create', ideaController.create);
router.put('/update', ideaController.update);
router.delete('/delete', ideaController.delete);

export const ideaRouter = Router().use('/idea', router);
