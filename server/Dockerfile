# API FarmCare: Express + Prisma (MariaDB).
# prisma7.config.ts dan prisma/ harus ada sebelum `npm ci` karena postinstall menjalankan `prisma generate`.

FROM node:22-slim
WORKDIR /app

COPY package.json package-lock.json prisma7.config.ts ./
COPY prisma ./prisma

# Placeholder saat build; nilai sebenarnya diisi docker-compose lewat environment.
ENV DATABASE_URL="mysql://farmcare:farmcare@db:3306/farmcare"

RUN npm ci

COPY src ./src

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "src/index.js"]
