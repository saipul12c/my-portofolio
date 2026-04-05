import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export const ACHIEVEMENTS = {
  // Global Achievements
  FIRST_MESSAGE: {
    id: 'first_message',
    name: 'Peserta Baru',
    description: 'Kirim pesan pertama Anda',
    icon: '🚀',
    points: 10,
    category: 'global'
  },
  TENTH_MESSAGE: {
    id: 'tenth_message',
    name: 'Pembicara Aktif',
    description: 'Kirim 10 pesan',
    icon: '💬',
    points: 25,
    category: 'global'
  },
  FIFTY_MESSAGE: {
    id: 'fifty_message',
    name: 'Orator Ulung',
    description: 'Kirim 50 pesan',
    icon: '🎤',
    points: 50,
    category: 'global'
  },
  SEVEN_DAY_STREAK: {
    id: 'seven_day_streak',
    name: 'Konsisten',
    description: 'Aktif selama 7 hari berturut-turut',
    icon: '🔥',
    points: 30,
    category: 'global'
  },
  HELPFUL_MENTION: {
    id: 'helpful_mention',
    name: 'Pembantu Sejati',
    description: 'Di-mention oleh 5 orang berbeda',
    icon: '🤝',
    points: 40,
    category: 'global'
  },

  // Moderator Achievements
  MOD_FIRST_WARN: {
    id: 'mod_first_warn',
    name: 'Penegak Aturan',
    description: 'Berikan peringatan pertama',
    icon: '⚠️',
    points: 20,
    category: 'moderator'
  },
  MOD_TEN_WARNS: {
    id: 'mod_ten_warns',
    name: 'Disiplin Master',
    description: 'Berikan 10 peringatan',
    icon: '🛡️',
    points: 50,
    category: 'moderator'
  },

  // Admin Achievements
  ADMIN_FIRST_BAN: {
    id: 'admin_first_ban',
    name: 'Penjaga Komunitas',
    description: 'Blokir user pertama kali',
    icon: '🔒',
    points: 30,
    category: 'admin'
  },
  ADMIN_COMMUNITY_BUILDER: {
    id: 'admin_community_builder',
    name: 'Pembangun Komunitas',
    description: 'Kelola komunitas selama 30 hari',
    icon: '🏢',
    points: 100,
    category: 'admin'
  },

  // Premium Achievements
  PREMIUM_EARLY_ADOPTER: {
    id: 'premium_early_adopter',
    name: 'Pendukung Awal',
    description: 'Menjadi Premium dalam 7 hari pertama',
    icon: '⭐',
    points: 50,
    category: 'premium'
  },
  PREMIUM_LOYAL: {
    id: 'premium_loyal',
    name: 'Anggota Setia',
    description: 'Premium selama 3 bulan',
    icon: '💎',
    points: 75,
    category: 'premium'
  }
};

export const useAchievements = () => {
  const [userAchievements, setUserAchievements] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  // Muat achievements dari database
  const loadAchievements = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId);

      if (!error && data && data.length > 0) {
        setUserAchievements(data);
        const total = data.reduce((sum, ach) => sum + (parseInt(ach.points) || 0), 0);
        setTotalPoints(total);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  }, []);

  // Unlock achievement
  const unlockAchievement = useCallback(async (userId, achievementId) => {
    const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
    if (!achievement) return false;

    try {
      // Add achievement baru (UNIQUE constraint in DB handles duplicates)
      const { error } = await supabase.from('achievements').insert([{
        user_id: userId,
        achievement_id: achievementId,
        name: achievement.name,
        icon: achievement.icon,
        points: achievement.points,
        date_unlocked: new Date().toISOString(),
        category: achievement.category
      }]);

      if (!error) {
        await loadAchievements(userId);
        return true;
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
    return false;
  }, [loadAchievements]);

  return {
    userAchievements,
    totalPoints,
    loadAchievements,
    unlockAchievement
  };
};