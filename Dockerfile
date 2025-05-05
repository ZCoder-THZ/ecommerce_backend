FROM node:20-alpine

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app
COPY . .

RUN pnpm install
RUN npx prisma generate

EXPOSE 4000