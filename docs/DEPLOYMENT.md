# 🚀 Deployment Guide - Vercel

This guide walks you through deploying the Retro Cyber World terminal interface to Vercel.

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 18+ installed
- ✅ Git repository with your project
- ✅ Vercel account (free tier is sufficient)
- ✅ GitHub account for CI/CD integration

## 🔧 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yoriichi-07/retro-cyber-web.git
   cd retro-cyber-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   # Opens at http://localhost:3000
   ```

## 🌐 Vercel Deployment

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? **N**
   - What's your project's name? **retro-cyber-world**
   - In which directory is your code located? **./
   
5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard

1. **Visit**: [vercel.com](https://vercel.com)
2. **Sign in** with your GitHub account
3. **Import Project** → Select your GitHub repository
4. **Configure Project**:
   - Project Name: `retro-cyber-world`
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `./` (since we're using static files)
5. **Deploy**

### Method 3: GitHub Integration

1. **Connect GitHub** to your Vercel account
2. **Import** the `retro-cyber-web` repository
3. **Auto-deploy** will trigger on every push to `main`

## ⚙️ Configuration Files

### `vercel.json` Configuration

```json
{
  "version": 2,
  "name": "retro-cyber-world",
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/404.html",
      "dest": "/404.html"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### Environment Variables (Optional)

If you need environment variables:

1. **In Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add variables for different environments

2. **Via Vercel CLI**:
   ```bash
   vercel env add VARIABLE_NAME
   ```

## 🔄 Continuous Deployment

### GitHub Actions Setup

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. **Runs tests** on every PR and push
2. **Deploys preview** for pull requests
3. **Deploys production** for main branch pushes

### Required Secrets

Add these secrets to your GitHub repository:

1. **Go to**: Repository Settings → Secrets and Variables → Actions
2. **Add secrets**:
   - `VERCEL_TOKEN`: Your Vercel personal access token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your project ID

### Getting Vercel IDs

```bash
# Install Vercel CLI and login
npm install -g vercel
vercel login

# Link your project
vercel link

# Get project info
vercel project ls
```

## 📊 Post-Deployment

### 1. Update URLs

After deployment, update these URLs in your code:

**In `index.html`**:
```html
<meta property="og:url" content="https://your-project.vercel.app">
<meta property="og:image" content="https://your-project.vercel.app/src/assets/og-image.png">
<meta name="twitter:image" content="https://your-project.vercel.app/src/assets/twitter-card.png">
```

**In `README.md`**:
```markdown
[![Live Demo](https://img.shields.io/badge/Live-Demo-00ff00?style=for-the-badge)](https://your-project.vercel.app)
```

### 2. Custom Domain (Optional)

1. **Purchase domain** from your preferred registrar
2. **In Vercel Dashboard**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

### 3. Performance Monitoring

Vercel automatically provides:
- ✅ Performance analytics
- ✅ Core Web Vitals tracking
- ✅ Function logs and metrics
- ✅ Deployment logs

Access via: **Vercel Dashboard → Your Project → Analytics**

## 🔍 Troubleshooting

### Common Issues

**Build Fails**:
- Check `package.json` scripts are correct
- Ensure all dependencies are listed
- Review build logs in Vercel dashboard

**404 Errors**:
- Verify `vercel.json` routing configuration
- Check file paths are correct
- Ensure `404.html` exists

**Performance Issues**:
- Optimize images and assets
- Review Core Web Vitals in Vercel Analytics
- Consider implementing caching strategies

### Debug Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Test build locally
vercel build

# Preview deployment
vercel dev
```

## 📈 Optimization Tips

### Performance
- ✅ Enable Vercel Analytics
- ✅ Optimize images with Vercel Image Optimization
- ✅ Use Vercel Edge Functions for dynamic content
- ✅ Implement proper caching headers

### SEO
- ✅ Update meta tags with production URLs
- ✅ Submit sitemap to search engines
- ✅ Verify Open Graph tags work correctly

### Security
- ✅ Configure security headers in `vercel.json`
- ✅ Enable HTTPS (automatic with Vercel)
- ✅ Review Content Security Policy

## 🎯 Production Checklist

Before going live:

- [ ] All features tested in production environment
- [ ] Performance metrics acceptable (< 3s load time)
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed
- [ ] SEO meta tags updated with production URLs
- [ ] Analytics tracking operational
- [ ] Error monitoring configured
- [ ] Backup and rollback plan in place

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [GitHub Actions for Vercel](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)

---

**Happy Deploying! 🚀**

Your cyberpunk terminal is ready to hack the world!