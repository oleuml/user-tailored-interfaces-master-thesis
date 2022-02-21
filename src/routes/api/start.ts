import type { RequestHandler } from '@sveltejs/kit';
import type { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export const post: RequestHandler = async ({ request, locals }) => {
  const db: Knex = locals.db;

  const data = await request.json();
  const userAgent = request.headers.get('user-agent');
  const screenSize = data.screenSize;
  const token = uuidv4();
  // Save session in Database
  await db('proband_data').insert({
    token: token,
    userAgent: userAgent,
    initScreenSize: JSON.stringify(screenSize),
    createdAt: Date.now()
  });

  return {
    status: 302,
    headers: {
      'set-cookie': [`token=${token}; path=/;`, `task=0; path=/`],
      Location: '/survey',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
};
