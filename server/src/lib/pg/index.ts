import { Pool } from "pg";

class Client {
  private client: Pool;

  constructor(client: Pool) {
    this.client = client;
  }

  query = async (sql_template: string, vars?) => {
    const [sql, params] = _transform(sql_template, vars);
    try {
      return await this.client.query(sql, params);
    } catch (e) {
      throw new Error(`Postgres error: ${e.message} (${e.hint})`);
    }
  };

  get = async (sql_template: string, vars?, ifNotFoundMessage?: string) => {
    const result = await this.query(sql_template, vars);
    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      if (ifNotFoundMessage) {
        throw new Error(ifNotFoundMessage);
      }
      return null;
    }
  };

  list = async (sql_template: string, vars?): Promise<any[]> => {
    return (await this.query(sql_template, vars)).rows;
  };

  insert = async (table: string, vars, values, keys?: any[], forUpdate?: any[]) => {
    const result = await this.query(
      `
        insert into ${table} 
          (${Object.keys(values).join(", ")}) 
        values 
          (${Object.values(values).join(", ")})
        ${keys && !forUpdate ? `on conflict(${keys.join(",")}) do nothing` : ""}
        ${
          keys && forUpdate
            ? `on conflict(${keys.join(",")}) do update set ${forUpdate
                .map((col) => col + " = EXCLUDED." + col)
                .join(", ")}`
            : ""
        }
        RETURNING *
      `,
      vars
    );
    return result.rows.length == 0 ? {} : result.rows[0];
  };

  update = async (table: string, vars, values, conditions): Promise<any> => {
    const result = await this.query(
      `
        update ${table} set 
          ${Object.entries(values)
            .map((e) => e.join(" = "))
            .join(", ")} where 
          ${Object.entries(conditions)
            .map((e) => e.join(" = "))
            .join(" and ")} 
        RETURNING *
      `,
      vars
    );
    return result.rows.length == 0 ? {} : result.rows[0];
  };
}

/**
 * @returns функцию-обертку, передающую в функцию fun объект client для выполнения запросов
 * */
const transaction = (pool: Pool, level: string) => {
  return async (fun: (client: Client) => Promise<any>) => {
    const connection = await pool.connect();
    // NOTE: connection имеет неподходящий тип. Передаю как "any", чтобы не менять старый код.
    const client = new Client(connection as any);
    try {
      await client.query("BEGIN " + level);
      const res = await fun(client);
      await client.query("COMMIT");
      return res;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      connection.release();
    }
  };
};

/**
 * @returns словарь параметров
 */
const params = (keys: string[]): any => {
  return Object.fromEntries(keys.map((k) => [k, "@" + k]));
};

const init = function (config) {
  const pool = new Pool(config);
  if (config.schema) {
    pool.on("connect", (client) => {
      client.query(`SET search_path TO ${config.schema}, public`);
    });
  }
  return {
    client: new Client(pool),
    execute: (client) => (fun: (client: Client) => Promise<any>) => fun(client),
    transaction_s_rw: transaction(pool, "ISOLATION LEVEL SERIALIZABLE READ WRITE"),
    transaction_s_r: transaction(pool, "ISOLATION LEVEL SERIALIZABLE READ ONLY"),
    transaction_rr_rw: transaction(pool, "ISOLATION LEVEL READ UNCOMMITTED READ WRITE"),
    transaction_rr_r: transaction(pool, "ISOLATION LEVEL READ UNCOMMITTED READ ONLY"),
    transaction_rc_rw: transaction(pool, "ISOLATION LEVEL READ COMMITTED READ WRITE"),
    transaction_rc_r: transaction(pool, "ISOLATION LEVEL READ COMMITTED READ ONLY"),
  };
};

module.exports = {
  Client,
  params,
  init,
};

/**
 * @returns трансформированный запрос + массив параметров,
 * в запросе имена параметров заменяются на номер в массиве
 */
const _transform = (sql: string, params?): [string, any[]] => {
  const chars = [] as string[];
  const vars = [] as string[];
  const values = [] as any[];
  let i = 0;
  while (i < sql.length) {
    const j = sql.indexOf("@", i);
    if (j < 0) {
      chars.push(sql.substring(i));
      break;
    }
    chars.push(sql.substring(i, j));
    let k = j + 1;
    let c = sql[k];

    while (
      k < sql.length &&
      (c.toLowerCase() != c.toUpperCase() || ("0" <= c && c <= "9") || "_" == c)
    ) {
      c = sql[++k];
    }

    const varName = sql.substring(j + 1, k);
    if (!params || !(varName in params)) {
      chars.push("@" + varName);
    } else {
      let i = vars.indexOf(varName);
      if (i < 0) {
        i = vars.length;
        vars.push(varName);
        values.push(params[varName]);
      }
      chars.push("$" + (i + 1));
    }

    i = k;
  }
  return [chars.join(""), values];
};
