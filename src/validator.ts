import { Cell } from "./const.ts";

type Position = [number, number];
type Board = Cell[][];

interface WinnerInfo {
    who: 'player_1' | 'player_2';
    positions: [Position, Position, Position, Position];
}

interface StepResult {
    player_1: Position[];
    player_2: Position[];
    board_state: 'waiting' | 'pending' | 'win' | 'full';
    winner?: WinnerInfo | null;
}

interface GameResult {
    [key: `step_${number}`]: StepResult;
}

export function Validator(board: Board, moves: number[]): GameResult {
    const ROWS = 6;
    const COLS = 7;

    const player1Pos: Position[] = [];
    const player2Pos: Position[] = [];

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === 'player_1') {
                player1Pos.push([c, ROWS - 1 - r]);
            } else if (board[r][c] === 'player_2') {
                player2Pos.push([c, ROWS - 1 - r]);
            }
        }
    }

    const totalMoves = moves.length;
    const isFull = board.every(row => row.every(cell => cell !== null));
    const lastPlayer = totalMoves % 2 === 1 ? 'player_1' : 'player_2';

    let lastRow = -1;
    let lastCol = -1;
    if (totalMoves > 0) {
        const col = moves[totalMoves - 1];
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r][col] === lastPlayer) {
                lastRow = r;
                lastCol = col;
                break;
            }
        }
    }

    const winner = lastRow !== -1 ? checkWinner(board, lastRow, lastCol, lastPlayer) : null;

    const result: GameResult = {
        step_0: {
            player_1: [],
            player_2: [],
            board_state: 'waiting',
        },
    };

    const stepKey = `step_${totalMoves}` as const;
    result[stepKey] = {
        player_1: player1Pos,
        player_2: player2Pos,
        board_state: winner ? 'win' : isFull ? 'full' : totalMoves === 0 ? 'waiting' : 'pending',
        winner,
    };

    return result;
}

function checkWinner(
    board: Board,
    row: number,
    col: number,
    player: 'player_1' | 'player_2'
): WinnerInfo | null {
    const ROWS = 6;
    const COLS = 7;
    const directions: [number, number][] = [
        [0, 1],  // горизонталь
        [1, 0],  // вертикаль
        [1, 1],  // диагональ \
        [1, -1], // диагональ /
    ];

    const toPos = (r: number, c: number): Position => [c, ROWS - 1 - r];

    for (const [dr, dc] of directions) {
        let count = 1;
        const positions: Position[] = [toPos(row, col)];

        for (let i = 1; i < 4; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                count++;
                positions.push(toPos(r, c));
            } else {
                break;
            }
        }

        for (let i = 1; i < 4; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                count++;
                positions.unshift(toPos(r, c));
            } else {
                break;
            }
        }

        if (count >= 4) {
            return {
                who: player,
                positions: positions.slice(0, 4) as [Position, Position, Position, Position],
            };
        }
    }

    return null;
}