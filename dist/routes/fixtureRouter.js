"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fixtureController_1 = require("../controllers/fixtureController");
const router = (0, express_1.Router)();
router.get('/fixtures', fixtureController_1.getFixtures);
router.get('/results', fixtureController_1.getResults);
exports.default = router;
//# sourceMappingURL=fixtureRouter.js.map