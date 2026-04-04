// Supabase API client for streaming pages
import { supabase } from '../../../lib/supabaseClient';

const mapVideo = (v) => ({
  ...v,
  views: v.views_text,
  uploadTime: v.upload_time,
  verified: v.is_verified,
  channelLogo: v.channel_logo, // Map snake_case to camelCase
  likes: v.likes_count,
  comments: v.comments_count,
  isNew: v.is_new,
  isLive: v.is_live,
  liveViewers: v.live_viewers
});

export const videos = {
  list: async (q, category) => {
    let query = supabase.from('videos').select('*');
    if (q) {
      query = query.ilike('title', `%${q}%`);
    }
    if (category && category !== 'All') {
      query = query.contains('category', [category]);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapVideo);
  },
  getRelated: async (videoId, categories = []) => {
    let query = supabase.from('videos').select('*').neq('id', videoId).limit(10);
    if (categories && categories.length > 0) {
      // Find videos with overlapping categories
      query = query.overlaps('category', categories);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapVideo);
  },
  get: async (id) => {
    const { data, error } = await supabase.from('videos').select('*').eq('id', id).single();
    if (error) throw error;
    return data ? mapVideo(data) : null;
  },
  comments: async (id, page = 1, per = 20) => {
    const from = (page - 1) * per;
    const to = from + per - 1;
    const { data, error } = await supabase
      .from('video_comments')
      .select('*')
      .eq('video_id', id)
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw error;
    return data;
  },
  postComment: async (id, author, message) => {
    const { data, error } = await supabase
      .from('video_comments')
      .insert([{ video_id: id, author_name: author, content: message }])
      .select();
    if (error) throw error;
    return data ? data[0] : null;
  },
  like: async (id, liked) => {
    const { data: video } = await supabase.from('videos').select('likes_count').eq('id', id).single();
    const newLikes = liked ? ((video?.likes_count || 0) + 1) : Math.max(0, (video?.likes_count || 0) - 1);
    const { error } = await supabase.from('videos').update({ likes_count: newLikes }).eq('id', id);
    if (error) throw error;
    return { likes: newLikes };
  }
};

export const shorts = {
  list: async () => {
    const { data, error } = await supabase.from('video_shorts').select('*');
    if (error) throw error;
    return (data || []).map(s => ({
      ...s,
      channelLogo: s.channel_logo,
      likes: s.likes_count,
      comments: s.comments_count,
      musicInfo: s.music_info
    }));
  }
};

export const streamingUsers = {
  list: async () => {
    const { data, error } = await supabase.from('users').select('*').limit(10);
    if (error) throw error;
    return data;
  }
};

export const streams = {
  listLive: async () => {
    const { data, error } = await supabase.from('videos').select('*').eq('is_live', true);
    if (error) throw error;
    return (data || []).map(mapVideo);
  },
  start: async (payload) => {
    const { data, error } = await supabase.from('videos').insert([{ ...payload, is_live: true }]).select();
    if (error) throw error;
    return data ? mapVideo(data[0]) : null;
  }
};

export default { videos, shorts, streamingUsers, streams };
