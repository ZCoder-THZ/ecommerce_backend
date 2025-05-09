FROM node:20-alpine

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copy prisma schema before generating
COPY prisma ./prisma/
RUN npx prisma generate

# Then copy the rest of the application
COPY . .

EXPOSE 4000

# Add your CMD or ENTRYPOINT here
CMD ["pnpm", "start"]