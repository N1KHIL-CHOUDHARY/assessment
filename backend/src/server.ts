import { app } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Cognibloom API server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  console.log(`📡 Health endpoint: http://localhost:${env.PORT}/api/health`);
});

// Graceful shutdown handling
async function gracefulShutdown(signal: string) {
  console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Prisma database client disconnected.');
    process.exit(0);
  });

  // Force shutdown after 10s if dangling connections exist
  setTimeout(() => {
    console.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
