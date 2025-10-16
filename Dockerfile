FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /app

COPY package.json yarn.lock ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:22-alpine
RUN corepack enable
WORKDIR /app

COPY package.json yarn.lock ./
RUN npm install

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma/

CMD ["sh", "-c", "npx prisma db push && npm start:prod"]