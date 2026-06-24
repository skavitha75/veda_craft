/**
 * Health Check Route — GET /api/v1/health
 *
 * Used by monitoring tools, load balancers, and CI pipelines to verify
 * that the server is running and its dependencies are reachable.
 */

import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

/**
 * GET /api/v1/health
 * Basic liveness check — returns server status and uptime.
 */
router.get('/', async (req, res) => {
  const startTime = Date.now();

  // Ping Supabase to verify database connectivity
  let dbStatus = 'ok';
  let dbLatencyMs = null;

  try {
    const dbStart = Date.now();
    const { error } = await supabase.from('_health_check').select('*').limit(1).maybeSingle();
    dbLatencyMs = Date.now() - dbStart;

    // A "relation does not exist" error is fine — the server is still connected
    if (error && !error.message.includes('does not exist')) {
      dbStatus = 'degraded';
    }
  } catch {
    dbStatus = 'unreachable';
  }

  const responseTimeMs = Date.now() - startTime;

  return res.status(200).json({
    success: true,
    status: 200,
    data: {
      server: 'ok',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      uptime: `${Math.floor(process.uptime())}s`,
      timestamp: new Date().toISOString(),
      responseTimeMs,
      services: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
      },
    },
  });
});

export default router;
