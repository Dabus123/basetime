# TBA Post Feature - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Start the App
```bash
cd /Users/andre/Documents/DEV/basetime
pnpm dev
```

### Step 2: Open Your Browser
Navigate to: `http://localhost:3000`

### Step 3: Try the Feature
1. Click on the **Calendar** tab (or navigate to calendar view)
2. Click **any date** in the calendar
3. You'll see a modal with two options:
   - **Create Event** (blue button)
   - **Schedule TBA Post** (gray button) ← Click this!
4. Fill out the form:
   - **Post Header**: "Base Hackathon 2025"
   - **Post Description**: "Join us for the biggest Base hackathon yet!"
   - **Image URL**: `https://images.unsplash.com/photo-1505373877841-8d25f7d46678`
   - **Image Header**: "Base Hackathon"
   - **Image Description**: "A gathering of Base builders"
5. Click **"Schedule Post"**
6. Check your browser console (F12) to see the payload!

## 📍 Where Everything Is Located

### In Your Codebase

```
basetime/
├── src/
│   ├── components/
│   │   ├── TBAPostModal.tsx          ← New form component
│   │   ├── CalendarView.tsx          ← Updated to use modal
│   │   └── DayActionModal.tsx        ← Has the button
│   └── types/
│       └── index.ts                  ← Add TBAPostData here if needed
│
├── TBA_POST_FEATURE.md               ← Full documentation
├── IMPLEMENTATION_SUMMARY.md         ← What was built
└── TBA_POST_QUICKSTART.md           ← This file
```

### In the UI

```
Calendar View
    ↓
Click any date
    ↓
Day Action Modal appears
    ├── Create Event (blue)
    └── Schedule TBA Post (gray) ← Click here!
        ↓
TBA Post Modal appears
    ├── Post Header
    ├── Post Description
    ├── Image URL (with preview)
    ├── Image Header
    └── Image Description
        ↓
Click "Schedule Post"
    ↓
Check console for payload!
```

## 🎯 What You'll See

### 1. Day Action Modal
When you click a date, you'll see this:

```
┌─────────────────────────────────────┐
│  ✨ Plan Your Day                   │
│  Monday, January 20, 2025           │
├─────────────────────────────────────┤
│                                     │
│  📅 Create Event                    │
│  Schedule a specific event...       │
│                                     │
│  🕐 Schedule TBA Post               │ ← Click this!
│  Coming soon to BaseTime.           │
│                                     │
└─────────────────────────────────────┘
```

### 2. TBA Post Form
After clicking, you'll see this beautiful form:

```
┌─────────────────────────────────────────────┐
│  ✨ Schedule TBA Post              [X]      │
│  Monday, January 20, 2025                   │
├─────────────────────────────────────────────┤
│                                             │
│  📝 Post Header                             │
│  ┌───────────────────────────────────────┐ │
│  │ Base Hackathon 2025                   │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  📝 Post Description                        │
│  ┌───────────────────────────────────────┐ │
│  │ Join us for the biggest...            │ │
│  │                                        │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ─────────── Image Details ───────────     │
│                                             │
│  🖼️ Image URL                               │
│  ┌───────────────────────────────────────┐ │
│  │ https://example.com/image.jpg         │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │        [Image Preview Here]           │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  📝 Image Header                            │
│  ┌───────────────────────────────────────┐ │
│  │ Base Hackathon                        │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  📝 Image Description                       │
│  ┌───────────────────────────────────────┐ │
│  │ A gathering of Base builders...       │ │
│  └───────────────────────────────────────┘ │
│                                             │
├─────────────────────────────────────────────┤
│                      [Cancel] [✨ Schedule Post] │
└─────────────────────────────────────────────┘
```

## 🔍 Testing the Form

### Test 1: Image Preview
1. Enter this image URL:
   ```
   https://images.unsplash.com/photo-1505373877841-8d25f7d46678
   ```
2. You should see a live preview below the input!

### Test 2: Form Validation
1. Leave all fields empty
2. Try to click "Schedule Post"
3. The button should be disabled (grayed out)

### Test 3: Console Output
1. Fill out all fields
2. Click "Schedule Post"
3. Open browser console (F12 → Console tab)
4. You should see:
   ```javascript
   📝 TBA Post Data: {
     header: "...",
     description: "...",
     image: "...",
     imageHeader: "...",
     imageDescription: "..."
   }
   📅 Scheduled for: Mon Jan 20 2025...
   📦 Post Payload: {
     date: ...,
     header: "...",
     description: "...",
     image: { ... }
   }
   ```

## 🎨 Customization

### Change Colors
Edit `src/components/TBAPostModal.tsx`:

```typescript
// Change gradient colors
className="bg-gradient-to-r from-purple-500 to-pink-600"
// To:
className="bg-gradient-to-r from-blue-500 to-indigo-600"
```

### Add More Fields
In the form section, add:

```typescript
<div>
  <label htmlFor="newField" className="...">
    New Field
  </label>
  <input
    type="text"
    id="newField"
    value={formData.newField}
    onChange={(e) => handleChange('newField', e.target.value)}
    className="..."
  />
</div>
```

### Change Button Text
```typescript
<SparklesIcon className="w-5 h-5" />
Schedule Post  // ← Change this
```

## 🐛 Troubleshooting

### Modal doesn't open
- Check browser console for errors
- Make sure you clicked a date in the calendar
- Verify the calendar view is active

### Image preview not working
- Make sure the URL is valid
- Check if the image host allows CORS
- Try a different image URL

### Form won't submit
- Check if all fields are filled
- Look for validation errors in console
- Make sure you're not in a loading state

### Console shows errors
- Check if all dependencies are installed: `pnpm install`
- Verify TypeScript types are correct
- Make sure the dev server is running

## 📚 Next Steps

After testing the UI:

1. **Read the full documentation**: `TBA_POST_FEATURE.md`
2. **Understand the implementation**: `IMPLEMENTATION_SUMMARY.md`
3. **Implement smart contract integration** (see documentation)
4. **Test on Base testnet**
5. **Deploy to production**

## 🎉 You're Ready!

The TBA Post feature is fully functional and ready to use. The UI is complete, and the data is being collected correctly. The next step is to connect it to the Base social contract to actually post to the feed.

---

**Need Help?**
- Check the full documentation
- Review the implementation summary
- Test with the examples above
- Check browser console for detailed logs

Happy coding! 🚀





