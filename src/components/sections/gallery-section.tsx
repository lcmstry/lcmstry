
"use client";

import Image from 'next/image';
import { galleryData, GalleryItem } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ArrowRight, Maximize, X } from 'lucide-react';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const GallerySection = ({ id }: { id: string }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedImages = showAll ? galleryData : galleryData.slice(0, 2);

  const handleImageClick = (item: GalleryItem) => {
    setSelectedImage(item);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  return (
    <section id={id} className="py-24 min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Galeri <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Kegiatan</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Momen-momen tak terlupakan yang telah kami lalui bersama di IC'24.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayedImages.map((item) => {
          const image = PlaceHolderImages.find(img => img.id === item.imageId);
          return (
            <div 
              key={item.imageId} 
              className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg aspect-video"
              onClick={() => handleImageClick(item)}
            >
              {image && (
                 <Image 
                    src={image.imageUrl} 
                    alt={item.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    data-ai-hint={image.imageHint}
                 />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-xl drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {item.title}
                </h3>
                <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                  <Maximize className="h-4 w-4 mr-1" />
                  <p className="text-sm font-semibold">Lihat</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!showAll && galleryData.length > 2 && (
        <div className="text-center mt-12">
          <Button onClick={() => setShowAll(true)} size="lg" className="group bg-primary/90 text-primary-foreground hover:bg-primary transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30 rounded-full text-base font-bold">
            Lihat Galeri Lainnya
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}

      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
            <DialogContent className="max-w-4xl w-full h-[90vh] bg-transparent border-none shadow-none p-4 flex flex-col items-center justify-center">
              <DialogTitle className="sr-only">{selectedImage.title}</DialogTitle>
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <div className="relative w-full flex-1 mb-4">
                         <Image 
                            src={PlaceHolderImages.find(img => img.id === selectedImage.imageId)?.imageUrl || ''}
                            alt={selectedImage.title}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="w-full max-w-3xl text-center p-4 bg-card/50 backdrop-blur-lg rounded-xl border border-primary/20">
                        <h3 className="text-xl font-bold text-primary mb-1">{selectedImage.title}</h3>
                        <p className="text-muted-foreground text-sm">
                            {PlaceHolderImages.find(img => img.id === selectedImage.imageId)?.description || 'Detail Gambar'}
                        </p>
                    </div>
                </div>
                <DialogClose className="absolute right-3 top-3 rounded-full p-2 bg-background/50 text-white/70 hover:bg-background/80 hover:text-white transition-all duration-300">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </Dialog>
      )}

    </section>
  );
};

export default GallerySection;
