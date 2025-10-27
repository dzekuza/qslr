import { PublicLayout } from '@/components/layout/public-layout'
import { TypographyDemo } from '@/components/ui/typography-demo'
import { TypographyH1 } from '@/components/ui/typography-h1'
import { TypographyH2 } from '@/components/ui/typography-h2'
import { TypographyH3 } from '@/components/ui/typography-h3'
import { TypographyH4 } from '@/components/ui/typography-h4'
import { TypographyP } from '@/components/ui/typography-p'
import { TypographyBlockquote } from '@/components/ui/typography-blockquote'
import { TypographyTable } from '@/components/ui/typography-table'
import { TypographyList } from '@/components/ui/typography-list'
import { TypographyInlineCode } from '@/components/ui/typography-inline-code'
import { TypographyLead } from '@/components/ui/typography-lead'
import { TypographyLarge } from '@/components/ui/typography-large'
import { TypographySmall } from '@/components/ui/typography-small'
import { TypographyMuted } from '@/components/ui/typography-muted'

export default function TypographyPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Typography</h1>
            <p className="text-muted-foreground">
              Styles for headings, paragraphs, lists...etc. We do not ship any typography styles by default. 
              This page is an example of how you can use utility classes to style your text.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Typography Demo</h2>
              <TypographyDemo />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">h1</h2>
                <TypographyH1 />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">h2</h2>
                <TypographyH2 />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">h3</h2>
                <TypographyH3 />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">h4</h2>
                <TypographyH4 />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">p</h2>
                <TypographyP />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">blockquote</h2>
                <TypographyBlockquote />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">table</h2>
                <TypographyTable />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">list</h2>
                <TypographyList />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Inline code</h2>
                <TypographyInlineCode />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Lead</h2>
                <TypographyLead />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Large</h2>
                <TypographyLarge />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Small</h2>
                <TypographySmall />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Muted</h2>
                <TypographyMuted />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
