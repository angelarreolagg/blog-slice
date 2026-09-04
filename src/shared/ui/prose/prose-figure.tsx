import { ProseImage } from "./prose-image";

type ProseFigureProps = {
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
  caption?: React.ReactNode;
};

export function ProseFigure({ caption, ...image }: ProseFigureProps) {
  return (
    <figure className="sm:-mx-8">
      <ProseImage {...image} />
      {caption && (
        <figcaption className="text-caption text-ink-faint mt-3 sm:px-8">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
