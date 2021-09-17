import React from "react";
import Logo from "../components/logo/Logo";

import $ from "jquery";

import BuyMenu from "./buyScreen/BuyMenu";

export default function BuyScreen({
    players,
    setPlayers,
    setGameState,
    availableProperties,
    setAvailableProperties,
    buildings,
    setBuildings,
}) {
    $("#navbar_lobby").removeClass("selected");
    $("#navbar_main").removeClass("selected");
    $("#navbar_pay").removeClass("selected");
    $("#navbar_buy").addClass("selected");
    $("#navbar_rent").removeClass("selected");
    $("#navbar_bank").removeClass("selected");
    $("#navbar_stocks").removeClass("selected");
    return (
        <>
            <Logo setGameState={setGameState} />
            <BuyMenu
                players={players}
                setPlayers={setPlayers}
                availableProperties={availableProperties}
                setAvailableProperties={setAvailableProperties}
                buildings={buildings}
                setBuildings={setBuildings}
            />
        </>
    );
}
