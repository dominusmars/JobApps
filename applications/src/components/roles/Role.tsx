import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { role } from "../../database/datatypes";
import "./Role.css";
import SmallInput from "../misc/SmallInput";
import Input from "../misc/Input";
type RoleProp = {
    role: role;
    save: (role: role) => Promise<void>;
    del: (role: role) => Promise<void>;
};

function Role({ role, save, del }: RoleProp) {
    const [Role, setRole]: [role, Dispatch<SetStateAction<role>>] = useState(role);
    const [InputElement, setInputElement] = useState("");
    useEffect(() => {
        setRole(role);
    }, [role]);
    async function updateRoleState(value: string) {
        setRole({ ...Role, [InputElement]: value });
    }
    async function updateCheck(value: string | boolean) {
        if (typeof value == "string") return;
        setRole({ ...Role, current: !Role.current });
    }
    async function CloseInput() {
        setInputElement("");
    }

    return (
        <div className="Role">
            <div className="info">
                <div className="title">{"Position: "}</div>
                <div className="info">{Role.position}</div>
            </div>
            <div className="info">
                <div className="title">{"Company: "}</div>
                <div className="info">{Role.company}</div>
            </div>
            <div className="info">
                <div className="title">{"Location: "}</div>
                <div className="info">{Role.location}</div>
            </div>
            <div className="dates">
                <div className="info">
                    <div className="title">{"Start: "}</div>
                    {InputElement === "start" ? (
                        <SmallInput classname="input" inputText="date" submit={updateRoleState} onClose={CloseInput} />
                    ) : (
                        <div
                            className="info"
                            onDoubleClick={() => {
                                setInputElement("start");
                            }}
                        >
                            {Role.start}
                        </div>
                    )}
                </div>
                {!Role.current && (
                    <div className="info">
                        <div className="title">{"End: "}</div>
                        {InputElement === "end" ? (
                            <SmallInput classname="input" inputText="date" submit={updateRoleState} onClose={CloseInput} />
                        ) : (
                            <div
                                className="info"
                                onDoubleClick={() => {
                                    setInputElement("end");
                                }}
                            >
                                {Role.end}
                            </div>
                        )}
                        {/* <div className="info">{Role.end}</div> */}
                    </div>
                )}

                <div className="info">
                    <div className="title">{"Current: "}</div>
                    <Input classname="checkbox" initialValue={Role.current} inputText="checkbox" submit={updateCheck} />
                </div>
            </div>

            <div className="info">
                <div className="title">{"Description: "}</div>
                {InputElement === "description" ? (
                    <SmallInput classname="input" submit={updateRoleState} onClose={CloseInput} />
                ) : (
                    <div
                        onDoubleClick={() => {
                            setInputElement("description");
                        }}
                    >
                        {Role.description}
                    </div>
                )}
            </div>

            <div className="buttons">
                <div
                    className="save"
                    onClick={() => {
                        save(Role);
                    }}
                >
                    Save
                </div>
                <div className="delete" onClick={() => del(Role)}>
                    Delete
                </div>
            </div>
        </div>
    );
}

export default Role;
