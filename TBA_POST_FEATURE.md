# TBA Post Feature Documentation

## Overview

The TBA (To Be Announced) Post feature allows users to schedule social posts directly from the BaseTime calendar. This feature is integrated into the calendar view and provides a beautiful form interface for creating posts with rich metadata.

## How It Works

### User Flow

1. **Open Calendar**: User navigates to the calendar view in BaseTime
2. **Click Date**: User clicks on any date in the calendar
3. **Choose Action**: User sees two options:
   - Create Event (for specific events)
   - Schedule TBA Post (for announcements)
4. **Fill Form**: User fills out the TBA post form with:
   - Post Header
   - Post Description
   - Image URL
   - Image Header
   - Image Description
5. **Submit**: Post is scheduled for the selected date

### Form Fields

The TBA Post form includes the following fields:

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| **Post Header** | Text | Main title/headline for the post | Yes |
| **Post Description** | Textarea | Detailed description of the announcement | Yes |
| **Image URL** | URL | Link to the post's featured image | Yes |
| **Image Header** | Text | Header text for the image card | Yes |
| **Image Description** | Textarea | Description of what the image shows | Yes |

### Data Structure

When submitted, the form creates a payload with this structure:

```typescript
interface TBAPostData {
  header: string;
  description: string;
  image: string;
  imageHeader: string;
  imageDescription: string;
}

// Full payload includes:
{
  date: Date,              // Selected calendar date
  header: string,          // Post header
  description: string,     // Post description
  image: {
    url: string,           // Image URL
    header: string,        // Image header
    description: string    // Image description
  },
  timestamp: string        // ISO timestamp
}
```

## Component Architecture

### TBAPostModal Component

**Location**: `src/components/TBAPostModal.tsx`

**Props**:
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Close handler
- `selectedDate: Date` - Date for which post is being scheduled
- `onSubmit: (data: TBAPostData) => void` - Submit handler

**Features**:
- Beautiful gradient UI (purple to pink theme)
- Real-time image preview
- Form validation
- Loading states during submission
- Responsive design
- Smooth animations with Framer Motion

### Integration with CalendarView

**Location**: `src/components/CalendarView.tsx`

The CalendarView component integrates the TBA modal:

```typescript
// State management
const [isTBAModalOpen, setIsTBAModalOpen] = useState(false);

// Handler to open modal
const handleScheduleTBA = () => {
  setIsDayActionModalOpen(false);
  setIsTBAModalOpen(true);
};

// Handler to process submission
const handleTBASubmit = async (data: TBAPostData) => {
  // Process the post data
  // TODO: Implement actual posting logic
};
```

## Next Steps: Implementing Actual Posting

### Current Status

The feature currently:
- ✅ Collects all required data
- ✅ Validates form inputs
- ✅ Shows beautiful UI
- ✅ Logs payload to console
- ⏳ **Needs**: Actual posting to Base social feed

### Implementation Guide

To implement actual posting to Base social feed, you'll need to:

#### 1. Understand the Transaction Structure

Based on the BaseScan transaction you referenced, social posts on Base are created through smart contract interactions. The transaction typically includes:

- **Cast Data**: The actual content of the post
- **Metadata**: Additional information like images, links, etc.
- **Timestamps**: When to publish

#### 2. Create a Smart Contract Interface

You'll need to interact with Base's social contract. This typically involves:

```typescript
// Example structure (needs actual contract ABI)
const SOCIAL_CONTRACT_ADDRESS = "0x...";
const SOCIAL_CONTRACT_ABI = [...];

// Create post function
async function createPost(data: TBAPostData) {
  const contract = new ethers.Contract(
    SOCIAL_CONTRACT_ADDRESS,
    SOCIAL_CONTRACT_ABI,
    signer
  );
  
  // Encode the post data
  const castData = encodeCastData(data);
  
  // Call the contract
  const tx = await contract.publishCast(castData);
  return tx;
}
```

#### 3. Encode Post Data

The post data needs to be encoded according to Base's social protocol:

```typescript
function encodeCastData(data: TBAPostData) {
  return {
    text: `${data.header}\n\n${data.description}`,
    embeds: [{
      url: data.image,
      title: data.imageHeader,
      description: data.imageDescription,
    }],
    publishedAt: selectedDate.getTime(),
  };
}
```

#### 4. Handle Transaction Lifecycle

Use wagmi hooks to manage the transaction:

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

function useTBAPost() {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  
  const createPost = async (data: TBAPostData) => {
    writeContract({
      address: SOCIAL_CONTRACT_ADDRESS,
      abi: SOCIAL_CONTRACT_ABI,
      functionName: 'publishCast',
      args: [encodeCastData(data)],
    });
  };
  
  return { createPost, isLoading, isSuccess };
}
```

#### 5. Update the Handler

Replace the placeholder logic in `CalendarView.tsx`:

```typescript
const handleTBASubmit = async (data: TBAPostData) => {
  try {
    await createPost(data);
    toast.success('TBA post scheduled successfully!');
    setIsTBAModalOpen(false);
  } catch (error) {
    console.error('Failed to schedule post:', error);
    toast.error('Failed to schedule post. Please try again.');
  }
};
```

## Resources

### Base Documentation
- [Base Docs Repository](https://github.com/base/docs)
- [OnchainKit Documentation](https://docs.base.org/onchainkit)
- [Base Social Protocol](https://docs.base.org/learn/base-app)

### Transaction Example
- [BaseScan Transaction](https://basescan.org/tx/0xb620c6c8a42589760d65d383f1737def01baba25c651d52303d537a85ecfebbd)

### Related Files
- Component: `src/components/TBAPostModal.tsx`
- Integration: `src/components/CalendarView.tsx`
- Types: `src/types/index.ts` (if you add TBAPostData there)

## Testing

To test the feature:

1. **Start the dev server**:
   ```bash
   pnpm dev
   ```

2. **Navigate to calendar view**

3. **Click any date**

4. **Select "Schedule TBA Post"**

5. **Fill out the form**:
   - Try with a valid image URL to see the preview
   - Test form validation by leaving fields empty
   - Submit and check console for the payload

6. **Verify**:
   - Form validates correctly
   - Image preview works
   - Payload structure is correct in console
   - Modal closes after submission

## Future Enhancements

Potential improvements for the TBA Post feature:

- [ ] Schedule posts for future dates (not just the selected date)
- [ ] Preview how the post will look when published
- [ ] Save drafts locally
- [ ] Add hashtags and mentions
- [ ] Support for multiple images
- [ ] Add link previews
- [ ] Integration with Base social contract
- [ ] Show scheduled posts on calendar
- [ ] Edit/delete scheduled posts
- [ ] Analytics for post performance

## Support

For questions or issues:
- Check the Base documentation
- Review transaction examples on BaseScan
- Test with Base testnet first
- Join Base Discord for community support

---

**Note**: This feature is currently in development. The UI and data collection are complete, but actual posting to Base social feed requires implementation of the smart contract interaction layer.


