import { useEffect, useMemo } from "react";
import { useNavigate, useLocation, Location } from "react-router";

function configureRouter<DefaultParams extends Record<string, Record<string, string>>>(
  defaultParamsConfig: DefaultParams
) {
  return function <Path extends keyof DefaultParams>(pathname: Path) {
    const location = useLocation();
    const navigate = useNavigate();

    if (pathname !== location.pathname) {
      /* 
        Параметр pathname передается только для того, 
        чтобы IntelliSense подсказывал имена query-параметров для текущей страницы
      */
      throw new Error(
        `Параметр pathname должен совпадать с location.pathname. Сейчас pathname=${pathname}, location.pathname=${location.pathname}`
      );
    }

    const { url, defaultParams, queryParams, fullQuery } = useMemo(() => {
      const defaultParams = defaultParamsConfig[pathname];
      const queryParams = Object.fromEntries(new URLSearchParams(location.search).entries());
      const fullQuery = { ...defaultParams, ...queryParams };
      const url = new URL<DefaultParams, Path>(location, fullQuery);
      return { url, defaultParams, queryParams, fullQuery };
    }, [location]);

    useEffect(() => {
      for (const key in defaultParams) {
        if (!(key in queryParams)) {
          navigate(url.setQuery(fullQuery), { replace: true });
          break;
        }
      }
    }, [location]);

    return url;
  };
}

class URL<
  DefaultParams extends Record<string, Record<string, string>>,
  Path extends keyof DefaultParams
> {
  public readonly location: Location;
  public readonly query: DefaultParams[Path];

  constructor(location: Location, query: DefaultParams[Path]) {
    this.location = location;
    this.query = query;
  }

  setQuery(query: Partial<Record<keyof DefaultParams[Path], string | number>>): Location {
    return {
      ...this.location,
      search: new URLSearchParams({ ...this.query, ...query }).toString(),
    };
  }

  reset<
    PathName extends keyof DefaultParams,
    Query extends {
      [Key in keyof DefaultParams[PathName]]?: string | number;
    }
  >(pathname: PathName, query: Query = {} as any) {
    return {
      ...this.location,
      pathname,
      search: new URLSearchParams(query as any).toString(),
    };
  }

  parse<
    Parsers extends {
      [Key in keyof DefaultParams[Path]]?: (value: string) => unknown;
    }
  >(
    parsers: Parsers
  ): {
    [Key in keyof Parsers]: Parsers[Key] extends (value: string) => unknown
      ? ReturnType<Parsers[Key]>
      : never;
  } {
    const parsed: any = {};
    for (const key in parsers) {
      parsed[key] = parsers[key]!(this.query[key as any]);
    }
    return parsed;
  }

  pick<Keys extends (keyof DefaultParams[Path])[]>(keys: Keys) {
    type Key = Keys extends ReadonlyArray<infer T> ? T : never;
    const ret: any = {};
    for (const path of keys) {
      ret[path] = this.query[path];
    }
    return ret as Record<Key, string>;
  }
}

type ExtractDefaultParams<Type extends (...args) => any> = ReturnType<Type> extends URL<
  infer X,
  any
>
  ? X
  : never;

export type { ExtractDefaultParams };
export { configureRouter, URL };
