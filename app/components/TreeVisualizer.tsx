"use client";
import { SearchNode } from '../lib/types';
import TreeNode from './TreeNode';

interface TreeVisualizerProps {
  tree: SearchNode | null;
  prunedHidden: boolean;
  onNodeClick?: (n: SearchNode) => void;
  maxDepthToShow?: number;
  // Feature 3: animated node-by-node build
  animationSpeed?: 'slow' | 'medium' | 'fast' | 'instant';
}

// Feature 3: stagger delay per visit index based on speed setting
const SPEED_DELAY: Record<string, number> = {
  slow: 40,
  medium: 20,
  fast: 8,
  instant: 0,
};

/**
 * Renders the AI's Minimax decision tree as a recursive
 * scrollable panel. This is the "crown jewel" of the app.
 *
 * - MAX nodes (AI) have white borders
 * - MIN nodes (Player) have gray borders
 * - Pruned branches are faded with ✂ badges
 * - Best path is highlighted with white glow
 * - Feature 3: Each node fades in staggered by visit order
 */
export default function TreeVisualizer({
  tree,
  prunedHidden,
  onNodeClick = () => {},
  maxDepthToShow = 4,
  animationSpeed = 'fast',
}: TreeVisualizerProps) {
  if (!tree) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-[#474747] font-mono text-[10px] uppercase tracking-widest p-8">
        <span className="material-symbols-outlined text-3xl mb-4 text-[#262626]">account_tree</span>
        <span>Awaiting AI computation...</span>
        <span className="text-[#262626] mt-2">Make a move to generate the search tree</span>
      </div>
    );
  }

  const staggerMs = SPEED_DELAY[animationSpeed] ?? 20;

  return (
    <div
      className="w-full overflow-auto relative"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#262626 #050505' }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .tree-container { display: flex; flex-direction: column; align-items: center; }
        .tree-children {
          display: flex; justify-content: center; position: relative;
          padding-top: 16px; margin-top: 8px; gap: 8px;
          border-top: 1px solid #1C1B1B;
        }
        .tree-children::before {
          content: ""; position: absolute; top: -10px; left: 50%;
          border-left: 1px solid #1C1B1B; width: 0; height: 10px;
          transform: translateX(-50%);
        }
        .tree-child::before {
          content: ""; position: absolute; top: 0; left: 50%;
          border-left: 1px solid #1C1B1B; width: 0; height: 16px;
          transform: translateX(-50%);
        }
        .tree-child-best::before {
          border-left-color: rgba(255,255,255,0.4) !important;
        }
        .tree-children-has-best {
          border-top-color: rgba(255,255,255,0.2) !important;
        }
        @keyframes node-appear {
          from { opacity: 0; transform: scale(0.85) translateY(-4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .tree-node-animated {
          animation: node-appear 0.25s ease-out both;
        }
      `}} />
      <div className="min-w-max pb-8 pt-2">
        <RenderNode
          node={tree}
          prunedHidden={prunedHidden}
          onClick={onNodeClick}
          isRoot={true}
          currentDepth={0}
          maxDepth={maxDepthToShow}
          staggerMs={staggerMs}
        />
      </div>
    </div>
  );
}

function RenderNode({
  node,
  prunedHidden,
  onClick,
  isRoot = false,
  currentDepth,
  maxDepth,
  staggerMs,
}: {
  node: SearchNode;
  prunedHidden: boolean;
  onClick: (n: SearchNode) => void;
  isRoot?: boolean;
  currentDepth: number;
  maxDepth: number;
  staggerMs: number;
}) {
  if (prunedHidden && node.pruned) return null;
  if (currentDepth >= maxDepth && !isRoot) return null;

  const visibleChildren = prunedHidden
    ? node.children.filter(n => !n.pruned)
    : node.children;

  // Limit children shown to prevent overflow
  const maxChildren = currentDepth === 0 ? 7 : 4;
  const displayChildren = visibleChildren.slice(0, maxChildren);
  const hasMore = visibleChildren.length > maxChildren;
  const hasBestChild = displayChildren.some(c => c.isBestPath);

  // Feature 3: animation delay based on visit order
  const delayMs = staggerMs > 0 ? (node.visitOrder ?? 0) * staggerMs : 0;

  return (
    <div
      className={`tree-container ${staggerMs > 0 ? 'tree-node-animated' : ''}`}
      style={staggerMs > 0 ? { animationDelay: `${delayMs}ms` } : {}}
    >
      <TreeNode node={node} isRoot={isRoot} onClick={onClick} />

      {displayChildren.length > 0 && currentDepth < maxDepth - 1 && (
        <div className={`tree-children ${hasBestChild ? 'tree-children-has-best' : ''}`}>
          {displayChildren.map((child) => (
            <div
              key={child.id}
              className={`tree-child relative flex flex-col items-center pt-4 ${child.isBestPath ? 'tree-child-best' : ''}`}
            >
              <RenderNode
                node={child}
                prunedHidden={prunedHidden}
                onClick={onClick}
                currentDepth={currentDepth + 1}
                maxDepth={maxDepth}
                staggerMs={staggerMs}
              />
            </div>
          ))}
          {hasMore && (
            <div className="tree-child relative flex flex-col items-center pt-4">
              <div className="w-20 h-8 border border-[#1C1B1B] bg-[#050505] flex items-center justify-center text-[8px] text-[#474747] font-mono">
                +{visibleChildren.length - maxChildren} more
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
