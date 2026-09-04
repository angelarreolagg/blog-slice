type SpriteIconProps = {
  id: string;
  className?: string;
};

export function SpriteIcon({ id, className }: SpriteIconProps) {
  return (
    <svg aria-hidden className={className} focusable="false">
      <use href={`/icons.svg#${id}`} />
    </svg>
  );
}
