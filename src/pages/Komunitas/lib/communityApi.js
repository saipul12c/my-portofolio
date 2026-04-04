import { supabase } from '../../../lib/supabaseClient';

const mapCommunity = (c) => ({
  ...c,
  members: typeof c.members === 'number' ? c.members : (Number(c.members) || 0),
  category: c.category || '',
  location: c.location || '',
  tags: Array.isArray(c.tags) ? c.tags : [],
  isActive: c.is_active !== false,
  contact: {
    email: c.contact_email || '',
    phone: c.contact_phone || '',
    website: c.contact_website || ''
  },
  social_media: {
    facebook: c.social_media_facebook || '',
    twitter: c.social_media_twitter || '',
    instagram: c.social_media_instagram || '',
    linkedin: c.social_media_linkedin || ''
  }
});

export const communities = {
  list: async () => {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return (data || []).map(mapCommunity);
  },

  get: async (id) => {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? mapCommunity(data) : null;
  },

  create: async (communityData) => {
    const { data, error } = await supabase
      .from('communities')
      .insert([{ ...communityData, created_at: new Date().toISOString() }])
      .select();
    
    if (error) throw error;
    return data ? mapCommunity(data[0]) : null;
  },

  update: async (id, communityData) => {
    const { data, error } = await supabase
      .from('communities')
      .update({ ...communityData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data ? mapCommunity(data[0]) : null;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  getStats: async () => {
    const { data, error } = await supabase
      .from('communities')
      .select('members, category, is_active');
    
    if (error) throw error;

    const totalCommunities = data.length;
    const activeCommunities = data.filter(c => c.is_active !== false).length;
    const totalMembers = data.reduce((sum, c) => sum + (c.members || 0), 0);
    const uniqueCategories = [...new Set(data.map(c => c.category).filter(Boolean))];

    return { totalCommunities, activeCommunities, totalMembers, categories: uniqueCategories };
  }
};

export default { communities };
