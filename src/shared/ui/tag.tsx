type TagProps = {
  children: React.ReactNode;
};

export function Tag({ children }: TagProps) {
  return (
    <span className="bg-surface text-ink-faint text-meta inline-flex h-6 items-center rounded-sm px-2">
      {children}
    </span>
  );
}
