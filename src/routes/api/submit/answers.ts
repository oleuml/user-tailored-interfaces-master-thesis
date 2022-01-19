import database from '$lib/utils/database';
import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const post: RequestHandler = async (request) => {
  const cookies = cookie.parse(request.headers.cookie);
  const proband = (await database('proband_data')).find((x) => x.token === cookies.token);
  if (proband === undefined) return { status: 401, body: 'invalid token' };

  const uid = proband.id;
  if ((await database('answers')).find((x) => x.uid === uid) !== undefined)
    return { status: 400, body: 'already data submitted for this token' };

  // Save answers in database
  const answers = request.body;
  const date = Date.now();
  Object.entries(answers).forEach(async (x) => {
    const key = x[0];
    const value = x[1];
    2;
    await database('answers').insert({
      uid: uid,
      qid: key,
      answer: JSON.stringify(value),
      createdAt: date
    });
  });

  return {};
};
