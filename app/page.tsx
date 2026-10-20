
'use client'

import { useEffect, useMemo, useState } from 'react'
import { RotateCcw, Trophy, Users, Bot, Sparkles } from 'lucide-react'

type Mark = 'X' | 'O'
type Cell = Mark | null

type Scores = { X: number; O: number; draws: number }

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function getWinner(board: Cell[]) {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] }
    }
  }
  return { winner: null, line: [] }
}

function pickComputerMove(board: Cell[]) {
  const open = board.map((cell, index) => (cell ? -1 : index)).filter((index) => index !== -1)
  if (!open.length) return -1
  const preferred = [4, 0, 2, 6, 8, 1, 3, 5, 7]
  return preferred.find((index) => !board[index]) ?? open[0]
}

export default function Page() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [turn, setTurn] = useState<Mark>('X')
  const [mode, setMode] = useState<'duo' | 'computer'>('duo')
  const [scores, setScores] = useState<Scores>({ X: 0, O: 0, draws: 0 })
  const [winningLine, setWinningLine] = useState<number[]>([])
  const [computerThinking, setComputerThinking] = useState(false)
  const [moveCount, setMoveCount] = useState(0)

  const result = useMemo(() => getWinner(board), [board])
  const gameOver = Boolean(result.winner) || board.every(Boolean)

  const status = result.winner
    ? `${result.winner} takes the round!`
    : board.every(Boolean)
      ? "It's a draw"
      : mode === 'computer' && turn === 'O'
        ? 'Computer is thinking...'
        : `${turn === 'X' ? 'Player 1' : mode === 'computer' ? 'Computer' : 'Player 2'}'s turn`

  useEffect(() => {
    if (gameOver || mode !== 'computer' || turn !== 'O') return

    setComputerThinking(true)

    const timer = window.setTimeout(() => {
      const move = pickComputerMove(board)

      if (move !== -1) {
        const next = [...board]
        next[move] = 'O'
        setBoard(next)
        setMoveCount((count) => count + 1)
        setTurn('X')
      }

      setComputerThinking(false)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [board, gameOver, mode, turn])

  useEffect(() => {
    if (!gameOver || board.length !== 9) return

    const found = getWinner(board)
    setWinningLine(found.line)

    setScores((current) => found.winner
      ? { ...current, [found.winner]: current[found.winner] + 1 }
      : { ...current, draws: current.draws + 1 })
  }, [gameOver, board])

  function play(index: number) {
    if (
      board[index] ||
      gameOver ||
      computerThinking ||
      (mode === 'computer' && turn === 'O')
    ) return

    const next = [...board]
    next[index] = turn

    setBoard(next)
    setMoveCount((count) => count + 1)
    setTurn(turn === 'X' ? 'O' : 'X')
  }

  function restart() {
    setBoard(Array(9).fill(null))
    setTurn('X')
    setWinningLine([])
    setComputerThinking(false)
    setMoveCount(0)
  }

  function resetScore() {
    restart()
    setScores({ X: 0, O: 0, draws: 0 })
  }

  return (
    <main className="arena-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <div className="arena-wrap">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark"><Sparkles size={18} /></span>
            <span>Tic-Tac-Toe <b>Arena</b></span>
          </div>
          <div className="live-pill">
            <span className="live-dot" /> LIVE MATCH
          </div>
        </header>

        <section className="hero-copy">
          <p className="eyebrow">
            ROUND {scores.X + scores.O + scores.draws + 1} <span>•</span> READY TO PLAY
          </p>
          <h1>Think. Place. <em>Conquer.</em></h1>
          <p className="subtitle">Classic strategy, reimagined for the arena.</p>
        </section>

        <section className="game-layout">
          <aside className="score-card panel">
            <div className="panel-heading">
              <Trophy size={17} /> SCOREBOARD
            </div>

            <div className="score-row score-x">
              <div>
                <span className="player-badge">X</span>
                <div><strong>PLAYER 1</strong><small>YOU</small></div>
              </div>
              <b>{scores.X}</b>
            </div>

            <div className="score-row score-o">
              <div>
                <span className="player-badge">O</span>
                <div>
                  <strong>{mode === 'computer' ? 'COMPUTER' : 'PLAYER 2'}</strong>
                  <small>{mode === 'computer' ? 'AI OPPONENT' : 'LOCAL PLAYER'}</small>
                </div>
              </div>
              <b>{scores.O}</b>
            </div>

            <div className="draw-row">
              <span>DRAWS</span>
              <b>{scores.draws}</b>
            </div>

            <button className="reset-link" onClick={resetScore}>
              <RotateCcw size={14} /> Reset score
            </button>
          </aside>

          <div className="board-column">
            <div className="move-counter">
              <span>🎯 Moves played: </span>
              <strong>{moveCount}</strong>
              <span> / 9</span>
            </div>

            <div className={`turn-indicator ${result.winner ? 'winner' : ''}`}>
              <span className={`turn-symbol symbol-${result.winner ?? turn}`}>
                {result.winner ?? turn}
              </span>
              <span>{status}</span>
            </div>

            <div className="board" role="grid" aria-label="Tic-Tac-Toe board">
              {board.map((cell, index) => (
                <button
                  key={index}
                  className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ''} ${winningLine.includes(index) ? 'winning' : ''}`}
                  onClick={() => play(index)}
                  aria-label={`Cell ${index + 1}${cell ? `, ${cell}` : ', empty'}`}
                  role="gridcell"
                >
                  {cell}
                </button>
              ))}
            </div>

            <button className="restart-button" onClick={restart}>
              <RotateCcw size={17} />
              {gameOver ? 'Play again' : 'Restart round'}
            </button>
          </div>

          <aside className="mode-card panel">
            <div className="panel-heading">
              <Users size={17} /> GAME MODE
            </div>

            <div className="mode-switch" role="group" aria-label="Game mode">
              <button
                className={mode === 'duo' ? 'selected' : ''}
                onClick={() => { setMode('duo'); restart() }}
              >
                <Users size={17} />
                <span>2 Players<small>Same device</small></span>
              </button>

              <button
                className={mode === 'computer' ? 'selected' : ''}
                onClick={() => { setMode('computer'); restart() }}
              >
                <Bot size={17} />
                <span>Vs Computer<small>Challenge the AI</small></span>
              </button>
            </div>

            <div className="tip">
              <span>PRO TIP</span>
              <p>Control the center to unlock more winning paths.</p>
            </div>
          </aside>
        </section>

        <footer>
          <span>BUILT FOR THE ARENA</span>
          <i />
          <span>GOOD LUCK, HAVE FUN</span>
        </footer>
      </div>
    </main>
  )
}
