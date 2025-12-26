# Bundestag Wrapped OG Image Service
# Generates speaker sharepics using Satori + resvg-js

FROM node:22-slim AS base

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY api/package.json ./
RUN npm install

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY api/ .
RUN npm run build

# Production
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3001

# Copy built files and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY api/package.json ./

# Copy speaker data for OG image generation (baked into image for Coolify)
COPY public/speakers /data/speakers

# Create cache directory
RUN mkdir -p .cache

ENV DATA_DIR=/data

EXPOSE 3001

CMD ["node", "dist/index.js"]
