const Redis = require('ioredis')

export const redis = new Redis(6379, "redis-service")
