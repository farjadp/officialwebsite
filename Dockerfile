# =============================================================================
# Dockerfile — Multi-stage production build for Next.js + Prisma
# Target: Google Cloud Run (europe-west1)
# Strategy: Standalone output for minimal image size
# =============================================================================

# ---- Stage 1: DEPS — Install ONLY production deps ----
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install all deps including dev (needed for Prisma generate + Next build)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate


# ---- Stage 2: BUILDER — Compile the Next.js app ----
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Bring in node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set dummy env vars so Next.js build doesn't fail on missing secrets
# Real env vars will be injected at Cloud Run runtime
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN npm run build


# ---- Stage 3: RUNNER — Minimal production image ----
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# PORT is used by Cloud Run (defaults to 8080)
ENV PORT=8080

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets
COPY --from=builder /app/public ./public

# Copy standalone build output (requires output: 'standalone' in next.config.ts)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
