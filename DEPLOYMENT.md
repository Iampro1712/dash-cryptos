# 🚀 Deployment Guide for CryptoDash

This guide will help you deploy CryptoDash to various platforms.

## 🌐 Netlify Deployment (Recommended)

### Quick Deploy Button
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Iampro1712/dash-cryptos)

### Manual Deployment

1. **Fork the repository** to your GitHub account
2. **Sign up/Login** to [Netlify](https://netlify.com)
3. **Connect your repository**:
   - Click "New site from Git"
   - Choose GitHub and authorize
   - Select your forked repository

4. **Configure build settings**:
   ```
   Base directory: /
   Build command: npm run build
   Publish directory: dist
   ```

5. **Environment variables** (optional):
   ```
   NODE_VERSION = 18
   NPM_VERSION = 9
   ```

6. **Deploy** and get your live URL!

### Netlify Configuration

The project includes a `netlify.toml` file with optimized settings:
- ✅ SPA routing support
- ✅ Security headers
- ✅ Performance optimizations
- ✅ Cache control
- ✅ Error handling

## ⚡ Vercel Deployment

### Quick Deploy Button
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Iampro1712/dash-cryptos)

### Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Configure** (if needed):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## 📄 GitHub Pages

1. **Enable GitHub Pages** in repository settings
2. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy script** to package.json:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build and Run
```bash
# Build image
docker build -t cryptodash .

# Run container
docker run -p 80:80 cryptodash
```

## 🔧 Environment Variables

### Optional Configuration
```env
# API Configuration
VITE_API_BASE_URL=https://api.coingecko.com/api/v3
VITE_UPDATE_INTERVAL=60000
VITE_MAX_CRYPTOS=100

# Analytics (optional)
VITE_GA_TRACKING_ID=your-google-analytics-id
```

## 🚨 Troubleshooting

### Common Issues

1. **Build fails with "out of memory"**:
   ```bash
   # Increase Node.js memory limit
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

2. **404 errors on refresh**:
   - Ensure SPA routing is configured
   - Check `netlify.toml` redirects

3. **API rate limiting**:
   - CoinGecko free tier: 50 calls/minute
   - Consider implementing caching

### Performance Tips

1. **Enable compression** on your hosting platform
2. **Use CDN** for static assets
3. **Implement service worker** for caching
4. **Optimize images** and assets

## 📊 Monitoring

### Recommended Tools
- **Netlify Analytics** - Built-in analytics
- **Google Analytics** - User behavior tracking
- **Lighthouse** - Performance monitoring
- **Sentry** - Error tracking

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🎯 Post-Deployment Checklist

- [ ] ✅ Site loads correctly
- [ ] ✅ All pages are accessible
- [ ] ✅ API calls work properly
- [ ] ✅ Charts render correctly
- [ ] ✅ Mobile responsiveness
- [ ] ✅ Performance optimization
- [ ] ✅ SEO meta tags
- [ ] ✅ Error handling
- [ ] ✅ Analytics setup

---

**Need help?** Open an issue on [GitHub](https://github.com/Iampro1712/dash-cryptos/issues)
