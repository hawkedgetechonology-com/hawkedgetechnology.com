# Stage 1: Build workspace
FROM node:18-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

COPY pnpm-lock.yaml* pnpm-workspace.yaml package.json ./
COPY packages/config/package.json ./packages/config/
COPY packages/shared/package.json ./packages/shared/
COPY packages/types/package.json ./packages/types/
COPY packages/auth/package.json ./packages/auth/
COPY packages/database/package.json ./packages/database/
COPY packages/ui/package.json ./packages/ui/
COPY apps/admin/package.json ./apps/admin/

RUN pnpm install --frozen-lockfile

COPY . .

# Set skip environment validation to true during compile phase
ENV SKIP_ENV_VALIDATION=true
RUN pnpm --filter @hawkedge/database db:generate
RUN pnpm --filter @hawkedge/shared build
RUN pnpm --filter @hawkedge/types build
RUN pnpm --filter @hawkedge/auth build
RUN pnpm --filter @hawkedge/config build
RUN pnpm --filter @hawkedge/ui build
RUN pnpm --filter @hawkedge/admin build

# Stage 2: Production runner
FROM node:18-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm

# Enforce secure directory ownership for non-root execution
RUN chown -R node:node /app

COPY --from=builder --chown=node:node /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml* ./
COPY --from=builder --chown=node:node /app/packages ./packages
COPY --from=builder --chown=node:node /app/apps/admin/.next ./apps/admin/.next
COPY --from=builder --chown=node:node /app/apps/admin/public ./apps/admin/public
COPY --from=builder --chown=node:node /app/apps/admin/package.json ./apps/admin/package.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

USER node
ENV NODE_ENV=production
EXPOSE 3002

# Docker healthcheck boundary
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/ || exit 1

CMD ["pnpm", "--filter", "@hawkedge/admin", "start"]
