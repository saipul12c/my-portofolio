import { Star } from "lucide-react";

const RatingStars = ({ rating, size = 16, showNumber = true }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600"
          }`}
        />
      ))}
      {showNumber && (
        <span className="text-sm text-gray-400 ml-1">{rating}</span>
      )}
    </div>
  );
};

export default RatingStars;