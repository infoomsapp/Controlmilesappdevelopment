# ControlMiles - Development Guidelines

## 🌐 Language Requirements

**MANDATORY**: All user-facing text, labels, placeholders, and messages MUST be in **English only**.

```typescript
// ✅ CORRECT
placeholder="Enter odometer reading"
toast.success("Photo captured successfully")
<Button>Start Tracking</Button>

// ❌ NEVER DO THIS
placeholder="Ingresa la lectura"
toast.success("Foto capturada")
<Button>Iniciar Rastreo</Button>
```

---

## 🚫 No Mock Data or Placeholders

- ❌ No mock data in production code
- ❌ No "test" or "demo" content
- ❌ No "Lorem ipsum" text
- ❌ No example data that isn't real
- ✅ All data must come from user input or localStorage
- ✅ Empty states should guide the user to create real data

---

## 📱 MVP-First Approach

- Focus on **core tracking workflow**:
  1. Start shift → capture odometer photo
  2. Select gig app → start GPS tracking
  3. Drive and track miles
  4. Stop tracking
  5. End shift → capture final odometer photo

- Keep UI **simple and clean**
- Prioritize **IRS compliance** over features
- **No unnecessary complexity**

---

## 🎨 Design System Guidelines

### Typography
- Use **system defaults** from `/src/styles/theme.css`
- Don't override font sizes unless absolutely necessary
- Don't use Tailwind font classes (text-2xl, font-bold) unless user specifically requests

### Colors
- Primary: Blue (`#2563EB`)
- Success: Green
- Warning: Yellow/Amber
- Error: Red
- Use semantic colors for status indicators

### Layout
- Use **flexbox and grid** by default
- Avoid absolute positioning unless necessary
- Keep layouts **responsive** (mobile-first)
- Maximum content width: `max-w-4xl`

---

## 🔐 IRS Compliance Rules

### Immutable Records
- **NEVER** edit original mileage data
- All corrections must be tracked separately in `corrections[]` array
- Each correction needs:
  - `timestamp`
  - `reason` (minimum 10 characters)
  - `adjustment` (+ or -)
  - `previousValue` and `newValue`

### Mandatory Photos
- Start of shift: **Required** before tracking
- End of shift: **Required** to complete the day
- Photos stored as data URLs in localStorage
- Odometer readings must be manually entered (no OCR)

### Hash Integrity
- Every ledger record has SHA-256 hash
- Hash includes: date, odometer, income, corrections
- Hash updated on every change
- Used for tamper detection

---

## 📦 File Structure

```
/src/app/
├── components/          # React components
│   ├── Dashboard.tsx    # Main screen (START HERE)
│   ├── CameraCapture.tsx
│   ├── Ledger.tsx
│   └── ...
├── services/           # Business logic
│   ├── storage.ts      # localStorage operations
│   ├── crypto.ts       # SHA-256 hashing
│   ├── gigApps.ts      # Gig app tracking
│   └── ...
├── hooks/              # Custom hooks
│   └── useTracking.ts  # GPS tracking hook
└── types/              # TypeScript definitions
    └── index.ts
```

---

## 🔧 Code Standards

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';

// 2. Interface/Types
interface MyComponentProps {
  onAction: () => void;
}

// 3. Component
export function MyComponent({ onAction }: MyComponentProps) {
  // 4. State
  const [value, setValue] = useState('');
  
  // 5. Effects
  useEffect(() => { }, []);
  
  // 6. Handlers
  function handleAction() { }
  
  // 7. Render
  return (/* JSX */);
}
```

### Naming Conventions
- Components: PascalCase (`DashBoard.tsx`)
- Functions: camelCase (`handleClick`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- Files: Match component name (`Dashboard.tsx`)

### State Management
- Use `useState` for local state
- Use `localStorage` for persistence
- No global state (Redux/Zustand) needed
- Props for parent-child communication

---

## 🎯 User Experience

### Flow
1. **Simple onboarding**: Take photo → Start tracking
2. **Clear states**: Loading, Success, Error, Empty
3. **Immediate feedback**: Toast notifications for actions
4. **Validation**: Clear error messages in English

### Error Handling
```typescript
// ✅ GOOD
toast.error('Please enter a valid odometer reading');

// ❌ BAD
toast.error('Error'); // Too vague
```

### Success Messages
```typescript
// ✅ GOOD
toast.success('✅ Shift completed successfully');

// ❌ BAD
toast.success('Done'); // Not descriptive
```

---

## 📊 Data Persistence

### localStorage Keys
- `controlmiles_ledgers` - All daily ledgers
- `controlmiles_logs` - GPS log entries
- `controlmiles_settings` - User settings
- `controlmiles_corrections` - Correction history

### Data Integrity
- Always hash data before saving
- Include timestamp on every record
- Never delete data (mark as corrected instead)

---

## 🚀 Performance

- **Lazy load** heavy components
- **Debounce** search inputs
- **Virtualize** long lists (if >100 items)
- **Compress** photos before storing
- **Limit** GPS log frequency (1 point per 15 seconds)

---

## ✅ Before Commit Checklist

- [ ] All text is in English
- [ ] No mock/test/demo data
- [ ] No console.log in production code
- [ ] Proper error handling
- [ ] Toast messages for user actions
- [ ] Responsive on mobile
- [ ] Follows IRS compliance rules
- [ ] TypeScript types defined
- [ ] No ESLint errors

---

## 🔍 Testing Scenarios

### Happy Path
1. Open app → See Dashboard
2. Take start photo → Enter reading
3. Select gig app (Uber)
4. Start tracking → Drive
5. Stop tracking → See miles
6. End shift → Take end photo
7. See shift completed badge

### Edge Cases
- No camera access → Show error
- Invalid odometer reading → Validation error
- GPS denied → Request permission
- End reading < start reading → Block submission
- Network offline → Still works (offline-first)

---

## 🎨 UI Components

Use components from `/src/app/components/ui/`:
- `Button` - Actions
- `Card` - Content containers
- `Input` - Text/number inputs
- `Badge` - Status indicators
- `Toast` - Notifications (via sonner)

**Never** create custom versions of these components.

---

## 🌟 Best Practices

1. **Keep it simple** - Don't over-engineer
2. **Mobile-first** - Gig drivers use phones
3. **Offline-capable** - localStorage > API calls
4. **IRS-ready** - Auditable, immutable, hashed
5. **User-friendly** - Clear, English, helpful

---

## 📖 Additional Resources

- `/TRANSLATION_STATUS.md` - Language compliance checklist
- `/END_SHIFT_FEATURE.md` - End shift workflow docs
- `/ANDROID_SETUP_COMPLETE.md` - Android deployment guide

---

**Remember**: ControlMiles is built for gig economy drivers who need IRS-compliant mileage tracking. Every feature must serve that goal. Keep it professional, clean, and in English.

---

Last Updated: 2025-01-14
