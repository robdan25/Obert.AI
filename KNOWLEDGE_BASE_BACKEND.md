# OBERT KNOWLEDGE BASE - WITH BACKEND SUPPORT

## DESIGN & CODE EXCELLENCE

### VISUAL DESIGN STANDARDS:
- Modern, professional aesthetics - avoid generic tutorial-style designs
- Flat, tokenized design system using CSS variables (no excessive glow/glass/shadows)
- Thoughtful color palettes with proper contrast (WCAG AA minimum)
- Asymmetric, breathing layouts - don't center everything by default
- Consistent spacing using 4px/8px grid system
- Smooth micro-interactions and transitions (150-400ms)
- Dark mode by default with optional light mode

### CSS ARCHITECTURE:
- CSS Grid for layouts, Flexbox for components
- CSS custom properties for theming and tokens
- Mobile-first responsive design with fluid typography (clamp())
- Semantic class names, avoid utility soup
- Modern effects: backdrop-filter, transforms, gradients
- 60fps animations using transform/opacity only

### JAVASCRIPT QUALITY:
- ES6+ modern syntax (const/let, arrow functions, destructuring)
- Proper error handling with try/catch (especially for localStorage AND API calls)
- Debouncing/throttling for performance-critical events
- Event delegation for dynamic content
- Keyboard navigation support (Tab, Enter, Escape)
- Loading states and user feedback for all async operations
- Async/await for API calls

### ACCESSIBILITY & UX:
- Semantic HTML5 (nav, main, section, article)
- ARIA labels and roles for screen readers
- Visible focus states on all interactive elements
- Respect prefers-reduced-motion
- Form validation with helpful error messages
- Touch-friendly targets (min 44px)
- Loading skeletons for async content

---

## BACKEND CAPABILITIES (via CDN)

### FIREBASE INTEGRATION:
**When to use:** Authentication, real-time database, file storage

**Setup:**
```html
<!-- Firebase App (Core) -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<!-- Firebase Auth -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<!-- Firebase Firestore -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<!-- Firebase Storage -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js"></script>
```

**Features:**
- Email/password authentication
- Google, GitHub, Twitter OAuth
- Real-time Firestore database
- Cloud Storage for files
- Offline support
- Real-time listeners

### SUPABASE INTEGRATION:
**When to use:** PostgreSQL database, real-time subscriptions, RESTful API

**Setup:**
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

**Features:**
- PostgreSQL database with SQL queries
- Real-time subscriptions
- Row-level security
- Authentication (email, OAuth)
- Storage for files
- Edge Functions

### API INTEGRATION PATTERNS:

**RESTful APIs:**
```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ data })
    });

    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    // Show user-friendly error message
  }
}
```

**WebSocket for Real-time:**
```javascript
const ws = new WebSocket('wss://api.example.com/stream');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateUI(data);
};
```

### AUTHENTICATION FLOWS:
- Login/Signup forms with validation
- Password reset functionality
- Protected routes/content
- Session management with JWT
- Remember me functionality
- Social auth buttons (Google, GitHub)
- Email verification flows

### DATABASE OPERATIONS:
- CRUD operations (Create, Read, Update, Delete)
- Real-time listeners for live updates
- Pagination for large datasets
- Search and filtering with debouncing
- Sorting and ordering
- Data aggregation and analytics
- Optimistic UI updates

### FILE HANDLING:
- Image upload with preview
- File type and size validation
- Progress indicators
- Drag-and-drop upload zones
- Image optimization/compression before upload
- Multiple file uploads
- Cloud storage integration (Firebase Storage, Supabase Storage)

### BACKEND BEST PRACTICES:
- Always wrap API calls in try/catch
- Show loading states during async operations
- Implement optimistic UI updates
- Handle offline scenarios gracefully
- Validate data on client before sending
- Use environment variables for API keys (or prompt user)
- Implement proper error boundaries
- Cache API responses when appropriate
- Debounce search/filter operations
- Handle rate limiting gracefully

---

## CODE STANDARDS

### CORE REQUIREMENTS:
- Self-contained single HTML files
- All styles in <style> tag
- All scripts in <script> tag
- No console errors or warnings
- Comprehensive error boundaries
- Comments only for complex logic
- Real content (no "Lorem ipsum")
- Production-ready from first output

### TYPOGRAPHY:
- System font stack: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui
- Fluid scale: clamp(1rem, 2.5vw, 1.5rem)
- Line height: 1.5-1.7 for body, 1.2 for headings
- Proper hierarchy with clear visual weight

### COLOR PHILOSOPHY:
- Use HSL for easy variations
- Primary: Brand color for CTAs
- Surface: Layered backgrounds for depth
- Text: High contrast (min 4.5:1 ratio)
- Accents: Purposeful, not decorative

### PERFORMANCE:
- Optimized selectors
- Minimal DOM manipulation
- Lazy loading for images
- Efficient event listeners
- No memory leaks
- Smooth 60fps animations

---

## EXAMPLE BACKEND-ENABLED APPS

### Firebase Examples:
1. **Chat Application** - Real-time messaging with Firestore
2. **Blog CMS** - Auth, Firestore for posts, Storage for images
3. **E-commerce Dashboard** - Products in Firestore, order management
4. **Social Network** - User profiles, posts, likes, comments
5. **Collaborative Whiteboard** - Real-time drawing with Firestore

### Supabase Examples:
1. **Task Management** - PostgreSQL for tasks, real-time updates
2. **Analytics Dashboard** - Complex SQL queries, charts
3. **Inventory System** - CRUD operations, search, filters
4. **Booking System** - Date handling, availability checks
5. **Content Management** - Rich text, media storage

### API Integration Examples:
1. **Weather App** - OpenWeather API integration
2. **Stock Tracker** - Real-time stock data APIs
3. **News Aggregator** - News API with search/filter
4. **GitHub Dashboard** - GitHub API for repos/issues
5. **Crypto Tracker** - CoinGecko API for prices

---

## GOAL
Every Obert output should be indistinguishable from professionally hand-crafted code - clean, modern, accessible, fully functional with backend when needed, and immediately deployable.
