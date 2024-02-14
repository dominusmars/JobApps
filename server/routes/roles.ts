import { Router } from "express";
import db from "../database/data";
import { roleRequest } from "../database/datatypes";

let roles = Router();

roles.get("/", async (req, res) => {
    res.json(await db.getRoles());
});

roles.post("/create", async (req, res) => {
    let roleRequest: roleRequest = req.body;
    let role = await db.createRole(roleRequest);
    if (typeof role === "string") res.status(500).json({ error: role });
    else res.json(role);
});
roles.post("/delete", async (req, res) => {
    let ids = req.body;
    if (typeof ids !== "object") {
        res.json({ error: "Unable to get IDs" });
        return;
    }
    let errors = [];
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        let role = await db.deleteRole(id);
        if (typeof role === "string") errors.push(role);
    }
    if (errors.length > 0) {
        return res.json({ error: errors });
    }
    res.json(true);
});
roles.post("/delete/:id", async (req, res) => {
    let { id } = req.params;
    if (!id) {
        res.json({ error: "Unable to get ID" });
        return;
    }
    let role = await db.deleteRole(id);
    if (typeof role === "string") res.json({ error: role });
    else res.json(role);
});

roles.post("/update/:id", async (req, res) => {
    let { id } = req.params;
    if (!id) {
        res.json({ error: "Unable to get ID" });
        return;
    }
    let role = await db.updateRole(id, req.body);
    if (typeof role === "string") res.json({ error: role });
    else res.json(role);
});
roles.get("/:id", async (req, res) => {
    let { id } = req.params;
    if (!id) {
        res.status(404).json({ error: "Unable to get ID" });
        return;
    }
});

export default roles;
