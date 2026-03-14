import { Router } from 'express';
import { getAllMatches, getFixtures, getResults, getLiveMatches } from '../controllers/fixtureController';

const router = Router();

router.get('/fixtures', getFixtures);
router.get('/results', getResults);
router.get('/live', getLiveMatches);
router.get('/all', getAllMatches);

export default router;