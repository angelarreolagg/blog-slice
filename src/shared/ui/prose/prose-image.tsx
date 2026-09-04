type ProseImageProps = Omit<React.ComponentProps<"img">, "width" | "height"> & {
  // No image pipeline, so CLS is prevented by hand.
  width: number | string;
  height: number | string;
  alt: string;
};

export function ProseImage({ alt, ...props }: ProseImageProps) {
  return (
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      className="border-line h-auto w-full rounded-md border"
      {...props}
    />
  );
}
