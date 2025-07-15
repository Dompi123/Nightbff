# ---- Base Image ----
FROM node:20-alpine

# Avoid prompts & split cache layers sensibly
ENV EXPO_NO_INTERACTIVE=1 \
    CI=true

WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps --no-audit --progress=false

# Copy source
COPY . .

# Expose Metro bundler port
EXPOSE 8081

# Start Expo/Metro for LAN access; CI sets EXPO_NO_INTERACTIVE so this is non-interactive
CMD ["npm", "start", "--", "--host", "lan", "--port", "8081"]
