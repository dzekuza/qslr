import * as React from 'react'
import { cn } from '@/lib/utils'

const TypographyVariants = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  blockquote: 'mt-6 border-l-2 pl-6 italic',
  table: 'w-full caption-bottom text-sm',
  list: 'my-6 ml-6 list-disc [&>li]:mt-2',
  'inline-code': 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground'
} as const

type TypographyVariant = keyof typeof TypographyVariants

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
  as?: keyof JSX.IntrinsicElements
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'p', as, ...props }, ref) => {
    const Component = as || (variant === 'inline-code' ? 'code' : variant) as keyof JSX.IntrinsicElements
    
    return React.createElement(
      Component,
      {
        className: cn(TypographyVariants[variant], className),
        ref,
        ...props
      }
    )
  }
)
Typography.displayName = 'Typography'

// Individual typography components for convenience
const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="h1"
      as="h1"
      className={className}
      {...props}
    />
  )
)
H1.displayName = 'H1'

const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="h2"
      as="h2"
      className={className}
      {...props}
    />
  )
)
H2.displayName = 'H2'

const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="h3"
      as="h3"
      className={className}
      {...props}
    />
  )
)
H3.displayName = 'H3'

const H4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="h4"
      as="h4"
      className={className}
      {...props}
    />
  )
)
H4.displayName = 'H4'

const P = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="p"
      as="p"
      className={className}
      {...props}
    />
  )
)
P.displayName = 'P'

const Blockquote = React.forwardRef<HTMLQuoteElement, React.HTMLAttributes<HTMLQuoteElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="blockquote"
      as="blockquote"
      className={className}
      {...props}
    />
  )
)
Blockquote.displayName = 'Blockquote'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="table"
      as="table"
      className={className}
      {...props}
    />
  )
)
Table.displayName = 'Table'

const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="list"
      as="ul"
      className={className}
      {...props}
    />
  )
)
List.displayName = 'List'

const InlineCode = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="inline-code"
      as="code"
      className={className}
      {...props}
    />
  )
)
InlineCode.displayName = 'InlineCode'

const Lead = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="lead"
      as="p"
      className={className}
      {...props}
    />
  )
)
Lead.displayName = 'Lead'

const Large = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="large"
      as="div"
      className={className}
      {...props}
    />
  )
)
Large.displayName = 'Large'

const Small = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="small"
      as="small"
      className={className}
      {...props}
    />
  )
)
Small.displayName = 'Small'

const Muted = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="muted"
      as="p"
      className={className}
      {...props}
    />
  )
)
Muted.displayName = 'Muted'

export {
  Typography,
  H1,
  H2,
  H3,
  H4,
  P,
  Blockquote,
  Table,
  List,
  InlineCode,
  Lead,
  Large,
  Small,
  Muted
}
