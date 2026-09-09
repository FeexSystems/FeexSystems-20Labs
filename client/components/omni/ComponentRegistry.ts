import type { ComponentType } from "react";
import type { OmniComponent } from "../../../shared/orchestration";
import { GraphVisualizer } from "./visualizers/GraphVisualizer";
import { MarkdownViewer } from "./visualizers/MarkdownViewer";
import { EmptyStage } from "./visualizers/EmptyStage";
import { ErrorStage } from "./visualizers/ErrorStage";

export const ComponentRegistry: Record<
  OmniComponent,
  ComponentType<any>
> = {
  GraphVisualizer,
  MarkdownViewer,
  MetricsDashboard: EmptyStage, // placeholder until metrics widgets are wired
  CodeViewer: MarkdownViewer,
  EvidencePanel: MarkdownViewer,
  EmptyStage,
  ErrorStage,
};
