import {JSX} from "react";
import {Helmet} from "react-helmet-async";
import "./../../public/css/welcome-page.css";
import {Link} from "react-router-dom";
import {AppRoute} from "../const.ts";

export function WelcomePage() : JSX.Element {

    return (
        <section className="welcome-page">
            <Helmet>
                <title>Начать игру</title>
            </Helmet>
            <div className="modal">
                <h1 className="head">4 в ряд</h1>
                <Link to={AppRoute.Game}>
                    <button className="start-button">Старт</button>
                </Link>
            </div>
        </section>
    )
}