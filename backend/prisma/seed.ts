import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const InteractionMode = {
  LEARN: 'LEARN',
  CHALLENGE: 'CHALLENGE',
  EXPLAIN: 'EXPLAIN',
  VALIDATE: 'VALIDATE',
} as const;

const Feedback = {
  HELPFUL: 'HELPFUL',
  NOT_HELPFUL: 'NOT_HELPFUL',
} as const;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Cognibloom...');

  // Clean existing records in reverse dependency order
  await prisma.interaction.deleteMany();
  await prisma.session.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Primary Demo User
  const demoUser = await prisma.user.create({
    data: {
      username: 'alex_learner',
      email: 'alex@cognibloom.com',
      passwordHash,
    },
  });

  // 2. Create Secondary User (for verifying isolation and IDOR protection)
  const secondaryUser = await prisma.user.create({
    data: {
      username: 'sarah_dev',
      email: 'sarah@cognibloom.com',
      passwordHash,
    },
  });

  console.log(`👤 Created demo users: ${demoUser.username} (id: ${demoUser.id}), ${secondaryUser.username} (id: ${secondaryUser.id})`);

  // ==========================================
  // TOPIC 1: Distributed Systems & Event-Driven Architecture
  // ==========================================
  const topic1 = await prisma.topic.create({
    data: {
      userId: demoUser.id,
      title: 'Distributed Systems & Event-Driven Architecture',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  // Topic 1 - Session 1
  const session1_1 = await prisma.session.create({
    data: {
      topicId: topic1.id,
      startedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000), // 45 mins session
    },
  });

  await prisma.interaction.createMany({
    data: [
      {
        sessionId: session1_1.id,
        mode: InteractionMode.LEARN,
        question: 'What is the difference between at-least-once and exactly-once delivery semantics in message brokers like Kafka?',
        response:
          `[Cognibloom AI - Learning Guide]\n\n` +
          `**Topic:** Distributed Systems & Event-Driven Architecture\n` +
          `**Concept:** Message Delivery Guarantees\n\n` +
          `1. **At-Least-Once Delivery:** The producer retries until an acknowledgement is received. Messages may be duplicated if the network drops the ack, requiring downstream consumers to be idempotent.\n` +
          `2. **Exactly-Once Semantics (EOS):** Combines idempotent producer sequence numbering with two-phase commit transaction coordinators across partitions, ensuring each record is processed precisely once even during broker or worker failure.\n\n` +
          `*Key Takeaway:* In high-throughput architectures, achieving true idempotency at the consumer level is frequently preferable to heavyweight two-phase commits.`,
        feedback: Feedback.HELPFUL,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
      },
      {
        sessionId: session1_1.id,
        mode: InteractionMode.CHALLENGE,
        question: 'Design an idempotent payment processing webhook receiver when third-party gateways retry payloads.',
        response:
          `[Cognibloom AI - Knowledge Challenge]\n\n` +
          `**Challenge Scenario:** High-reliability payment webhook handler\n\n` +
          `### Requirements:\n` +
          `1. Store a unique \`idempotency_key\` or payment intent reference in a transactional database table with a unique constraint.\n` +
          `2. Use atomic database transactions: if the key exists with status \`PROCESSED\`, instantly return \`200 OK\` with cached response.\n` +
          `3. If status is \`PROCESSING\`, return \`409 Conflict\` or wait with exponential backoff.\n\n` +
          `**Question for You:** How would you handle a scenario where the processing server crashes midway through external ledger settlement?`,
        feedback: Feedback.HELPFUL,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000),
      },
    ],
  });

  // Topic 1 - Session 2 (Active/Recent Session)
  const session1_2 = await prisma.session.create({
    data: {
      topicId: topic1.id,
      startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    },
  });

  await prisma.interaction.createMany({
    data: [
      {
        sessionId: session1_2.id,
        mode: InteractionMode.EXPLAIN,
        question: 'Explain the Outbox Pattern and why dual-writing to database and message broker is dangerous.',
        response:
          `[Cognibloom AI - Conceptual Breakdown]\n\n` +
          `**Topic:** Distributed Systems & Event-Driven Architecture\n\n` +
          `### The Dual-Write Problem\n` +
          `Writing to an SQL database and publishing an event to RabbitMQ/Kafka in the same HTTP request is fundamentally non-atomic. If the database commit succeeds but the network fails during event publication (or vice versa), the system enters an inconsistent state.\n\n` +
          `### The Transactional Outbox Solution\n` +
          `1. Write both domain state and outbox event in the same local SQL transaction.\n` +
          `2. A separate background worker (or Debezium CDC) tails the outbox table or WAL logs to reliably publish messages.\n` +
          `3. Guarantees zero lost events without distributed 2PC locks.`,
        feedback: Feedback.HELPFUL,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
      },
      {
        sessionId: session1_2.id,
        mode: InteractionMode.VALIDATE,
        question: 'Is it okay to use 2-minute polling on the outbox table for low-latency notifications?',
        response:
          `[Cognibloom AI - Solution Validation]\n\n` +
          `⚠️ **Assessment:** A 2-minute polling interval creates a severe 120-second latency floor for critical customer notifications and creates unnecessary database spikes.\n\n` +
          `💡 **Recommended Alteration:** Use PostgreSQL \`LISTEN/NOTIFY\` triggers with a node-pg subscriber or Change Data Capture (Debezium) to dispatch outbox records in sub-second intervals.`,
        feedback: Feedback.NOT_HELPFUL,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000),
      },
    ],
  });

  // ==========================================
  // TOPIC 2: TypeScript Advanced Type Gymnastics
  // ==========================================
  const topic2 = await prisma.topic.create({
    data: {
      userId: demoUser.id,
      title: 'TypeScript Advanced Type Gymnastics',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  const session2_1 = await prisma.session.create({
    data: {
      topicId: topic2.id,
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000),
    },
  });

  await prisma.interaction.createMany({
    data: [
      {
        sessionId: session2_1.id,
        mode: InteractionMode.LEARN,
        question: 'How do distributive conditional types work with union types and how to prevent distribution?',
        response:
          `[Cognibloom AI - Learning Guide]\n\n` +
          `**Topic:** TypeScript Advanced Type Gymnastics\n\n` +
          `When a conditional type operates on a bare generic parameter \`T extends U ? X : Y\`, if \`T\` is a union \`A | B\`, TypeScript distributes the condition across each member: \`(A extends U ? X : Y) | (B extends U ? X : Y)\`.\n\n` +
          `### Preventing Distribution\n` +
          `Wrap the generic in a tuple: \`[T] extends [U] ? X : Y\`. This treats the entire union as a single atomic type.`,
        feedback: Feedback.HELPFUL,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
      },
      {
        sessionId: session2_1.id,
        mode: InteractionMode.EXPLAIN,
        question: 'Explain the difference between `infer` keyword inside template literal types vs tuple rest types.',
        response:
          `[Cognibloom AI - Conceptual Breakdown]\n\n` +
          `**Topic:** TypeScript Advanced Type Gymnastics\n\n` +
          `- In template literal types: \`T extends \`\${infer Head}/\${infer Tail}\`\` extracts substrings matching pattern delimiters.\n` +
          `- In tuple types: \`T extends [infer First, ...infer Rest]\` extracts the first element type and the remaining tuple rest slice.\n\n` +
          `This allows building compile-time parsers and deeply typed recursive path navigation.`,
        feedback: null, // Unrated interaction
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000),
      },
    ],
  });

  // ==========================================
  // TOPIC 3: PostgreSQL Indexing & Query Tuning
  // ==========================================
  const topic3 = await prisma.topic.create({
    data: {
      userId: demoUser.id,
      title: 'PostgreSQL Indexing & Query Tuning',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  const session3_1 = await prisma.session.create({
    data: {
      topicId: topic3.id,
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      endedAt: null, // Ongoing session!
    },
  });

  await prisma.interaction.create({
    data: {
      sessionId: session3_1.id,
      mode: InteractionMode.LEARN,
      question: 'When should I choose a BRIN index over a B-tree index in PostgreSQL?',
      response:
        `[Cognibloom AI - Learning Guide]\n\n` +
        `**Topic:** PostgreSQL Indexing & Query Tuning\n\n` +
        `### BRIN (Block Range Index) vs B-Tree:\n` +
        `1. **Physical Ordering:** Use BRIN when table data is naturally correlated with physical block order on disk (e.g. auto-incrementing timestamps, audit logs, or sequential sensor telemetry).\n` +
        `2. **Space Efficiency:** BRIN stores min/max values per page range (e.g. 128 pages), consuming megabytes instead of gigabytes.\n` +
        `3. **Trade-off:** Slightly slower point lookups compared to direct B-tree pointers, but massive speedup for range scans on hundred-million-row tables.`,
      feedback: Feedback.HELPFUL,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  });

  // ==========================================
  // Secondary User Topic (to ensure strict isolation testing)
  // ==========================================
  const secondaryTopic = await prisma.topic.create({
    data: {
      userId: secondaryUser.id,
      title: 'Rust Memory Safety & Lifetimes',
      createdAt: new Date(),
    },
  });

  const secondarySession = await prisma.session.create({
    data: {
      topicId: secondaryTopic.id,
      startedAt: new Date(),
    },
  });

  await prisma.interaction.create({
    data: {
      sessionId: secondarySession.id,
      mode: InteractionMode.LEARN,
      question: 'How does the borrow checker enforce non-aliasing XOR mutability at compile time?',
      response:
        `[Cognibloom AI] Rust borrow checker guarantees memory safety by ensuring references are either aliased immutable or unique mutable.`,
      feedback: Feedback.HELPFUL,
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log(`📊 Seed Summary:`);
  console.log(`- Users: 2`);
  console.log(`- Topics: 4`);
  console.log(`- Sessions: 4`);
  console.log(`- Interactions: 8`);
  console.log(`Demo login credentials: alex@cognibloom.com / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
