# Adding Photos to Your Athol Island Venue Website

## Quick Setup Guide

### Step 1: Add Your Photos to the Project

1. **Copy your photos** to the `public/images/` directory in your project
2. **Rename them** to descriptive names like:
   - `construction-progress.jpg`
   - `venue-structure.jpg`
   - `island-views.jpg`
   - `beach-area.jpg`
   - `interior-work.jpg`
   - `dock-facilities.jpg`

### Step 2: Update the Photo Paths

Open `src/components/IslandHero.tsx` and find the `VENUE_PHOTOS` array (around line 10). Update the `src` fields with your photo paths:

```javascript
const VENUE_PHOTOS = [
  {
    src: '/images/construction-progress.jpg', // ← Add your photo filename here
    alt: 'Construction progress on Athol Island venue',
    title: 'Construction Progress'
  },
  {
    src: '/images/venue-structure.jpg', // ← Add your photo filename here
    alt: 'Main venue structure under construction',
    title: 'Venue Structure'
  },
  // ... and so on for each photo
];
```

### Step 3: Photo Requirements

**Recommended specs for best results:**
- **Format:** JPG or PNG
- **Size:** 800x800 pixels minimum (square aspect ratio works best)
- **File size:** Under 2MB each for fast loading
- **Quality:** Good lighting and clear details

### Step 4: Testing

1. Save your changes
2. The development server should automatically reload
3. Scroll through all three sections to test:
   - **Nassau view** → scroll down
   - **Island view** → scroll down  
   - **Form view** with your photos

## Current Photo Placeholders

The form currently shows these 6 photo categories:
1. **Construction Progress** - Overall building progress
2. **Venue Structure** - Main buildings and architecture  
3. **Island Views** - Scenic shots of the island
4. **Beach Area** - Waterfront and beach facilities
5. **Interior Work** - Inside construction and finishes
6. **Dock Facilities** - Marina and boat access

## Photo Optimization Tips

- **Compress images** before adding (try [TinyPNG](https://tinypng.com/))
- **Use descriptive filenames** (no spaces, use hyphens)
- **Keep originals** as backup in case you need different sizes later

## Need Help?

If you need to adjust the photo layout, categories, or add more photos, just let me know! The PhotoGallery component is fully customizable. 