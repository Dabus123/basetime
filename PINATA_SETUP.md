# Pinata IPFS Setup Guide

## Overview

The TBA Post feature now supports **file upload with IPFS** instead of URL input. Images are uploaded to IPFS via Pinata and stored permanently on the decentralized web.

## Quick Setup (5 Minutes)

### Step 1: Create a Pinata Account

1. Go to [Pinata.cloud](https://www.pinata.cloud/)
2. Click **"Sign Up"**
3. Create a free account (generous free tier!)

### Step 2: Get Your JWT Token

1. After logging in, go to **API Keys** in the sidebar
2. Click **"New Key"**
3. Enable **"Pinning"** permissions
4. Click **"Create Key"**
5. **Copy your JWT token** (you'll only see it once!)

### Step 3: Add to Environment Variables

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add your Pinata JWT token:

```env
NEXT_PUBLIC_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb0lkIjoi...
```

3. Save the file

### Step 4: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
pnpm dev
```

## How It Works

### Before (URL Input)
```
User enters URL → Form validates → Submit
```

### After (File Upload)
```
User selects file → Preview shows → Upload to IPFS → Get IPFS hash → Submit
```

### Upload Flow

1. **User selects image** from their device
2. **Preview displays** immediately
3. **On submit**, image uploads to Pinata IPFS
4. **Progress bar** shows upload status
5. **IPFS hash** is stored with the post
6. **Image is accessible** via `https://gateway.pinata.cloud/ipfs/{hash}`

## Features

### ✅ What You Get

- **File Upload**: Click or drag & drop images
- **Live Preview**: See your image before uploading
- **IPFS Storage**: Images stored permanently on decentralized storage
- **Progress Bar**: Visual feedback during upload
- **Error Handling**: Clear error messages if upload fails

### 🎨 UI Features

- **Drag & Drop**: Drop images directly onto the upload area
- **Click to Upload**: Click to browse files
- **Change Image**: Easy to replace selected image
- **File Validation**: Only image files accepted
- **Size Limit**: Up to 10MB per image

## Testing Without Pinata

If you don't set up Pinata yet, the form will still work but will show an error when trying to upload. You can:

1. **Test the UI**: Select a file and see the preview
2. **Skip IPFS**: The form validates without uploading
3. **Set up later**: Add Pinata JWT when ready

## Troubleshooting

### "Failed to upload to IPFS"

**Cause**: Pinata JWT not configured or invalid

**Solution**:
1. Check `.env.local` has `NEXT_PUBLIC_PINATA_JWT`
2. Verify JWT token is correct
3. Restart dev server after adding JWT

### "Invalid JWT token"

**Cause**: Token expired or incorrect

**Solution**:
1. Generate a new JWT in Pinata dashboard
2. Update `.env.local`
3. Restart dev server

### Image preview not showing

**Cause**: File is not an image

**Solution**:
- Only upload image files (PNG, JPG, GIF, WebP)
- Check file extension

### Upload stuck at 0%

**Cause**: Network issue or Pinata API down

**Solution**:
1. Check internet connection
2. Try a smaller image file
3. Check Pinata status page

## Pinata Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| **Storage** | 1 GB |
| **Files** | Unlimited |
| **Bandwidth** | 1 GB/month |
| **API Calls** | 1000/day |

**Note**: This is perfect for testing and small projects!

## Production Considerations

### For Production Deployment

1. **Upgrade Pinata Plan** if you expect high traffic
2. **Set up CORS** in Pinata dashboard for your domain
3. **Use environment variables** in Vercel/hosting platform
4. **Monitor usage** in Pinata dashboard

### Alternative IPFS Providers

If you want to use a different IPFS provider:

- **NFT.Storage** (by Protocol Labs)
- **Web3.Storage** (by Protocol Labs)
- **Fleek** (IPFS + hosting)
- **Your own IPFS node**

## Example Usage

### In Your Code

```typescript
// The upload happens automatically when you submit the form
const handleSubmit = async (data: TBAPostData) => {
  // data.image will contain the IPFS URL
  console.log('IPFS URL:', data.image);
  // Example: https://gateway.pinata.cloud/ipfs/QmXxXxXx...
};
```

### In Browser Console

After uploading, you'll see:

```
✅ Image uploaded to IPFS: https://gateway.pinata.cloud/ipfs/QmXxXxXx...
📝 TBA Post Data: {
  header: "My Post",
  description: "...",
  image: "https://gateway.pinata.cloud/ipfs/QmXxXxXx...",
  ...
}
```

## Security Notes

### ⚠️ Important

1. **Never commit `.env.local`** to git
2. **Keep JWT token secret** - it has full access to your Pinata account
3. **Use different tokens** for dev and production
4. **Rotate tokens** periodically

### Safe Practices

- ✅ Use environment variables
- ✅ Add `.env.local` to `.gitignore`
- ✅ Use Pinata's key restrictions
- ❌ Don't hardcode tokens
- ❌ Don't share JWT tokens publicly

## Support

### Pinata Resources

- [Pinata Docs](https://docs.pinata.cloud/)
- [Pinata Dashboard](https://app.pinata.cloud/)
- [Pinata Discord](https://discord.gg/pinata)

### BaseTime Support

- Check the TBA_POST_FEATURE.md for more details
- Review the implementation in TBAPostModal.tsx
- Test with the quick start guide

---

**Ready to upload?** Set up your Pinata JWT and start uploading images to IPFS! 🚀




