import { NextFunction, Request, Response } from 'express';
import { cacheService } from '../services/cacheService';
import { log } from '../utils/logger';

async function getHealth(
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  try {
    const cacheSummary = cacheService.getSummary();
    res.json({
      status: 'OK',
      cache: cacheSummary
    });
    const cacheKeys = Object.keys(cacheSummary);
    log({ 
      level: 'INFO', 
      message: 'Health check successful',
      context: 'healthController',
      customAttributes: { cacheEntriesCount: cacheKeys.length, cacheKeys: cacheKeys.join(', ') }
    });
  } catch (err) {
    log({ 
      level: 'ERROR', 
      message: `Health check failed: ${err instanceof Error ? err.message : String(err)}`, 
      context: 'healthController', 
      customAttributes: { error: err instanceof Error ? err.stack : String(err) } 
    });
    _next(err);
  }
}

export { getHealth };