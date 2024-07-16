import express, { Request, Response, Application } from "express";
import animeIndo from "./src/routes/animeindoRoute";
import cors from "cors";
import limiter from "./src/middleware/rateLimit";
import "dotenv/config";

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(limiter);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
    exposedHeaders: ["Authorization"],
    methods: ["GET"],
  })
);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Express & TypeScript Server",
    route: "Go to our route /api/v1/anime",
  });
});

app.use("/api/v2/anime", animeIndo);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
