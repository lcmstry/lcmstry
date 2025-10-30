import Image from 'next/image';
import { memberGroups, Member } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import React from 'react';

const MemberCard = ({ member }: { member: Member }) => {
  const image = PlaceHolderImages.find(img => img.id === member.imageId) || PlaceHolderImages.find(img => img.id === 'default-member');
  const positionColor = 
    member.position === 'Ketua Kelas' ? 'text-primary font-bold text-glow-primary' :
    member.position === 'Wakil Ketua' ? 'text-accent font-bold text-glow-accent' :
    ['Sekretaris', 'Bendahara'].includes(member.position) ? 'text-cyan-400 font-semibold' :
    'text-muted-foreground';

  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  };

  return (
    <div 
      className="spotlight-card text-center group"
      onMouseMove={handleMouseMove}
      style={{ '--mouse-x': `${mouseX}px`, '--mouse-y': `${mouseY}px` } as React.CSSProperties}
    >
      <div className="spotlight-card-content flex flex-col items-center">
        <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-4 border-2 border-border group-hover:border-primary transition-all duration-300 transform group-hover:scale-110 shadow-lg">
          {image && <AvatarImage src={image.imageUrl} alt={`Foto ${member.name}`} className="object-cover" />}
          <AvatarFallback className="bg-card text-4xl font-bold">
            {member.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-bold text-lg text-white leading-tight">{member.name}</h3>
        <p className={cn("text-sm transition-colors duration-300", positionColor)}>{member.position}</p>
      </div>
    </div>
  );
};

const MembersSection = ({ id }: { id: string }) => {
  return (
    <section id={id} className="py-24 min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Struktur <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Kelas IC'24</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Anggota IC 2024 Manajemen Informatika Politeknik Negeri Sriwijaya.</p>
      </div>
      
      {memberGroups.map((group) => (
        <div key={group.title} className="mb-20 last:mb-0">
            <h3 className="text-3xl font-bold text-center text-white mb-10">{group.title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                {group.members.map((member) => (
                    <MemberCard key={member.name} member={member} />
                ))}
            </div>
        </div>
      ))}
    </section>
  );
};

export default MembersSection;
