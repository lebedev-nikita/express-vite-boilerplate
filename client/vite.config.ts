import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  const env = loadEnv(mode, resolve(__dirname, ".."), "");

  const CLIENT_PORT = +env.CLIENT_PORT;
  const SERVER_PORT = +env.SERVER_PORT;

  return defineConfig({
    plugins: [react()],
    server: {
      port: CLIENT_PORT,
      proxy: {
        "/api": `http://localhost:${SERVER_PORT}`,
      },
    },
  });
};
