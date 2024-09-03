import express, { Request, Response } from "express";

require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/customers", async (req: Request, res: Response) => {
  const customers = [
    { name: "Jane Doe", email: "jane.doe@example.com", phone: "2121234567" },
    { name: "Joe Clark", email: "joe.clark@example.com", phone: "2121234567" },
  ];
  return res.status(200).json(customers);
});
