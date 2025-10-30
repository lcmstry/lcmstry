
"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { href: '/#jadwal', label: 'Jadwal' },
  { href: '/#anggota', label: 'Anggota' },
  { href: '/#galeri', label: 'Galeri' },
  { href: '/#tugas', label: 'Proyek' },
  { href: '/secret-messages', label: 'Anonymous Message' },
];

interface HeaderProps {
  activeSection: string;
}

export function Header({ activeSection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('home');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        setIsScrolled(window.scrollY > heroHeight - 80);
      } else {
        setIsScrolled(window.scrollY > 80);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ href, label }: { href: string, label: string }) => {
    const isExternal = href.startsWith('http') || href.startsWith('/#');
    const isActive = activeSection === href.substring(href.lastIndexOf('#') + 1) || pathname === href;
    
    const linkContent = (
      <span
        className={cn(
          "relative text-slate-200 hover:text-white transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-300",
          isActive ? "text-white after:scale-x-100" : "hover:after:scale-x-100",
          !isScrolled && pathname === '/' && "text-slate-200 hover:text-white"
        )}
      >
        {label}
      </span>
    );
  
    if (isExternal || href.startsWith('/#')) {
        return <a href={href} onClick={() => setIsMobileMenuOpen(false)}>{linkContent}</a>;
    }
  
    return <Link href={href} onClick={() => setIsMobileMenuOpen(false)}>{linkContent}</Link>;
  };

  return (
    <header
      id="header"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || isMobileMenuOpen ? "bg-background/80 backdrop-blur-lg shadow-lg shadow-primary/10" : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/#home" className="flex items-center gap-3 text-lg md:text-xl font-bold font-headline text-white hover:text-primary transition-colors duration-300 text-glow-primary">
          <Image src="/images/icon/IC.png" alt="ICMSTRY Logo" width={36} height={36} className="h-9 w-9 md:h-7 md:w-7" />
          <span className="text-xl md:text-lg">ICMSTRY</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8 font-semibold">
          {navLinks.map((link) => <NavLink key={link.href} {...link} />)}
        </div>
        <Button
          id="mobile-menu-button"
          size="icon"
          variant="ghost"
          className="md:hidden text-slate-200 focus:outline-none hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </nav>
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden">
            <div className="flex flex-col px-6 pb-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(link.href.lastIndexOf('#') + 1) || pathname === link.href;
              const isExternal = link.href.startsWith('http') || link.href.startsWith('/#');

              const linkProps = {
                onClick: () => setIsMobileMenuOpen(false),
                className: cn(
                  "block py-2 px-4 rounded-md text-base text-slate-300 hover:bg-card",
                  isActive && "text-primary bg-card font-semibold"
                )
              };

              if (isExternal) {
                return <a key={link.href} href={link.href} {...linkProps}>{link.label}</a>;
              }

              return <Link key={link.href} href={link.href} {...linkProps}>{link.label}</Link>;

            })}
            </div>
        </div>
      )}
    </header>
  );
}
