
import Image from 'next/image';

export function LogoIcon({ className }: { className?: string }) {
  return (
    <Image src="/images/icon/IC.png" alt="ICMSTRY Logo" width={36} height={36} className={className} />
  );
}
