import type { GetSession, Handle } from '@sveltejs/kit';
import db from '$lib/utils/database';

const dbConnector = db;

export const getSession: GetSession = (request) => {
  let cookie;
  if (request.headers.cookie) {
    cookie = request.headers.cookie
      .split('; ')
      .map((cookie) => {
        let splitted = cookie.split('=');
        return { key: splitted[0], value: splitted[1] };
      })
      .find((cookie) => cookie.key === 'token');
  }
  return {
    userAgent: request.headers['user-agent'],
    token: cookie ? cookie.value : undefined
  };
};

export const handle: Handle = async ({ request, resolve }) => {
  request.locals = { db: dbConnector };
  return await resolve(request);
};
