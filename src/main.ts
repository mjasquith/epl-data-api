import { config } from './config';
import app from './index';
import { log } from './utils/logger';
const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  log({ 
    level: 'INFO', 
    message: `Server running on port ${PORT}`, 
    context: 'main', 
    customAttributes: { port: PORT, cacheSettings: config.cache ?? {} } 
  });
});

server.on('error', (err) => {
  log({ 
    level: 'ERROR', 
    message: 'Server error', 
    context: 'main', 
    customAttributes: { error: err } 
  });
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log({ 
    level: 'INFO', 
    message: 'SIGTERM received, shutting down gracefully', 
    context: 'main' 
  });
  server.close(() => {
    log({ 
      level: 'INFO', 
      message: 'Server closed', 
      context: 'main' 
    });
    process.exit(0);
  });
});

export default server;