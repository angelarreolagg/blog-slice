import { Children, isValidElement, type ReactNode } from "react";
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/tabs";

type CompareItemProps = {
  id: string;
  label: string;
  children: React.ReactNode;
};

// A marker component: Compare reads its props and renders the panels itself.
export function CompareItem({ children }: CompareItemProps) {
  return <>{children}</>;
}

type CompareProps = {
  label: string;
  defaultItem?: string;
  children: React.ReactNode;
};

function itemsOf(children: ReactNode) {
  return Children.toArray(children).flatMap((child) =>
    isValidElement<CompareItemProps>(child) && child.type === CompareItem
      ? [child.props]
      : [],
  );
}

export function Compare({ label, defaultItem, children }: CompareProps) {
  const items = itemsOf(children);
  const first = items[0]?.id;

  return (
    <Tabs defaultValue={defaultItem ?? first}>
      <TabsList aria-label={label}>
        {items.map((item) => (
          <TabsTrigger key={item.id} value={item.id}>
            {item.label}
          </TabsTrigger>
        ))}
        <TabsIndicator />
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.id} value={item.id}>
          {item.children}
        </TabsContent>
      ))}
    </Tabs>
  );
}
