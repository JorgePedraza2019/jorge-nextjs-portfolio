// Comando para correr este script de embedding al indice de pinecone
// NODE_ENV=development \
// DOTENV_CONFIG_PATH=env/feature/local.env \
// npx ts-node -r dotenv/config src/scripts/ingest-portfolio.ts

// DOTENV_CONFIG_PATH=env/qa/local.env \
// npx ts-node -r dotenv/config src/scripts/ingest-portfolio.ts

import 'dotenv/config';
import OpenAI from 'openai';
import { pinecone } from '../lib/pinecone.client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const NAMESPACE = 'portfolio';
const index = pinecone
  .index(process.env.PINECONE_INDEX_NAME!)
  .namespace(NAMESPACE);

type Document = {
  id: string;
  text: string;
  metadata: Record<string, any>;
};

async function embedAndUpsert(doc: Document) {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: doc.text,
  });

  await index.upsert([
    {
      id: doc.id,
      values: embedding.data[0].embedding,
      metadata: doc.metadata,
    },
  ]);

  console.log(`✔ Upserted: ${doc.id}`);
}

async function ingest() {
  const documents: Document[] = [
    // ======================
    // PROFILE
    // ======================
    {
      id: 'cv-profile',
      text: `
Dynamic IT professional with over 3 years of experience in front-end development,
specializing in React and Next.js, with full-stack experience through the MERN stack.
Proven track record building scalable web applications and improving performance.
`,
      metadata: {
        source: 'profile',
        section: 'cv',
        role: 'Software Developer',
        location: 'Monterrey, Mexico',
      },
    },

    // ======================
    // SKILLS
    // ======================
    {
      id: 'cv-skills',
      text: `
Programming Languages: JavaScript, Python, SQL.
Frameworks: React, Node.js, Express.js, Next.js.
Databases: MongoDB, MySQL.
Tools: Git, CI/CD, Linux, Docker, PowerBI.
Cloud: AWS (EC2, S3, RDS, VPC), NGINX, DevOps.
`,
      metadata: {
        source: 'skills',
        section: 'cv',
      },
    },

    // ======================
    // EXPERIENCE
    // ======================
    {
      id: 'experience-onibex-js-dev',
      text: `
JavaScript Developer at Onibex (Jan 2022 – Present).
Implemented scalable front-end solutions using React and Next.js.
Expanded into full-stack development with Node.js and MySQL.
Improved page load performance by 30%.
`,
      metadata: {
        source: 'experience',
        company: 'Onibex',
        role: 'JavaScript Developer',
      },
    },

    {
      id: 'experience-onibex-aws',
      text: `
AWS Engineer at Onibex (Jan 2023 – Jan 2024).
Led a team of 5 engineers to design and deploy AWS infrastructure.
Built high-availability systems and reduced downtime by 10%.
`,
      metadata: {
        source: 'experience',
        company: 'Onibex',
        role: 'AWS Engineer',
      },
    },

    // ======================
    // PROJECTS
    // ======================
    {
      id: 'project-servigo',
      text: `
ServiGO (Onibex).
Built a responsive web application using React and Next.js.
Improved UI performance by 30% using Material UI.
Reduced load times by 20% through optimized API calls.
`,
      metadata: {
        source: 'project',
        tech: ['React', 'Next.js', 'Material UI'],
      },
    },

    {
      id: 'project-connect-confluent',
      text: `
Connect with Confluent (Onibex).
Developed a web portal for managing Kafka clusters using Next.js.
Implemented authentication and real-time monitoring dashboards.
`,
      metadata: {
        source: 'project',
        tech: ['Next.js', 'Kafka', 'Material UI'],
      },
    },

    {
      id: 'project-ai-portfolio',
      text: `
This portfolio is a full-stack AI-enabled system using Next.js, NestJS,
Docker, Pinecone, and OpenAI.
It includes a custom RAG pipeline with vector search and LLM inference.
`,
      metadata: {
        source: 'project',
        tech: ['Next.js', 'NestJS', 'Pinecone', 'OpenAI', 'Docker'],
      },
    },
  ];

  for (const doc of documents) {
    await embedAndUpsert(doc);
  }

  console.log('🎉 CV ingestion completed successfully');
}

ingest().catch(console.error);
