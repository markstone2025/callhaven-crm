
import { Star, StarHalf } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LeadScoreCardProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

export function LeadScoreCard({ 
  score, 
  maxScore = 5,
  size = "md",
  showTooltip = true 
}: LeadScoreCardProps) {
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.5;
  const emptyStars = Math.floor(maxScore - score);
  
  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  const tooltipText = (() => {
    if (score < 2) return "Cold lead - Needs nurturing";
    if (score < 3.5) return "Warm lead - Shows potential";
    return "Hot lead - High conversion potential";
  })();

  const renderStars = () => (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={`${sizeClass[size]} fill-yellow-400 text-yellow-400`} />
      ))}
      
      {hasHalfStar && (
        <StarHalf className={`${sizeClass[size]} fill-yellow-400 text-yellow-400`} />
      )}
      
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`${sizeClass[size]} text-gray-300`} />
      ))}
    </div>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {renderStars()}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
            <p className="text-xs text-muted-foreground mt-1">Score: {score} out of {maxScore}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return renderStars();
}
