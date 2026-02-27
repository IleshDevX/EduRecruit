# 🚀 Simple Render Deployment Guide for EduRecruit

Follow these steps exactly — it's easier than you think!

---

## ✅ Before You Start

You need:
- [ ] GitHub account
- [ ] Render account (free) - [Sign up here](https://dashboard.render.com/register)
- [ ] MongoDB Atlas account (free) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

---

## Step 1: Setup MongoDB Atlas (5 minutes)

1. **Create Cluster:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Click "Build a Database" → Choose **FREE** (M0)
   - Pick any region → Create

2. **Create Database User:**
   - Left sidebar → "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `edurecruit_user` (or anything you like)
   - Password: Click "Autogenerate Secure Password" → **COPY IT!**
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

3. **Allow Network Access:**
   - Left sidebar → "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access From Anywhere" → Confirm

4. **Get Connection String:**
   - Left sidebar → "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://edurecruit_user:<password>@...`)
   - **Replace `<password>` with the password you copied earlier**
   - **Replace `myFirstDatabase` or `test` with `cipat`**
   
   Final format:
   ```
   mongodb+srv://edurecruit_user:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/cipat?retryWrites=true&w=majority
   ```
   
   **Save this connection string!** You'll need it soon.

---

## Step 2: Push Your Code to GitHub (3 minutes)

```bash
# Open PowerShell in your project folder
cd "d:\06 College Stuff\SE CIPAT"

# Check git status
git status

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Push to GitHub
git push origin main
```

If you don't have a GitHub repository yet:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/IleshDevX/edurecruit.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend (7 minutes)

1. **Go to Render:**
   - Open [Render Dashboard](https://dashboard.render.com/)
   - Click **"New +"** (top right) → **"Web Service"**

2. **Connect GitHub:**
   - Click "Build and deploy from a Git repository" → **Next**
   - If first time: Click "Connect GitHub" → Authorize
   - Find your repository: `edurecruit` → Click **"Connect"**

3. **Fill in the Form:**

   | Field | What to Enter |
   |-------|---------------|
   | **Name** | `edurecruit-backend` |
   | **Region** | Choose closest to you (e.g., Oregon) |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |
   | **Runtime** | Automatically detects "Node" ✅ |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | **Free** |

4. **Add Environment Variables:**
   - Scroll down to "Environment Variables"
   - Click **"Add Environment Variable"** (do this 4 times)

   | Key | Value |
   |-----|-------|
   | `NODE_VERSION` | `18.18.0` |
   | `MONGODB_URI` | Paste your MongoDB connection string from Step 1 |
   | `JWT_SECRET` | `your_secret_key_12345_change_me` |
   | `PORT` | `5000` |

5. **Create Service:**
   - Click **"Create Web Service"** button at bottom
   - Wait 3-5 minutes (watch the logs!)
   - When you see "Your service is live 🎉" → Success!

6. **Copy Your Backend URL:**
   - At top of page, you'll see your URL like: `https://edurecruit-backend.onrender.com`
   - **Click the copy icon** or write it down
   - **✅ Test it:** Visit `https://your-backend-url.onrender.com/api/health`
   - You should see: `{"status":"ok","timestamp":"..."}`

---

## Step 4: Add Demo Data (2 minutes)

Your backend is running, but there's no data yet! Let's add demo users and jobs:

1. **Open Shell:**
   - In Render dashboard (still on your backend service page)
   - Top navigation → Click **"Shell"** tab
   - Wait 10-15 seconds for shell to load

2. **Run Seed Command:**
   ```bash
   node seed.js
   ```
   
3. **Check Output:**
   - You should see: "✅ Database seeded successfully!"
   - This creates 5 demo students, 3 companies, and sample jobs

---

## Step 5: Deploy Frontend (5 minutes)

1. **Create Static Site:**
   - Render Dashboard → Click **"New +"** → **"Static Site"**
   - "Build and deploy from a Git repository" → **Next**
   - Select your `edurecruit` repository → **"Connect"**

2. **Fill in the Form:**

   | Field | What to Enter |
   |-------|---------------|
   | **Name** | `edurecruit-frontend` |
   | **Branch** | `main` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |

3. **Add Environment Variables:**
   - Click **"Advanced"** to expand
   - Click **"Add Environment Variable"** (do this 2 times)

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-backend-url.onrender.com/api` |
   | `VITE_BACKEND_URL` | `https://your-backend-url.onrender.com` |

   ⚠️ **IMPORTANT:** Use YOUR actual backend URL from Step 3!
   
   Example:
   - If backend is: `https://edurecruit-backend-xyz.onrender.com`
   - Then `VITE_API_URL` = `https://edurecruit-backend-xyz.onrender.com/api`
   - And `VITE_BACKEND_URL` = `https://edurecruit-backend-xyz.onrender.com`

4. **Create Static Site:**
   - Click **"Create Static Site"** at bottom
   - Wait 2-3 minutes for build
   - Watch for "Your site is live 🎉"

---

## Step 6: Test Everything! (3 minutes)

1. **Open Your App:**
   - Click your frontend URL (e.g., `https://edurecruit-frontend.onrender.com`)
   - You should see the EduRecruit landing page

2. **Try Logging In:**
   Click "Login" → Use these demo accounts:

   | Role | Email | Password |
   |------|-------|----------|
   | **Student** | `aarav@student.com` | `password123` |
   | **Recruiter** | `hr@techcorp.com` | `password123` |
   | **Admin (TPO)** | `admin@cipat.com` | `password123` |

3. **Test Features:**
   - ✅ Login works
   - ✅ Dashboard shows data
   - ✅ Student can browse jobs
   - ✅ Recruiter can see applicants
   - ✅ Admin can view all data

---

## 🎉 You're Live!

**Your app is now deployed!**

Frontend: `https://your-frontend.onrender.com`  
Backend: `https://your-backend.onrender.com`

---

## 🐛 Common Issues & Fixes

### Frontend shows blank page
- **Check:** Browser console (F12) for errors
- **Fix:** Verify `VITE_API_URL` and `VITE_BACKEND_URL` are set correctly
- **Fix:** Make sure backend URL ends with `/api` in `VITE_API_URL`

### Login fails / "Network Error"
- **Check:** Is backend running? Visit `https://your-backend-url.onrender.com/api/health`
- **Fix:** Backend might be spinning down (free tier) - first request takes 30-60 seconds
- **Fix:** Check CORS is enabled in backend (already done in your code)

### MongoDB connection error
- **Check:** Is your connection string correct?
- **Fix:** Make sure you replaced `<password>` with actual password
- **Fix:** Make sure Network Access allows `0.0.0.0/0` in MongoDB Atlas

### "Application not found" when seeding
- **Fix:** Your models are fine - this just means Application collection doesn't exist yet (normal for new DB)

---

## 🔄 How to Update Your Live App

Made changes? Push and auto-deploy:

```bash
# Make your code changes
# Then commit and push
git add .
git commit -m "Update feature X"
git push origin main
```

Render automatically detects the push and redeploys! (Takes 2-3 minutes)

---

## ⚠️ Important Notes

1. **Free Tier Sleep Mode:**
   - Free services "sleep" after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds
   - Normal behavior - not a bug!

2. **File Uploads Warning:**
   - Render free tier doesn't persist uploaded files
   - Student resumes will be lost on redeploy
   - For production: Use Cloudinary or AWS S3

3. **Environment Variables:**
   - Never commit `.env` files to GitHub
   - Always use Render's environment variable settings

---

## 🎓 Next Steps

1. **Share your link** with friends/professors
2. **Add your live URL** to your GitHub README
3. **Test all features** thoroughly
4. **Monitor** logs in Render dashboard
5. **Star the repo** on GitHub ⭐

---

## 📱 Quick Reference

**Backend Health Check:**
```
https://your-backend.onrender.com/api/health
```

**Demo Login Credentials:**
```
Student:   aarav@student.com / password123
Recruiter: hr@techcorp.com / password123
Admin:     admin@cipat.com / password123
```

**Render Shell Commands:**
```bash
node seed.js          # Seed demo data
npm start            # Start server manually
npm install          # Reinstall dependencies
```

---

Need help? Check:
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Your GitHub Issues](https://github.com/IleshDevX/edurecruit/issues)

---

**Made with ❤️ by IleshDevX**
