import React from "react";
import type { MarkdownViewerProps } from "@shared/orchestration";

export function MarkdownViewer(props: MarkdownViewerProps) {
  const { title, content, evidence_anchors = [] } = props;

  const html = content
    .replace(/^### (.*$)/gim, "<h3 class='text-base font-semibold text-zinc-100 mt-4 mb-2'>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2 class='text-lg font-bold text-white mt-5 mb-2'>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1 class='text-xl font-bold text-white mt-2 mb-3'>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/`(.*?)`/gim, "<code class='px-1 py-0.5 rounded bg-zinc-800 text-cyan-300 text-xs'>$1</code>")
    .replace(/^- (.*$)/gim, "<li class='ml-4 list-disc text-zinc-300'>$1</li>")
    .replace(/\n/g, "<br/>");

  return (
    <div className="w-full h-full overflow-y-auto p-8 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-display font-semibold text-white mb-6">{title}</h1>
        <div
          className="prose prose-invert prose-sm text-zinc-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {evidence_anchors.length > 0 && (
          <div className="mt-10 pt-6 border-t border-zinc-800">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
              Evidence Anchors ({evidence_anchors.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {evidence_anchors.map((a) => (
                <span
                  key={a.id}
                  className="text-xs px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-400"
                >
                  {a.type}: {a.label}
                  {a.sha ? ` · ${a.sha.slice(0, 7)}` : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
