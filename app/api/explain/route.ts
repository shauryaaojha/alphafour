// ─── AI Narrator API Route ───
// Feature 10: Calls Anthropic Claude API to explain the AI's move.
// Route: POST /api/explain

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface ExplainRequest {
  chosenColumn: number;
  topAlternatives: { col: number; score: number }[];
  heuristicScore: number;
  threats: { type: string; col: number; label: string }[];
  isBlockingMove: boolean;
  moveNumber: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: ExplainRequest = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // If no API key, return a deterministic offline explanation
    if (!apiKey) {
      const explanation = generateOfflineExplanation(body);
      return NextResponse.json({ explanation });
    }

    const prompt = buildPrompt(body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-20240307',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const explanation = generateOfflineExplanation(body);
      return NextResponse.json({ explanation });
    }

    const data = await response.json();
    const explanation = data.content?.[0]?.text ?? generateOfflineExplanation(body);

    return NextResponse.json({ explanation });
  } catch {
    return NextResponse.json(
      { explanation: 'AI narration unavailable. Check your API key.' },
      { status: 200 }
    );
  }
}

function buildPrompt(b: ExplainRequest): string {
  const colName = ['far-left', 'left', 'center-left', 'center', 'center-right', 'right', 'far-right'];
  const threats = b.threats.length > 0
    ? b.threats.map(t => t.label).slice(0, 3).join(', ')
    : 'no immediate threats detected';

  return `You are an AI explaining a Connect 4 move to a student in exactly 2 sentences.

Context:
- The AI chose column ${b.chosenColumn} (${colName[b.chosenColumn] ?? b.chosenColumn})
- Heuristic score for this move: ${b.heuristicScore}
- Threats detected on the board: ${threats}
- Was this a blocking move? ${b.isBlockingMove ? 'Yes, blocking the player' : 'No, offensive play'}
- Move number in the game: ${b.moveNumber}
- Top alternatives considered: ${b.topAlternatives.map(a => `col ${a.col} (score ${a.score})`).join(', ')}

Explain in exactly 2 clear sentences why the AI chose column ${b.chosenColumn}. Be specific about threats and strategy. Do not use em-dashes.`;
}

/**
 * Offline fallback explanation when no API key is set.
 * Uses heuristic data to generate a deterministic explanation.
 */
function generateOfflineExplanation(b: ExplainRequest): string {
  const col = b.chosenColumn;
  const colName = ['far-left', 'left', 'center-left', 'center', 'center-right', 'right', 'far-right'][col] ?? `column ${col}`;

  if (b.isBlockingMove) {
    const playerThreat = b.threats.find(t => t.type === 'player-threat');
    if (playerThreat) {
      return `The AI detected your 3-in-a-row threat at ${playerThreat.label} and played column ${col} (${colName}) to block it. Blocking the opponent's winning threat is always the top defensive priority in Minimax evaluation.`;
    }
    return `The AI played the ${colName} column defensively to neutralize a developing threat. The Minimax algorithm weighted defensive play highest at this board state with a score of ${b.heuristicScore}.`;
  }

  const aiThreat = b.threats.find(t => t.type === 'ai-threat');
  if (aiThreat) {
    return `The AI played column ${col} (${colName}) to extend its own 3-in-a-row sequence, creating a winning threat at ${aiThreat.label}. With a heuristic score of ${b.heuristicScore}, this offensive play was ranked highest by Minimax among all ${b.topAlternatives.length + 1} candidate columns.`;
  }

  if (col === 3) {
    return `The AI chose the center column (${col}) because center control offers the most potential winning combinations in Connect 4. The heuristic scored this position at ${b.heuristicScore}, making it the best available positional move.`;
  }

  return `The AI selected column ${col} (${colName}) with a heuristic score of ${b.heuristicScore}, which was the highest-valued position among all evaluated candidates. The Minimax algorithm searched ${Math.abs(b.moveNumber)} moves deep and found this the optimal strategic placement.`;
}
