import Link from 'next/link';
import { projectData } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import React from 'react';

const ProjectsSection = ({ id }: { id: string }) => {

  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  };

  return (
    <section id={id} className="py-24 min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Proyek <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Kelas</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Karya-karya inovatif yang telah dan akan kami selesaikan bersama.</p>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {projectData.map((project) => (
          <div 
            key={project.title} 
            className="spotlight-card group"
            onMouseMove={handleMouseMove}
            style={{ '--mouse-x': `${mouseX}px`, '--mouse-y': `${mouseY}px` } as React.CSSProperties}
          >
            <div className="spotlight-card-content h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-white">{project.title}</h3>
                  {project.status === 'Completed' ? (
                    <Badge className="font-code text-sm bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Selesai
                    </Badge>
                  ) : (
                    <Badge className="font-code text-sm bg-amber-500/20 text-amber-400 border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5" variant="outline">
                      <Clock className="h-3.5 w-3.5" />
                      Segera
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
              </div>
              
              {project.status === 'Completed' && project.link && (
                 <Link href={project.link} target="_blank" rel="noopener noreferrer" className="mt-6 text-sm font-semibold text-primary inline-flex items-center group/link">
                   Lihat Proyek
                   <ArrowUpRight className="h-4 w-4 ml-1.5 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                 </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
