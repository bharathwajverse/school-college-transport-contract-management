# Deployment Guide

This guide describes how to deploy the School & College Transport Contract Management System onto production servers.

---

## 🏗️ 1. Database Deployment (Supabase)

1. Sign in to your [Supabase](https://supabase.com) account.
2. Click **New Project** and create a project in your region.
3. Once the database is ready, navigate to the **SQL Editor** in the left sidebar.
4. Click **New Query**, copy the SQL schema contents from [DATABASE_SCHEMA.sql](file:///g:/Projects/insternship/school-college-transport-contract-management/database/DATABASE_SCHEMA.sql), paste them in, and click **Run**.
5. Go to **Project Settings** > **Database** and copy the **URI** connection string under the connection pool settings (usually uses port `6543`).

---

## 🖥️ 2. Backend Deployment (Render)

We use **Render**'s Web Services tier. Render automatically parses `render.yaml` at the root of the project to create the server configurations.

1. Connect your repository to [Render](https://render.com).
2. Create a new **Web Service** from the dashboard.
3. Render will find `render.yaml` or you can manually create a Web Service pointing to the root repository:
   - **Environment**: Node
   - **Root Directory**: `backend` (or leave empty if deploying from root and configuring paths)
   - **Build Command**: `npm ci` (or `cd backend && npm ci` if deploying from the repository root)
   - **Start Command**: `node src/server.js` (or `cd backend && npm start`)
4. Add the following **Environment Variables** in the Render settings panel:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or Render will bind to standard)
   - `DATABASE_URL`: Your Supabase Transaction Pool connection URL
   - `JWT_SECRET`: A secure random string
   - `JWT_EXPIRES_IN`: `1d`
   - `CORS_ORIGIN`: Your frontend domain (e.g. `https://your-app.vercel.app`)
   - `ENABLE_CRON`: `true` (enables daily alert updates)

---

## 🎨 3. Frontend Deployment (Vercel)

Vercel is our preferred static site host since it has native optimization and routing rules.

1. Connect your repository to [Vercel](https://vercel.com).
2. Create a new project, select your repository, and set the **Root Directory** to `frontend/`.
3. Vercel automatically detects Vite configurations:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Define the following **Environment Variables**:
   - `VITE_API_URL`: The production API URL from Render (e.g. `https://your-backend.onrender.com/api`).
5. Vercel uses `frontend/vercel.json` to configure fallback rewrites for React Router.

---

## ⚙️ 4. Post-Deployment Verification

1. Access your Vercel URL. Check that you can view the login screen.
2. Try registering a user or logging in with credentials.
3. Open Developer Tools (F12) to verify there are no CORS warnings.
4. Verify that requests hit the Render API URL and return `success: true`.
5. Call the `/health` API of your Render endpoint to verify database pool health.
