FROM node:20-bookworm AS build
WORKDIR /app
COPY package.json ./
# Generate lockfile fresh in Linux environment (no macOS-specific binaries)
RUN npm install --package-lock-only --legacy-peer-deps
COPY . .
# Install all deps (lightningcss will fetch correct Linux binary)
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Expo web export with Metro cache clear
RUN npx expo export --clear --platform web

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost:80 || exit 1
