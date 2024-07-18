import express, { Request, Response, Application } from "express";
import animeIndo from "./src/routes/animeindoRoute";
import cors from "cors";
import limiter from "./src/middleware/rateLimit";
import "dotenv/config";
import morgan from "morgan";

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(limiter);
app.use(morgan("combined"));
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
    message: "Welcome to LuckyAnime Indo V2 & TypeScript Server",
    route: "Go to our route /api/v2/anime",
  });
});

app.use("/api/v2/anime", animeIndo);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
