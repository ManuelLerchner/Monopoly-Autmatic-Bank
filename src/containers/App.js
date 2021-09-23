import React, { useState, useEffect } from "react";

import { PlayerClass } from "./../Data/PlayerClass";
import { PropertyClass } from "../Data/PropertyClass";
import { BuildingClass } from "../Data/BuildingClass";

import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

import LobbyScreen from "./LobbyScreen";
import MainScreen from "./MainScreen";
import PayScreen from "./PayScreen";
import BuyScreen from "./BuyScreen";
import BankScreen from "./BankScreen";
import StocksScreen from "./StocksScreen";
import RentScreen from "./RentScreen";
import SellScreen from "./SellScreen";
import Overview from "./OverviewScreen";

import "./App.css";
import BottomBar from "../components/bottomBar/BottomBar";

import loadGameData from "../Data/loadGameData";

import One_House from "../images/houses/1 House.jpg";
import Two_Houses from "../images/houses/2 Houses.jpg";
import Three_Houses from "../images/houses/3 Houses.jpg";
import One_Industrial from "../images/houses/1 Industrial.jpg";
import Two_Industrial from "../images/houses/2 Industrial.jpg";
import Three_Industrial from "../images/houses/3 Industrial.jpg";
import Skyscraper from "../images/houses/Skyscraper.jpg";
import MonopolyTower from "../images/houses/Monopoly Tower.jpg";

export default function App() {
    //Player List,  Game State
    const [players, setPlayers] = useState([]);
    const [availableProperties, setAvailableProperties] = useState([]);
    const [buildings, setBuildings] = useState([]);

    const [gameState, setGameState] = useState("lobby");
    const [bank, setbank] = useState(null);

    useEffect(() => {
        setbank(() => {
            let bank = new PlayerClass("Bank");
            bank.balance = 10 ** 10;
            return bank;
        });

        async function fetchData() {
            const data = await loadGameData();

            const properties = [];
            for (const id in data) {
                const property = data[id];

                let name = property.name;
                let cost = property.cost;
                let color = property.color;
                let rentPrice = {
                    1: property.rentPrice_1,
                    2: property.rentPrice_2,
                    3: property.rentPrice_3,
                    4: property.rentPrice_4,
                    5: property.rentPrice_5,
                    6: property.rentPrice_6,
                    7: property.rentPrice_7,
                    8: property.rentPrice_8,
                };

                let baseRent = property.baseRent;
                let buildingPrice = {
                    house: property.housePrice,
                    skyscraper: property.skyScraperPrice,
                    monopolyTower: 10 * 10 ** 6,
                    industrialBuilding: property.industrialBuildingPrice,
                };

                properties.push(
                    new PropertyClass(
                        name,
                        cost,
                        color,
                        baseRent,
                        rentPrice,
                        buildingPrice
                    )
                );
            }

            setAvailableProperties(properties);
        }

        fetchData();

        setBuildings([
            new BuildingClass("1 House", One_House),
            new BuildingClass("2 Houses", Two_Houses),
            new BuildingClass("3 Houses", Three_Houses),
            new BuildingClass("1 Industrial Building", One_Industrial),
            new BuildingClass("2 Industrial Buildings", Two_Industrial),
            new BuildingClass("3 Industrial Buildings", Three_Industrial),
            new BuildingClass("Skyscraper", Skyscraper),
            new BuildingClass("Monopoly Tower", MonopolyTower),
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Determine which main Content to load
    function Content() {
        if (gameState === "lobby") {
            return (
                <LobbyScreen
                    players={players}
                    setPlayers={setPlayers}
                    setGameState={setGameState}
                />
            );
        }
        if (gameState === "main") {
            return <MainScreen setGameState={setGameState} players={players} />;
        }
        if (gameState === "overview") {
            return <Overview setGameState={setGameState} players={players} />;
        }

        if (gameState === "pay") {
            return (
                <PayScreen
                    players={players}
                    setPlayers={setPlayers}
                    setGameState={setGameState}
                />
            );
        }
        if (gameState === "buy") {
            return (
                <BuyScreen
                    players={players}
                    setPlayers={setPlayers}
                    setGameState={setGameState}
                    availableProperties={availableProperties}
                    setAvailableProperties={setAvailableProperties}
                    buildings={buildings}
                    setBuildings={setBuildings}
                    bank={bank}
                />
            );
        }

        if (gameState === "rent") {
            return (
                <RentScreen
                    players={players}
                    setPlayers={setPlayers}
                    setGameState={setGameState}
                />
            );
        }

        if (gameState === "sell") {
            return (
                <SellScreen
                    players={players}
                    setPlayers={setPlayers}
                    setGameState={setGameState}
                    bank={bank}
                />
            );
        }

        if (gameState === "bank") {
            return (
                <BankScreen
                    players={players}
                    setPlayers={setPlayers}
                    setGameState={setGameState}
                />
            );
        }

        if (gameState === "stocks") {
            return (
                <StocksScreen
                    players={players}
                    setPlayers={setPlayers}
                    setGameState={setGameState}
                />
            );
        }
    }

    return (
        <div id="main">
            <div className="wallpaper">
                <Navbar setGameState={setGameState} />

                <Content />
                <BottomBar players={players} />
            </div>
            <Footer />
        </div>
    );
}
