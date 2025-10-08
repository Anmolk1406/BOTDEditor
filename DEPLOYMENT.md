# BOTD Editor - Netlify Deployment Guide

## 🚀 Deploy to Netlify

This guide will help you deploy the BOTD Editor to Netlify.

### Prerequisites
- A GitHub account
- A Netlify account (free at [netlify.com](https://netlify.com))

### Method 1: Deploy via Netlify UI (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Select the branch (usually `main`)

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: `18` (or latest LTS)

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live at a Netlify URL

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Custom Domain (Optional)

1. Go to your site settings in Netlify
2. Click "Domain settings"
3. Add your custom domain
4. Configure DNS as instructed

### Environment Variables

If you need to add environment variables:
1. Go to Site settings > Environment variables
2. Add any required variables

### Build Troubleshooting

If the build fails:
1. Check the build logs in Netlify
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility

### Local Testing

Test the production build locally:
```bash
npm run build
npx serve out
```

## 🎯 Features

- ✅ Static export ready
- ✅ Drag & drop image upload
- ✅ BOTD/BOTM animations
- ✅ Color customization
- ✅ Download functionality
- ✅ Responsive design

## 📁 Project Structure

```
botd_editor/
├── src/
│   ├── components/
│   ├── pages/
│   └── styles/
├── public/
│   └── lottie/
├── netlify.toml
├── next.config.mjs
└── package.json
```

## 🔧 Configuration Files

- `netlify.toml` - Netlify deployment configuration
- `next.config.mjs` - Next.js static export settings
- `.gitignore` - Git ignore rules 