import type { GetSession, Handle } from "@sveltejs/kit";
import db from "$lib/utils/database";
import cookie from "cookie";

const dbConnector = db;

export const getSession: GetSession = (request) => {
  let c;
  if (request.headers.cookie) {
    c = cookie.parse(request.headers.cookie);
  }
  return {
    userAgent: request.headers["user-agent"],
    token: c ? c.token : undefined,
    page: c ? c.page : undefined,
  };
};

export const handle: Handle = async ({ request, resolve }) => {
  request.locals = { db: dbConnector };
  return await resolve(request);
};
