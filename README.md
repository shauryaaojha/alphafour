# AlphaFour — Connect 4 AI Visualiser

A Connect 4 game where the AI opponent plays with **Minimax + Alpha-Beta pruning**, and the entire decision tree is visualised in real time so you can watch the AI "think": which branches it explores, which it prunes, and why it picks a move.

**Stack:** Next.js (App Router) · React · TypeScript · framer-motion · lucide-react

## Features

- **Playable Connect 4** vs. AI with adjustable search depth and pruning on/off.
- **Live tree visualiser** — nodes expand as the search runs; pruned subtrees are marked, alpha/beta bounds shown per node.
- **Compare panel** — Minimax vs. Alpha-Beta side-by-side: nodes visited, time, chosen move.
- **Stats & status bar** — node counts, prune counts, evaluation score per move.
- **Explain API** (`/api/explain`) — plain-English explanation of the current AI decision.
- **Rooms API** (`/api/rooms`) — create/join a room, make moves, reset (multi-client play).
- **Theory page** — Minimax, heuristics, alpha-beta walkthrough; **Settings** for depth/heuristics.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Landing |
| `/game` | Board + tree visualiser |
| `/theory` | Algorithm theory |
| `/settings` | Depth, pruning, heuristic weights |

## Layout

```
app/components/   GameBoard, Disc, TreeVisualizer, TreeNode, PruningGraph,
                  ComparePanel, ControlPanel, StatsPanel, StatusBar, SpeechBubble
app/api/          explain, rooms (create / move / reset)
```

Full project guide, poster content and viva notes: [`connect4_ai_project_guide.md`](connect4_ai_project_guide.md).
