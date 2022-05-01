import { configureRouter } from "../lib/router";

export const useUrl = configureRouter({
  "/": {
    urlParam_1: "edit_me_in_url",
    urlParam_2: "edit_me_in_url_too",
  },
});
