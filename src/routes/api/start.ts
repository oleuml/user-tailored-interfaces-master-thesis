import type { RequestHandler } from '@sveltejs/kit';
import type { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export const post: RequestHandler = async (request) => {
  const db: Knex = request.locals.db;

  const userAgent = request.headers['user-agent'];
  const screenSize = request.body.screenSize;
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
      "set-cookie": [`token=${token}; path=/;`],
      Location: "/survey/0",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
};
