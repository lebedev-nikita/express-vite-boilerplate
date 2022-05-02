import pgPromise from "pg-promise";

const { PG_LOGIN, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE, PG_SCHEMA: schema } = process.env;
const pgUrl = `postgres://${PG_LOGIN}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;

const pg = pgPromise({ schema })(pgUrl);
pg.connect();

export default pg;
