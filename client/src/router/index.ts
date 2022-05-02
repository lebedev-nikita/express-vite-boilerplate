import { configureRouter } from "../lib/router";

export const useUrl = configureRouter({
  "/": {
    param_1: "change_me_in_url",
    param_2: "change_me_in_url_too",
  },
});
