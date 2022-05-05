import dayjs from "dayjs";
import { Request } from "express";
import { Pool } from "pg";

export const pg = {
  init() {
    this.pool = new Pool({
      host: process.env.SERVER_STAT_PG_HOST,
      port: +process.env.SERVER_STAT_PG_PORT!,
      database: process.env.SERVER_STAT_PG_DB,
      user: process.env.SERVER_STAT_PG_USER,
      password: process.env.SERVER_STAT_PG_PASSWORD,
    });
    this.pool.connect();
  },

  async log(info: Info, error?: Error) {
    const service = process.env.SERVICE;
    const month = dayjs().format("YYYYMM");

    const { rows: table } = await this.pool.query(`
      SELECT *
      FROM information_schema.tables
      WHERE table_schema = 'stat' and table_name = 'events_${month}_${service}'
    `);

    if (table.length == 0) {
      await this.pool.query(`
        CREATE TABLE stat.events_${month}_${service}
        PARTITION OF stat.events for values from ('${month}','${service}') to ('${month}','${service} ');
  
        CREATE INDEX ON stat.events_${month}_${service} USING HASH (login);
        CREATE INDEX ON stat.events_${month}_${service} USING HASH (query);
        CREATE INDEX ON stat.events_${month}_${service} USING HASH (created_at);
        CREATE INDEX ON stat.events_${month}_${service} USING HASH (fail_hash);
      `);
    }

    if (!info.ip || info.ip.length > 15) {
      info.ip = null;
    }

    const { user_id, query, params, query_time, ip, url, domain } = info;
    await this.pool.query(
      `
        INSERT INTO stat.events
        (created_at, login, month, service, query, params, query_time, ip, url, domain, fail_hash, fail_details)
        VALUES 
        (now()     , $1   , $2   , $3     , $4   , $5    , $6        , $7, $8 , $9    , $10      , $11)
      `,
      [user_id, month, service, query, params, query_time, ip, url, domain, null, error?.message]
    );
  },
};

export const getInfo = (req: Request, user_id: string, query_time: number) => {
  const params = {
    ...req.query,
    ...(req.headers["content-type"] == "application/json" && req.body),
  };

  return {
    user_id,
    query_time,
    params,
    ip: req["X-Real-IP"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    method: req.method,
    query: req.originalUrl,
    domain: req.headers["last-host"] || req.headers["Host"] || null,
    url: req.protocol + "://" + req.headers["last-host"] + req.originalUrl,
  };
};

export type Info = ReturnType<typeof getInfo>;
