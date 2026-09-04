type TableProps = React.ComponentProps<"table">;

export function ProseTable({ children, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table {...props} className="text-meta w-full border-collapse text-left">
        {children}
      </table>
    </div>
  );
}

export function ProseTableHeaderCell({
  children,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      {...props}
      className="border-line text-ink border-b px-3 py-2 font-medium"
    >
      {children}
    </th>
  );
}

export function ProseTableCell({
  children,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td {...props} className="border-line text-ink-muted border-b px-3 py-2">
      {children}
    </td>
  );
}
