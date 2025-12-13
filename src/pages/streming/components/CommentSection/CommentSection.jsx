import React, { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import { debounce } from '../../utils/helpers';
import { 
  Send, ThumbsUp, MoreVertical, ChevronDown, 
  ChevronUp, MessageCircle, Flag, Heart, 
  Smile, Image as ImageIcon, AtSign
} from 'lucide-react';

const CommentSection = ({ videoId }) => {
  const [comment, setComment] = useState('');
  const [replies, setReplies] = useState({});
  const [showReply, setShowReply] = useState({});
  const [sortBy, setSortBy] = useState('top');
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [per] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const debouncedPostRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const loadPage = async (p = 1) => {
      if (!videoId) return;
      try {
        if (p === 1) setLoading(true); else setLoadingMore(true);
        const res = await api.videos.comments(videoId, p, per).catch(() => null);
        if (!mounted) return;
        // res may be {page, per, total, data} or an array
        if (res && Array.isArray(res.data)) {
          if (p === 1) setComments(res.data); else setComments(prev => [...prev, ...res.data]);
          setTotal(res.total || (res.data || []).length);
        } else if (Array.isArray(res)) {
          // fallback
          setComments(res);
          setTotal(res.length);
        } else {
          setComments([]);
          setTotal(0);
        }
      } catch (err) {
        console.error('Failed to load comments', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    // reset when videoId changes
    setPage(1);
    loadPage(1);

    return () => { mounted = false; };
  }, [videoId, per]);

  useEffect(() => {
    // prepare debounced poster
    debouncedPostRef.current = debounce(async (text) => {
      if (!videoId) return;
      setSubmitting(true);
      try {
        const author = localStorage.getItem('username') || 'You';
        const res = await api.videos.postComment(videoId, author, text);
        // backend returns created comment object
        setComments(prev => [res, ...prev]);
      } catch (err) {
        console.error('Failed to post comment', err);
        setComments(prev => [{ id: Date.now(), author: localStorage.getItem('username') || 'You', message: text, created_at: new Date().toISOString() }, ...prev]);
      } finally {
        setSubmitting(false);
      }
    }, 800);
    return () => { debouncedPostRef.current = null; };
  }, [videoId]);

  // comments loaded from backend (api.videos.comments)

  const handleLikeComment = (commentId) => {
    // Implement like functionality (client-side for now)
    console.log('Liking comment:', commentId);
  };

  const handleReply = (commentId) => {
    setShowReply({
      ...showReply,
      [commentId]: !showReply[commentId]
    });
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!comment.trim() || !videoId || !debouncedPostRef.current) return;
    // call debounced post
    debouncedPostRef.current(comment.trim());
    setComment('');
  };

  const handleLoadMore = async () => {
    const next = page + 1;
    setPage(next);
    try {
      setLoadingMore(true);
      const res = await api.videos.comments(videoId, next, per).catch(() => null);
      if (res && Array.isArray(res.data)) {
        setComments(prev => [...prev, ...res.data]);
        setTotal(res.total || total);
      } else if (Array.isArray(res)) {
        setComments(prev => [...prev, ...res]);
        setTotal((prev) => prev + (res.length || 0));
      }
    } catch (err) {
      console.error('Failed to load more comments', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmitReply = (commentId, replyText) => {
    // Submit reply
    setReplies({
      ...replies,
      [commentId]: [...(replies[commentId] || []), replyText]
    });
    setShowReply({ ...showReply, [commentId]: false });
  };

  const noMoreComments = comments.length >= total;
  const loadMoreClass = `px-6 py-2 rounded-full transition-colors ${noMoreComments ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`;

  return (
    <div className="space-y-6">
      {/* Comment Input */}
      <div className="flex gap-3">
        <img 
          src="https://i.pravatar.cc/40?img=6" 
          alt="Your avatar" 
          className="w-10 h-10 rounded-full"
          loading="lazy"
        />
        <form onSubmit={handleSubmitComment} className="flex-1">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-gray-700 pb-2 focus:outline-none focus:border-white transition-colors"
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-4">
              <button type="button" className="p-2 hover:bg-gray-800 rounded-full">
                <Smile size={20} />
              </button>
              <button type="button" className="p-2 hover:bg-gray-800 rounded-full">
                <ImageIcon size={20} />
              </button>
              <button type="button" className="p-2 hover:bg-gray-800 rounded-full">
                <AtSign size={20} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => setComment('')}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!comment.trim()}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  comment.trim() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                }`}
              >
                Comment
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-4">
        <h4 className="text-lg font-semibold">Comments</h4>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent border border-gray-700 rounded px-3 py-1 focus:outline-none"
        >
          <option value="top">Top comments</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => {
          const authorName = comment.user?.name || comment.author || comment.username || 'User';
          const authorAvatar = comment.user?.avatar || `https://i.pravatar.cc/40?u=${authorName}`;
          const verified = comment.user?.verified || false;
          const time = comment.time || comment.created_at || 'Just now';
          const text = comment.text || comment.message || comment.body || '';
          const likes = comment.likes || 0;
          const liked = comment.liked || false;

          return (
          <div key={comment.id || comment.video_id || Math.random()} className="space-y-4">
            {/* Main Comment */}
            <div className="flex gap-3">
              <img 
                src={authorAvatar} 
                alt={authorName}
                className="w-10 h-10 rounded-full"
                loading="lazy"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{authorName}</span>
                  {verified && (
                    <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">✓</span>
                  )}
                  <span className="text-gray-400 text-sm">{time}</span>
                </div>
                <p className="mb-2">{text}</p>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1 ${liked ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    <ThumbsUp size={16} />
                    <span className="text-sm">{likes}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleReply(comment.id)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Reply
                  </button>
                  
                  <button className="text-gray-400 hover:text-white">
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Reply Input */}
                {showReply[comment.id] && (
                  <div className="mt-4 flex gap-3">
                    <img 
                      src="https://i.pravatar.cc/32?img=6" 
                      alt="Your avatar" 
                      className="w-8 h-8 rounded-full"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        className="w-full bg-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            handleSubmitReply(comment.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* View Replies */}
                {comment.replies > 0 && (
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mt-3">
                    <MessageCircle size={14} />
                    <span>{comment.replies} replies</span>
                    <ChevronDown size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Replies */}
            {replies[comment.id]?.map((reply, index) => (
              <div key={index} className="ml-12 flex gap-3">
                <img 
                  src="https://i.pravatar.cc/32?img=6" 
                  alt="Reply avatar" 
                  className="w-8 h-8 rounded-full"
                  loading="lazy"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">You</span>
                    <span className="text-gray-400 text-sm">Just now</span>
                  </div>
                  <p className="mb-2">{reply}</p>
                </div>
              </div>
            ))}
          </div>
        );
      })}
      </div>

      {/* Load More Comments */}
      <div className="text-center">
        {loadingMore ? (
          <button className="px-6 py-2 bg-gray-800 rounded-full" disabled>Loading...</button>
        ) : (
          <button
            onClick={handleLoadMore}
            disabled={noMoreComments}
            className={loadMoreClass}
          >
            {noMoreComments ? 'No more comments' : 'Load more comments'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentSection;