# 📱 Mobile Date Range Picker

A smooth, native-like mobile calendar component built with Next.js and TypeScript. Designed to feel like Tinder/Instagram - fast, fluid, and intuitive.

## 🚀 Live Demo

[View on Vercel](#) _(will be added after deployment)_

## 🎯 Technical Decisions & Implementation

### **1. Week-Based View (Not Month)**

**Decision:** Display one week at a time instead of full month.

**Reasoning:**
- **Mobile-first approach**: Full month calendars are cramped on small screens
- **Touch-friendly**: Larger tap targets (easier to select dates)
- **Natural scrolling**: Vertical scroll feels more native than pagination
- **Better focus**: Users see exactly 7 days without cognitive overload

### **2. Infinite Scroll with Snap Points**

**Implementation:**
```typescript
// CSS snap scrolling for native feel
scroll-snap-type: y mandatory;
scroll-snap-align: start;
-webkit-overflow-scrolling: touch;
```

**Features:**
- Pre-generates 52 weeks in past + 52 weeks in future (2 years total)
- Smooth snap-to-week behavior
- No "jumpy" scroll experience
- Works like Instagram stories

### **3. Touch Event Optimization**

**Problem Solved:** Prevent accidental date selection while scrolling.

**Solution:**
```typescript
const handleTouchMove = (e: React.TouchEvent) => {
  const diff = Math.abs(touchY - touchStartY);
  if (diff > 5) {
    isScrollingRef.current = true; // Block clicks
  }
};
```

**Benefits:**
- Detects scroll intent (5px threshold)
- Blocks date selection during active scroll
- 100ms cooldown after scroll ends
- No conflict between tap and scroll gestures

### **4. Smart Date Range Selection UX**

**Logic:**
1. **First tap** → Select start date
2. **Second tap** → Select end date (or swap if earlier than start)
3. **Tap on start date again** → Clear selection
4. **Third tap** → Start new selection

**Edge cases handled:**
- Clicking dates in reverse order (auto-swap)
- Same date selection (clear range)
- Visual feedback during partial selection

### **5. Visual Design Choices**

#### **Colors & States:**
- **Blue-600** for selected edges (start/end)
- **Blue-100** for dates in range
- **Gray-300** for dates outside current month
- **Ring-2** for today's date
- **Scale animation** on tap (active:scale-95)

#### **Performance:**
- Transition-all duration-200 (smooth but not laggy)
- GPU-accelerated transforms
- No re-renders on scroll (refs instead of state)

### **6. Accessibility & Usability**

✅ **Today indicator** - Blue dot below current date
✅ **Month labels** - Context for each week
✅ **Visual range highlight** - Clear selection feedback
✅ **Scroll hint** - "👆 Scroll to browse weeks"
✅ **Clear button** - Easy way to reset selection

## 🛠️ Tech Stack

- **Next.js 16** (App Router)
- **React 18** (Client components)
- **TypeScript** (Full type safety)
- **Tailwind CSS** (Utility-first styling)
- **No external date libraries** (Pure vanilla implementation)

## 🏗️ Project Structure

```
mobile-calendar/
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── MobileDateRangePicker.tsx  # Calendar component
└── README.md
```

## 🔧 Installation & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd mobile-calendar

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Best Experienced On

- iPhone Safari
- Android Chrome
- Any mobile browser with touch support

**Desktop works too**, but the component is optimized for mobile UX.

## 🎨 Key Features

### ✨ Smooth Scrolling
- Native scroll snap points
- No lag or jank
- Feels like a native app

### 🎯 Intelligent Touch Handling
- Distinguishes between scroll and tap
- No accidental selections
- Immediate visual feedback

### 🗓️ Flexible Date Selection
- Start date → End date flow
- Auto-swap for reverse selection
- Clear visual range indication

### ⚡ Performance Optimized
- Virtual scrolling approach
- Minimal re-renders
- GPU-accelerated animations

## 🧠 What I Focused On

### 1. **Mobile UX First**
The component was designed specifically for mobile touch interfaces. Desktop is secondary.

### 2. **No Scroll-Click Conflicts**
Solved the classic problem where scrolling triggers clicks. Used touch event detection with threshold logic.

### 3. **Native App Feel**
Snap scrolling, smooth transitions, and proper touch handling make it feel like iOS/Android native components.

### 4. **Clean Code Architecture**
- Single responsibility principle
- Type-safe with TypeScript
- Readable and maintainable
- No over-engineering

### 5. **Zero External Dependencies**
No date libraries (date-fns, dayjs, etc.). Pure JavaScript Date API. Keeps bundle size minimal.

## 🚧 Future Improvements (Out of Scope)

- Month view toggle option
- Swipe gestures for week navigation
- Preset ranges (Last 7 days, This month, etc.)
- Internationalization (i18n)
- Dark mode support
- Animation spring physics

## 📝 Notes

- **Scroll behavior**: Uses native CSS scroll-snap for best performance
- **Touch detection**: 5px threshold to differentiate tap vs scroll
- **Date range**: Generates 2 years of weeks (104 total)
- **Accessibility**: Could be enhanced with ARIA labels in v2

## 👨‍💻 Author

Built as a technical assessment for a mobile-first frontend position.

**Time spent:** ~2-3 hours

**Focus areas:**
1. Mobile UX quality
2. Scroll vs click interaction
3. Visual polish
4. Code cleanliness

---

Made with ❤️ and lots of care for mobile UX.
