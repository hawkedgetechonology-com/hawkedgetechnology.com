# Stage 1: Build workspace
FROM node:18-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

COPY pnpm-lock.yaml* pnpm-workspace.yaml package.json ./
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/types/package.json ./packages/types/
COPY packages/auth/package.json ./packages/auth/
COPY services/api/package.json ./services/api/
COPY services/email/package.json ./services/email/
COPY services/notifications/package.json ./services/notifications/
COPY services/storage/package.json ./services/storage/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @hawkedge/database db:generate
RUN pnpm --filter @hawkedge/shared build
RUN pnpm --filter @hawkedge/types build
RUN pnpm --filter @hawkedge/auth build
RUN pnpm --filter @hawkedge/database build
RUN pnpm --filter @hawkedge/email build
RUN pnpm --filter @hawkedge/notifications build
RUN pnpm --filter @hawkedge/storage build
RUN pnpm --filter @hawkedge/api build

# Stage 2: Production runner
FROM node:18-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm

# Enforce secure directory ownership for non-root execution
RUN chown -R node:node /app

COPY --from=builder --chown=node:node /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml* ./
COPY --from=builder --chown=node:node /app/packages ./packages
COPY --from=builder --chown=node:node /app/services/api/dist ./services/api/dist
COPY --from=builder --chown=node:node /app/services/api/package.json ./services/api/package.json
COPY --from=builder --chown=node:node /app/services/email/dist ./services/email/dist
COPY --from=builder --chown=node:node /app/services/email/package.json ./services/email/package.json
COPY --from=builder --chown=node:node /app/services/notifications/dist ./services/notifications/dist
COPY --from=builder --chown=node:node /app/services/notifications/package.json ./services/notifications/package.json
COPY --from=builder --chown=node:node /app/services/storage/dist ./services/storage/dist
COPY --from=builder --chown=node:node /app/services/storage/package.json ./services/storage/package.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

USER node
ENV NODE_ENV=production
EXPOSE 5000

# Docker healthcheck boundary
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# PID 1 handler node direct launch for SIGTERM signals propagation
CMD ["node", "services/api/dist/main.js"]
