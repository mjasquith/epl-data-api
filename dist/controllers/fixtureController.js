"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFixtures = getFixtures;
exports.getResults = getResults;
const upstreamApiService_1 = require("../services/upstreamApiService");
async function getFixtures(_req, res, _next) {
    try {
        const fixtures = await (0, upstreamApiService_1.fetchMatches)('fixtures');
        res.json(fixtures);
    }
    catch (err) {
        _next(err);
    }
}
async function getResults(_req, res, _next) {
    try {
        const results = await (0, upstreamApiService_1.fetchMatches)('results');
        res.json(results);
    }
    catch (err) {
        _next(err);
    }
}
//# sourceMappingURL=fixtureController.js.map