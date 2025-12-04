import React, { useState } from 'react';
import { 
  Send, ThumbsUp, MoreVertical, ChevronDown, 
  ChevronUp, MessageCircle, Flag, Heart, 
  Smile, Image as ImageIcon, AtSign
} from 'lucide-react';

const CommentSection = () => {
  const [comment, setComment] = useState('');
  const [replies, setReplies] = useState({});
  const [showReply, setShowReply] = useState({});
  const [sortBy, setSortBy] = useState('top');

  // Mock comments data
  const comments = [
    {
      id: 1,
      user: {
        name: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/40?img=1',
        verified: true
      },
      text: 'This tutorial saved me hours of research! The explanation of hooks is crystal clear.',
      time: '2 hours ago',
      likes: 245,
      liked: false,
      replies: 3
    },
    {
      id: 2,
      user: {
        name: 'Sarah Chen',
        avatar: 'https://i.pravatar.cc/40?img=2',
        verified: false
      },
      text: 'Could you make a video about React Server Components? I think many would find it helpful!',
      time: '5 hours ago',
      likes: 189,
      liked: true,
      replies: 12
    },
    {
      id: 3,
      user: {
        name: 'Tech Guru',
        avatar: 'https://i.pravatar.cc/40?img=3',
        verified: true
      },
      text: 'The performance optimization tips were exactly what I needed for my project. Thanks!',
      time: '1 day ago',
      likes: 542,
      liked: false,
      replies: 8
    }
  ];

  const handleLikeComment = (commentId) => {
    // Implement like functionality
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
    if (comment.trim()) {
      // Submit comment
      console.log('Submitting comment:', comment);
      setComment('');
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

  return (
    <div className="space-y-6">
      {/* Comment Input */}
      <div className="flex gap-3">
        <img 
          src="https://i.pravatar.cc/40?img=6" 
          alt="Your avatar" 
          className="w-10 h-10 rounded-full"
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
        {comments.map(comment => (
          <div key={comment.id} className="space-y-4">
            {/* Main Comment */}
            <div className="flex gap-3">
              <img 
                src={comment.user.avatar} 
                alt={comment.user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{comment.user.name}</span>
                  {comment.user.verified && (
                    <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">✓</span>
                  )}
                  <span className="text-gray-400 text-sm">{comment.time}</span>
                </div>
                <p className="mb-2">{comment.text}</p>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1 ${comment.liked ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    <ThumbsUp size={16} />
                    <span className="text-sm">{comment.likes}</span>
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
        ))}
      </div>

      {/* Load More Comments */}
      <div className="text-center">
        <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
          Load more comments
        </button>
      </div>
    </div>
  );
};

export default CommentSection;