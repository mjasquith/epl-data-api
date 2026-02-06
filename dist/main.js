"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const PORT = Number(process.env.PORT) || 3000;
const server = index_1.default.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
server.on('error', (err) => {
    console.error('Server error', err);
    process.exit(1);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
exports.default = server;
//# sourceMappingURL=main.js.map