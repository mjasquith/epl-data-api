"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const fixtureRouter_1 = __importDefault(require("./routes/fixtureRouter"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
app.use('/matches', fixtureRouter_1.default);
// 404 for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: { message: 'Not Found', status: 404 } });
});
// Error handler (must be last)
app.use(errorHandler_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map