import React, { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { application, applicationRequest } from "./database/datatypes";
import JobApp from "./components/JobApp";
import TaskBar from "./components/TaskBar";
import AddJobApplicationModal from "./components/AddJobApp";
import ClipboardNotification from "./components/ClipboardNotification";
function App() {
    const [Applications, setApplications]: [application[], Dispatch<SetStateAction<application[]>>] = useState([] as application[]);
    const [FilteredApplications, setFilteredApplications]: [application[], Dispatch<SetStateAction<application[]>>] = useState([] as application[]);
    const [AddModel, setAddModel] = useState(false);
    const [Clip, setClip]:[boolean | string, Dispatch<SetStateAction<boolean | string>>] = useState(false as boolean |string);
    const [AppId, setAppId]:[string[] | string, Dispatch<SetStateAction<string[] | string>>] = useState("" as string[] | string);
    const [AltKey, setAltKey] = useState(false);

    const handleKeyDown = (event: KeyboardEvent) => {
        console.log(event)
        if (event.key === 'Alt') {
           !AltKey && setAltKey(true);
        }
      };
    
      const handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'Alt') {
            !!AltKey && setAltKey(false);
        }
      };
    
    useEffect(() => {
        getApplications();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    async function getApplications() {
        let apps = await axios.get("/applications");
        setApplications(apps.data);
    }

    useEffect(() => {
        setFilteredApplications(Applications);
    }, [Applications]);

    async function delApp() {
        if (AppId === "") return;
        await axios.post("/applications/delete/" + AppId);
        await getApplications();
    }
    async function addApp(value: applicationRequest) {
        await axios.post("/applications/create", value);
        await getApplications();
    }
    async function updateStatus(appid: string, status: application["status"]) {
        await axios.post("/applications/update/status/" + appid, {
            status: status,
        });
        await getApplications();
    }
    async function updateAppValue(appid: string, name: string, value: string) {
        await axios.post("/applications/update/" + appid, {
            [name]: value,
        });
        await getApplications();
    }

    async function selectAppID(appID:string){
        console.log(AltKey)
        if(AltKey){
            if(typeof appID === 'string') setAppId([appID])
            else setAppId([...AppId, appID])
        }else setAppId(appID)
    }

    return (
        <div className="App">
            {AddModel && (
                <AddJobApplicationModal
                    onClose={() => {
                        setAddModel(false);
                    }}
                    onSubmit={addApp}
                />
            )}
            {Clip && <ClipboardNotification message={typeof Clip === 'string' ? Clip: "Unknown"} setIsVisible={setClip} />}
            <div className="header">
                <h1>Job Applications</h1>
                <TaskBar
                    AppId={AppId}
                    OpenApp={() => setAddModel(true)}
                    delApp={delApp}
                    Applications={Applications}
                    setApplications={setFilteredApplications}
                />
            </div>

            <div className="job-app-container">
                <div className={"job-app jobs-title"}>
                    <div>Company</div>
                    <div>Position</div>
                    <div>Job Type</div>
                    <div>Location</div>
                    <div>Url</div>
                    <div>Username</div>
                    <div>Password</div>
                    <div>Status</div>
                    <div>Date Expired</div>
                    <div>Description</div>
                </div>
                {FilteredApplications.map((value, k) => {
                    return (
                        <JobApp
                            app={value}
                            clipboardNotification={setClip}
                            selectApp={selectAppID}
                            selected={AppId}
                            index={k}
                            updateStatus={updateStatus}
                            updateAppValue={updateAppValue}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default App;
