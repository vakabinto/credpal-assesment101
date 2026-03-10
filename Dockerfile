# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY app/package*.json ./
RUN npm ci --only=production --ignore-scripts --prefer-offline \
  && npm cache clean --force
COPY app/ ./

FROM node:20-alpine
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001
WORKDIR /app
COPY --from=builder --chown=nodeapp:nodejs /app ./
USER nodeapp
EXPOSE 3000
CMD ["node", "app.js"]