FROM node:20-alpine AS base

# Установка общих зависимостей
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Development stage
FROM base AS development

WORKDIR /app

# Копируем package files
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig-paths.json* ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код (будет переопределено через volume)
COPY . .

# Expose порты
EXPOSE 3000 9229

# Development command с hot reload
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig-paths.json* ./

RUN npm ci --only=production && \
    npm cache clean --force

COPY . .

# Компиляция TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 3000

USER node

CMD ["npm", "start"]
