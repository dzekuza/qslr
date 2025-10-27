# Development Rules & Conventions

## Critical Development Rules

### Before Making ANY Changes

1. **ANALYZE FIRST**: Always read and understand the current file structure completely
2. **IDENTIFY REUSABLE COMPONENTS**: Check if a similar component already exists before creating new ones
3. **PLAN THE CHANGE**: Determine if you need to:
   - Replace existing code (preferred for structural changes)
   - Extend existing code (for feature additions)
   - Refactor existing code (for optimization)
4. **AVOID NESTING**: Never wrap new sections inside existing ones unless absolutely necessary. Instead, replace or refactor.
5. **DOCUMENT CHANGES**: Comment why you're removing or replacing code sections

---

## Code Structure Standards

### HTML/JSX Structure

Every section/div MUST have both an ID and classes:

```tsx
<div id="hero-section" className="hero-section container">
```

**Naming Conventions**:
- **ID Naming**: Use kebab-case (e.g., `product-grid`, `vendor-dashboard-header`)
- **Class Naming**: Use BEM methodology or consistent naming convention
  - Block: `product-card`
  - Element: `product-card__image`
  - Modifier: `product-card--featured`
- **Component Naming**: PascalCase (e.g., `ProductCard`, `VendorDashboard`)
- **File Naming**: kebab-case for files (e.g., `product-card.tsx`, `vendor-dashboard.tsx`)

### Component Philosophy

1. **Reuse over Recreation**: Always check `/components` directory before creating new components
2. **Composition over Duplication**: Use component composition to build complex UIs
3. **Props over Hardcoding**: Make components flexible with props
4. **Single Responsibility**: Each component should do ONE thing well

---

## CSS/Styling Standards

### Global Styles
Define in `/styles/globals.css`:
- Typography (font families, sizes, weights)
- Color variables (CSS custom properties)
- Spacing system
- Base element styles

### Component Styles
- **Primary**: Use Tailwind utility classes
- **Alternative**: CSS modules for complex component-specific styles
- **Consistency**: Use the same styling approach throughout the project
- **No Inline Styles**: Unless absolutely necessary for dynamic values

### Tailwind + Stylus Hybrid Approach
- Use Tailwind for common utilities and layout
- Use Stylus modules for complex, component-specific styles
- **Never use @apply directive**
- Example:
  - Tailwind: Spacing, colors, flexbox/grid
  - Stylus: Complex animations, unique layouts, component-specific patterns

### File Structure for Styling
```
components/
  Button/
    Button.tsx
    Button.module.styl
```

---

## TypeScript Standards

### Type Definitions
```typescript
// Use explicit types
interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
  className?: string
}

// Use enums for constants
enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
}
```

### Error Handling
```typescript
async function fetchProduct(id: string): Promise<Product> {
  try {
    const response = await fetch(`/api/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    return await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}
```

---

## React Component Standards

### Component Template
```typescript
import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ComponentNameProps extends HTMLAttributes<HTMLDivElement> {
  // Specific props here
  title: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function ComponentName({
  title,
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: ComponentNameProps) {
  return (
    <div
      id="component-name-wrapper"
      className={cn(
        'component-name',
        `component-name--${variant}`,
        `component-name--${size}`,
        className
      )}
      {...props}
    >
      <h2 id="component-name-title" className="component-name__title">
        {title}
      </h2>
      <div id="component-name-content" className="component-name__content">
        {children}
      </div>
    </div>
  )
}
```

### React Best Practices
- Use functional components with hooks
- Use the "function" keyword for component definitions
- Implement hooks correctly (useState, useEffect, useContext, etc.)
- Follow the Rules of Hooks
- Create custom hooks to extract reusable logic
- Use React.memo() for component memoization when appropriate
- Implement useCallback for memoizing functions passed as props
- Use useMemo for expensive computations
- Avoid inline function definitions in render
- Prefer composition over inheritance
- Implement error boundaries
- Use cleanup functions in useEffect

---

## File Modification Protocol

### Step 1: ANALYZE
```
ANALYZE FIRST:
I will now examine the current file structure:
- [List relevant files]
- [List existing components]
- [Identify reusable patterns]
```

### Step 2: PLAN
```
PLAN:
- Existing component to modify: [Component Name]
- New components needed: [List]
- Components to remove/replace: [List]
- Reason for approach: [Explanation]
```

### Step 3: IMPLEMENT
```
IMPLEMENTATION:
I will now [replace/extend/refactor] the following:
- File: [path/to/file.tsx]
- Action: [Specific changes]
- Rationale: [Why this approach]
```

### Step 4: VERIFY
```
VERIFICATION:
After changes:
- ✅ IDs added to all sections
- ✅ Classes follow naming convention
- ✅ Component is reusable
- ✅ No unnecessary nesting
- ✅ TypeScript types defined
- ✅ Props documented
```

---

## CORRECT vs WRONG Approaches

### ❌ WRONG: Nesting New Code
```tsx
// Old code
<div id="product-section" className="products">
  <ProductGrid products={products} />
</div>

// Wrong: Adding by nesting
<div id="product-section" className="products">
  <div className="new-wrapper"> {/* ❌ Unnecessary nesting */}
    <ProductGrid products={products} />
    <NewFeature />
  </div>
</div>
```

### ✅ RIGHT: Replace or Add as Sibling
```tsx
// Clean addition as sibling
<div id="product-section" className="products">
  <ProductGrid products={products} />
  <NewFeature /> {/* ✅ Clean addition */}
</div>

// Or if structure needs to change, replace entirely:
<section id="product-section" className="product-section">
  <div id="product-grid-wrapper" className="product-section__grid">
    <ProductGrid products={products} />
  </div>
  <aside id="product-sidebar" className="product-section__sidebar">
    <NewFeature />
  </aside>
</section>
```

---

## Component Development Checklist

Before creating a new component, ask yourself:

1. ✅ Does a similar component already exist?
   - Check `/components/ui`, `/components/layout`, `/components/products`, etc.
   - Can I extend or compose existing components?

2. ✅ Is this component reusable?
   - If yes, create it in appropriate domain folder
   - If no, consider inline implementation

3. ✅ What props does it need?
   - Keep props minimal and focused
   - Use TypeScript interfaces
   - Provide sensible defaults

4. ✅ Does it need IDs?
   - Add unique IDs to all major sections
   - Use descriptive, kebab-case naming
   - Include both ID and classes

5. ✅ What are the styling requirements?
   - Use Tailwind utilities
   - Allow className override via props
   - Follow design system spacing/colors

---

## API Routes Standards

### Structure
```typescript
// app/api/products/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const products = await prisma.product.findMany({
    // Query logic
  })

  return Response.json({
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'VENDOR') {
    return new Response('Unauthorized', { status: 401 })
  }

  const data = await req.json()
  
  // Validate with Zod
  const validated = productSchema.parse(data)

  const product = await prisma.product.create({
    data: validated,
  })

  return Response.json(product, { status: 201 })
}
```

---

## Database Standards (Prisma)

### Schema Conventions
- Use `camelCase` for field names
- Use `PascalCase` for model names
- Use `snake_case` for database table names (via `@@map`)
- Always include `createdAt` and `updatedAt` timestamps
- Use enums for status fields

### Example
```prisma
model Product {
  id              String          @id @default(cuid())
  vendorId        String
  name            String
  status          ProductStatus   @default(DRAFT)
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  vendor          Vendor          @relation(fields: [vendorId], references: [id])
  
  @@map("products")
}
```

---

## Git Commit Standards

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```
feat(products): Add product filtering functionality

docs(README): Update installation instructions

fix(auth): Resolve session expiration issue
```

---

## Performance Optimization Guidelines

### Frontend
- Minimize 'use client' directive usage
- Use Server Components by default
- Implement code splitting with React.lazy() and Suspense
- Optimize images (WebP format, lazy loading, size attributes)
- Use React.memo() for expensive components
- Implement useCallback for event handlers
- Use useMemo for expensive computations

### Backend
- Use Prisma queries efficiently (include, select)
- Implement pagination for large datasets
- Add database indexes for frequently queried fields
- Cache expensive operations
- Use connection pooling

---

## Testing Standards

### Unit Tests
- Test component rendering
- Test user interactions
- Test edge cases and error states
- Mock external dependencies

### Integration Tests
- Test API routes
- Test database operations
- Test authentication flows

### E2E Tests
- Test critical user flows
- Test payment processing
- Test vendor onboarding

---

## Security Standards

### Authentication
- Use NextAuth.js for session management
- Hash passwords with bcrypt
- Implement rate limiting
- Validate all user inputs

### API Security
- Validate request data with Zod
- Check user permissions on every request
- Sanitize user inputs
- Use HTTPS in production

### Database Security
- Use parameterized queries (Prisma handles this)
- Implement Row Level Security (RLS) where applicable
- Limit database permissions

---

## Documentation Standards

### Code Comments
```typescript
/**
 * Fetches a product by ID from the database
 * @param id - The unique identifier of the product
 * @returns Promise<Product> - The product object
 * @throws Error if product not found
 */
async function fetchProduct(id: string): Promise<Product> {
  // Implementation
}
```

### Component Documentation
```typescript
/**
 * ProductCard Component
 * 
 * Displays a single product card with image, title, price, and add to cart button.
 * 
 * @example
 * <ProductCard 
 *   product={product} 
 *   onAddToCart={handleAddToCart} 
 * />
 */
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Implementation
}
```

---

## Critical Reminders

1. **ALWAYS** analyze the entire file before making changes
2. **NEVER** nest unnecessarily - keep code layout clear and professional
3. **ALWAYS** add both ID and className to major sections
4. **ALWAYS** use TypeScript for type safety
5. **ALWAYS** follow the established patterns and conventions
6. **ALWAYS** test your changes before committing
7. **ALWAYS** document complex logic
8. **ALWAYS** consider reusability when creating components
9. **ALWAYS** follow the DRY (Don't Repeat Yourself) principle
10. **ALWAYS** maintain code consistency throughout the project

---

## Quick Reference

### Naming Conventions Quick Reference
| Element | Convention | Example |
|---------|-----------|---------|
| IDs | kebab-case | `product-grid` |
| Class Names | BEM | `product-card__image` |
| Component Names | PascalCase | `ProductCard` |
| File Names | kebab-case | `product-card.tsx` |
| Variables/Functions | camelCase | `getProducts` |
| Constants | UPPER_SNAKE_CASE | `MAX_ITEMS` |
| Types/Interfaces | PascalCase | `ProductProps` |

### File Structure Quick Reference
```
components/
  ComponentName/
    ComponentName.tsx
    ComponentName.module.styl
    index.ts
```
