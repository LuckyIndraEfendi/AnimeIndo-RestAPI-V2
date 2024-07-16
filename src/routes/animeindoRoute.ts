import { Router } from "express";
import {
  getAnimeByGenre,
  getAnimeBySchedule,
  getAnimeBySeasonList,
  getAnimeOnGoing,
  getAnimePropertiesGenre,
  getAnimeSeasonList,
  getAnimeByDetails,
} from "../controllers/animeindoController";

const animeIndo = Router();

animeIndo.get("/ongoing", getAnimeOnGoing);

animeIndo.get("/:anime_code/:anime_id", getAnimeByDetails);

animeIndo.get("/properties/season", getAnimeSeasonList);
animeIndo.get("/properties/season/:season_id", getAnimeBySeasonList);

animeIndo.get("/properties/genre", getAnimePropertiesGenre);
animeIndo.get("/properties/genre/:genre_id", getAnimeByGenre);

animeIndo.get("/schedule", getAnimeBySchedule);

export default animeIndo;
