import { Level } from "level";
import os from "os";
import path from "path";
import fs from "fs";
import { application, applicationRequest, role, roleRequest } from "./datatypes";
import { AbstractSublevel } from "level/node_modules/abstract-level";
import { randomUUID } from "crypto";
import { delay, getDate, normalizeName } from "../../applications/src/modules/util";
import EventEmitter from "events";

class Database extends EventEmitter {
    _path: string;
    levelDB: Level<string, any>;
    applications: AbstractSublevel<Level<string, application>, string | Buffer | Uint8Array, string, application>;
    ready: boolean;
    roles: AbstractSublevel<Level<string, role>, string | Buffer | Uint8Array, string, role>;
    constructor() {
        super();
        this._path = process.env.NODE_ENV === "development" ? path.join(process.cwd(), "data") : path.join(os.homedir(), "applications");
        if (!fs.existsSync(this._path)) {
            fs.mkdirSync(this._path, {
                recursive: true,
            });
        }
        this.levelDB = new Level(this._path);
        this.applications = this.levelDB.sublevel("apps", { valueEncoding: "json" });
        this.roles = this.levelDB.sublevel("roles", { valueEncoding: "json" });

        this.ready = false;
        this.init();
    }
    async init() {
        await this.levelDB.open();
        this.applications = this.levelDB.sublevel("apps", { valueEncoding: "json" });
        this.roles = this.levelDB.sublevel("roles", { valueEncoding: "json" });

        this.ready = true;
        this.emit("ready");
    }

    async getApplications(): Promise<application[]> {
        if (!this.ready) {
            await delay(100);
            return await this.getApplications();
        }
        let applications: application[] = [];
        for await (const key of this.applications.keys()) {
            // type script returning a boolean by default :(
            const value = await this.applications.get(key).catch(() => "");
            if (typeof value === "string") continue;
            applications.push(value);
        }
        applications.sort((a, b) => {
            return a.company.localeCompare(b.company);
        });
        return applications;
    }
    async getAppByID(id: string): Promise<application | string> {
        if (!this.ready) {
            await delay(100);
            return await this.getAppByID(id);
        }
        const value = await this.applications.get(id).catch(() => "Unable to Find Application");
        if (typeof value === "string") return value;
        return value;
    }
    async deleteApplication(id: string) {
        const app = await this.getAppByID(id);
        if (typeof app == "string") return app;
        let res = await this.applications.del(id).catch(() => "Unable to Delete Application");
        if (typeof res === "string") return res;
        return true;
    }
    async updateStatus(id: string, status: application["status"]) {
        let app = await this.getAppByID(id);
        if (typeof app == "string") return app;
        app.status = status || app.status;
        return this.saveApp(app);
    }
    async saveApp(app: application) {
        const result = await this.applications.put(app.id, app).catch(() => "Unable to Save Application");
        if (typeof result == "string") return result;
        return true;
    }
    async updateApplication(
        id: string,
        url: string | undefined,
        username: string | undefined,
        password: string | undefined,
        description: string | undefined,
        dateExpire: string | undefined
    ) {
        let app = await this.getAppByID(id);
        if (typeof app == "string") return app;
        app.url = url || app.url;
        app.username = username || app.username;
        app.password = password || app.password;
        app.description = description || app.description;
        app.dateExpire = (dateExpire && getDate(dateExpire)) || app.dateExpire;
        return this.saveApp(app);
    }
    async createApplication(request: applicationRequest): Promise<boolean | string> {
        if (!request.company || !request.position || !request.job_type || !request.description || !request.location) return "Invalid Request";
        let app: application = {
            id: makeID(),
            company: normalizeName(request.company),
            position: normalizeName(request.position),
            description: request.description,
            job_type: request.job_type,
            dateCreated: getDate(),
            url: request.url ? request.url : "null",
            username: request.username || "null",
            password: request.password || "null",
            dateExpire: request.dateExpire || "null",
            status: "created",
            location: request.location,
        };
        const result = await this.applications.put(app.id, app).catch(() => "Unable to Create Application");
        if (typeof result == "string") return result;
        return true;
    }
    async getRoles(): Promise<role[]> {
        if (!this.ready) {
            await delay(100);
            return await this.getRoles();
        }
        let roles: role[] = [];
        for await (const key of this.roles.keys()) {
            // type script returning a boolean by default :(
            const value = await this.roles.get(key).catch(() => "");
            if (typeof value === "string") continue;
            roles.push(value);
        }
        roles.sort((a, b) => {
            return a.start.localeCompare(b.start);
        });
        return roles;
    }

    async createRole(request: roleRequest): Promise<boolean | string> {
        if (!request.company || !request.position || !request.start || !request.description || !request.location) return "Invalid Request";

        let role: role = {
            id: makeID(),
            company: request.company,
            position: request.position,
            description: request.description,
            location: request.location,
            start: request.start,
            end: request.end || "null",
            current: request.current,
            dateCreated: getDate(),
        };
        const result = await this.roles.put(role.id, role).catch(() => "Unable to Create Application");
        if (typeof result == "string") return result;
        return true;
    }
    async saveRole(role: role) {
        const result = await this.roles.put(role.id, role).catch(() => "Unable to Save Application");
        if (typeof result == "string") return result;
        return true;
    }
    async getRoleById(id: string): Promise<role | string> {
        if (!this.ready) {
            await delay(100);
            return await this.getRoleById(id);
        }
        const value = await this.roles.get(id).catch(() => "Unable to Find Role");
        if (typeof value === "string") return value;
        return value;
    }
    async deleteRole(id: string) {
        const role = await this.getRoleById(id);
        if (typeof role == "string") return role;
        let res = await this.roles.del(id).catch(() => "Unable to Delete Role");
        if (typeof res === "string") return res;
        return true;
    }
    async updateRole(
        id: string,
        options: {
            description: string | undefined;
            location: string | undefined;
            start: string | undefined;
            end: string | undefined;
            current: boolean | undefined;
        }
    ) {
        let role = await this.getRoleById(id);
        if (typeof role === "string") return role;

        role.description = options.description || role.description;
        role.location = options.location || role.location;
        role.start = options.start || role.start;
        role.end = options.end || role.end;
        role.current = typeof options.current == "boolean" ? options.current : role.current;
        return this.saveRole(role);
    }
}

function makeID() {
    return randomUUID();
}

const db = new Database();

export default db;
