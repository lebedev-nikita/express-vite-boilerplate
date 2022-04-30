import type { Handler } from "express";

export const authMiddleware: Handler = (req, res, next) => {
  if (/.css|.js|.jpg|.jpeg|.ico|.png|woff2/gi.test(req.path)) {
    return next();
  }

  if (req.cookies.login) {
    res.cookie("login", req.cookies.login, { expires: new Date(Date.now() + 365 * 24 * 3600_000) });
    return next();
  }

  if (req.query.login) {
    let reqLogin = decodeURI(req.query.login as string);
    let originalUrl = decodeURI(req.originalUrl);

    if (originalUrl.includes("getParamsBeforeRedirect")) {
      reqLogin = req.query.login as string;
      originalUrl = originalUrl.slice(0, originalUrl.indexOf("?login"));
      const objGetParams = JSON.parse(req.query.getParamsBeforeRedirect as string);
      const strGetParams = new URLSearchParams(objGetParams).toString();
      const search = strGetParams.length > 0 ? "?" + strGetParams : "";
      originalUrl = `${req.baseUrl}${req.path}${search}`;
    }

    const login = reqLogin.split("\\")[1] || reqLogin;
    res.cookie("login", login, { expires: new Date(Date.now() + 365 * 24 * 3600_000) });
    res.append("Cache-Control", "no-store");
    const redirectUrl = originalUrl
      .replace(`?login=${reqLogin}`, "")
      .replace(`&login=${reqLogin}`, "");
    return res.redirect(302, redirectUrl);
  }

  const callback =
    `${req.protocol}://${req.headers["last-host"]}${req.baseUrl}${req.path}` +
    `?getParamsBeforeRedirect=${JSON.stringify(req.query)}`;
  const authUrl = `http://triada.consultant.ru/AuthRedirectService/?callback=${callback}`;
  res.redirect(302, authUrl);
};
