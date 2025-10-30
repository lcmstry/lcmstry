import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { Particles } from "../particles";

const HeroSection = ({ id }: { id: string }) => {
  return (
    <section 
      id={id} 
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center text-center"
      style={{ backgroundImage: "url('/images/bg-mi.jpg')" }}
    >
      <Particles
          className="absolute inset-0 -z-10"
          quantity={100}
        />
      <div className="absolute inset-0 z-0 bg-black/70" />

      <div className="relative z-10 flex flex-col items-center px-4">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg md:text-5xl font-headline">
          Selamat Datang di <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/80 via-primary to-red-400 text-glow-primary">
            ICMSTRY
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200 drop-shadow-md md:text-xl">
          IC 2024 Manajemen Informatika, Politeknik Negeri Sriwijaya.
        </p>
        <a href="#jadwal">
          <Button size="lg" className="group mt-10 rounded-full bg-primary/90 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 hover:bg-primary">
            Jelajahi Sekarang
            <ArrowDown className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-y-1" />
          </Button>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
