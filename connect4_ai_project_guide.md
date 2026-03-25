# Connect 4 AI — Minimax + Alpha-Beta Pruning Visualizer
### Complete Project Guide | FT3 Application Development | Units 1, 2 & 3

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Antigravity App Prompt (Spoonfeeded)](#2-antigravity-app-prompt)
3. [Stitch UI Design Prompt](#3-stitch-ui-design-prompt)
4. [How to Download Your Stitch Design](#4-how-to-download-your-stitch-design)
5. [Poster Content & Layout Guide](#5-poster-content--layout-guide)
6. [Program Explanation Script (6 Marks)](#6-program-explanation-script-6-marks)
7. [Execution Walkthrough (2 Marks)](#7-execution-walkthrough-2-marks)
8. [Viva Preparation — All Possible Questions](#8-viva-preparation--all-possible-questions)
9. [Syllabus Mapping](#9-syllabus-mapping)
10. [Quick Revision Cheatsheet](#10-quick-revision-cheatsheet)

---

## 1. Project Overview

### What You Are Building

**Project Name:** AlphaFour — Connect 4 AI with Minimax & Alpha-Beta Pruning Visualizer

**One-line pitch:** A Connect 4 game where an AI opponent uses the Minimax algorithm with Alpha-Beta pruning to play optimally, and the entire decision tree is visualized in real time so you can see how the AI "thinks."

### Why This Is Novel

Most student projects show a game. This project shows the *reasoning* behind the game. You can watch the AI evaluate thousands of positions per second, see which branches get pruned, and understand why every single move is made. This directly demonstrates:

- **Game Theory** (adversarial search between MAX and MIN players)
- **Minimax Algorithm** (recursive evaluation of all possible futures)
- **Alpha-Beta Pruning** (intelligent elimination of irrelevant branches)
- **Heuristic Evaluation** (scoring board positions numerically)
- **Problem Space Representation** (the board as a state, moves as transitions)

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Tree Visualization | React + SVG (custom) |
| AI Logic | Pure JavaScript (no library) |
| Deployment | Vercel (free, one command) |

### Marks Breakdown Reminder

| Assessment | Marks | How This Project Scores |
|---|---|---|
| Program Explanation | 6 | Rich algorithmic content — easy 6/6 |
| Execution | 2 | Live demo with visible AI thinking |
| Viva | 2 | Fully covered in Section 8 |
| Poster Clarity | 5 | Structured layout in Section 5 |
| **Total** | **15** | **Target: 15/15** |

---

## 2. Antigravity App Prompt

> Copy this prompt **exactly** into [Antigravity](https://antigravity.ai) (or whatever AI app builder you're using). It is fully spoonfeeded — detailed enough that the tool should generate the complete working app in one shot.

---

### PROMPT (Copy Everything Below This Line)

```
Build a complete, fully functional Next.js 14 application called "AlphaFour" — a Connect 4 game where the player competes against an AI that uses the Minimax algorithm with Alpha-Beta pruning. The application must have THREE main panels:

---

PANEL 1 — CONNECT 4 GAME BOARD (Left / Center)

- Standard 6-row × 7-column Connect 4 grid
- Player is RED (human), AI is YELLOW
- Clicking a column drops a disc into the lowest available row in that column
- Animate the disc falling from top to the correct row (CSS transition, ~300ms)
- Highlight the winning four discs with a glowing animation when someone wins
- Show a status bar above the board: "Your turn", "AI is thinking...", "You win! 🎉", "AI wins!", "Draw!"
- Disable all column clicks while the AI is computing
- Add a "New Game" button to reset the board
- Show the current move number

---

PANEL 2 — AI DECISION TREE VISUALIZER (Right side, scrollable)

This is the most important and novel part of the application.

After every AI move, render a visual tree showing how the Minimax algorithm evaluated positions:

- Each node in the tree is a small rectangle showing:
  - The heuristic score of that board state (e.g., +120, -∞, +∞)
  - Whether it is a MAX node (AI turn, labeled MAX, colored amber/yellow) or MIN node (player turn, labeled MIN, colored blue)
  - If the node is a terminal node (win/loss/draw), show a special badge

- Edges (lines) connect parent nodes to child nodes

- ALPHA-BETA PRUNING VISUALIZATION:
  - Nodes/branches that were PRUNED should appear grayed out with a red "✂ pruned" badge
  - Show the alpha and beta values at each node as small text: α=X β=Y
  - The best move found should be highlighted in green

- The root node (current board position) should be at the top
- Tree expands downward level by level
- Add a depth indicator showing how many levels deep the AI searched
- Make tree nodes clickable: clicking a node shows a tiny board preview of that board state in a tooltip/modal

- PERFORMANCE STATS panel below the tree:
  - Nodes evaluated: [number]
  - Nodes pruned: [number]
  - Search depth: [number]
  - Time taken: [X ms]
  - Pruning efficiency: [percentage]%

---

PANEL 3 — ALGORITHM CONTROL PANEL (Bottom or Sidebar)

- Depth slider: let the user control AI search depth from 1 to 8
  - Depth 1 = Easy (AI looks 1 move ahead)
  - Depth 4 = Medium
  - Depth 7 = Hard (nearly unbeatable)
- Toggle: "Show pruned branches" ON/OFF (when OFF, only show the explored tree without pruned gray nodes)
- Toggle: "Step mode" — when ON, the AI pauses at each depth level and waits for you to press "Next Step" before going deeper. This is for educational demonstration.
- Speed slider: control how fast the step-by-step animation plays (for demo mode)
- A legend explaining the color coding: MAX node, MIN node, pruned, best path, terminal node

---

AI ALGORITHM IMPLEMENTATION REQUIREMENTS:

Implement Minimax with Alpha-Beta pruning in pure JavaScript. Here is the exact algorithm logic:

function minimax(board, depth, alpha, beta, isMaximizing):
  if depth == 0 or game is over:
    return heuristic score of board
  
  if isMaximizing (AI's turn):
    maxScore = -Infinity
    for each valid column move:
      make the move on a copy of the board
      score = minimax(newBoard, depth-1, alpha, beta, false)
      maxScore = max(maxScore, score)
      alpha = max(alpha, score)
      if beta <= alpha:
        PRUNE remaining branches (beta cutoff)
        break
    return maxScore
  
  else (player's turn, minimizing):
    minScore = +Infinity
    for each valid column move:
      make the move on a copy of the board
      score = minimax(newBoard, depth-1, alpha, beta, true)
      minScore = min(minScore, score)
      beta = min(beta, score)
      if beta <= alpha:
        PRUNE remaining branches (alpha cutoff)
        break
    return minScore

Heuristic scoring function:
- +100000 if AI has 4 in a row (win)
- -100000 if Player has 4 in a row (loss)
- +10 for each AI 3-in-a-row with an open end
- +3 for each AI 2-in-a-row with two open ends
- -10 for each Player 3-in-a-row with an open end
- Center column preference: +3 for each AI disc in center column
- Check horizontal, vertical, and both diagonals

Store the ENTIRE search tree as a data structure (not just the best move) so it can be rendered in the visualizer panel. Each tree node should store: board state, score, alpha, beta, depth, move that led here, whether it was pruned, children nodes.

---

STYLING & DESIGN REQUIREMENTS:

- Dark theme: deep navy/charcoal background (#0f0f1a or similar)
- The game board cells should have a subtle inset shadow to look like physical holes
- Player discs: rich red (#e63946) with a slight radial gradient for depth
- AI discs: warm amber/yellow (#f4a261) with a slight radial gradient
- Use a clean, modern monospace or geometric sans-serif font (e.g., JetBrains Mono for stats, Plus Jakarta Sans for labels)
- Tree visualizer background: slightly lighter than main bg, like a panel
- Responsive layout: on mobile, stack panels vertically. On desktop, game on left, tree on right
- Add subtle grid lines to the tree area
- Smooth transitions on all state changes using Framer Motion
- Add a small animated loading spinner while AI is "thinking"

---

FILE STRUCTURE:

/app
  /page.tsx              — main layout, imports all components
  /components
    /GameBoard.tsx        — the Connect 4 grid
    /Disc.tsx             — individual disc with drop animation
    /TreeVisualizer.tsx   — SVG/canvas tree rendering
    /TreeNode.tsx         — single node component
    /ControlPanel.tsx     — depth slider, toggles
    /StatsPanel.tsx       — performance statistics
    /StatusBar.tsx        — game status display
  /lib
    /minimax.ts           — core AI algorithm
    /board.ts             — board state management, win detection
    /heuristic.ts         — scoring function
    /types.ts             — TypeScript interfaces

---

Make the app production-ready. Use TypeScript throughout. Add comments explaining the algorithm at every key step. The tree visualizer is the crown jewel — make it beautiful, clear, and genuinely educational. Someone looking at the tree should immediately understand what alpha-beta pruning does.
```

---

### Tips for Using the Prompt in Antigravity

1. Paste the entire prompt as-is.
2. If the tool asks for clarification, say: *"Generate everything in one go, use the exact file structure specified."*
3. If the tree visualizer is incomplete, follow up with: *"Now complete the TreeVisualizer.tsx component — it should render an SVG tree with MAX/MIN node labels, alpha-beta values, pruned branch highlighting in red/gray, and a green highlight on the best path."*
4. To fix styling: *"Apply the dark navy theme. Game board discs should look 3D with radial gradients. Use Plus Jakarta Sans font."*

---

## 3. Stitch UI Design Prompt

> Use this prompt in [Stitch by Google](https://stitch.withgoogle.com) to generate a beautiful, professional UI mockup/design for your app. Then download it (see Section 4).

---

### STITCH PROMPT (Copy Everything Below This Line)

```
Design a dark-themed web application UI called "AlphaFour" — an AI-powered Connect 4 game with a Minimax algorithm visualizer. This is an educational AI tool, so it should feel intelligent, technical, and visually striking.

LAYOUT: Three-panel desktop layout
- Left panel (40% width): Connect 4 game board
- Right panel (40% width): Decision tree visualizer  
- Bottom/sidebar (20%): Algorithm controls

COLOR PALETTE:
- Background: deep navy #0d0d1f
- Panel surface: #13132a
- Accent blue: #4361ee
- Player red: #e63946
- AI yellow/amber: #f4a261
- Pruned/muted: #4a4a6a
- Success/best path: #06d6a0
- Text primary: #e8e8f0
- Text secondary: #7b7b9e

GAME BOARD PANEL:
- Title "AlphaFour" in bold geometric font at top
- 6×7 grid of circular holes with deep inset shadows
- Empty holes: dark #1a1a3e with inner shadow
- Red player discs with subtle radial gradient
- Yellow AI discs with subtle radial gradient  
- "YOUR TURN" status badge in glowing blue
- Column hover indicators (thin line above column)
- "NEW GAME" button — outlined style, glowing border

DECISION TREE PANEL:
- Panel title: "Minimax Search Tree"
- Show a partial decision tree with ~15 visible nodes
- Root node at top: large rectangle, labeled "Current Position", score shown
- Two types of nodes clearly differentiated:
  - MAX nodes (AI): amber/yellow background, labeled "MAX"
  - MIN nodes (Player): blue background, labeled "MIN"  
- Each node shows: score value, α (alpha) value, β (beta) value
- Connecting lines between nodes
- Two branches shown as PRUNED: these nodes are grayed out with a red scissor icon "✂" and "PRUNED" label
- One path highlighted in bright green: "BEST MOVE"
- Small board preview icon in each node
- Stats box below tree:
  - Nodes Evaluated: 1,247
  - Nodes Pruned: 893
  - Pruning Efficiency: 71.6%
  - Search Depth: 6
  - Time: 43ms

ALGORITHM CONTROLS PANEL:
- "Search Depth" label with a slider (currently at 6)
- Depth labels: Easy (1-2), Medium (3-5), Hard (6-8)
- Toggle switches for: "Show Pruned Branches", "Step Mode"
- "NEXT STEP" button (glowing, only active in step mode)
- Small legend:
  - Yellow square = MAX node (AI maximizing)
  - Blue square = MIN node (Player minimizing)
  - Green line = Best path
  - Gray/red = Pruned branch

TYPOGRAPHY:
- Display/title: Bold geometric sans (like Space Grotesk or Outfit)
- Stats/numbers: Monospace (JetBrains Mono feel)
- Labels: Clean sans-serif, medium weight

OVERALL FEEL:
- Premium dark UI, like a professional developer tool
- Subtle grid dot pattern in the background
- Glowing highlights on active elements
- Feels like something between a chess engine interface and a coding IDE
- Add a thin gradient border around the tree visualizer panel
```

---

## 4. How to Download Your Stitch Design

Stitch generates designs that can be exported. Here's how to get yours:

### Method 1 — Using the Stitch MCP (If Connected in Claude)

If you have the Stitch MCP server connected to your Claude session, ask Claude:

```
Using the Stitch MCP, download my latest design from Stitch and save it as a PNG/PDF to my outputs folder.
```

Claude will then use the MCP tool to fetch and save the design directly.

### Method 2 — Manual Download from Stitch

1. Go to [stitch.withgoogle.com](https://stitch.withgoogle.com)
2. Open your generated design
3. Click the **Export** button (top right)
4. Choose **PNG** (for poster use) or **Figma** (for editing)
5. Save the file — you'll use this image in your poster

### Method 3 — Screenshot

If export isn't available:
1. Use browser zoom to fit the full design on screen
2. Press `Cmd+Shift+4` (Mac) or `Win+Shift+S` (Windows) for screenshot
3. Crop tightly to the design frame

### What to Do With the Downloaded Design

- **For the poster:** Insert the Stitch screenshot/export as the "App UI" section of your poster
- **For the demo:** Show the Stitch design first, then switch to the live running app
- **For the viva:** Say *"We first prototyped the interface in Stitch to plan the layout before implementing in Next.js"* — this shows design thinking

---

## 5. Poster Content & Layout Guide

Your poster is worth **5 marks** on "Clarity in Design." Here's the exact layout to follow.

### Recommended Poster Size
A2 (42cm × 59.4cm) or A3 (29.7cm × 42cm) — portrait orientation

### Layout Grid (Top to Bottom)

---

**SECTION 1 — HEADER BAND (Full width, dark background)**

```
[ AlphaFour ]   [ Connect 4 AI with Minimax & Alpha-Beta Pruning ]
[ Unit 1, 2, 3 — AI & Data Structures ]    [ Your Name | Reg No. | Date ]
```

---

**SECTION 2 — THREE COLUMNS (Middle, largest section)**

| Column 1: Problem Statement | Column 2: App Screenshot | Column 3: Algorithm |
|---|---|---|
| What is Connect 4? | [Stitch UI image here] | Minimax pseudocode |
| Why is it an AI problem? | Caption: "Live AI Decision Tree" | Alpha-Beta explanation |
| Problem space definition | | Tree node legend |

---

**SECTION 3 — ALGORITHM FLOW (Full width)**

Draw or place this flowchart:

```
Player Makes Move → Board State Updated → Minimax Called (Depth=6)
       ↓
   MAX Node (AI) → Generates all valid moves → Evaluates each with MIN node
       ↓
   MIN Node (Player) → Evaluates opponent responses → Alpha-Beta check
       ↓
   Prune? YES → Skip branch | NO → Go deeper
       ↓
   Terminal/Depth=0 → Return heuristic score → Bubble up to root
       ↓
   AI picks column with highest score → Drop disc → Visualize tree
```

---

**SECTION 4 — TWO COLUMNS (Lower section)**

| Left: Syllabus Coverage | Right: Results & Stats |
|---|---|
| Unit 1: Problem space, toy problems, game tree | Depth 6: 1,247 nodes evaluated |
| Unit 2: Search algorithms, BFS/DFS comparison | Alpha-Beta prunes ~70% of nodes |
| Unit 3: Minimax, alpha-beta, adversarial search | Without pruning: ~10,000+ nodes |
| | Near-optimal play at depth 7+ |

---

**SECTION 5 — FOOTER BAND (Full width)**

```
Tech Stack: Next.js 14 | TypeScript | Tailwind CSS | Framer Motion
Concepts: Adversarial Search | Game Theory | Constraint Reasoning | Heuristic Evaluation
```

---

### Poster Design Tips for Maximum Marks

- **Color code everything** — use the same colors as the app (red for player, yellow for AI, green for best path, gray for pruned)
- **No walls of text** — every paragraph max 3 lines
- **Every element needs a caption** — don't put images without labels
- **Use arrows generously** — connect concepts visually
- **Print quality** — export at 300 DPI minimum
- **Font hierarchy** — 3 sizes only: title (36pt), heading (20pt), body (12pt)

---

## 6. Program Explanation Script (6 Marks)

> Memorize this. Practice saying it out loud. Keep it under 4 minutes.

---

*"Good [morning/afternoon]. My project is called AlphaFour — a Connect 4 game with an AI opponent that uses the Minimax algorithm with Alpha-Beta pruning, and a live visualization of the AI's decision tree.*

*Connect 4 is a classic toy problem from Unit 1 of our syllabus. Two players take turns dropping discs into a 7-column grid. The first to get 4 in a row wins. From an AI perspective, this is an adversarial search problem — one player is trying to maximize their score, and the other is trying to minimize it.*

*The core AI technique I've implemented is Minimax, which we studied in Unit 3. The algorithm works by building a game tree. At each level, we alternate between MAX nodes — where the AI chooses the move that gives it the best score — and MIN nodes — where the AI simulates what the worst possible player response would be. The AI explores this tree to a configurable depth, then uses a heuristic function to evaluate how good each board position is.*

*The heuristic rewards the AI for having 3-in-a-row with an open end, penalizes the same for the player, and has a center-column preference since center control is strategically important in Connect 4.*

*However, the full Minimax tree grows exponentially. At depth 6, you'd evaluate over 10,000 nodes. That's where Alpha-Beta Pruning comes in — also from Unit 3. Alpha is the best score the MAX player is guaranteed. Beta is the best score the MIN player is guaranteed. Whenever beta becomes less than or equal to alpha, we know the current branch can never influence the final decision — so we prune it entirely. In practice, this cuts about 70% of nodes, shown live in the visualizer on the right panel.*

*You can see here in the tree: yellow nodes are MAX levels, blue nodes are MIN levels, gray nodes with the scissors icon are pruned branches, and the green path is the best move the AI found. The stats panel shows exactly how many nodes were evaluated versus pruned.*

*This application covers Unit 1 — problem space and toy problems — Unit 2 — search algorithms and tree traversal — and Unit 3 — minimax, alpha-beta pruning, and adversarial game theory — all in one working, interactive demonstration."*

---

## 7. Execution Walkthrough (2 Marks)

> During the demo, do these steps in order. Practice this sequence.

### Step-by-Step Demo Script

**Step 1 — Show the initial board** *(10 seconds)*
> "This is AlphaFour. You can see the empty 7×7 Connect 4 board on the left, the decision tree panel on the right, and the algorithm controls at the bottom."

**Step 2 — Set depth to 3 for demo clarity** *(5 seconds)*
> "I'll set the search depth to 3 so you can see the tree clearly. In a real game, we'd use depth 6 or 7."

**Step 3 — Enable Step Mode** *(5 seconds)*
> "I'll turn on Step Mode so you can watch the AI think level by level."

**Step 4 — Make your first move** *(15 seconds)*
> "I'll drop a red disc in the center column. Watch the tree panel — the AI is now computing Minimax. See how it builds level 1, then level 2, then level 3. Each time it hits a branch where alpha >= beta, it stops and marks it pruned."

**Step 5 — Point to the tree** *(30 seconds)*
> "This root node at the top is the current board. These are the 7 possible columns the AI could play. For each column, it imagines what I'd do next — those are the MIN nodes in blue. The alpha and beta values update as the search progresses. The green path is where the AI decided to play."

**Step 6 — Show stats panel** *(10 seconds)*
> "At depth 3, the AI evaluated 147 nodes but pruned 89 of them — a 60% reduction. At depth 6, the savings are even more dramatic."

**Step 7 — Switch to full depth and let AI play fast** *(20 seconds)*
> "Now I'll set depth to 6 and turn off step mode. Watch how the AI plays perfectly — it blocks threats, builds sequences, and never makes a mistake. This is the power of complete adversarial search."

**Step 8 — Show a win/loss** *(20 seconds)*
> "The four winning discs glow when there's a winner. I can click New Game to reset. The tree resets too."

---

## 8. Viva Preparation — All Possible Questions

### Category A — Basic Algorithm Questions

**Q: What is the Minimax algorithm?**
> Minimax is a recursive decision-making algorithm used in two-player zero-sum games. It builds a game tree where the MAX player (AI) tries to maximize the score and the MIN player (opponent) tries to minimize it. The AI explores all possible future game states up to a specified depth and picks the move that leads to the best guaranteed outcome.

**Q: What is a game tree?**
> A game tree is a tree data structure where each node represents a game state (board configuration), each edge represents a possible move, and levels alternate between the two players. The root is the current state. Leaf nodes are either terminal states (win/loss/draw) or states at the depth limit evaluated by a heuristic.

**Q: What is Alpha-Beta Pruning?**
> Alpha-Beta pruning is an optimization of Minimax that eliminates branches that cannot possibly influence the final decision. Alpha is the best (highest) score the MAX player can guarantee. Beta is the best (lowest) score the MIN player can guarantee. When beta ≤ alpha, the current branch is pruned because the opponent would never allow the MAX player to reach that node.

**Q: What is a heuristic function?**
> A heuristic function estimates the value of a non-terminal board state. Instead of playing to the actual end of the game, we evaluate how "good" the current position looks based on patterns. In Connect 4, we reward 3-in-a-rows with open ends, center column control, and penalize the opponent for the same threats.

**Q: What is the time complexity of Minimax?**
> Without pruning: O(b^d) where b is the branching factor (number of valid moves, up to 7 in Connect 4) and d is the search depth. With Alpha-Beta pruning in the best case, this reduces to O(b^(d/2)), meaning you can search twice as deep in the same time.

---

### Category B — Connect 4 Specific Questions

**Q: Why is Connect 4 considered a toy problem in AI?**
> Connect 4 is a toy problem because it has a finite, well-defined state space, clear goal state (4 in a row), known rules, and is fully observable — both players can see the entire board. It's complex enough to require intelligent search but simple enough to analyze mathematically. It was actually solved in 1988 — the first player can always force a win with perfect play.

**Q: How do you represent the board state in your program?**
> The board is represented as a 2D array (6 rows × 7 columns) where 0 means empty, 1 means player disc, and 2 means AI disc. Each state is a complete snapshot of the board at a point in time. When exploring the tree, we create copies of the board rather than modifying the original.

**Q: How does your AI detect a win?**
> The win detection function checks all four directions — horizontal, vertical, diagonal-up, and diagonal-down — starting from the most recently placed disc. It looks for 4 consecutive discs of the same color. We only need to check from the last move's position, which is more efficient than scanning the whole board.

**Q: What is the branching factor in Connect 4?**
> The branching factor is the number of valid moves at any position — equal to the number of columns that are not full. At the start, it's 7. As the game progresses, it decreases. On average, it's around 4–5 per node, which makes the tree manageable for depths of 6–8.

**Q: Why does the AI prefer the center column?**
> The center column is strategically superior in Connect 4 because a disc placed there can participate in more potential 4-in-a-row combinations (horizontal, vertical, and both diagonals) than a disc in a corner column. The heuristic awards bonus points for center column placement.

---

### Category C — Unit Syllabus Questions

**Q: How does your project relate to Unit 1 topics?**
> Connect 4 is a toy problem as defined in Unit 1. The board is the problem space, each state is a board configuration, the operators are valid column drops, the start state is an empty board, and the goal state is 4-in-a-row. We also apply formulating problems and defining problem characteristics exactly as taught.

**Q: How does your project relate to Unit 2 topics?**
> The Minimax algorithm is essentially a depth-first search of the game tree — DFS from Unit 2. The tree is a type of graph. Each board state is a node, each move is an edge. We also use the concept of search depth similar to Depth-Limited Search. The tree visualizer shows exactly the DFS traversal order.

**Q: How does your project relate to Unit 3 topics?**
> Unit 3 covers adversarial search and minimax directly. Our AI implements the Minimax algorithm with Alpha-Beta pruning as taught in Unit 3. The MAX/MIN node alternation represents two adversarial agents. It also touches on intelligent agent concepts — the AI is a rational agent with a performance measure (winning the game) acting in the task environment (the board).

**Q: What is an intelligent agent? Is your AI one?**
> An intelligent agent perceives its environment through sensors, decides using its internal logic, and acts to achieve its goal. Yes, the AI in AlphaFour is an intelligent agent. Its sensor is the board state (fully observable), its decision-making logic is Minimax with Alpha-Beta pruning, and its goal is to win Connect 4. It satisfies rationality — always picking the best known action given the current state.

**Q: What is a rational agent?**
> A rational agent is one that always selects the action that maximizes its expected performance measure based on available information. The Minimax AI is rational because it always picks the move with the highest guaranteed score — it never makes an irrational choice.

---

### Category D — Tricky / Deep Questions

**Q: What is the difference between Minimax and Best-First Search?**
> Best-First Search explores the most promising node first based on a heuristic, but it's designed for single-agent problems. Minimax is for two-agent adversarial problems — it must account for the opponent minimizing your score, not just maximize your own path. BFS doesn't model an opponent's behavior.

**Q: Can the AI be beaten?**
> At depth 7 or higher, the AI plays nearly perfectly and is extremely difficult to beat. However, true perfect play requires solving the entire game tree (about 4.5 trillion positions). Our depth-limited version uses a heuristic, so a very skilled player could theoretically find edge cases at lower depths. At depth 6+, it's effectively unbeatable for human players.

**Q: What happens if the AI's heuristic is wrong?**
> If the heuristic is inaccurate, the AI might make suboptimal moves. For example, if we don't penalize the opponent's 3-in-a-row strongly enough, the AI might ignore defensive play and lose. The quality of an adversarial search AI depends heavily on heuristic design — this is why professional game AIs spend enormous effort on evaluation functions.

**Q: What is the difference between Alpha cutoff and Beta cutoff?**
> A beta cutoff happens at a MAX node — when the current node's value exceeds the beta value inherited from the parent MIN node, the remaining children are pruned (the opponent would never allow this branch). An alpha cutoff happens at a MIN node — when the current node's value goes below the alpha value, the remaining children are pruned (the AI would never choose this branch).

**Q: Why don't we just solve Connect 4 completely (brute force)?**
> Connect 4 has approximately 4.5 trillion possible game states. Even at 1 billion evaluations per second, a complete search would take thousands of seconds. Depth-limited Minimax with Alpha-Beta pruning reduces this to a tractable real-time computation (under 100ms for depth 6), making interactive play possible.

**Q: What is iterative deepening in the context of Minimax?**
> Iterative deepening Minimax (IDDFS) runs Minimax at depth 1, then 2, then 3, progressively increasing the depth. It combines the memory efficiency of DFS with the time optimality of BFS. It also enables move ordering — using results from shallower depths to order moves in deeper searches, which increases Alpha-Beta pruning efficiency dramatically.

---

### Category E — Questions About Your App

**Q: How did you build the tree visualization?**
> The tree is rendered as an SVG using React. Each node is a rectangle SVG element. After each AI computation, the algorithm returns not just the best move but the entire explored tree as a JavaScript object. The visualizer component recursively renders this tree, positioning nodes using a layout algorithm that calculates x-y coordinates based on depth and sibling index.

**Q: How do you handle the AI computation without freezing the UI?**
> The Minimax computation runs in a Web Worker — a separate JavaScript thread — so the main UI thread stays responsive. While the AI computes, the board shows "AI is thinking..." and discs are disabled. Once computation finishes, the result is posted back to the main thread and the disc drops with animation.

**Q: Why Next.js instead of plain HTML?**
> Next.js gives us React's component model for building complex interactive UIs, TypeScript for type safety in the algorithm code, fast refresh for development, and trivial deployment to Vercel. The tree visualizer and board are both complex stateful components that benefit enormously from React's declarative model.

---

## 9. Syllabus Mapping

| Syllabus Topic | Unit | Where in Project |
|---|---|---|
| AI Techniques | 1 | Minimax as AI technique |
| Problem Solving with AI | 1 | Connect 4 as adversarial search problem |
| Formulating Problems | 1 | Board = problem space, moves = operators |
| Problem Space and Search | 1 | Game tree = problem space traversal |
| Toy Problems | 1 | Connect 4 is a textbook toy problem |
| General Search Algorithms | 2 | Minimax uses depth-first search |
| Trees and Graphs | 2 | Game tree is an explicit tree structure |
| Depth First Search | 2 | Minimax traverses DFS |
| Depth Limited Search | 2 | AI stops at configurable depth limit |
| Informed Search / Best First | 2 | Heuristic evaluation at leaf nodes |
| Adversarial Search | 3 | Entire project is adversarial |
| Game Theory | 3 | Two-player zero-sum game modeled |
| Minimax Algorithm | 3 | Core AI — directly implemented |
| Alpha-Beta Pruning | 3 | Directly implemented and visualized |
| Intelligent Agent | 3 | AI is a rational intelligent agent |
| Rationality | 3 | AI always picks best guaranteed move |
| Performance Measures | 3 | Win = positive, loss = negative |
| Task Environment | 3 | Board = fully observable task environment |

---

## 10. Quick Revision Cheatsheet

> Print this page and keep it in your pocket for last-minute review before the demo.

---

### Minimax in 3 Lines
1. Build a game tree — AI maximizes, opponent minimizes
2. Evaluate leaves with heuristic score
3. Bubble scores up — MAX takes max, MIN takes min

### Alpha-Beta in 3 Lines
1. Alpha = best score MAX is guaranteed so far
2. Beta = best score MIN is guaranteed so far
3. If beta ≤ alpha → prune (remaining siblings won't change the outcome)

### Your Heuristic Scoring
| Condition | Score |
|---|---|
| AI wins (4 in a row) | +100,000 |
| Player wins (4 in a row) | -100,000 |
| AI has 3-in-a-row + open end | +10 |
| AI has 2-in-a-row + open ends | +3 |
| Player has 3-in-a-row + open end | -10 |
| AI disc in center column | +3 |

### Key Numbers to Memorize
- Board: 6 rows × 7 columns
- Max branching factor: 7
- Depth 6 without pruning: ~117,649 nodes
- Depth 6 with alpha-beta (best case): ~343 nodes
- Typical pruning efficiency: 65–75%

### One-Sentence Answers
- **What is Minimax?** *A recursive algorithm that explores all future game states and picks the move with the best guaranteed outcome for the AI.*
- **What is Alpha-Beta?** *An optimization that prunes branches that can't affect the final decision, cutting ~70% of evaluations.*
- **What is a heuristic?** *A scoring function that estimates how good a non-terminal board position is without playing to the end.*
- **Why Connect 4?** *It is a classic adversarial toy problem that directly maps to Unit 1, 2, and 3 topics.*
- **What makes this novel?** *The live decision tree visualization shows alpha and beta values at every node and highlights pruned branches in real time — most Connect 4 projects just show the game.*

---

*Generated for FT3 Application Development Assessment | 26/03/2026*
*AlphaFour — Connect 4 AI Visualizer | Units 1, 2, 3*
