FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Build the app
FROM deps AS build
COPY package.json bun.lock ./
COPY src ./src
COPY static ./static
COPY svelte.config.js tsconfig.json vite.config.ts ./
COPY eslint.config.js ./eslint.config.js
COPY .prettierrc ./.prettierrc
COPY .prettierignore ./.prettierignore
RUN bun install --frozen-lockfile
RUN bun run build

# Production runtime
FROM oven/bun:1 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.env.example ./.env.example

EXPOSE 3000
CMD ["node", "build/index.js"]
