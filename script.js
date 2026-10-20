const app = document.querySelector('#app')
let board = Array(9).fill('')
let turn = 'X'
let scores = { X: 0, O: 0, draws: 0 }
const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

function winner() { return lines.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]) }
function render() {
  const line = winner()
  const draw = !line && board.every(Boolean)
  const status = line ? `${board[line[0]]} wins!` : draw ? "It's a draw!" : `${turn}'s turn`
  app.innerHTML = `<p>ROUND ${scores.X + scores.O + scores.draws + 1}</p><h1>Think. Place. <em>Conquer.</em></h1><p>Classic strategy, reimagined for the arena.</p><div class="status">${status}</div><div class="board" role="grid">${board.map((cell, i) => `<button class="cell" data-index="${i}" aria-label="Cell ${i + 1}">${cell}</button>`).join('')}</div><button class="action" id="restart">Restart round</button><div class="scores"><span>X: ${scores.X}</span><span>O: ${scores.O}</span><span>Draws: ${scores.draws}</span></div>`
  document.querySelectorAll('.cell').forEach(button => button.addEventListener('click', () => play(Number(button.dataset.index))))
  document.querySelector('#restart').addEventListener('click', reset)
}
function play(index) { if (board[index] || winner() || board.every(Boolean)) return; board[index] = turn; const line = winner(); if (line) scores[turn]++; else if (board.every(Boolean)) scores.draws++; else turn = turn === 'X' ? 'O' : 'X'; render() }
function reset() { board = Array(9).fill(''); turn = 'X'; render() }
render()
