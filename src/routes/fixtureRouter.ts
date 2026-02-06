import { Router } from 'express';
import { getFixtures, getResults } from '../controllers/fixtureController';

const router = Router();

router.get('/fixtures', getFixtures);
router.get('/results', getResults);

export default router;