# Deploying Your Portfolio to Vercel

This guide will walk you through deploying your Next.js portfolio to Vercel.

---

## Prerequisites

Before deploying, make sure you have:

- ✅ A [GitHub](https://github.com) account
- ✅ A [Vercel](https://vercel.com) account (sign up with GitHub)
- ✅ Your portfolio code pushed to a GitHub repository
- ✅ All features tested locally

---

## Step 1: Prepare Your Project

### 1.1 Create a GitHub Repository

If you haven't already:

```bash
cd /Users/lisban/Documents/Portfolio/portfolio

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Portfolio ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

### 1.2 Verify Your Files

Make sure these files exist and are configured:

**`package.json`** - Should have these scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

**`.gitignore`** - Should include:
```
node_modules/
.next/
.env.local
*.log
.DS_Store
```

### 1.3 Test Production Build Locally

```bash
npm run build
npm start
```

Visit `http://localhost:3000` and verify everything works.

---

## Step 2: Deploy to Vercel

### 2.1 Sign Up / Log In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### 2.2 Import Your Repository

1. Click **"Add New Project"** or **"Import Project"**
2. Select **"Import Git Repository"**
3. Find your `portfolio` repository and click **"Import"**

### 2.3 Configure Project Settings

Vercel will auto-detect Next.js. Configure these settings:

**Project Name:**
```
portfolio
```
(or any name you prefer - this will be your subdomain)

**Framework Preset:**
```
Next.js
```
(should be auto-detected)

**Root Directory:**
```
./
```
(leave as default)

**Build Command:**
```
npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```
npm install
```

### 2.4 Environment Variables (if needed)

Currently, your portfolio doesn't require environment variables for production. But if you add any in the future:

1. Click **"Environment Variables"**
2. Add variables like:
   - `NEXT_PUBLIC_API_URL`
   - `DATABASE_URL`
   - etc.

### 2.5 Deploy!

1. Click **"Deploy"**
2. Wait for the build to complete (2-3 minutes)
3. 🎉 Your site is live!

---

## Step 3: Access Your Live Site

After deployment succeeds, you'll get:

**Vercel Domain:**
```
https://your-portfolio.vercel.app
```

**Deployment URL:**
```
https://your-portfolio-abc123.vercel.app
```

---

## Step 4: Custom Domain (Optional)

### 4.1 Add Your Domain

1. Go to your project dashboard on Vercel
2. Click **"Settings"** → **"Domains"**
3. Enter your custom domain (e.g., `yourname.com`)
4. Click **"Add"**

### 4.2 Configure DNS

Vercel will provide DNS records. Add them to your domain registrar:

**For apex domain (yourname.com):**
```
A Record: 76.76.21.21
```

**For www subdomain:**
```
CNAME: cname.vercel-dns.com
```

Wait 24-48 hours for DNS propagation.

---

## Step 5: Post-Deployment Setup

### 5.1 Test All Features

Visit your live site and test:

- ✅ All pages load correctly
- ✅ Navigation works
- ✅ Projects display properly
- ✅ Experience page shows correctly
- ✅ Contact form works
- ✅ Admin login works
- ✅ Dark mode toggle
- ✅ Mobile responsiveness

### 5.2 Admin Panel Access

**Production Admin URL:**
```
https://your-portfolio.vercel.app/admin
```

**Default Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **IMPORTANT:** Change these credentials immediately in production!

### 5.3 Update Admin Credentials

Since your auth is client-side, you'll need to:

1. Update the credentials in your code
2. Or implement a proper authentication system for production

**Recommended:** Implement NextAuth.js or similar for production security.

---

## Step 6: Continuous Deployment

Vercel automatically deploys when you push to GitHub!

```bash
# Make changes to your code
git add .
git commit -m "Update: Added new project"
git push origin main

# Vercel automatically deploys! 🚀
```

**Preview Deployments:**
- Every pull request gets a preview URL
- Test changes before merging to main

---

## Step 7: Data Management in Production

### 7.1 Portfolio Data

Your portfolio data is stored in:
```
app/data/portfolio-data.json
```

**To update:**
1. Use the admin panel at `/admin`
2. Make changes
3. Click "Save Changes"
4. Changes are saved to the JSON file

### 7.2 File Uploads

Company logos and project images are stored in:
```
public/company_logo/
```

**To add new logos:**
1. Go to `/admin/experience` or `/admin/projects`
2. Click "Upload Logo"
3. Select file
4. File is uploaded to `public/company_logo/`

### 7.3 Messages

Contact form messages are stored in:
```
app/data/portfolio-data.json
```

View them at `/admin/messages`

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Solution: Install missing dependencies
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: "Build exceeded maximum duration"**
- Your build is taking too long
- Check for large dependencies
- Optimize images

### Images Not Loading

**Problem:** Images show broken links

**Solution:**
- Ensure images are in `public/` folder
- Use absolute paths: `/company_logo/logo.svg`
- Not relative paths: `./company_logo/logo.svg`

### Admin Panel Not Working

**Problem:** Can't login to admin

**Solution:**
1. Check browser console for errors
2. Verify credentials in code
3. Check if auth context is properly set up

### Data Not Saving

**Problem:** Changes in admin don't persist

**Solution:**
- Vercel filesystem is read-only in production
- Consider using a database (MongoDB, PostgreSQL)
- Or use Vercel's KV storage
- Or use a headless CMS (Sanity, Contentful)

---

## Performance Optimization

### Enable Caching

Vercel automatically caches:
- Static pages
- Images
- API routes

### Image Optimization

Next.js automatically optimizes images using `next/image`:

```jsx
import Image from 'next/image';

<Image
  src="/company_logo/logo.svg"
  alt="Logo"
  width={100}
  height={100}
/>
```

### Analytics

Enable Vercel Analytics:
1. Go to project dashboard
2. Click "Analytics"
3. Enable Web Analytics
4. Get real-time visitor data

---

## Monitoring

### Deployment Status

Check deployment status at:
```
https://vercel.com/YOUR_USERNAME/portfolio/deployments
```

### Logs

View build and runtime logs:
1. Go to deployment
2. Click "Logs"
3. See real-time logs

### Error Tracking

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay

---

## Updating Your Portfolio

### Adding New Projects

1. Go to `https://your-site.vercel.app/admin/projects`
2. Add new project
3. Save changes
4. Project appears on frontend immediately

### Adding Experience

1. Go to `https://your-site.vercel.app/admin/experience`
2. Add new experience
3. Upload company logo
4. Save changes

### Viewing Messages

1. Go to `https://your-site.vercel.app/admin/messages`
2. View all contact form submissions
3. Mark as read/delete when done

---

## Security Recommendations

### 1. Change Admin Credentials

Update hardcoded credentials or implement proper auth:

```bash
# Install NextAuth.js
npm install next-auth

# Set up authentication
# Follow: https://next-auth.js.org/getting-started/example
```

### 2. Add Environment Variables

Move sensitive data to environment variables:

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://yoursite.com
ADMIN_EMAIL=your-email@example.com
```

### 3. Rate Limiting

Add rate limiting to contact form:
- Prevent spam submissions
- Use Vercel Edge Middleware

### 4. HTTPS

Vercel automatically provides SSL certificates!

---

## Backup Strategy

### 1. GitHub Backup

Your code is backed up on GitHub automatically.

### 2. Data Backup

Regularly backup your data file:

```bash
# Download portfolio-data.json
# Store in a safe location
cp app/data/portfolio-data.json ~/backups/portfolio-data-$(date +%Y%m%d).json
```

### 3. Automated Backups

Consider:
- GitHub Actions for automated backups
- Cloud storage (Google Drive, Dropbox)

---

## Scaling Considerations

As your portfolio grows:

### Option 1: Database Migration

Migrate from JSON to a database:
- **MongoDB** (with Mongoose)
- **PostgreSQL** (with Prisma)
- **Supabase** (Postgres + Auth + Storage)

### Option 2: Headless CMS

Use a CMS for content management:
- **Sanity.io**
- **Contentful**
- **Strapi**

### Option 3: Vercel KV Storage

Use Vercel's built-in storage:
- Redis-compatible
- Serverless
- Built into Vercel

---

## Support Resources

**Vercel Documentation:**
- https://vercel.com/docs

**Next.js Documentation:**
- https://nextjs.org/docs

**Community:**
- Vercel Discord: https://vercel.com/discord
- Next.js GitHub: https://github.com/vercel/next.js

**Troubleshooting:**
- Check deployment logs
- Search Vercel community
- Ask on Stack Overflow

---

## Summary Checklist

Before going live:

- [ ] Push code to GitHub
- [ ] Test production build locally (`npm run build`)
- [ ] Deploy to Vercel
- [ ] Test all features on live site
- [ ] Change admin credentials
- [ ] Add custom domain (optional)
- [ ] Enable analytics
- [ ] Set up monitoring
- [ ] Create backup strategy
- [ ] Update README with live URL

---

## Your Portfolio is Live! 🎉

Congratulations! Your portfolio is now deployed and accessible worldwide.

**Share your portfolio:**
- Add to LinkedIn profile
- Share on Twitter
- Include in email signature
- Add to GitHub profile

**Next Steps:**
1. Keep adding projects
2. Update your experience
3. Respond to messages
4. Monitor analytics
5. Iterate and improve

---

**Need Help?**

If you encounter issues during deployment, check the Vercel dashboard logs or reach out to Vercel support.

Good luck! 🚀
