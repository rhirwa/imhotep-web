import Link from 'next/link';
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  
  const links = [
    { title: 'Solutions', href: '/#solutions' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'Docs', href: '/docs' },
    { title: 'Blog', href: '/blog' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ];

  return (
    <footer className={cn(className)}>
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <Link href="/" className="flex items-center">
              <Logo className="h-6" />
            </Link>
            <p className="text-sm text-muted-foreground">
              {currentYear} Imhotep. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
