import axios from "axios";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { role } from "../database/datatypes";
import "./Roles.css";
import Role from "../components/roles/Role";
import AddRole from "../components/roles/AddRole";
import TaskBar from "../components/roles/TaskBar";
function Roles() {
    const [Roles, setRoles]: [role[], Dispatch<SetStateAction<role[]>>] = useState([] as role[]);
    const [OpenAdd, setOpenAdd] = useState(false);
    useEffect(() => {
        getRoles();
    }, []);
    async function getRoles() {
        let roles = await axios.get("/roles");
        setRoles(roles.data);
    }

    async function saveRole(role: role) {
        await axios.post("/roles/update/" + role.id, role);
        await getRoles();
    }
    async function delRole(role: role) {
        await axios.post("/roles/delete/" + role.id);
        await getRoles();
    }

    async function addRole(role: role) {
        await axios.post("/roles/create", role);
        await getRoles();
        setOpenAdd(false);
    }

    return (
        <div className="Roles">
            <div className="header">
                <h1>Roles</h1>
                <TaskBar />
            </div>

            <div className="role-container">
                {Roles.map((role, i) => (
                    <Role key={i} save={saveRole} role={role} del={delRole}></Role>
                ))}
                {OpenAdd && <AddRole save={addRole} />}
            </div>

            <div className="add-container">
                <div className="button" onClick={() => setOpenAdd(!OpenAdd)}>
                    {OpenAdd ? "-" : "+"}
                </div>
            </div>
        </div>
    );
}

export default Roles;
