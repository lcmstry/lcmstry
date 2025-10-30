import { scheduleData } from '@/lib/data';
import { Clock } from 'lucide-react';
import React from 'react';

const ScheduleSection = ({ id }: { id: string }) => {

    const CourseCard = ({ course }: { course: { subject: string, time: string }}) => (
        <div className="bg-card/50 p-4 rounded-lg border border-transparent hover:border-primary/50 hover:bg-card transition-all duration-300 group">
            <h4 className="font-bold text-white text-base group-hover:text-primary transition-colors">{course.subject}</h4>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-code">{course.time}</span>
            </div>
        </div>
    );

  return (
    <section id={id} className="py-24 min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Jadwal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Perkuliahan</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Jadwal Mata Kuliah IC 2024 (Semester 3)</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {scheduleData.map((daySchedule, index) => (
          <div key={daySchedule.day} className="flex flex-col gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white tracking-wider uppercase">{daySchedule.day}</h3>
              <div className="h-1 w-16 bg-primary mx-auto mt-2 rounded-full" />
            </div>
            <div className="flex flex-col gap-6">
                {daySchedule.courses.map((course) => (
                    <CourseCard key={course.subject} course={course} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScheduleSection;
