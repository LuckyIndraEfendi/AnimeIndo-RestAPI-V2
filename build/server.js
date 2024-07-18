"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const animeindoRoute_1 = __importDefault(require("./src/routes/animeindoRoute"));
const cors_1 = __importDefault(require("cors"));
const rateLimit_1 = __importDefault(require("./src/middleware/rateLimit"));
require("dotenv/config");
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use(express_1.default.json());
app.use(rateLimit_1.default);
app.use((0, morgan_1.default)("combined"));
app.use((0, cors_1.default)({
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
}));
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to LuckyAnime Indo V2 & TypeScript Server",
        route: "Go to our route /api/v2/anime",
    });
});
app.use("/api/v2/anime", animeindoRoute_1.default);
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
