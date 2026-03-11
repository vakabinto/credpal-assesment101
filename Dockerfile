# Build stage
FROM node:20-alpine AS builder
WORKDIR /src
COPY src/package*.json ./
RUN npm ci --only=production --ignore-scripts --prefer-offline \
  && npm cache clean --force
COPY src/ ./

FROM node:20-alpine
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001
WORKDIR /src
COPY --from=builder --chown=nodeapp:nodejs /src ./
USER nodeapp
EXPOSE 3000
CMD ["node", "app.js"]
