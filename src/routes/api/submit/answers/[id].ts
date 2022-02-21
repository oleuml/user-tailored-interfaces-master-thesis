import database from '$lib/utils/database';
import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const post: RequestHandler = async ({ request, params }) => {
  const cookies = cookie.parse(request.headers.get('cookie'));
  const proband = (await database('proband_data')).find((x) => x.token === cookies.token);
  if (proband === undefined) return { status: 401, body: 'invalid token' };

  const uid = proband.id;
  const qid = params.id;
  if ((await database('answers')).find((x) => x.uid === uid && x.qid === qid) !== undefined)
    return { status: 400, body: `already data submitted for this question ${qid} and token` };

  // Save answers in database
  const answer = await request.json();
  const date = Date.now();
  await database('answers').insert({
    uid: uid,
    qid: qid,
    answer: JSON.stringify(answer),
    createdAt: date
  });

  return {};
};
