# ===================== STAGE 1: Deps =====================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

COPY prisma ./prisma
RUN npx prisma generate

# ===================== STAGE 2: Builder =====================
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Declare build args for env vars needed at build time
ARG DATABASE_URL
ARG JWT_SECRET
ARG ADMIN_USERNAME
ARG ADMIN_PASSWORD
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_BASE_URL
ARG GOOGLE_API_KEY
ARG CEREBRAS_API_KEY
ARG GROQ_API_KEY
ARG R2_ACCESS_KEY_ID
ARG R2_API_KEY
ARG GA_PRIVATE_KEY
ARG DUITKU_API_KEY

# Set them as env vars so prisma and next build can use them
ENV DATABASE_URL=${DATABASE_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV ADMIN_USERNAME=${ADMIN_USERNAME}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=${NEXT_PUBLIC_WHATSAPP_NUMBER}
ENV NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}
ENV CEREBRAS_API_KEY=${CEREBRAS_API_KEY}
ENV GROQ_API_KEY=${GROQ_API_KEY}
ENV R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
ENV R2_API_KEY=${R2_API_KEY}
ENV GA_PRIVATE_KEY=${GA_PRIVATE_KEY}
ENV DUITKU_API_KEY=${DUITKU_API_KEY}

COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

COPY --from=deps /app/node_modules/.prisma /app/node_modules/.prisma

# Cache bust to ensure fresh source copy
ARG CACHEBUST=1
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npx prisma generate
RUN npx prisma db push --accept-data-loss
RUN npm run build

# ===================== STAGE 3: Runner =====================
FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
