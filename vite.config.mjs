import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repository = process.env.GITHUB_REPOSITORY ?? "";
const [owner, repositoryName] = repository.split("/");
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const base = isGitHubPagesBuild && repositoryName
  ? repositoryName === `${owner}.github.io` ? "/" : `/${repositoryName}/`
  : "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
});
