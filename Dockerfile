# ================================
# Dockerfile – Transport Contract Management System
# ================================
# Multi-stage build:
#   Stage 1: Build the Vite/React frontend
#   Stage 2: Run the Express backend (serves the API + built UI)
#
# Usage:
#   docker build -t transport-app .
#   docker run -p 5000:5000 --env-file backend/.env transport-app
# ================================

# ---------- Stage 1: Build Frontend ----------
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --silent
COPY frontend/ ./
RUN npm run build

# ---------- Stage 2: Backend + Serve Built UI ----------
FROM node:18-alpine AS production

WORKDIR /app

# Copy backend source and install production dependencies
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev --silent

COPY backend/ ./backend/

# Copy the built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the application port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

# Start the backend (which also serves the frontend)
WORKDIR /app/backend
CMD ["node", "src/server.js"]
