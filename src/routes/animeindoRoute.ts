import { Router } from "express";
import {
  getAnimeByGenre,
  getAnimeBySchedule,
  getAnimeBySeasonList,
  getAnimeOnGoing,
  getAnimePropertiesGenre,
  getAnimeByDetails,
  getAnimeByEpisode,
  getAnimeLatest,
  getAnimeMovie,
  getAnimeSeasonList,
} from "../controllers/animeindoController";

const animeIndo = Router();

animeIndo.get("/ongoing", getAnimeOnGoing);
animeIndo.get("/completed", getAnimeLatest);
animeIndo.get("/movie", getAnimeMovie);

animeIndo.get("/:anime_code/:anime_id", getAnimeByDetails);

animeIndo.get("/properties/season/list", getAnimeSeasonList);
animeIndo.get("/properties/season/:season_id", getAnimeBySeasonList);

animeIndo.get("/properties/genre/list", getAnimePropertiesGenre);
animeIndo.get("/properties/genre/:genre_id", getAnimeByGenre);

animeIndo.get("/schedule", getAnimeBySchedule);

animeIndo.get("/:anime_code/:anime_id/episode/:episode_id", getAnimeByEpisode);

export default animeIndo;
