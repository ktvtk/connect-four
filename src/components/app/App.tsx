import {JSX} from "react";
import {GamePage} from "../../pages/game-page.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AppRoute} from "../../const.ts";
import { WelcomePage } from "../../pages/welcome-page.tsx";

export function App() : JSX.Element {
    return(
        <BrowserRouter>
            <Routes>
                <Route
                    path={AppRoute.Main}
                    element={<WelcomePage />}
                ></Route>
                <Route
                path={AppRoute.Game}
                element={<GamePage />}
                ></Route>
            </Routes>
        </BrowserRouter>
    )
}