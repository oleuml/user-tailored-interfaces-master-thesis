/// <reference types="@sveltejs/kit" />
import type { Knex } from 'knex';

declare global {
  declare namespace App {
    interface Locals {
      db: Knex;
    }

    interface Platform {}

    interface Session {}

    interface Stuff {}
  }
}
