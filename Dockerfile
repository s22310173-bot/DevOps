# Frontend FarmCare: lint + build (Vite) lalu sajikan lewat nginx.
# Stage `lint` dipakai Jenkins untuk pemeriksaan terpisah sebelum build gambar.

FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS lint
COPY . .
RUN npm run lint

FROM deps AS build
COPY . .
RUN npm run build

FROM nginx:alpine AS web
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
