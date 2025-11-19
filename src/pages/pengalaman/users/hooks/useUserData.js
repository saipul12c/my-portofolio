import { useState, useMemo, useCallback, useEffect } from "react";
import testimonialsData from "../../../../data/testimoni/testimonials.json";

export const useUserData = (slug) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [sortBy, setSortBy] = useState("latest");

  // Fungsi membuat slug dengan error handling
  const createSlug = useCallback((text) => {
    try {
      if (!text || typeof text !== 'string') {
        throw new Error('Invalid text for slug creation');
      }
      return text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    } catch (err) {
      console.error('Error creating slug:', err);
      return 'unknown-user';
    }
  }, []);

  // Load data dengan error handling
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!testimonialsData || !Array.isArray(testimonialsData)) {
          throw new Error('Data testimonial tidak valid');
        }

        const userTestimonials = testimonialsData.filter(t => {
          try {
            return createSlug(t.name) === slug;
          } catch (err) {
            console.error('Error filtering testimonials:', err);
            return false;
          }
        });

        if (userTestimonials.length === 0) {
          throw new Error('Pengguna tidak ditemukan');
        }

        setFilteredTestimonials(userTestimonials);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, createSlug]);

  // Ambil info pengguna dari testimonial pertama dengan error handling
  const userInfo = useMemo(() => {
    try {
      if (filteredTestimonials.length === 0) return null;
      
      const first = filteredTestimonials[0];
      if (!first) return null;

      // Validasi data required
      if (!first.name || !first.role) {
        throw new Error('Data pengguna tidak lengkap');
      }

      const totalRatings = filteredTestimonials.reduce((sum, t) => {
        const rating = Number(t.rating) || 0;
        return sum + Math.max(0, Math.min(5, rating)); // Clamp between 0-5
      }, 0);

      const avgRating = totalRatings / filteredTestimonials.length;
      const achievementLevel = avgRating >= 4.5 ? "Expert" : avgRating >= 4.0 ? "Advanced" : "Professional";

      return {
        name: first.name,
        role: first.role,
        company: first.company || "Freelance",
        image: first.image,
        location: first.location || "Remote",
        totalTestimonials: filteredTestimonials.length,
        avgRating: avgRating.toFixed(2),
        achievementLevel,
        joinDate: first.join_date || "2024",
        verified: Boolean(first.verified),
        email: first.email,
        website: first.website,
        business_impact: first.business_impact,
        innovation_contributions: first.innovation_contributions,
        technologies_used: first.technologies_used,
        performance_metrics: first.performance_metrics
      };
    } catch (err) {
      console.error('Error processing user info:', err);
      setError('Gagal memproses data pengguna');
      return null;
    }
  }, [filteredTestimonials]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    loading,
    error,
    filteredTestimonials,
    sortBy,
    setSortBy,
    userInfo,
    handleRetry
  };
};