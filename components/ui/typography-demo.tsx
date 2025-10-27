import { H1, H2, H3, H4, P, Blockquote, List, InlineCode, Lead, Large, Small, Muted } from '@/components/ui/typography'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function TypographyDemo() {
  return (
    <div className="space-y-6">
      <div>
        <H1>Taxing Laughter: The Joke Tax Chronicles</H1>
        <P>
          Once upon a time, in a kingdom far, far away, there lived a king who loved to laugh.
          He would spend his days telling jokes and making his subjects chuckle. But one day,
          he realized that laughter was becoming too expensive for the royal treasury.
        </P>
        <P>
          The king, seeing how much happier his subjects were, proclaimed the joke tax would be
          a permanent law in the kingdom, and in doing so, inadvertently created the first tax
          joke in history.
        </P>
      </div>

      <div>
        <H2>The People of the Kingdom</H2>
        <P>
          The people of the kingdom were not amused by this new tax. They grumbled and complained,
          but the king was determined to make his point.
        </P>
        <Blockquote>
          "After all," he said, "everyone enjoys a good joke, so it's only fair that
          they should pay for the privilege."
        </Blockquote>
      </div>

      <div>
        <H3>The Joke Tax</H3>
        <P>
          The joke tax was implemented with great fanfare. Here's how it worked:
        </P>
        <List>
          <li>1st level of puns: 5 gold coins</li>
          <li>2nd level of jokes: 10 gold coins</li>
          <li>3rd level of one-liners: 20 gold coins</li>
        </List>
      </div>

      <div>
        <H4>People stopped telling jokes</H4>
        <P>
          As the tax grew heavier, people began to stop telling jokes altogether. The kingdom
          became a very serious place, and the king realized his mistake.
        </P>
      </div>

      <div>
        <Lead>
          A modal dialog that interrupts the user with important content and expects
          a response.
        </Lead>
        <P>
          This is a lead paragraph that introduces important information about the typography
          system and how it can be used throughout the application.
        </P>
      </div>

      <div>
        <Large>Are you sure absolutely sure?</Large>
        <P>
          This is a large text element that can be used for important callouts or emphasis.
        </P>
      </div>

      <div>
        <Small>Email address</Small>
        <Muted>Enter your email address.</Muted>
        <P>
          You can use <InlineCode>@radix-ui/react-alert-dialog</InlineCode> to create
          accessible dialog components.
        </P>
      </div>

      <div>
        <H3>Sample Table</H3>
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV002</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>PayPal</TableCell>
                <TableCell className="text-right">$150.00</TableCell>
              </TableRow>
            </TableBody>
          </table>
        </div>
      </div>
    </div>
  )
}
