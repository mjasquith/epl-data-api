import { Router } from 'express';
import { getAllMatches, getFixtures, getResults } from '../controllers/fixtureController';

const router = Router();

router.get('/fixtures', getFixtures);
router.get('/results', getResults);
router.get('/all', getAllMatches);

export default router;