import React, { useRef, useState } from 'react';

interface TiltedCardProps extends React.PropsWithChildren {
  className?: string;
  maxAngle?: number;
  scale?: number;
  id?: string;
  onClick?: () => void;
}

/**
 * React Bits - TiltedCard (https://reactbits.dev/components/tilted-card)
 * 3D perspective rotational tilt card following mouse coordinates.
 */
export const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  className = '',
  maxAngle = 8,
  scale = 1.015,
  id,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxAngle;
    const rotateY = ((x - centerX) / centerX) * maxAngle;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      id={id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: '1000px',
      }}
      className={`transition-transform duration-200 ease-out ${className}`}
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotation.x.toFixed(2)}deg) rotateY(${rotation.y.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full"
      >
        {children}
      </div>
    </div>
  );
};
