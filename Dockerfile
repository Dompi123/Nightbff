FROM node:20-bookworm AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Remove native-only files before web export (preserves them in repo for future native builds)
RUN find . -name "*.native.tsx" -o -name "*.native.ts" -o -name "*.native.jsx" -o -name "*.native.js" | xargs rm -f

# Expo web export
RUN npx expo export --platform web

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost:80 || exit 1
