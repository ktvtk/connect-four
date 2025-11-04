import {JSX} from "react";
import "./../../public/css/game-page.css"
import {Link} from "react-router-dom";
import {AppRoute} from "../const.ts";
import { Game } from "../components/game/game.tsx";

export function GamePage() : JSX.Element {

    return (
        <div>
            <div className="header">
                <Link to={AppRoute.Main} className="out">
                    <img src="./../../public/img/logout.png" alt="Выйти из игры" width="28" height="28"/>
                </Link>
            </div>
            <Game />
        </div>
    );
}