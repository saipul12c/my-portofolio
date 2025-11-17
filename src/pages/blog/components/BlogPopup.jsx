import { Link } from "react-router-dom";
import { FiX, FiCheckCircle, FiUser, FiBookmark, FiShare2 } from "react-icons/fi";
import { 
  getLabelColor, 
  getTagColor, 
  cleanContent, 
  formatNumber, 
  formatDate,
  STATS_CONFIG 
} from "../utils/blogUtils";

export default function BlogPopup({
  selectedPost,
  onClosePopup,
  onAuthorClick,
  onShowTooltip,
  onHideTooltip,
  showTooltip
}) {
  if (!selectedPost) return null;

  return (
    <div
      onClick={onClosePopup}
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fadeIn p-3 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl 
          w-full max-w-4xl sm:max-w-5xl 
          max-h-[90vh] sm:max-h-[95vh] 
          overflow-hidden animate-scaleIn flex flex-col border border-gray-700/50"
      >
        <PopupHeader 
          post={selectedPost} 
          onClose={onClosePopup}
          onAuthorClick={onAuthorClick}
          onShowTooltip={onShowTooltip}
          onHideTooltip={onHideTooltip}
          showTooltip={showTooltip}
        />
        <PopupContent post={selectedPost} />
      </div>
    </div>
  );
}

function PopupHeader({ post, onClose, onAuthorClick, onShowTooltip, onHideTooltip, showTooltip }) {
  return (
    <div className="relative h-52 sm:h-60 lg:h-72 overflow-hidden flex-shrink-0">
      <img
        src={post.imageFull || post.thumbnail}
        alt={post.title}
        className="w-full h-full object-cover transform transition-transform duration-700"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 sm:top-5 right-4 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 hover:scale-110 border border-white/10 group"
      >
        <FiX className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform" />
      </button>

      {/* Labels */}
      {post.labels?.length > 0 && (
        <div className="absolute top-4 sm:top-5 left-4 sm:left-5 flex flex-wrap gap-2">
          {post.labels.map((label, idx) => (
            <span
              key={idx}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-sm border font-medium ${getLabelColor(label)} shadow-lg`}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Title & Meta */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
          {post.title}
        </h2>
        
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/90 text-sm">
          <AuthorButton
            author={post.author}
            slug={'popup-' + post.slug}
            onAuthorClick={onAuthorClick}
            onShowTooltip={onShowTooltip}
            onHideTooltip={onHideTooltip}
            showTooltip={showTooltip}
            variant="popup"
          />

          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
            <span>
              {formatDate(post.date, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthorButton({ author, slug, onAuthorClick, onShowTooltip, onHideTooltip, showTooltip, variant = 'card' }) {
  const isPopup = variant === 'popup';
  
  return (
    <div className="relative">
      <button
        onClick={(e) => onAuthorClick(e, author)}
        onMouseEnter={() => onShowTooltip(slug)}
        onMouseLeave={onHideTooltip}
        className={`flex items-center gap-2 ${
          isPopup 
            ? "bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 hover:border-cyan-500/50 transition-colors group/author"
            : "group/author"
        }`}
      >
        {isPopup && <FiUser className="w-4 h-4 text-cyan-400" />}
        <span className={`${isPopup ? 'group-hover/author:text-cyan-400 transition-colors' : ''}`}>
          {author}
        </span>
        <FiCheckCircle className="w-3 h-3 text-green-400" />
      </button>

      {showTooltip === slug && (
        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 border border-green-500/30 rounded-lg shadow-lg z-50 min-w-[220px]">
          <div className="flex items-center gap-2 text-green-400 text-xs font-medium mb-1">
            <FiCheckCircle className="w-3 h-3" />
            <span>Author Terverifikasi</span>
          </div>
          <p className="text-gray-300 text-[10px] leading-tight">
            {isPopup 
              ? `Konten dari ${author} telah melalui proses validasi dan terjamin kredibilitasnya.`
              : `Informasi dari ${author} telah divalidasi dan terpercaya. Klik untuk melihat profil lengkap.`
            }
          </p>
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
}

function PopupContent({ post }) {
  return (
    <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
      <StatsGrid post={post} />
      <CategorySection post={post} />
      <ExcerptSection excerpt={post.excerpt} />
      <ContentSection content={post.content} />
      <TagsSection tags={post.tags} />
      <ActionButtons slug={post.slug} />
      <PostInfo post={post} />
    </div>
  );
}

function StatsGrid({ post }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {STATS_CONFIG.map((stat, index) => (
        <div key={index} className="flex items-center justify-center p-3 sm:p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group">
          <div className="text-center">
            <stat.icon className={`w-6 h-6 sm:w-7 sm:h-7 text-${stat.color}-400 mb-2 mx-auto group-hover:scale-110 transition-transform`} />
            <span className="text-lg sm:text-xl font-bold text-white block">
              {formatNumber(post[stat.valueKey] || 0)}
            </span>
            <span className="text-xs text-gray-400">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CategorySection({ post }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 px-4 py-2 rounded-lg backdrop-blur-sm">
        <span className="text-cyan-300 text-sm font-medium">{post.category}</span>
      </div>
      {post.series && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 px-4 py-2 rounded-lg backdrop-blur-sm">
          <span className="text-purple-300 text-sm font-medium">Seri: {post.series}</span>
        </div>
      )}
      {post.source && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 px-4 py-2 rounded-lg backdrop-blur-sm">
          <span className="text-orange-300 text-sm font-medium">Sumber: {post.source}</span>
        </div>
      )}
    </div>
  );
}

function ExcerptSection({ excerpt }) {
  if (!excerpt) return null;
  
  return (
    <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 border border-cyan-500/20 rounded-xl p-5 mb-6 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-400"></div>
      <div className="flex items-start gap-3">
        <div className="text-cyan-400 text-lg mt-0.5">💡</div>
        <p className="text-cyan-100 text-sm sm:text-base leading-relaxed font-medium flex-1">
          {excerpt}
        </p>
      </div>
    </div>
  );
}

function ContentSection({ content }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full"></div>
        <h3 className="text-lg font-bold text-white">Konten Artikel</h3>
      </div>
      
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50">
        <div className="prose prose-invert max-w-none prose-sm sm:prose-base">
          <div className="text-gray-200 leading-relaxed whitespace-pre-line text-sm sm:text-base space-y-4">
            {cleanContent(content)
              .split('\n\n')
              .map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 last:mb-0 text-justify leading-7">
                    {paragraph}
                  </p>
                )
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function TagsSection({ tags }) {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="mt-6 pt-6 border-t border-gray-700/50">
      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-lg font-bold text-white">Tag Terkait</h4>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {tags.map((tag, i) => (
          <span
            key={i}
            className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm border font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${getTagColor(tag, i)}`}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ActionButtons({ slug }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-700/50">
      <Link
        to={`/blog/${slug}`}
        className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white py-4 rounded-xl text-center font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] text-sm sm:text-base flex items-center justify-center gap-2 group"
      >
        <FiBookmark className="w-4 h-4 group-hover:scale-110 transition-transform" />
        📖 Baca Artikel Lengkap
      </Link>
      <button className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-cyan-500/50 hover:bg-gray-700/70 transition-all duration-300">
        <FiShare2 className="w-4 h-4" />
        Bagikan
      </button>
    </div>
  );
}

function PostInfo({ post }) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-700/50">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
        <div>
          <span className="font-medium text-gray-300">Dibuat:</span>{' '}
          {formatDate(post.date)}
        </div>
        <div>
          <span className="font-medium text-gray-300">Terakhir diperbarui:</span>{' '}
          {post.updatedAt ? formatDate(post.updatedAt) : 'Tidak tersedia'}
        </div>
      </div>
    </div>
  );
}