import { useEffect, useState } from "react";

// A thin band under the site header: whichever heading sits inside it is the
// one being read. Long sections leave the band empty, so the last one sticks.
const BAND = "-120px 0px -70% 0px";

export function useActiveHeading(ids: Array<string>): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const key = ids.join("|");

  useEffect(() => {
    const headings = key
      .split("|")
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: BAND },
    );

    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [key]);

  return activeId;
}
