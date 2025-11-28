import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap, Award, BookOpen, Star, Calendar, MapPin, Clock, Users } from "lucide-react";
import { useRef } from "react";
import educationData from "../../data/pendidikan/data.json";

export default function Education() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Destructure data untuk memisahkan education dan courses
  const { education, courses } = educationData;

  // Hitung statistik
  const totalAchievements = education.reduce((acc, edu) => acc + (edu.achievements?.length || 0), 0);
  const totalSkills = education.reduce((acc, edu) => acc + (edu.skills?.length || 0), 0);
  const totalCourses = courses?.length || 0;
  const totalCertifications = education.length + totalCourses;

  return (
    <main
      ref={ref}
      className="relative min-h-screen bg-[#0b1120] text-white flex flex-col items-center px-6 py-24 overflow-hidden"
    >
      {/* === Scroll Progress Bar === */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[5px] origin-left z-50 bg-[linear-gradient(90deg,#06b6d4,#a855f7,#ec4899)] animate-[shimmer_3s_infinite_linear]"
      />
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-[shimmer_3s_infinite_linear] {
          background-size: 200% 200%;
        }
      `}</style>

      {/* === Background Glow === */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-5rem] left-[-5rem] w-[30rem] h-[30rem] bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-[-5rem] right-[-5rem] w-[30rem] h-[30rem] bg-fuchsia-500/20 blur-[120px]" />
      </div>

      {/* === Header === */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mb-24"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
          Riwayat Pendidikan & Pengembangan
        </h1>
        <p className="mt-4 text-gray-300 text-lg leading-relaxed">
          Perjalanan akademik dan pengembangan profesional yang membentuk cara berpikir, nilai, dan visi
          menuju masa depan penuh inovasi.
        </p>
        
        {/* === Stats Overview === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-cyan-400">{education.length}</div>
            <div className="text-sm text-gray-400">Tingkat Pendidikan</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-purple-400">{totalCourses}</div>
            <div className="text-sm text-gray-400">Kursus Diselesaikan</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-pink-400">{totalAchievements}+</div>
            <div className="text-sm text-gray-400">Pencapaian</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400">{totalSkills}+</div>
            <div className="text-sm text-gray-400">Keterampilan</div>
          </div>
        </motion.div>
      </motion.div>

      {/* === Timeline Education === */}
      <section className="relative max-w-5xl w-full flex flex-col items-center">
        {/* Garis tengah */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 rounded-full hidden sm:block opacity-70" />
        <motion.div
          style={{ height: lineHeight }}
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[3px] bg-gradient-to-b from-cyan-200 via-fuchsia-400 to-transparent hidden sm:block shadow-[0_0_15px_rgba(56,189,248,0.6)]"
        />

        <div className="flex flex-col gap-24 w-full mt-10">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative sm:w-[46%] px-8 py-8 rounded-3xl backdrop-blur-md transition-all duration-500 hover:scale-[1.02] ${
                index % 2 === 0
                  ? "self-start sm:mr-auto bg-gradient-to-br from-[#172554]/80 to-[#1e293b]/70 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
                  : "self-end sm:ml-auto bg-gradient-to-bl from-[#1e1b4b]/80 to-[#1e293b]/70 hover:shadow-[0_0_25px_rgba(236,72,153,0.4)]"
              }`}
            >
              {/* Status Badge untuk pendidikan yang sedang berjalan */}
              {edu.status && (
                <div className="absolute -top-2 -right-2 px-3 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full border border-green-500/30">
                  {edu.status}
                </div>
              )}

              {/* Icon Bubble */}
              <div
                className={`absolute sm:top-8 sm:-translate-y-0 top-[-1.5rem] ${
                  index % 2 === 0 ? "sm:-right-8" : "sm:-left-8"
                } flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg text-xl`}
              >
                {edu.logo || <GraduationCap size={24} className="text-white" />}
              </div>

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-cyan-300 mb-1">
                    {edu.degree}
                  </h2>
                  <h3 className="text-lg text-gray-200 mb-1">{edu.institution}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{edu.year}</span>
                    </div>
                    {edu.gpa && (
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400" />
                        <span>GPA: {edu.gpa}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed mb-6">{edu.description}</p>

              {/* Thesis (if exists) */}
              {edu.thesis && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300 mb-1">
                    <BookOpen size={16} />
                    <span>Skripsi/Tesis</span>
                  </div>
                  <p className="text-sm text-gray-300">{edu.thesis}</p>
                </div>
              )}

              {/* Skills */}
              {edu.skills && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Keterampilan:</h4>
                  <div className="flex flex-wrap gap-2">
                    {edu.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {edu.achievements && (
                <div className="mt-4">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-cyan-300 mb-3">
                    <Award size={16} />
                    <span>Pencapaian</span>
                  </h4>
                  <ul className="space-y-2">
                    {edu.achievements.map((achievement, achievementIndex) => (
                      <li key={achievementIndex} className="flex items-start gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* === Courses Section === */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mt-32 w-full"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-12 text-center">
          Kursus & Pelatihan Professional
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm">{course.provider}</p>
                </div>
                <div className="text-2xl">{course.logo}</div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{course.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{course.duration}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  course.level === 'Advanced' ? 'bg-red-500/20 text-red-300' :
                  course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {course.level}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4">{course.description}</p>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Keterampilan:</h4>
                <div className="flex flex-wrap gap-2">
                  {course.skills_learned.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {course.certificate && (
                <div className="flex items-center gap-2 text-sm text-cyan-300">
                  <Award size={16} />
                  <span>Bersertifikat</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* === Philosophy Section === */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mt-32 text-center"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
          Filosofi Pendidikan
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Pertumbuhan Berkelanjutan</h3>
            <p className="text-gray-400 text-sm">Pendidikan adalah proses seumur hidup yang terus berkembang</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Inovasi dalam Pembelajaran</h3>
            <p className="text-gray-400 text-sm">Menerapkan pendekatan kreatif dan solusi inovatif</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-lg font-semibold text-pink-300 mb-2">Kolaborasi & Komunitas</h3>
            <p className="text-gray-400 text-sm">Belajar melalui kerja sama dan berbagi pengetahuan</p>
          </div>
        </div>
      </motion.section>

      {/* Footer Glow */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#0b1120] to-transparent pointer-events-none" />
    </main>
  );
}