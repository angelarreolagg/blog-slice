import type { MDXComponents } from "mdx/types";
import { AnimatedParagraph, Keyword } from "@/features/keyword-reveal";
import { Layers } from "@/features/layer-highlight";
import { Steps } from "@/features/step-walkthrough";
import { Flow } from "@/shared/ui/diagram/flow";
import { Callout } from "@/shared/ui/prose/callout";
import { Compare, CompareItem } from "@/shared/ui/prose/compare";
import { CodeBlock } from "../ui/code-block";
import { CodeTitle } from "@/shared/ui/prose/code-title";
import { Heading } from "@/shared/ui/prose/heading";
import { InlineCode } from "@/shared/ui/prose/inline-code";
import { ProseBlockquote } from "@/shared/ui/prose/prose-blockquote";
import { ProseDivider } from "@/shared/ui/prose/prose-divider";
import { ProseFigure } from "@/shared/ui/prose/prose-figure";
import { ProseFigureWrapper } from "@/shared/ui/prose/prose-figure-wrapper";
import { ProseImage } from "@/shared/ui/prose/prose-image";
import { ProseLink } from "@/shared/ui/prose/prose-link";
import {
  ProseOrderedList,
  ProseUnorderedList,
} from "@/shared/ui/prose/prose-list";
import {
  ProseTable,
  ProseTableCell,
  ProseTableHeaderCell,
} from "@/shared/ui/prose/prose-table";

export const mdxComponents: MDXComponents = {
  h1: (props) => <Heading level="h1" {...props} />,
  h2: (props) => <Heading level="h2" {...props} />,
  h3: (props) => <Heading level="h3" {...props} />,
  h4: (props) => <Heading level="h4" {...props} />,
  p: AnimatedParagraph,
  a: ProseLink,
  ul: ProseUnorderedList,
  ol: ProseOrderedList,
  blockquote: ProseBlockquote,
  code: InlineCode,
  pre: CodeBlock,
  figure: ProseFigureWrapper,
  figcaption: CodeTitle,
  img: ProseImage,
  hr: ProseDivider,
  table: ProseTable,
  th: ProseTableHeaderCell,
  td: ProseTableCell,
  Keyword,
  Figure: ProseFigure,
  Callout,
  Compare,
  CompareItem,
  Flow,
  Layers,
  Steps,
};
