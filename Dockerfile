FROM node:trixie-slim AS builder
# RUN corepack enable
RUN npm install -g @nestjs/cli
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN yarn build

FROM node:trixie-slim
RUN corepack enable
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma/

CMD ["sh", "-c", "npx prisma db push && yarn start:prod"]