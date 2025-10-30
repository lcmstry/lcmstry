
export type Schedule = {
  time: string;
  subject: string;
};

export type DaySchedule = {
  day: string;
  courses: Schedule[];
};

export const scheduleData: DaySchedule[] = [
  {
    day: "Senin",
    courses: [
      { time: "07:00 - 09:30", subject: "Dasar-Dasar Ekonomi" },
      { time: "10:00 - 12:30", subject: "Praktikum Pemrograman Visual" },
    ],
  },
  {
    day: "Selasa",
    courses: [
      { time: "07:00 - 08:40", subject: "Pemrograman Mobile" },
      { time: "08:40 - 10:50", subject: "Matematika Diskrit" },
      { time: "10:50 - 12:30", subject: "Basis Data I" },
    ],
  },
  {
    day: "Rabu",
    courses: [
      { time: "07:00 - 09:30", subject: "Manajemen Perusahaan" },
      { time: "10:00 - 12:30", subject: "Praktikum Basis Data I" },
    ],
  },
  {
    day: "Kamis",
    courses: [
      { time: "07:00 - 09:30", subject: "Keamanan Komputer" },
      { time: "10:00 - 12:30", subject: "Prak. Pemrograman Mobile" },
    ],
  },
  {
    day: "Jumat",
    courses: [
      { time: "07:00 - 09:30", subject: "Analisis Proses Bisnis" },
      { time: "10:00 - 11:40", subject: "Bahasa Inggris III" },
    ],
  },
];

export type Member = {
  name: string;
  position: string;
  imageId: string;
};

export type MemberGroup = {
  title: string;
  members: Member[];
}

const allMembers: Member[] = [
    { name: "Nabila Rizki Agnia", position: "Ketua Kelas", imageId: "nabila" },
    { name: "Zovanda Putri Nazyra", position: "Wakil Ketua", imageId: "zovanda" },
    { name: "Dwina Berlieana", position: "Sekretaris", imageId: "dwina" },
    { name: "Putri Afifah Khairunnisa", position: "Bendahara", imageId: "putri" },
    { name: "Dimas Yuda Pratama", position: "Anggota", imageId: "dimas" },
    { name: "Ahmad Afan Saputra", position: "Anggota", imageId: "afan" },
    { name: "Alfaris Abiyyu Ramadhan", position: "Anggota", imageId: "alfaris" },
    { name: "Amelia Andina Putri", position: "Anggota", imageId: "amelia-a" },
    { name: "Amira Lutfia Alkamila", position: "Anggota", imageId: "amira" },
    { name: "Brilia Fatihah", position: "Anggota", imageId: "brilia" },
    { name: "Bunga Chesyaqilla Yandrina", position: "Anggota", imageId: "bunga" },
    { name: "Dinda Septiasa", position: "Anggota", imageId: "dinda" },
    { name: "Gilang Ferdinan", position: "Anggota", imageId: "gilang" },
    { name: "Lulu Zakiyah", position: "Anggota", imageId: "lulu" },
    { name: "M Rifky Alsyahputra", position: "Anggota", imageId: "rifky" },
    { name: "M. Alif Rizkiano Mauliddin", position: "Anggota", imageId: "alif" },
    { name: "Natasya", position: "Anggota", imageId: "natasya" },
    { name: "Nayla Siti Azzyza", position: "Anggota", imageId: "nayla" },
    { name: "Nia Tripen Sella Manalu", position: "Anggota", imageId: "nia" },
    { name: "Raid Agasyah", position: "Anggota", imageId: "raid" },
    { name: "Risky Amelia", position: "Anggota", imageId: "risky" },
    { name: "Shandy Dwi Raka Putra", position: "Anggota", imageId: "shandy" },
    { name: "Yulia Agustin", position: "Anggota", imageId: "yulia" },
    { name: "Zahra Amelia", position: "Anggota", imageId: "zahra" }
];

const officials = allMembers.filter(m => m.position !== 'Anggota');
const members = allMembers.filter(m => m.position === 'Anggota');

export const memberGroups: MemberGroup[] = [
  {
    title: 'Perangkat Kelas',
    members: officials,
  },
  {
    title: 'Anggota',
    members: members,
  }
];


export type GalleryItem = {
  title: string;
  imageId: string;
};

export const galleryData: GalleryItem[] = [
    { title: "After CompanyProfil", imageId: "gallery-compro" },
    { title: "Bakar Bakar", imageId: "gallery-bakar" },
    { title: "Gacoan", imageId: "gallery-gacoan" },
    { title: "Bukber", imageId: "gallery-bukber" },
    { title: "Idul Fitri", imageId: "gallery-fitri" },
    { title: "Kolam with IB", imageId: "gallery-kolam" },
];

export type Project = {
  title: string;
  description: string;
  status: 'Completed' | 'Coming Soon';
  link?: string;
};

export const projectData: Project[] = [
  { 
    title: "Multimedia", 
    description: "Membuat Video Company Profil Manajemen Informatika",
    status: 'Completed',
    link: 'https://youtu.be/hCBD4Tz7tho'
  },
  { 
    title: "Coming Soon", 
    description: "-",
    status: 'Coming Soon'
  }
];
