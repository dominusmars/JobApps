import React from "react";
import "../TaskBar.css";
import { Link } from "react-router-dom";
function TaskBar() {
    return (
        <div className="Task-Bar-Container">
            {/* <div className="Task-button">Select All Job App</div> */}
            <Link to="/" className="Task-button">
                Job Apps
            </Link>
        </div>
    );
}

export default TaskBar;
