
"use client";

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Loader } from '@/components/loader';
import HeroSection from '@/components/sections/hero-section';
import ScheduleSection from '@/components/sections/schedule-section';
import MembersSection from '@/components/sections/members-section';
import GallerySection from '@/components/sections/gallery-section';
import ProjectsSection from '@/components/sections/projects-section';

const sections = ['home', 'jadwal', 'anggota', 'galeri', 'tugas', 'secret-messages'];

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const scrollObserver = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    sectionRefs.current = sections.map(id => document.getElementById(id));

    observer.current = new IntersectionObserver((entries) => {
      const visibleSection = entries.find((entry) => entry.isIntersecting)?.target.id;
      if (visibleSection) {
        setActiveSection(visibleSection);
      }
    }, {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    });

    scrollObserver.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                scrollObserver.current?.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
    });

    const sectionsToObserve = sectionRefs.current.filter(el => el?.id !== 'home');

    sectionsToObserve.forEach((el) => {
      if (el) {
        scrollObserver.current?.observe(el);
        el.classList.add('fade-in-initial');
      }
    });

    sectionRefs.current.forEach((el) => {
      if(el) {
        observer.current?.observe(el);
      }
    })

    return () => {
      sectionRefs.current.forEach((el) => {
        if (el) {
          observer.current?.unobserve(el);
          scrollObserver.current?.unobserve(el);
        }
      });
    };
  }, []);

  return (
    <>
      <Loader />
      <Header activeSection={activeSection} />
      <main>
        <HeroSection id="home" />
        <div className="relative z-10 bg-transparent -mt-16">
          <div className="rounded-t-3xl pt-16">
            <div className='container mx-auto px-6'>
              <ScheduleSection id="jadwal" />
              <MembersSection id="anggota" />
              <GallerySection id="galeri" />
              <ProjectsSection id="tugas" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
