import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import errorHandler from './middleware/errorHandler';
import fixtureRouter from './routes/fixtureRouter';

const app = express();

// Load Swagger YAML
const swaggerPath = path.join(__dirname, '../src/swagger.yaml');
const swaggerDoc: any = YAML.load(fs.readFileSync(swaggerPath, 'utf8'));

// Middleware
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Redirect root to API docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

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