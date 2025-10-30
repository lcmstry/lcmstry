
import { Instagram, Youtube } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function SocialLinks() {
  const socialLinks = [
    { 
      name: 'Instagram', 
      href: 'https://www.instagram.com/lchemistryy/',
      icon: <Instagram className="h-5 w-5" /> 
    },
    { 
      name: 'YouTube', 
      href: 'https://www.youtube.com/@lchemistryy',
      icon: <Youtube className="h-5 w-5" /> 
    },
  ];

  return (
    <div className={cn(
      "fixed z-50 flex flex-col gap-3 left-4 top-1/2 -translate-y-1/2"
    )}>
      {socialLinks.map((link) => (
        <Button 
          key={link.name} 
          asChild 
          size="icon" 
          variant="outline"
          className="rounded-full bg-card/50 text-muted-foreground backdrop-blur-sm border-border/50 hover:bg-primary/80 hover:text-primary-foreground hover:border-primary/50 transition-all duration-300"
        >
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
          >
            {link.icon}
          </a>
        </Button>
      ))}
    </div>
  );
}
