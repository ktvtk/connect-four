import {JSX, useCallback, useEffect, useRef, useState} from "react";
import { Gameboard } from "../gameboard/gameboard.tsx";
import { Cell } from "../../const.ts";
import "./../../../public/css/game.css";
import { Validator } from "../../validator.ts";

type Board = Cell[][];

const ROWS = 6;
const COLS = 7;

export function Game(): JSX.Element {
    const [board, setBoard] = useState<Board>(() =>
        Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
    );
    const [winner, setWinner] = useState<'player_1' | 'player_2' | null>(null);
    const [status, setStatus] = useState<string>('Ход player_1');
    const [moves, setMoves] = useState<number[]>([]);
    const [isDropping, setIsDropping] = useState<boolean>(false);
    const [hoveredCol, setHoveredCol] = useState<number>(-1);

    const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
    const columnsRef = useRef<HTMLDivElement>(null);

    const setBoardAndMoves = useCallback((newBoard: Board, newMoves: number[]) => {
        setBoard(newBoard);
        setMoves(newMoves);
    }, []);

    useEffect(() => {
        const initialResult = Validator(
            Array(ROWS).fill(null).map(() => Array(COLS).fill(null)),
            []
        );
        console.log('step_0:', initialResult.step_0);
    }, []);

    const resetGame = () => {
        setBoardAndMoves(
            Array(ROWS).fill(null).map(() => Array(COLS).fill(null)),
            []
        );
        setWinner(null);
        setStatus('Ход player_1');
        setIsDropping(false);
        setHoveredCol(-1);
    };

    const handleColumnClick = useCallback((col: number) => {
        if (isDropping || winner || moves.length >= ROWS * COLS) return;

        const isColumnFull = board.every(row => row[col] !== null);
        if (isColumnFull) return;

        setIsDropping(true);

        const newBoard = board.map(r => [...r]);
        let dropped = false;

        for (let row = ROWS - 1; row >= 0; row--) {
            if (newBoard[row][col] === null) {
                newBoard[row][col] = moves.length % 2 === 0 ? 'player_1' : 'player_2';
                dropped = true;
                break;
            }
        }

        if (!dropped) {
            setIsDropping(false);
            return;
        }

        const newMoves = [...moves, col];
        setBoardAndMoves(newBoard, newMoves);

        const result = Validator(newBoard, newMoves);
        const lastStep = result[`step_${newMoves.length}`];

        const { step_0, ...rest } = result;
        console.log(rest);

        if (lastStep.board_state === 'win' && lastStep.winner) {
            console.log({
                who: lastStep.winner.who,
                positions: lastStep.winner.positions
            });

            setWinner(lastStep.winner.who);
            if (lastStep.winner.who === "player_1"){
                setStatus(`Победил Розовый!`);
            } else if ( lastStep.winner.who === "player_2"){
                setStatus('Победил Бирюзовый!')
            }
        } else if (lastStep.board_state === 'full') {
            setStatus('Ничья!');
        } else {
            const nextPlayer = newMoves.length % 2 === 0 ? 'player_1' : 'player_2';
            setStatus(`Ход ${nextPlayer}`);
        }

        setIsDropping(false);
    }, [board, moves, winner, isDropping, setBoardAndMoves]);

    const isGameOver = winner !== null || moves.length >= ROWS * COLS;
    const currentPlayer = moves.length % 2 === 0 ? 'player1' : 'player2';

    const handleMouseEnter = (col: number) => {
        if (isGameOver || isDropping) return;
        const isColumnFull = board.every(row => row[col] !== null);
        if (!isColumnFull) setHoveredCol(col);
    };


    const handleColumnsMouseLeave = () => {
        setHoveredCol(-1);
    };

    const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});

    const updatePreview = () => {
        if (hoveredCol === -1 || !columnRefs.current[hoveredCol]) {
            setPreviewStyle({ opacity: 0 });
            return;
        }

        const cell = columnRefs.current[hoveredCol]!;
        const rect = cell.getBoundingClientRect();

        setPreviewStyle({
            position: 'fixed',
            left: rect.left,
            opacity: 1,
            transition: 'all 0.15s ease',
            pointerEvents: 'none',
        });
    };

    useEffect(() => {
        updatePreview();
    }, [hoveredCol, board, moves]);

    useEffect(() => {
        const handleResize = () => updatePreview();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [hoveredCol]);

    return (
        <div className="game-container">
            <div className="columns-wrapper" onMouseLeave={handleColumnsMouseLeave}>
                <div
                    className="columns"
                    ref={columnsRef}
                >
                    {Array.from({ length: COLS }).map((_, col) => {
                        const isColumnFull = board.every(row => row[col] !== null);
                        const disabled = isGameOver || isColumnFull || isDropping;
                        return (
                            <div
                                key={col}
                                ref={el => columnRefs.current[col] = el}
                                className={`column-selector ${disabled ? 'disabled' : ''}`}
                                onClick={() => handleColumnClick(col)}
                                onMouseEnter={() => handleMouseEnter(col)}
                            />
                        );
                    })}
                </div>
                <div className="preview-container">
                    {hoveredCol !== -1 && !board[0][hoveredCol] && (
                        <div
                            className={`preview-cell ${currentPlayer}`}
                            style={previewStyle}
                        />
                    )}
                </div>
            </div>
            <Gameboard board={board} />
            {isGameOver && (
                <div className="game-over">
                    <div className="game-over-status">{status}</div>
                    <button className="new-game" onClick={resetGame}>
                        Начать новую игру
                    </button>
                </div>
            )}
        </div>
    );
}