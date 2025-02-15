import React, { useState } from "react";

import { PlayerClass } from "../../Data/PlayerClass";
import BuyModal from "../../components/modal/Modal";
import PropertyCard from "./../../components/propertyCard/PropertyCard";
import PlayerList from "../../components/playerList/PlayerList";
import { PropertyClass } from "../../Data/PropertyClass";

import $ from "jquery";

import "./BuyMenu.css";

let housesBuilt = 0;

export default function BuyMenu({
    players,
    setPlayers,
    availableProperties,
    setAvailableProperties,
    buildings,
    setBuildings,
    bank,
    maxHouses,
}) {
    const [selectedProperty, setselectedProperty] = useState(null);
    const [playerProperties, setplayerProperties] = useState([]);
    const [selectedPropertyToBuild, setselectedPropertyToBuild] =
        useState(null);

    const purchaseProperty = () => {
        const buyerID = $("input:radio[name=Buyer]:checked").val();

        if (buyerID === undefined) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: "No Buyer selected",
                classes: "rounded red  black-text",
            });
            return;
        }

        if (selectedProperty === null) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: "No Property selected",
                classes: "rounded red  black-text",
            });
            return;
        }

        const buyer = players.find((player) => player.id === buyerID);

        const [succesfull, paymentMSG] = PlayerClass.buyProperty(
            buyer,
            selectedProperty
        );

        if (!succesfull) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: paymentMSG,
                classes: "rounded red black-text",
            });
            return;
        }

        setPlayers(
            players.map((player) => {
                if (player.id === buyer.id) {
                    return buyer;
                }
                return player;
            })
        );

        setAvailableProperties(
            availableProperties.filter(
                (prop) => prop.id !== selectedProperty.id
            )
        );

        // eslint-disable-next-line no-undef
        M.toast({
            html: paymentMSG,
            classes: "rounded green  black-text",
        });
    };

    const buyBuilding = (building, price) => {
        const buyerID = $("input:radio[name=Buyer]:checked").val();

        if (buyerID === undefined) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: "No Buyer selected",
                classes: "rounded red  black-text",
            });
            return;
        }

        if (selectedPropertyToBuild === null) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: "No Property selected",
                classes: "rounded red  black-text",
            });
            return;
        }

        if (maxHouses < housesBuilt + building.slotsTaken) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: `Missing ${
                    housesBuilt + building.slotsTaken - maxHouses
                } houses`,
                classes: "rounded red black-text",
            });
            return;
        }

        const buyer = players.find((player) => player.id === buyerID);

        if (buyer.balance < price) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: "Not enought Money",
                classes: "rounded red black-text",
            });
            return;
        }

        var newSlotsNeeded = building.slotsTaken;

        if (selectedPropertyToBuild.buildingSlotsTaken + newSlotsNeeded > 8) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: `Not Enought Slots available,missing ${
                    selectedPropertyToBuild.buildingSlotsTaken +
                    newSlotsNeeded -
                    8
                }`,
                classes: "rounded red black-text",
            });
            return;
        }

        if (
            selectedPropertyToBuild.owner.hasSkyScraperOn[
                selectedPropertyToBuild.color
            ] &&
            building.type === "skyscraper"
        ) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: "Skyscraper is already built on this color",
                classes: "rounded red black-text",
            });
            return;
        }

        const [succesfullTransaction, transactionMSG] =
            PlayerClass.builtBuilding(
                buyer,
                selectedPropertyToBuild,
                building,
                price
            );

        if (building.type === "monopolyTower") {
            setBuildings(buildings.filter((build) => build.id !== building.id));
        }

        if (building.type === "house") {
            housesBuilt += newSlotsNeeded;
        }

        if (!succesfullTransaction) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: transactionMSG,
                classes: "rounded red black-text",
            });
            return;
        }

        const [succesfull, paymentMSG] = PropertyClass.builtBuilding(
            selectedPropertyToBuild,
            building
        );

        if (!succesfull) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: paymentMSG,
                classes: "rounded red black-text",
            });
            return;
        }

        buyer.calcEstimatedValue();

        setPlayers(
            players.map((player) => {
                if (player.id === buyer.id) {
                    return buyer;
                }
                return player;
            })
        );

        closeBuyHome();

        // eslint-disable-next-line no-undef
        M.toast({
            html: paymentMSG,
            classes: "rounded green  black-text",
        });
    };

    const openBuyHome = (property) => {
        setselectedPropertyToBuild(property);
        var modalElems = document.querySelectorAll("#modalBuyHome");
        modalElems.forEach((elem) => {
            // eslint-disable-next-line no-undef
            var instance = M.Modal.getInstance(elem);
            instance.open();
        });
    };

    const closeBuyHome = (property) => {
        setselectedPropertyToBuild(property);
        var modalElems = document.querySelectorAll("#modalBuyHome");
        modalElems.forEach((elem) => {
            // eslint-disable-next-line no-undef
            var instance = M.Modal.getInstance(elem);
            instance.close();
        });
    };

    const closeModal = (property) => {
        setselectedProperty(property);
        var modalElems = document.querySelectorAll(".modal");
        modalElems.forEach((elem) => {
            // eslint-disable-next-line no-undef
            var instance = M.Modal.getInstance(elem);
            instance.close();
        });
    };

    const openBuyBuilding = () => {
        const buyerID = $("input:radio[name=Buyer]:checked").val();

        if (buyerID === undefined) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: "No Buyer selected",
                classes: "rounded red  black-text",
            });
            return;
        }

        const buyer = players.find((player) => player.id === buyerID);

        setplayerProperties(buyer.properties);

        var modalElems = document.querySelectorAll("#modalSelectPropety");
        modalElems.forEach((elem) => {
            // eslint-disable-next-line no-undef
            var instance = M.Modal.getInstance(elem);
            instance.open();
        });
    };

    return (
        <div className="row">
            <div className="col l2 offset-l1 s4 ">
                <div className="card cardColor-buy ">
                    <div className="card-content white-text">
                        {/* Title */}

                        <div className="section">
                            <div className="card-title green-text center title">
                                Buyer
                            </div>
                        </div>

                        <PlayerList players={players} type={"Buyer"} />
                    </div>
                </div>
            </div>

            <div className="col l4 offset-l1 s4">
                {selectedProperty !== null && (
                    <div className="card cardColor-buy ">
                        <div className="card-content white-text">
                            <div className="row smallRow ">
                                <div className="gridWrapperOneColumn">
                                    <PropertyCard
                                        property={selectedProperty}
                                        setselectedProperty={
                                            setselectedProperty
                                        }
                                        closeModal={() => {}}
                                        showType={"cost"}
                                    />
                                </div>
                            </div>

                            <div className="row center padding10">
                                <a
                                    className="waves-effect waves-light btn-large btn-large-buy blue lighten-1"
                                    onClick={purchaseProperty}
                                >
                                    <i className="material-icons right  hide-on-small-only">
                                        attach_money
                                    </i>
                                    Purchase
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="col l2 offset-l1 s4">
                <div className="card cardColor-buy ">
                    <div className="card-content white-text ">
                        {/* Title */}
                        <div className="section">
                            <div className="card-title grey-text text-lighten-3 center title">
                                Type
                            </div>
                        </div>

                        <div className="row center ">
                            <div className="col s12">
                                <button
                                    className=" btn-large btn-large-type waves-effect waves-light orange darken-2 "
                                    onClick={openBuyBuilding}
                                >
                                    <i className="material-icons right  hide-on-small-only">
                                        home
                                    </i>
                                    Bulding
                                </button>
                            </div>
                        </div>

                        <div className="row center padding10">
                            <div className="col s12 ">
                                <a
                                    className=" btn-large btn-large-type waves-effect waves-light green darken-1  modal-trigger "
                                    href="#modalBuyProperties"
                                >
                                    <i className="material-icons right  hide-on-small-only">
                                        texture
                                    </i>
                                    Property
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="modalSelectPropety" className="modal">
                <BuyModal
                    title={"Player Properties:"}
                    description={"Select a property where you want to build"}
                    properties={playerProperties}
                    clickCallback={openBuyHome}
                    showType={"rent"}
                />
            </div>

            <div id="modalBuyProperties" className="modal">
                <BuyModal
                    title={"Properties:"}
                    description={"Select a property to buy"}
                    properties={[...availableProperties, ...bank.properties]}
                    clickCallback={closeModal}
                    showType={"cost"}
                />
            </div>

            <div id="modalBuyHome" className="modal">
                <BuyModal
                    title={"Buildings:"}
                    description={"Select a Building to buy"}
                    properties={buildings}
                    selectedProperty={selectedPropertyToBuild}
                    clickCallback={buyBuilding}
                    showType={"/"}
                />
            </div>
        </div>
    );
}
