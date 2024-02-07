import { Level } from "level";
import os from "os"
import path from 'path'
import fs from 'fs'
import { application, applicationRequest } from "./datatypes";
import {AbstractSublevel} from 'level/node_modules/abstract-level'
import { randomUUID } from "crypto";
import {delay, getDate, normalizeName} from '../../applications/src/modules/util'
import EventEmitter from "events";


class Database extends EventEmitter{
    _path: string;
    levelDB: Level<string, any>;
    applications: AbstractSublevel<Level<string, application>, string | Buffer | Uint8Array, string, application>;
    ready: boolean;
    constructor(){
        super();
        this._path = process.env.NODE_ENV === 'development' ? path.join(process.cwd(),"data" ): path.join(os.homedir(), "applications");
        if(!fs.existsSync(this._path)){
            fs.mkdirSync(this._path, {
                'recursive':true,
            })
        }
        this.levelDB = new Level(this._path)
        this.applications = this.levelDB.sublevel("apps", { valueEncoding: "json" });
        this.ready = false;
        this.init()
    }
    async init(){
        await this.levelDB.open()
        this.applications = this.levelDB.sublevel("apps",{ valueEncoding: "json" });
        this.ready = true;
        this.emit("ready")
    }

    async getApplications(): Promise<application[]>{
        if(!this.ready) {
            await delay(100);
            return await this.getApplications();
        }
        let applications: application[] = [];
        for await(const key of this.applications.keys()){
            // type script returning a boolean by default :(
            const value = await this.applications.get(key).catch(()=> '');
            if(typeof value === 'string') continue
            applications.push(value);
        }
        applications.sort((a,b)=>{
            return a.company.localeCompare(b.company)
        })
        return applications;
    }
    async getAppByID(id:string): Promise<application |string>{
        if(!this.ready) {
            await delay(100);
            return await this.getAppByID(id);
        }
        const value = await this.applications.get(id).catch(()=> 'Unable to Find Application');
        if(typeof value === 'string') return value;
        return value
    }
    async deleteApplication(id:string){
        const app = await this.getAppByID(id);
        if(typeof app =='string') return app;
        let res = await this.applications.del(id).catch(()=> "Unable to Delete Application");
        if(typeof res === 'string') return res;
        return true;
    }
    async updateStatus(id:string, status:application["status"]){
        let app = await this.getAppByID(id);
        if(typeof app =='string') return app;
        app.status = status || app.status
        return this.saveApp(app);

    }
    async saveApp(app:application){
        const result =  await this.applications.put(app.id, app).catch(()=> "Unable to Save Application");
        if(typeof result == 'string') return result;
        return true;
    }
    async updateApplication(id:string, url:string | undefined, username:string| undefined, password:string| undefined, description:string| undefined,dateExpire:string| undefined){
        let app = await this.getAppByID(id);
        if(typeof app =='string') return app;
        app.url = url || app.url;
        app.username = username || app.username;
        app.password = password || app.password;
        app.description = description || app.description;
        app.dateExpire =(dateExpire && getDate(dateExpire)) || app.dateExpire;
        return this.saveApp(app);
    }
    async createApplication(request:applicationRequest):Promise<boolean |string>{
        if(!request.company || !request.position || !request.job_type || !request.description || !request.location) return "Invalid Request";
        let app:application = {
            id:makeID(),
            company:normalizeName(request.company),
            position: normalizeName(request.position),
            description: request.description,
            job_type: request.job_type,
            dateCreated: getDate(),
            url: request.url? request.url: "null",
            username:request.username || "null",
            password: request.password || "null",
            dateExpire: request.dateExpire || "null",
            status: "created",
            location: request.location,

        }
        const result =  await this.applications.put(app.id, app).catch(()=> "Unable to Create Application");
        if(typeof result == 'string') return result;
        return true;
    }


}


function makeID(){
    return randomUUID();
}


const db = new Database();


export default db;