FROM node:alpine as deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./ ./
RUN yarn install --frozen-lockfile

FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=deps /app ./

USER nextjs

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

CMD ["yarn", "start"]
