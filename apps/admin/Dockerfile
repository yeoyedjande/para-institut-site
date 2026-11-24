# Back-office (build autonome Next.js). À construire depuis la racine du monorepo :
#   docker build -f apps/admin/Dockerfile .
FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /repo
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm install --frozen-lockfile && pnpm --filter @para/admin build

FROM node:22-alpine
ENV NODE_ENV=production PORT=3001 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY --from=build --chown=node:node /repo/apps/admin/.next/standalone ./
COPY --from=build --chown=node:node /repo/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=build --chown=node:node /repo/apps/admin/public ./apps/admin/public
USER node
EXPOSE 3001
HEALTHCHECK --interval=10s --timeout=5s --retries=6 CMD wget -qO- http://127.0.0.1:3001/ >/dev/null || exit 1
CMD ["node", "apps/admin/server.js"]
