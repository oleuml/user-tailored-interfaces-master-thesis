import type { GetSession, Handle } from '@sveltejs/kit';
import db from '$lib/utils/database';
import cookie from 'cookie';

const dbConnector = db;

export const getSession: GetSession = ({ request }) => {
  let c;
  if (request.headers.get('cookie')) {
    c = cookie.parse(request.headers.get('cookie'));
  }
  return {
    userAgent: request.headers.get('user-agent'),
    token: c ? c.token : undefined,
    page: c ? c.page : undefined
  };
};

export const handle: Handle = async ({ event, resolve }) => {
  event.locals = { db: dbConnector };
  return await resolve(event);
};
