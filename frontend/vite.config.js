import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  let proxyTarget = "http://127.0.0.1:5001";
  if (env.VITE_API_URL) {
    try {
      proxyTarget = new URL(env.VITE_API_URL).origin;
    } catch {
      // keep default
    }
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Dev: browser calls same-origin `/api/*` → Vite forwards to Node (avoids CORS / wrong host).
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          configure(proxy) {
            proxy.on("error", (err) => {
              if (String(err?.code || err?.message).includes("ECONNREFUSED")) {
                console.error(
                  `\n[vite] API proxy target refused connection: ${proxyTarget}\n` +
                    `  Start the backend in another terminal:\n` +
                    `    cd backend && npm run dev\n` +
                    `  (must listen on the same port as VITE_API_URL in frontend/.env)\n`
                );
              }
            });
          },
        },
      },
    },
  };
});
