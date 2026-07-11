interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: number;
  className?: string;
  /** When true, ignores `size` and fills its parent (w-full h-full) - e.g. a big proportional avatar block. */
  fill?: boolean;
  shape?: 'circle' | 'square';
}

export function Avatar({ name, avatarUrl, size = 40, className = '', fill = false, shape = 'circle' }: AvatarProps) {
  const initial = name?.trim()?.[0]?.toUpperCase() || '?';
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={avatarUrl}
        alt={name}
        width={fill ? undefined : size}
        height={fill ? undefined : size}
        className={`${shapeClass} object-cover shrink-0 ${fill ? 'w-full h-full' : ''} ${className}`}
        style={fill ? undefined : { width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`${shapeClass} bg-[#2B2644] text-white flex items-center justify-center font-medium shrink-0 ${fill ? 'w-full h-full' : ''} ${className}`}
      style={fill ? undefined : { width: size, height: size, fontSize: size * 0.4 }}
    >
      <span className={fill ? 'text-4xl' : undefined}>{initial}</span>
    </div>
  );
}