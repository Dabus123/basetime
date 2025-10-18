# BaseTime Deployment Guide

This guide will walk you through deploying BaseTime to production, including smart contracts and frontend.

## 🚀 Quick Deployment

### 1. Smart Contract Deployment

#### Prerequisites
- Base Sepolia testnet ETH in your wallet
- Private key for deployment account
- BaseScan API key for contract verification

#### Deploy Contracts

```bash
# Set environment variables
export PRIVATE_KEY="your_private_key_here"
export BASESCAN_API_KEY="your_basescan_api_key_here"

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.ts --network baseTestnet
```

#### Expected Output
```
Deploying BaseTime contracts...
Deploying EventRegistry...
EventRegistry deployed to: 0x...
Deploying RSVPToken...
RSVPToken deployed to: 0x...
Setting RSVPToken owner to EventRegistry...
RSVPToken ownership transferred to EventRegistry
Creating example events...
Example events created successfully!

=== DEPLOYMENT SUMMARY ===
Network: base-sepolia
Deployer: 0x...
EventRegistry: 0x...
RSVPToken: 0x...

=== CONTRACT ADDRESSES ===
export EVENT_REGISTRY_ADDRESS="0x..."
export RSVP_TOKEN_ADDRESS="0x..."
export NETWORK_NAME="base-sepolia"
```

#### Verify Contracts
```bash
npx hardhat verify --network baseTestnet <EVENT_REGISTRY_ADDRESS>
npx hardhat verify --network baseTestnet <RSVP_TOKEN_ADDRESS>
```

### 2. Frontend Deployment (Vercel)

#### Prerequisites
- Vercel account
- GitHub repository
- Environment variables

#### Deploy Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Set Environment Variables**
   ```env
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_EVENT_REGISTRY_ADDRESS=0x...
   NEXT_PUBLIC_RSVP_TOKEN_ADDRESS=0x...
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-app.vercel.app`

### 3. Base App Registration

#### Update Manifest
1. Update `public/.well-known/farcaster.json` with your production URLs:
   ```json
   {
     "frame": {
       "homeUrl": "https://your-app.vercel.app",
       "iconUrl": "https://your-app.vercel.app/icon.png",
       "splashImageUrl": "https://your-app.vercel.app/splash.png",
       "heroImageUrl": "https://your-app.vercel.app/hero.png",
       "screenshotUrls": [
         "https://your-app.vercel.app/screenshot1.png",
         "https://your-app.vercel.app/screenshot2.png"
       ]
     }
   }
   ```

2. Set `noindex: false` when ready for production

#### Register with Base Build
1. Go to [Base Build](https://build.base.org)
2. Submit your Mini App for review
3. Include your manifest URL: `https://your-app.vercel.app/.well-known/farcaster.json`

## 🔧 Production Configuration

### Environment Variables

#### Required
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_EVENT_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_RSVP_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

#### Optional
```env
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret
```

### Security Checklist

- [ ] Environment variables are properly set
- [ ] Contract addresses are verified on BaseScan
- [ ] Private keys are not exposed
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented

### Performance Optimization

- [ ] Images are optimized (WebP format)
- [ ] Bundle size is minimized
- [ ] CDN is configured
- [ ] Caching headers are set
- [ ] Database queries are optimized

## 📊 Monitoring

### Analytics
- Set up Google Analytics or similar
- Monitor user engagement
- Track RSVP conversion rates

### Error Tracking
- Implement Sentry or similar
- Monitor smart contract interactions
- Track failed transactions

### Performance Monitoring
- Use Vercel Analytics
- Monitor Core Web Vitals
- Track load times

## 🔄 Updates and Maintenance

### Smart Contract Updates
- Deploy new contracts if needed
- Update frontend contract addresses
- Migrate data if necessary

### Frontend Updates
- Deploy through Vercel
- Test on staging environment first
- Monitor for issues post-deployment

### Database Migrations
- Backup data before changes
- Test migrations on staging
- Plan for rollback procedures

## 🆘 Troubleshooting

### Common Issues

#### Contract Deployment Fails
- Check private key has sufficient ETH
- Verify network configuration
- Check gas limits

#### Frontend Build Fails
- Check environment variables
- Verify all dependencies are installed
- Check TypeScript errors

#### Transactions Fail
- Check user has sufficient ETH for gas
- Verify contract addresses are correct
- Check network connectivity

### Support Resources
- [Base Documentation](https://docs.base.org)
- [OnchainKit Documentation](https://onchainkit.xyz)
- [Vercel Documentation](https://vercel.com/docs)
- [Hardhat Documentation](https://hardhat.org/docs)

## 📈 Scaling Considerations

### Smart Contracts
- Consider upgradeable contracts for future changes
- Implement batch operations for efficiency
- Monitor gas costs and optimize

### Frontend
- Implement caching strategies
- Use CDN for static assets
- Consider server-side rendering for SEO

### Infrastructure
- Use load balancers for high traffic
- Implement database sharding if needed
- Monitor resource usage

---

**Ready to deploy BaseTime? Follow this guide step by step for a successful production deployment!**
