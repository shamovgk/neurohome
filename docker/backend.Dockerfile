FROM node:20-alpine AS development

WORKDIR /app

# Копируем package files
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем код (будет переопределено через volume)
COPY . .

# Expose порты
EXPOSE 3000 9229

# Development command
CMD ["npm", "run", "dev"]
