import express from 'express';
import errorHandler from './middleware/errorHandler';
import fixtureRouter from './routes/fixtureRouter';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/matches', fixtureRouter);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Not Found', status: 404 } });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;