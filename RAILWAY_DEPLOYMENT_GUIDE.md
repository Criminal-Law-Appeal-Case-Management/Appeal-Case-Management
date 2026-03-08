# Railway Deployment Guide for Appeal Case Manager

## Overview
This guide walks you through deploying your Appeal Case Manager app to Railway with your custom domain.

---

## Step 1: Set Up MongoDB Atlas (Free Tier)

1. Go to https://cloud.mongodb.com and create an account (or sign in)
2. Click **"Build a Cluster"** → Select **FREE Shared** tier
3. Choose a region close to your users (Sydney for Australia)
4. Wait for cluster creation (~3 mins)
5. Click **"Database Access"** → **"Add New User"**
   - Username: `appealmanager`
   - Password: Generate a secure password (save it!)
   - Role: Read/Write to any database
6. Click **"Network Access"** → **"Add IP Address"** → **"Allow Access from Anywhere"** (0.0.0.0/0)
7. Click **"Clusters"** → **"Connect"** → **"Connect Your Application"**
8. Copy the connection string - it looks like:
   ```
   mongodb+srv://appealmanager:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<password>` with your actual password.

---

## Step 2: Deploy Backend to Railway

1. Go to https://railway.app and log in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your Appeal Case Manager repository
4. Railway will detect the repo - click **"Add Service"**
5. **IMPORTANT**: Set the root directory to `/backend`
   - Click the service → **Settings** → **Root Directory** → Set to `backend`
6. Go to **Variables** tab and add these environment variables:

   | Variable | Value |
   |----------|-------|
   | `MONGO_URL` | Your MongoDB Atlas connection string |
   | `DB_NAME` | `appeal_case_manager` |
   | `JWT_SECRET` | Generate at random.org (32+ chars) |
   | `CORS_ORIGINS` | `*` (will update after frontend deploy) |
   | `PAYPAL_MODE` | `live` |
   | `PAYPAL_CLIENT_ID` | Your PayPal client ID |
   | `PAYPAL_CLIENT_SECRET` | Your PayPal secret |
   | `EMERGENT_UNIVERSAL_KEY` | Your Emergent LLM key |
   | `PORT` | `8080` |

7. Click **"Deploy"** and wait for it to complete
8. Copy your backend URL from the **Deployments** tab (e.g., `https://appeal-backend.up.railway.app`)

---

## Step 3: Deploy Frontend to Railway

1. In the same Railway project, click **"New"** → **"Service"** → **"GitHub Repo"**
2. Select the same repository again
3. Set root directory to `/frontend`
4. Go to **Variables** tab and add:

   | Variable | Value |
   |----------|-------|
   | `REACT_APP_BACKEND_URL` | Your backend URL from Step 2 (e.g., `https://appeal-backend.up.railway.app`) |

5. Click **"Deploy"**

---

## Step 4: Update CORS (Important!)

After frontend deploys, go back to your **backend service**:
1. Go to **Variables**
2. Update `CORS_ORIGINS` to include your frontend URL:
   ```
   https://your-frontend.up.railway.app,https://criminallawappealmanagement.com.au
   ```
3. Redeploy the backend

---

## Step 5: Connect Custom Domain

### For Backend (API):
1. In Railway, click your **backend service** → **Settings** → **Domains**
2. Click **"Generate Domain"** to get Railway's domain
3. (Optional) Add custom subdomain like `api.criminallawappealmanagement.com.au`

### For Frontend:
1. Click your **frontend service** → **Settings** → **Domains**
2. Click **"Custom Domain"** → Enter `criminallawappealmanagement.com.au`
3. Railway will show you DNS records to add

### In GoDaddy:
1. Go to your domain's DNS settings
2. Add a **CNAME** record:
   - Type: CNAME
   - Name: @ (or www)
   - Value: The target Railway gives you (like `cname.railway.app`)
   - TTL: 600 (or 1 hour)
3. Wait 10-30 minutes for DNS to propagate

---

## Step 6: Verify Deployment

1. Visit your frontend URL - you should see the landing page
2. Try logging in with Google or email/password
3. Create a test case and generate a report

---

## Troubleshooting

### "CORS Error"
- Check that `CORS_ORIGINS` in backend includes your frontend URL
- Make sure there are no trailing slashes

### "Database Connection Failed"
- Check your MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify the connection string has the correct password

### "Reports Not Generating"
- Check that `EMERGENT_UNIVERSAL_KEY` is set correctly in backend variables

---

## Environment Variables Reference

### Backend Required:
```
MONGO_URL=mongodb+srv://...
DB_NAME=appeal_case_manager
JWT_SECRET=your-secret-key
CORS_ORIGINS=https://your-frontend.railway.app
EMERGENT_UNIVERSAL_KEY=your-key
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=your-paypal-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
PORT=8080
```

### Frontend Required:
```
REACT_APP_BACKEND_URL=https://your-backend.railway.app
```

---

## Need Help?

The app is currently running at the preview URL and fully functional. Deployment to Railway is optional - the preview URL works indefinitely for testing.

If you prefer not to deploy yourself, you can:
1. Continue using the preview URL
2. Use Railway's one-click deploy (if available)
3. Ask Emergent support for deployment assistance
