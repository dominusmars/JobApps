import express from "express";
import db from "./database/data";
import path from "path";
import application from "./routes/applications";
import role from "./routes/roles";
import morgan from "morgan";
const PORT = process.env.PORT || 3001;

const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded());
process.env.NODE_ENV === "development" || app.use(express.static(path.resolve(__dirname, "../../applications/build")));
app.use("/applications", application);
app.use("/roles", role);
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});
app.get("/");

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
