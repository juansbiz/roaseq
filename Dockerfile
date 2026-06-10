# Stage 1: Build frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY .worktrunk/frontend ./
RUN npm install && npm run build

# Stage 2: Runtime
FROM node:20-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init curl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --shell /bin/bash --uid 1001 nodejs
COPY --chown=nodejs:nodejs --from=frontend-builder /app/dist ./dist
COPY --chown=nodejs:nodejs .worktrunk/backend ./backend
RUN cd /app/backend && npm install
COPY .worktrunk/backend/scripts/docker-startup.sh ./docker-startup.sh
RUN chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3007
ENTRYPOINT ["dumb-init", "--"]
CMD ["npx", "tsx", "backend/server.ts"]
