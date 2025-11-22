import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Briefcase, ArrowRight } from "lucide-react";

export default function GalleryRelatedContent() {
  const [projectsData, setProjectsData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load projects data
        const projectsRes = await import("../../../data/projects.json");
        setProjectsData(projectsRes.default?.slice(0, 3) || []);

        // Load blog data
        const blogRes = await import("../../../data/blog/data.json");
        setBlogData(blogRes.default?.slice(0, 3) || []);
      } catch (err) {
        console.log("Data tidak tersedia:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <motion.section className="w-full max-w-7xl mx-auto mb-24">
        <div className="h-32 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl animate-pulse" />
      </motion.section>
    );
  }

  return (
    <motion.section
      className="w-full max-w-7xl mx-auto mb-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Projects Section */}
      {projectsData.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-400" /> Proyek Terkait
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-xl p-5 hover:border-blue-400/50 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-blue-300 transition line-clamp-2">
                      {project.name}
                    </h3>
                    <p className="text-xs text-blue-300/70 mt-1">
                      {project.category}
                    </p>
                  </div>
                  {project.featured && (
                    <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                  {project.description}
                </p>
                <Link
                  to={`/projects/${project.id}`}
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                >
                  Lihat Detail <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Blog Section */}
      {blogData.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" /> Artikel Terkait
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogData.map((blog) => (
              <motion.div
                key={blog.id}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-5 hover:border-purple-400/50 transition group"
              >
                {blog.thumbnail && (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-32 object-cover rounded-lg mb-3 opacity-80 group-hover:opacity-100 transition"
                  />
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-purple-300 transition line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-purple-300/70 mt-1">
                      {blog.category || "Blog"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                  {blog.excerpt || blog.description}
                </p>
                <Link
                  to={`/blog/${blog.slug || blog.id}`}
                  className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
                >
                  Baca Selengkapnya <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
