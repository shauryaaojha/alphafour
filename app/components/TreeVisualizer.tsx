"use client";
import { SearchNode } from '../lib/types';
import TreeNode from './TreeNode';

interface TreeVisualizerProps {
  tree: SearchNode | null;
  prunedHidden: boolean;
  onNodeClick?: (n: SearchNode) => void;
  maxDepthToShow?: number;
}

/**
 * Renders the AI's Minimax decision tree as a recursive
 * scrollable panel. This is the "crown jewel" of the app.
 *
 * - MAX nodes (AI) have white borders
 * - MIN nodes (Player) have gray borders
 * - Pruned branches are faded with ✂ badges
 * - Best path is highlighted with white glow
 */
export default function TreeVisualizer({
  tree,
  prunedHidden,
  onNodeClick = () => {},
  maxDepthToShow = 4
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
      `}} />
      <div className="min-w-max pb-8 pt-2">
        <RenderNode
          node={tree}
          prunedHidden={prunedHidden}
          onClick={onNodeClick}
          isRoot={true}
          currentDepth={0}
          maxDepth={maxDepthToShow}
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
  maxDepth
}: {
  node: SearchNode;
  prunedHidden: boolean;
  onClick: (n: SearchNode) => void;
  isRoot?: boolean;
  currentDepth: number;
  maxDepth: number;
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

  return (
    <div className="tree-container">
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
