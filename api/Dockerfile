# Bundestag Wrapped OG Image Service
# Generates speaker sharepics using Satori + resvg-js

FROM node:22-slim AS base

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json ./
RUN npm install

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3001

# Copy built files and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

# Create cache directory
RUN mkdir -p .cache

# The DATA_DIR environment variable should point to where speaker JSON files are
# This can be mounted as a volume or set to a URL for remote fetching
ENV DATA_DIR=/data

EXPOSE 3001

CMD ["node", "dist/index.js"]
