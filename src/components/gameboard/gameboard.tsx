import { JSX } from 'react';
import "./../../../public/css/gameboard.css"
import {Cell} from "../../const.ts";

type Board = Cell[][];
interface GameboardProps {
    board: Board;
}

export function Gameboard({board} : GameboardProps) : JSX.Element {

    return (
        <div className="gameboard">
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`cell ${
                            cell === 'player_1' ? 'player1' :
                                cell === 'player_2' ? 'player2' :
                                    'empty'
                        }`}
                    />
                ))
            )}
        </div>
    );
}