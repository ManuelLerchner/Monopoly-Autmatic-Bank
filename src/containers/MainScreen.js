import React from "react";
import Logo from "../components/logo/Logo";
import MainMenu from "./mainScreen/MainMenu";

import $ from "jquery";

export default function MainScreen({ setGameState }) {
    $("#navbar_lobby").removeClass("selected");
    $("#navbar_main").addClass("selected");
    $("#navbar_pay").removeClass("selected");
    $("#navbar_buy").removeClass("selected");
    $("#navbar_rent").removeClass("selected");
    $("#navbar_bank").removeClass("selected");
    $("#navbar_stocks").removeClass("selected");

    return (
        <>
            <Logo setGameState={setGameState} />
            <MainMenu setGameState={setGameState} />
        </>
    );
}
