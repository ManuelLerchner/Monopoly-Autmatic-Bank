import React, { useRef } from "react";

import { PlayerClass } from "../../Data/PlayerClass";
import PlayerList from "../../components/playerList/PlayerList";

import BankImg from "../../images/Bank.png"; //

import $ from "jquery";
import "./BankMenu.css";

export default function BankScreen({ players, setPlayers, bank }) {
    const amountRef = useRef();

    const transfer = (direction, val) => {
        const customerID = $("input:radio[name=Customer]:checked").val();

        const amount = val === undefined ? amountRef.current.value : val;

        if (customerID === undefined) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: "No Customer selected",
                classes: "rounded red black-text",
            });
            return;
        }

        if (amount === "") {
            // eslint-disable-next-line no-undef
            M.toast({
                html: "No Amount selected",
                classes: "rounded red black-text",
            });
            return;
        }

        const customer = players.find((player) => player.id === customerID);

        const [succesfull, paymentMSG] =
            direction === "send"
                ? PlayerClass.sendMoney(customer, bank, amount)
                : PlayerClass.sendMoney(bank, customer, amount);

        if (!succesfull) {
            // eslint-disable-next-line no-undef
            M.toast({
                html: paymentMSG,
                classes: "rounded red black-text",
            });
            return;
        }

        let clone = players.map((player) => {
            if (player.id === customer.id) {
                return customer;
            }

            return player;
        });

        setPlayers([...clone]);

        // eslint-disable-next-line no-undef
        M.toast({
            html: paymentMSG,
            classes: "rounded green  black-text",
        });
    };

    return (
        <div className="row">
            <div className="col l3 offset-l1 s4 ">
                <div className="card cardColor-pay ">
                    <div className="card-content white-text">
                        {/* Title */}

                        <div className="section">
                            <div className="card-title yellow-text text-darken-2 center title">
                                Customer
                            </div>
                        </div>

                        <PlayerList players={players} type={"Customer"} />
                    </div>
                </div>
            </div>

            <div className="col l2 offset-l1 s4">
                <div className="card cardColor-pay ">
                    <div className="card-content white-text">
                        {/* Title */}
                        <div className="section">
                            <div className="card-title white-text center title">
                                Amount
                            </div>
                        </div>

                        <div className="row smallRow">
                            <div className="input-field col l10 offset-l1 s10 offset-s1  ">
                                <input
                                    id="first_name"
                                    type="text"
                                    className="validate"
                                    autoComplete="off"
                                    ref={amountRef}
                                />
                                <label htmlFor="first_name">Amount</label>
                            </div>
                        </div>

                        <div className="row center paddingBot">
                            <button
                                className=" btn-large btn-large-amount waves-effect waves-light red darken-2"
                                type="submit"
                                onClick={() => {
                                    transfer("send");
                                }}
                            >
                                Send
                                <i className="material-icons right hide-on-small-only ">
                                    keyboard_double_arrow_right
                                </i>
                            </button>
                        </div>
                        <div className="row center paddingBot">
                            <button
                                className=" btn-large btn-large-amount waves-effect waves-light green darken-1"
                                type="submit"
                                onClick={() => {
                                    transfer("receive");
                                }}
                            >
                                Receive
                                <i className="material-icons right hide-on-small-only ">
                                    keyboard_double_arrow_left
                                </i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col l3 offset-l1 s4 ">
                <div className="card cardColor-pay ">
                    <div className="card-content white-text">
                        {/* Title */}

                        <div className="section">
                            <div className="card-title  center title">Bank</div>
                        </div>

                        <div className="row center">
                            <div className=" col l12">
                                <img
                                    className="bankImg"
                                    src={BankImg}
                                    alt="Bank"
                                />
                            </div>
                        </div>
                        <div className="row paddingBot center">
                            <div className="col l4 offset-l2">
                                <button
                                    className=" btn-large  waves-effect waves-light blue darken-1"
                                    type="submit"
                                    onClick={() => {
                                        transfer("receive", "5M");
                                    }}
                                >
                                    <strong>5 M </strong>
                                    <i className="material-icons left hide-on-small-only ">
                                        keyboard_double_arrow_left
                                    </i>
                                </button>
                            </div>
                            <div className="col l4 ">
                                <button
                                    className=" btn-large  waves-effect waves-light purple lighten-1"
                                    type="submit"
                                    onClick={() => {
                                        transfer("receive", "7M");
                                    }}
                                >
                                    <strong>7 M </strong>
                                    <i className="material-icons left hide-on-small-only ">
                                        keyboard_double_arrow_left
                                    </i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
