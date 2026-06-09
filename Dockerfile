# =============================================================================
# STAGE 1: deps
# Inštaluje závislosti (node_modules) zo package.json.
# Táto vrstva sa cachuje — ak sa package.json nezmení, npm ci sa nespúšťa znova.
# =============================================================================
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# =============================================================================
# STAGE 2: builder
# Skopíruje zdrojový kód a node_modules z predchádzajúcej vrstvy.
# Spustí "npm run build" ktorý skompiluje Next.js app do produkčného formátu (.next).
# =============================================================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# =============================================================================
# STAGE 3: runner
# Finálny obraz ktorý skutočne beží v kontajneri.
# Kopíruje len to čo je potrebné na spustenie — nie celý zdrojový kód.
# Vďaka tomu je obraz čo najmenší.
# =============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

# Nastaví produkčný režim — Next.js vypne dev nástroje a optimalizuje výkon
ENV NODE_ENV=production

# Skopíruje skompilovanú aplikáciu z builder vrstvy
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Skopíruje statické súbory (obrázky, ikony, atď.)
COPY --from=builder /app/public ./public

# Informuje Docker že aplikácia počúva na porte 3000
EXPOSE 3000

# Príkaz ktorý sa spustí pri štarte kontajnera
CMD ["npm", "start"]
