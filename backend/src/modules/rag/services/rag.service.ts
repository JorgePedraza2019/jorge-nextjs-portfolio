import { Injectable } from '@nestjs/common';
import { QueryPromptDto } from '../dto/query-prompt.dto';
import { pinecone } from '../../../lib/pinecone.client';
import OpenAI from 'openai';
import { Response } from 'express';

@Injectable()
export class RagService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  // Streaming para la barra de AI
  async stream(queryPromptDto: QueryPromptDto, res: Response): Promise<void> {
    const { prompt } = queryPromptDto;

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    try {
      const index = pinecone.index(process.env.PINECONE_INDEX_NAME!).namespace('portfolio');

      const embeddingResponse = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: prompt,
      });
      const vector = embeddingResponse.data[0].embedding;

      const queryResponse = await index.query({
        vector,
        topK: 15,
        includeMetadata: true,
      });

      const context = queryResponse.matches
        ?.map((match) => {
          const md = match.metadata ?? {};
          if (md.source === 'project') {
            const techList = Array.isArray(md.tech) ? md.tech.join(", ") : "N/A";
            return `Project: ${md.project ?? match.id}\nTechnologies: ${techList}`;
          } else if (md.source === 'experience') {
            return `Experience: ${md.role ?? "N/A"} at ${md.company ?? "N/A"}\nDetails: ${md.text ?? ""}`;
          } else {
            return `Section: ${md.section ?? md.source ?? "N/A"}\nDetails: ${md.text ?? ""}`;
          }
        })
        .join('\n\n');

      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        stream: true,
        messages: [
          {
            role: 'system',
            content: `You are a professional assistant who answers questions about Jorge using only the information from the context. If the question is about projects or experiences, list all details found in the context. Always respond in English. Context:\n${context}\n\nQuestion:\n${prompt}`,
          },
          {
            role: 'user',
            content: `Context:\n${context}\n\nQuestion:\n${prompt}`,
          },
        ],
        temperature: 0.3,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) res.write(`data: ${delta}\n\n`);
      }

      // Enviar sources al final solo si existen
      const sources = queryResponse.matches?.map((m) => m.metadata) ?? [];
      if (sources.length > 0) {
        res.write(`data: __SOURCES__${JSON.stringify(sources)}\n\n`);
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      console.error(error);
      res.write(`data: Ocurrió un error procesando la solicitud.\n\n`);
      res.end();
    }
  }

  // Query simple para fetch / API
  async query(promptDto: QueryPromptDto) {
    const { prompt } = promptDto;

    const index = pinecone.index(process.env.PINECONE_INDEX_NAME!).namespace('portfolio');

    const embeddingResponse = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: prompt,
    });
    const vector = embeddingResponse.data[0].embedding;

    const queryResponse = await index.query({
      vector,
      topK: 15,
      includeMetadata: true,
    });

    const relevantMatches = queryResponse.matches ?? [];

    // Construir contexto legible
    const context = relevantMatches
      .map((match) => {
        const md = match.metadata ?? {};
        if (md.source === 'project') {
          const techList = Array.isArray(md.tech) ? md.tech.join(", ") : "N/A";
          return `Project: ${md.project ?? match.id}\nTechnologies: ${techList}`;
        } else if (md.source === 'experience') {
          return `Experience: ${md.role ?? 'N/A'} at ${md.company ?? 'N/A'}\nDetails: ${md.text ?? ''}`;
        } else {
          return `Section: ${md.section ?? md.source ?? 'N/A'}\nDetails: ${md.text ?? ''}`;
        }
      })
      .join('\n\n');

    // Si no hay matches, devolvemos mensaje estándar
    if (relevantMatches.length === 0) {
      return {
        answer: 'I don’t have information about that in Jorge’s portfolio yet.',
        sources: [],
      };
    }

    // Llamada al LLM
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional assistant who answers questions about the candidate’s portfolio and experience using only the provided context. Always respond in English.',
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion:\n${prompt}`,
        },
      ],
      temperature: 0.3,
    });

    return {
      answer: completion.choices[0].message.content,
      sources: relevantMatches.map((m) => m.metadata),
    };
  }
}