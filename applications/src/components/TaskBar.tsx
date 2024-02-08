import React, { Dispatch, useEffect, useState } from "react";
import "./TaskBar.css";
import { application } from "../database/datatypes";
function TaskBar({
    AppId,
    OpenApp,
    delApp,
    Applications,
    setApplications,
}: {
    AppId: string[] | string;
    OpenApp: () => void;
    delApp: () => Promise<void>;
    Applications: application[];
    setApplications: Dispatch<React.SetStateAction<application[]>>;
}) {
    const [filter, setFilter] = useState({
        jobType: "all",
        status: "all",
        company: "all",
        location: "all",
    });

    useEffect(() => {
        setApplications(
            Applications.filter(
                (app) =>
                    (filter.jobType === "all" || app.job_type === filter.jobType) &&
                    (filter.status === "all" || app.status === filter.status) &&
                    (filter.company === "all" || app.company.toLowerCase() === filter.company) &&
                    (filter.location === "all" || app.location.toLowerCase() === filter.location)
            )
        );
    }, [Applications, filter, setApplications]);

    const handleFilterChange = (e: any) => {
        const { name, value } = e.target;
        let currFilter = { ...filter, [name]: value };

        setFilter(currFilter);
    };

    let companyList = Array.from(new Set(Applications.map((app) => app.company)));
    let locationList = Array.from(new Set(Applications.map((app) => app.location)));

    return (
        <div className="Task-Bar-Container">
            {/* <div className="Task-button">Select All Job App</div> */}
            <div className="Task-button Task-add-button" onClick={() => OpenApp()}>
                Add Job App
            </div>
            <div className="Task-button Task-del-button" onClick={() => delApp()}>
                Del Job App
            </div>
            <div className="Task-Filter">
                <label>
                    Filter by Location:
                    <select name="location" value={filter.location} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        {locationList.map((v) => {
                            return <option value={v.toLowerCase()}>{v}</option>;
                        })}
                    </select>
                </label>
            </div>
            <div className="Task-Filter">
                <label>
                    Filter by Company:
                    <select name="company" value={filter.company} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        {companyList.map((v) => {
                            return <option value={v.toLowerCase()}>{v}</option>;
                        })}
                    </select>
                </label>
            </div>
            <div className="Task-Filter">
                <label>
                    Filter by Job Type:
                    <select name="jobType" value={filter.jobType} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="part time">Part Time</option>
                        <option value="full time">Full Time</option>
                        <option value="internship">Internship</option>
                    </select>
                </label>
            </div>
            <div className="Task-Filter">
                <label>
                    Filter by Status:
                    <select name="status" value={filter.status} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="created">Created</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                        <option value="accepted">Accepted</option>
                        <option value="in review">In Review</option>
                        <option value="interview">Interview</option>
                    </select>
                </label>
            </div>
        </div>
    );
}

export default TaskBar;
