import React, { Dispatch, useState } from "react";
import { application } from "../database/datatypes";
import "./JobApp.css";
import SmallInput from "./SmallInput";

function JobApp({
    app,
    clipboardNotification,
    selectApp,
    selected,
    index,
    updateStatus,
    updateAppValue,
}: {
    app: application;
    selectApp: (appid:string) => Promise<void>;
    selected: string[] | string;
    clipboardNotification: Dispatch<React.SetStateAction<string | boolean>>;
    index: number;
    updateStatus(appid: string, status: application["status"]): Promise<void>;
    updateAppValue(appid: string, name: string, value: string): Promise<void>;
}) {
    const [InputElement, setInputElement] = useState("");
    async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
        e.preventDefault();
        const { value } = e.target;
        updateStatus(app.id, value as application["status"]);
    }

    async function updateApp(value: string) {
        await updateAppValue(app.id, InputElement, value);
        setInputElement("");
    }

    function dateToString(dateStringISO: string) {
        if (dateStringISO === "null") return "None";
        // Create a new Date object from the ISO string
        const date = new Date(dateStringISO);

        // Extract the month, day, and year components from the Date object
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
        const day = date.getDate().toString().padStart(2, "0");
        const year = date.getFullYear().toString();

        // Construct the mm-dd-year format
        const mmddyyyyFormat = `${month}-${day}-${year}`;

        return mmddyyyyFormat;
    }
    function copyToClip(value: string) {
        navigator.clipboard.writeText(value);
        clipboardNotification("Copied")
    }


    return (    
        <div
            className={"job-app " + (selected === app.id || selected?.includes(app.id) ? "selected" : "") + (index % 2 === 0 ? "" : " job-app-odd")}
            onClick={() => {
                selectApp(app.id);
            }}
        >
            <div>{app.company}</div>
            <div>{app.position}</div>
            <div>{app.job_type}</div>
            <div>{app.location}</div>
            {InputElement !== "url" ? (
                <div
                    onDoubleClick={() => {
                        setInputElement("url");
                    }}
                    onClick={() => copyToClip(app.url)}
                >
                    {app.url}
                </div>
            ) : (
                <SmallInput submit={updateApp} onClose={async () => setInputElement("")} />
            )}
            {InputElement !== "username" ? (
                <div
                    onDoubleClick={() => {
                        setInputElement("username");
                    }}
                    onClick={() => copyToClip(app.username)}
                >
                    {app.username}
                </div>
            ) : (
                <SmallInput submit={updateApp} onClose={async () => setInputElement("")} />
            )}
            {InputElement !== "password" ? (
                <div
                    onDoubleClick={() => {
                        setInputElement("password");
                    }}
                    onClick={() => copyToClip(app.password)}
                >
                    {app.password}
                </div>
            ) : (
                <SmallInput submit={updateApp} onClose={async () => setInputElement("")} />
            )}
            <select name="status" value={app.status} onChange={handleStatusChange}>
                <option value="created">Created</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
                <option value="in review">In Review</option>
                <option value="interview">Interview</option>
            </select>
            {InputElement !== "dateExpire" ? (
                <div
                    onDoubleClick={() => {
                        setInputElement("dateExpire");
                    }}
                >
                    {dateToString(app.dateExpire)}
                </div>
            ) : (
                <SmallInput inputText="date" submit={updateApp} onClose={async () => setInputElement("")} />
            )}
            {InputElement !== "description" ? (
                <div
                    onDoubleClick={() => {
                        setInputElement("description");
                    }}
                >
                    {app.description}
                </div>
            ) : (
                <SmallInput submit={updateApp} onClose={async () => setInputElement("")} />
            )}
        </div>
    );
}

export default JobApp;
