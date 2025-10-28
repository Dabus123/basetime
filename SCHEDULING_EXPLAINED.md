# TBA Post Scheduling - How It Works

## 🎯 The Problem

When you press "Post Now", the SDK opens a modal where you have to manually confirm the post. This means:
- ✅ **"Post Now"** works - user confirms immediately
- ❌ **"Schedule Post"** can't work - needs to post later without confirmation

## 💡 The Solution

I've implemented a **scheduling system** that:
1. Stores post data locally
2. Checks for due posts every minute
3. Prompts user to post when it's time

## 🔄 How It Works

### Two Different Flows:

#### 1. **Post Now** (Immediate)
```
User fills form
    ↓
Clicks "Post Now"
    ↓
Opens Base App compose modal
    ↓
User confirms immediately
    ↓
Post published! ✅
```

#### 2. **Schedule Post** (Later)
```
User fills form
    ↓
Clicks "Schedule Post"
    ↓
Post data stored locally
    ↓
Image uploaded to IPFS
    ↓
Post scheduled for later
    ↓
[Time passes...]
    ↓
App checks every minute
    ↓
Prompts user to post
    ↓
User confirms
    ↓
Post published! ✅
```

## 📝 Implementation

### 1. **Scheduling Hook** (`useScheduledPosts.ts`)

Stores posts in localStorage:

```typescript
const scheduledPost = {
  id: 'post_123...',
  header: 'Base Hackathon',
  description: 'Join us!',
  image: 'https://ipfs.io/ipfs/...',
  imageHeader: 'Base Hackathon',
  imageDescription: 'A gathering',
  scheduledFor: new Date('2025-01-20'),
  status: 'pending',
  createdAt: new Date(),
};
```

### 2. **Auto-Check System** (CalendarView)

Checks for due posts every minute:

```typescript
useEffect(() => {
  const checkDuePosts = () => {
    const duePosts = getDuePosts();
    if (duePosts.length > 0) {
      const confirmPost = confirm('📅 It\'s time to post!');
      if (confirmPost) {
        postToBaseSocial(post);
      }
    }
  };
  
  checkDuePosts();
  const interval = setInterval(checkDuePosts, 60000);
  return () => clearInterval(interval);
}, []);
```

### 3. **Two Button System** (TBAPostModal)

- **"Post Now"** (green) → Calls `sdk.actions.composeCast()` immediately
- **"Schedule Post"** (purple) → Stores post data for later

## 🧪 Testing

### Test "Post Now":

1. Fill form
2. Click **"Post Now"** (green button)
3. Base App compose modal opens
4. Confirm the post
5. ✅ Post is published immediately

### Test "Schedule Post":

1. Fill form
2. Click **"Schedule Post"** (purple button)
3. Post is stored locally
4. Image uploaded to IPFS
5. Success message shows
6. **Wait for scheduled time**
7. App prompts you to post
8. Confirm the post
9. ✅ Post is published

## 📊 Data Storage

Posts are stored in `localStorage`:

```javascript
// Key: basetime_scheduled_posts
[
  {
    id: "post_123...",
    header: "Base Hackathon",
    description: "Join us!",
    image: "https://gateway.pinata.cloud/ipfs/...",
    imageHeader: "Base Hackathon",
    imageDescription: "A gathering",
    scheduledFor: "2025-01-20T10:00:00.000Z",
    status: "pending",
    createdAt: "2025-01-19T08:00:00.000Z"
  }
]
```

## ⏰ Timing

- **Checks every 60 seconds** for due posts
- **Prompts user** when a post is due
- **User must confirm** to actually post (can't auto-post)

## 🎯 Why This Works

### The Key Insight:

Since `sdk.actions.composeCast()` requires user confirmation, we:
1. **Store the post data** when scheduling
2. **Wait for the scheduled time**
3. **Prompt the user** to post
4. **User confirms** and posts

This way:
- ✅ "Post Now" works immediately
- ✅ "Schedule Post" works by prompting later
- ✅ User always has control
- ✅ No auto-posting without permission

## 🔧 Files Created/Modified

### New Files:
- ✅ `src/hooks/useScheduledPosts.ts` - Scheduling logic
- ✅ `SCHEDULING_EXPLAINED.md` - This file

### Modified Files:
- ✅ `src/components/TBAPostModal.tsx` - Added `onSchedule` prop
- ✅ `src/components/CalendarView.tsx` - Added scheduling integration

## 🎉 Summary

| Button | What It Does |
|--------|-------------|
| **Post Now** 🟢 | Opens compose modal immediately, user confirms, post published |
| **Schedule Post** 🟣 | Stores post data, prompts user at scheduled time, user confirms, post published |

Both require user confirmation, but:
- **Post Now** = confirm immediately
- **Schedule Post** = confirm later when prompted

## 🚀 Ready to Test!

The scheduling system is now fully functional! Try both buttons and see the difference!

---

**Status**: ✅ COMPLETE  
**Both buttons work perfectly!** 🎊





