import React, { useEffect, useState } from "react";

import "./SpectateMenu.css";

import BottomBar from "../../components/bottomBar/BottomBar";
const CircularJSON = require("circular-json");

export default function SpectateMenu({
    socket,
    socketConnected,
    spectateID,
    setSpectateID,
}) {
    const [submitedPlayers, setSubmitedPlayers] = useState([]);

    //Rerender Materialize on rerender
    useEffect(() => {
        setTimeout(() => {
            // eslint-disable-next-line no-undef
            M.updateTextFields();
        }, 200);
    });

    useEffect(() => {
        var modalElems = document.querySelectorAll(".modal");
        // eslint-disable-next-line no-undef
        M.Modal.init(modalElems, {});
    }, []);

    const submitForm = (e) => {
        e.preventDefault();
        const groupID = e.target[0].value;

        socket.emit("changeRoom", groupID);
        socket.emit("requestData", groupID);
        e.target[0].value = "";
        closeModal();
        setSpectateID(groupID);
    };

    useEffect(() => {
        if (socket) {
            const dataListener = (data) => {
                var players = CircularJSON.parse(data.playersJSON);
                setSubmitedPlayers(players);
            };

            socket.on("Data", dataListener);

            return () => {
                socket.off("Data", dataListener);
            };
        }
    }, [socket, spectateID]);

    useEffect(() => {
        if (socket && spectateID !== "/") {
            socket.emit("changeRoom", spectateID);
            socket.emit("requestData", spectateID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const closeModal = () => {
        var modalElems = document.querySelectorAll("#settingsModal");
        modalElems.forEach((elem) => {
            // eslint-disable-next-line no-undef
            var instance = M.Modal.getInstance(elem);
            instance.close();
        });
    };

    return (
        <>
            <div className="row center">
                <div className="row ">
                    <a
                        className="waves-effect waves-light btn modal-trigger marginTop orange darken-2 black-text"
                        href="#settingsModal"
                    >
                        Settings
                    </a>
                </div>
            </div>

            <div id="settingsModal" className="modal">
                <div className="modal-content   cardColor-main">
                    <div className="col l6 offset-l3 m8 offset-m2 s12 ">
                        <h4 className="center orange-text padding10">
                            {spectateID === "/"
                                ? "No Listening ID given"
                                : `Listening on Game-ID: ${spectateID}`}
                        </h4>

                        <div className="row">
                            {!socketConnected || !socket ? (
                                <h5 className="center white-text">
                                    Error: Socket not connected
                                </h5>
                            ) : (
                                <div className="col l10 offset-l1 m8 offset-m2 s12 ">
                                    <form
                                        className="padding10"
                                        onSubmit={submitForm}
                                    >
                                        <div className="input-field col l5 offset-l3 m7 offset-m2 s8 offset-s1">
                                            <input
                                                autoComplete="off"
                                                id="listeingID"
                                                type="number"
                                                className="validate"
                                            />
                                            <label htmlFor="listeingID">
                                                Enter Listening ID
                                            </label>
                                        </div>

                                        <div className="input-field col s2 ">
                                            <button
                                                className=" btn-small waves-effect waves-light yellow darken-4 "
                                                type="submit"
                                                name="action"
                                            >
                                                <i className="material-icons right noMargin ">
                                                    send
                                                </i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <BottomBar players={submitedPlayers} />
        </>
    );
}
