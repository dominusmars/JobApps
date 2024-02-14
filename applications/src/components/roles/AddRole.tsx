import React, { Dispatch, SetStateAction, useState } from "react";
import { role } from "../../database/datatypes";
import "./Role.css";
import SmallInput from "../misc/SmallInput";
import Input from "../misc/Input";
type RoleProp = {
    save: (role: role) => Promise<void>;
};

function AddRole({ save }: RoleProp) {
    const [Role, setRole]: [role, Dispatch<SetStateAction<role>>] = useState({
        id: "",
        position: "",
        company: "",
        location: "",
        description: "",
        start: "",
        end: "",
        dateCreated: "",
        current: false as boolean,
    });

    async function updateRoleState(name: string, value: string) {
        console.log(value);
        setRole({ ...Role, [name]: value });
    }
    async function updateCheck(value: string | boolean) {
        console.log(value);
        if (typeof value == "string") return;
        setRole({ ...Role, current: !Role.current });
    }
    async function CloseInput() {}

    return (
        <div className="Role">
            <div className="info">
                <div className="title">{"Position: "}</div>
                <SmallInput
                    classname="input"
                    inputText="text"
                    onChange={async (value) => {
                        updateRoleState("position", value);
                    }}
                    onClose={CloseInput}
                />
                {/* <div className="info">{Role.position}</div> */}
            </div>
            <div className="info">
                <div className="title">{"Company: "}</div>{" "}
                <SmallInput
                    classname="input"
                    onChange={async (value) => {
                        updateRoleState("company", value);
                    }}
                    inputText="text"
                    onClose={CloseInput}
                />
                {/* <div className="info">{Role.company}</div> */}
            </div>
            <div className="info">
                <div className="title">{"Location: "}</div>
                <SmallInput
                    classname="input"
                    onChange={async (value) => {
                        updateRoleState("location", value);
                    }}
                    inputText="text"
                    onClose={CloseInput}
                />
            </div>
            <div className="dates">
                <div className="info">
                    <div className="title">{"Start: "}</div>
                    <SmallInput
                        classname="input"
                        onChange={async (value) => {
                            updateRoleState("start", value);
                        }}
                        inputText="date"
                        onClose={CloseInput}
                    />
                </div>
                {!Role.current && (
                    <div className="info">
                        <div className="title">{"End: "}</div>
                        <SmallInput
                            classname="input"
                            inputText="date"
                            onChange={async (value) => {
                                updateRoleState("end", value);
                            }}
                            onClose={CloseInput}
                        />

                        {/* <div className="info">{Role.end}</div> */}
                    </div>
                )}

                <div className="info">
                    <div className="title">{"Current: "}</div>
                    <Input classname="checkbox" initialValue={Role.current} inputText="checkbox" submit={updateCheck} />
                    {/* <div className="checkbox">{Role.current}</div> */}
                </div>
            </div>

            <div className="info">
                <div className="title">{"Description: "}</div>
                <SmallInput
                    classname="input"
                    onChange={async (value) => {
                        updateRoleState("description", value);
                    }}
                    onClose={CloseInput}
                />
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
            </div>
        </div>
    );
}

export default AddRole;
