import { ImageWithFallback } from './figma/ImageWithFallback';

interface PersonaCardProps {
  name: string;
  role: string;
  description: string[];
  imageUrl: string;
  color: string;
  onClick?: () => void;
}

export function PersonaCard({ name, role, description, imageUrl, color, onClick }: PersonaCardProps) {
  return (
    <div 
      className={`bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1 min-h-[400px]`}
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${color}15 0%, white 50%)`
      }}
    >
      <div className="flex flex-col space-y-5 h-full">
        {/* Header with Image and Basic Info */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div 
              className="w-16 h-16 rounded-full p-1"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}80)`
              }}
            >
              <ImageWithFallback
                src={imageUrl}
                alt={name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div 
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
              style={{ backgroundColor: color }}
            />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600 font-medium">{role}</p>
          </div>
        </div>
        
        {/* Description as Bullet Points */}
        <div className="flex-1 flex flex-col justify-center">
          <ul className="space-y-3 text-left">
            {description.map((point, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div 
                  className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Select Button */}
        <div className="flex justify-center pt-2">
          <div 
            className="inline-flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 group-hover:scale-105"
            style={{
              backgroundColor: `${color}20`,
              color: color
            }}
          >
            Select
          </div>
        </div>
      </div>
    </div>
  );
}