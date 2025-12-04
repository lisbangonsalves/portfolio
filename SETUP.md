# Portfolio Database Migration Setup Guide

Your portfolio has been successfully migrated from file-based storage to MongoDB + Cloudinary! This guide will help you complete the setup.

## What Changed?

### Before
- Data stored in `app/data/portfolio-data.json` (read-only on Vercel)
- Images uploaded to `/public/company_logo/` (doesn't work on Vercel)
- Admin updates only worked locally

### After
- Data stored in MongoDB Atlas (cloud database)
- Images stored in Cloudinary (cloud CDN)
- Admin updates work everywhere, including Vercel production

---

## Step 1: Set Up MongoDB Atlas (Free)

1. **Create a MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free" and sign up
   - Choose the FREE tier (M0 Sandbox)

2. **Create a Cluster**
   - Select a cloud provider (AWS recommended)
   - Choose a region close to your users
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Set Up Database Access**
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set "Database User Privileges" to "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add 0.0.0.0/0)
   - Click "Confirm"

5. **Get Your Connection String**
   - Go to "Database" in the left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" and version "4.1 or later"
   - Copy the connection string (looks like: `mongodb+srv://...`)
   - Replace `<password>` with your actual database user password
   - Replace `<dbname>` with `portfolio`

---

## Step 2: Set Up Cloudinary (Free)

1. **Create a Cloudinary Account**
   - Go to https://cloudinary.com/users/register/free
   - Sign up for a free account

2. **Get Your Credentials**
   - After signing in, you'll see your dashboard
   - Find these values:
     - **Cloud Name**
     - **API Key**
     - **API Secret** (click the eye icon to reveal)
   - Keep these values handy

---

## Step 3: Update Environment Variables

1. **Update `.env.local`**
   Open your `.env.local` file and add:

   ```bash
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/portfolio?retryWrites=true&w=majority

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Admin Credentials (you already have these)
   NEXT_PUBLIC_ADMIN_EMAIL=admin@lisban.com
   NEXT_PUBLIC_ADMIN_PASSWORD=Lisban@2002
   ```

2. **Replace the placeholders:**
   - MongoDB URI: Use the connection string from Step 1.5
   - Cloudinary credentials: Use the values from Step 2.2

---

## Step 4: Migrate Your Existing Data

Run the migration script to transfer your data from JSON to MongoDB:

```bash
node scripts/migrate-to-mongodb.js
```

You should see output like:
```
🚀 Starting migration...
✅ Successfully read portfolio-data.json
✅ Connected to MongoDB
📦 Migrating portfolio data...
✅ Portfolio data migrated
   - Skills: 5 categories
   - Projects: 2 items
   - Experience: 1 items
📧 Migrating messages...
ℹ️  No messages to migrate
🎉 Migration completed successfully!
```

---

## Step 5: Test Locally

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test the admin panel:**
   - Go to http://localhost:3000/admin
   - Log in with your credentials
   - Try adding/editing a project or experience
   - Try uploading a company logo
   - Check if changes persist after page refresh

3. **Verify data in MongoDB:**
   - Go to MongoDB Atlas dashboard
   - Click "Browse Collections"
   - You should see your `portfolio` database with:
     - `portfolio` collection (containing your data)
     - `messages` collection (for contact form messages)

---

## Step 6: Deploy to Vercel

1. **Add Environment Variables to Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to "Settings" > "Environment Variables"
   - Add all variables from your `.env.local`:
     - `MONGODB_URI`
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `NEXT_PUBLIC_ADMIN_EMAIL`
     - `NEXT_PUBLIC_ADMIN_PASSWORD`
   - Make sure to select all environments (Production, Preview, Development)

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Migrate to MongoDB and Cloudinary"
   git push
   ```

   Or use Vercel CLI:
   ```bash
   vercel --prod
   ```

3. **Test Production:**
   - Go to your live site's admin panel
   - Try adding/editing content
   - Changes should now persist!

---

## Troubleshooting

### "Failed to connect to MongoDB"
- Check your connection string is correct
- Make sure you replaced `<password>` with actual password
- Verify Network Access allows 0.0.0.0/0 in MongoDB Atlas

### "Cloudinary credentials are missing"
- Check that all three Cloudinary variables are set
- No spaces or quotes around the values
- Restart your dev server after adding variables

### "Failed to upload file"
- Verify Cloudinary credentials are correct
- Check file size is under 2MB
- Make sure file type is SVG, PNG, or JPG

### Changes still not working on Vercel
- Verify all environment variables are added in Vercel
- Redeploy after adding environment variables
- Check Vercel function logs for errors

---

## Architecture Overview

### API Routes
- `/api/portfolio` - Get/update projects, experience, skills
- `/api/messages` - Get/create/delete contact messages
- `/api/upload` - Upload images to Cloudinary

### Database Structure
```javascript
// portfolio collection
{
  type: 'main',
  skills: { ... },
  projects: [ ... ],
  experience: [ ... ],
  categoryMeta: { ... }
}

// messages collection
{
  name: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890',
  message: 'Hello!',
  timestamp: '2024-01-01T00:00:00.000Z',
  read: false,
  createdAt: Date
}
```

---

## Important Notes

1. **Backup:** Your original `portfolio-data.json` is unchanged and can serve as a backup
2. **Free Tiers:** Both MongoDB Atlas and Cloudinary offer generous free tiers perfect for portfolios
3. **Security:** Never commit `.env.local` to Git (it's already in `.gitignore`)
4. **Images:** Old images in `/public/company_logo/` won't be automatically migrated. Re-upload them via the admin panel.

---

## Need Help?

If you encounter any issues:
1. Check the Vercel function logs
2. Check MongoDB Atlas metrics
3. Verify all environment variables are correct
4. Make sure migration script ran successfully

Good luck with your updated portfolio! 🚀
