FROM node:20-bookworm AS build
WORKDIR /app
COPY package*.json ./
# Install deps and rebuild native modules for current platform
RUN npm install --legacy-peer-deps && npm rebuild
COPY . .

# Expo web export with Metro cache clear
RUN npx expo export --clear --platform web

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost:80 || exit 1
