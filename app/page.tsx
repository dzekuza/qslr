import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Solar Panel Marketplace</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Multi-vendor marketplace for solar panels and related products
        </p>
        
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
          >
            Customer Sign Up
          </Link>
          <Link
            href="/register-vendor"
            className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90"
          >
            Vendor Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
