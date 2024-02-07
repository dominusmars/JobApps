import { Router } from "express";
import db from "../database/data";
import { applicationRequest } from "../database/datatypes";
const application = Router();

var statues = ["created", "pending", "rejected", "accepted", "in review", "interview"];
application.get("/", async (req, res) => {
    res.json(await db.getApplications());
});
application.post("/create", async (req, res) => {
    let appRequest: applicationRequest = req.body;

    let app = await db.createApplication(appRequest);
    if (typeof app === "string") res.json({ error: app });
    else res.json(app);
});
application.post("/delete", async (req, res) => {
    let ids = req.body;
    console.log(ids);
    if (typeof ids !== "object") {
        res.json({ error: "Unable to get IDs" });
        return;
    }
    let errors = [];
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        let app = await db.deleteApplication(id);
        if (typeof app === "string") errors.push(app);
    }
    if (errors.length > 0) {
        return res.json({ error: errors });
    }
    res.json(true);
});
application.post("/delete/:id", async (req, res) => {
    let { id } = req.params;
    if (!id) {
        res.json({ error: "Unable to get ID" });
        return;
    }
    let app = await db.deleteApplication(id);
    if (typeof app === "string") res.json({ error: app });
    else res.json(app);
});
application.post("/update/status/:id", async (req, res) => {
    let { status } = req.body;
    let { id } = req.params;
    if (!id) {
        res.status(500).json({ error: "Unable to get ID" });
        return;
    }
    if (!status || !statues.includes(status)) {
        res.status(500).json({ error: "Invalid Status" });
        return;
    }
    let app = await db.updateStatus(id, status);
    if (typeof app === "string") res.status(500).json({ error: app });
    else res.json(app);
});
application.post("/update/:id", async (req, res) => {
    let { id } = req.params;
    if (!id) {
        res.json({ error: "Unable to get ID" });
        return;
    }

    let { url, username, password, description, dateExpire } = req.body;
    let app = await db.updateApplication(id, url, username, password, description, dateExpire);
    if (typeof app === "string") res.json({ error: app });
    else res.json(app);
});
application.get("/:id", async (req, res) => {
    let { id } = req.params;
    if (!id) {
        res.json({ error: "Unable to get ID" });
        return;
    }
    let app = await db.getAppByID(id);
    if (typeof app === "string") res.json({ error: app });
    else res.json(app);
});

export default application;
