import express from 'express';
import * as fs from 'fs';
import YAML from 'js-yaml';
import * as path from 'path';
import swaggerUi from 'swagger-ui-express';
import errorHandler from './middleware/errorHandler';
import fixtureRouter from './routes/fixtureRouter';
import healthRouter from './routes/healthRouter';

const app = express();

// Load Swagger YAML
const swaggerPath = path.join(__dirname, '../src/swagger.yaml');
const swaggerDoc: any = YAML.load(fs.readFileSync(swaggerPath, 'utf8'));

// Middleware
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Redirect root to health check
app.get('/', (req, res) => {
  res.redirect('/health');
});

// Routes
app.use('/health', healthRouter);

app.use('/matches', fixtureRouter);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Not Found', status: 404 } });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;