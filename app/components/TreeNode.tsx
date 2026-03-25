"use client";
import { SearchNode } from '../lib/types';

interface TreeNodeProps {
  node: SearchNode;
  isRoot?: boolean;
  onClick: (n: SearchNode) => void;
}

/**
 * Renders a single node in the Minimax search tree.
 * MAX nodes have white accents, MIN nodes have gray accents.
 * Pruned nodes are faded with a ✂ indicator.
 * Best-path nodes have a white left border highlight.
 */
export default function TreeNode({ node, isRoot = false, onClick }: TreeNodeProps) {
  const isPruned = node.pruned;
  const formatScore = (s: number) => {
    if (s >= 100000) return '+∞';
    if (s <= -100000) return '-∞';
    return s.toString();
  };
  const formatVal = (v: number) => {
    if (v === Infinity) return '∞';
    if (v === -Infinity) return '-∞';
    return v.toString();
  };

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(node); }}
      className={`
        relative flex flex-col items-center justify-center p-2 cursor-pointer
        transition-all duration-200 hover:brightness-125
        w-20 text-[8px] font-mono border
        ${isPruned
          ? 'bg-[#050505]/60 border-[#262626] opacity-30'
          : node.isBestPath
            ? 'bg-[#1C1B1B] border-white shadow-[0_0_10px_rgba(255,255,255,0.15)]'
            : isRoot
              ? 'bg-[#1C1B1B] border-white'
              : node.isMax
                ? 'bg-[#131313] border-[#474747]'
                : 'bg-[#0E0E0E] border-[#262626]'
        }
      `}
    >
      {/* MAX / MIN label */}
      <div className="flex justify-between w-full mb-0.5">
        <span className={`font-bold tracking-wider ${node.isMax ? 'text-white' : 'text-[#919191]'}`}>
          {node.isMax ? 'MAX' : 'MIN'}
        </span>
        {node.move !== null && (
          <span className="text-[#474747]">c{node.move}</span>
        )}
      </div>

      {/* Score */}
      <div className={`text-sm font-bold my-0.5 ${isPruned ? 'text-[#474747]' : 'text-white'}`}>
        {formatScore(node.score)}
      </div>

      {/* Alpha / Beta */}
      <div className="flex justify-between w-full text-[7px] text-[#474747] mt-0.5 gap-1">
        <span>α:{formatVal(node.alpha)}</span>
        <span>β:{formatVal(node.beta)}</span>
      </div>

      {/* Pruned badge */}
      {isPruned && (
        <div className="absolute -top-2 -right-1 bg-[#262626] text-[#919191] px-1 flex items-center border border-[#474747]">
          <span className="text-[7px] tracking-tight">✂ CUT</span>
        </div>
      )}

      {/* Terminal badge */}
      {node.isTerminal && !isPruned && (
        <div className="absolute -top-2 -left-1 bg-white text-black px-1 flex items-center">
          <span className="text-[7px] font-black tracking-tight">TERM</span>
        </div>
      )}

      {/* Best path indicator */}
      {node.isBestPath && !isPruned && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-white shadow-[0_0_6px_white]" />
      )}
    </div>
  );
}
