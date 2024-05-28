import express from 'express'
import bodyParser from "body-parser";
import {connectDB} from './util/db';
import RegistrationRoutes from "./routes/RegistrationRoutes";

const app = express();

console.log("Connected to db... proobably")
connectDB()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err.message);
    });

app.use(bodyParser.json());

app.use("/api", RegistrationRoutes);

const PORT = process.env.NODE_ENV === 'test' ? 3001 : (process.env.PORT || 3000);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

export default app;
