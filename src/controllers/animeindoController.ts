import { Request, Response } from "express";
import * as cheerio from "cheerio";
import request from "request";
import { baseURL } from "../lib/baseURL";
import { IncomingMessage } from "http";

export const getAnimeOnGoing = (req: Request, res: Response): Promise<void> => {
  const { order_by, page } = req.query;
  return new Promise((resolve, reject) => {
    try {
      const options = {
        url: `${baseURL}/quick/ongoing?order_by=${order_by || "updated"}&page=${
          page || 1
        }`,
      };

      let has_next_page = false;
      let has_prev_page = false;
      let current_pages = 0;
      const animeList: Array<any> = [];

      request(
        options,
        (error: Error | null, response: IncomingMessage, body: string) => {
          if (error || response.statusCode !== 200) {
            return res.status(500).json({
              status: "error",
              message: "Failed to retrieve anime list",
            });
          }

          const $ = cheerio.load(body);

          $("#animeList > div > div").each((index, el) => {
            const typeList = $(el)
              .find("div > ul > a")
              .map((i, index) => $(index).text())
              .get();

            const slug = $(el)
              .find("div > a")
              .attr("href")
              ?.replace(baseURL, "");

            const title = $(el)
              .find("div > h5")
              .text()
              ?.replace(/\n/g, "")
              ?.trim()
              ?.replace(/"/g, "");

            const episode = $(el)
              .find("a > div > div.ep > span")
              .text()
              ?.replace(/\n/g, "")
              ?.trim();

            const image = $(el).find("a > div").attr("data-setbg");
            const current_page = $(
              "#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a.current-page"
            )?.text();

            const get_hash_next = $(
              "#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a:nth-child(7)"
            )?.attr("aria-disabled");
            const get_hash_prev = $(
              "#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a:nth-child(1)"
            )?.attr("aria-disabled");

            if (current_page) {
              current_pages = parseInt(current_page);
            }

            if (get_hash_prev) {
              has_prev_page = true;
            }
            if (get_hash_next) {
              has_next_page = true;
            }

            // if()

            animeList.push({
              type: typeList,
              slug,
              title,
              episode,
              image,
            });
          });

          const filteredAnimeList = animeList.filter((anime) => {
            return anime.type.length > 0 || anime.title || anime.episode;
          });

          if (filteredAnimeList.length === 0) {
            return res.status(404).json({
              status: "error",
              message: "No anime found",
            });
          }

          res.status(200).json({
            status: "success",
            data: filteredAnimeList,
            total_item: filteredAnimeList.length,
            has_next: {
              has_next_page: !has_next_page,
            },
            has_prev: {
              has_prev_page: !has_prev_page,
            },
            current_page: current_pages,
          });

          resolve();
        }
      );
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
      reject(error);
    }
  });
};

export const getAnimeLatest = (req: Request, res: Response): Promise<void> => {
  const { order_by, page } = req.query;
  return new Promise((resolve, reject) => {
    try {
      const options = {
        url: `${baseURL}/quick/finished?order_by=${order_by || "latest"}&page=${
          page || 1
        }`,
      };

      let has_next_page = false;
      let has_prev_page = false;
      let current_pages = 0;
      const animeList: Array<any> = [];

      request(
        options,
        (error: Error | null, response: IncomingMessage, body: string) => {
          if (error || response.statusCode !== 200) {
            return res.status(500).json({
              status: "error",
              message: "Failed to retrieve anime list",
            });
          }

          const $ = cheerio.load(body);

          $("#animeList > div > div").each((index, el) => {
            const typeList = $(el)
              .find("div > ul > a")
              .map((i, index) => $(index).text())
              .get();

            const slug = $(el)
              .find("div > a")
              .attr("href")
              ?.replace(baseURL, "");

            const title = $(el)
              .find("div > h5")
              .text()
              ?.replace(/\n/g, "")
              ?.trim()
              ?.replace(/"/g, "");

            const episode = $(el)
              .find("a > div > div.ep > span")
              .text()
              ?.replace(/\n/g, "")
              ?.trim();

            const image = $(el).find("a > div").attr("data-setbg");
            const current_page = $(
              "#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a.current-page"
            )?.text();

            const get_hash_next = $(
              "#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a:nth-child(7)"
            )?.attr("aria-disabled");
            const get_hash_prev = $(
              "#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a:nth-child(1)"
            )?.attr("aria-disabled");

            if (current_page) {
              current_pages = parseInt(current_page);
            }

            if (get_hash_prev) {
              has_prev_page = true;
            }
            if (get_hash_next) {
              has_next_page = true;
            }

            // if()

            animeList.push({
              type: typeList,
              slug,
              title,
              episode,
              image,
            });
          });

          const filteredAnimeList = animeList.filter((anime) => {
            return anime.type.length > 0 || anime.title || anime.episode;
          });

          if (filteredAnimeList.length === 0) {
            return res.status(404).json({
              status: "error",
              message: "No anime found",
            });
          }

          res.status(200).json({
            status: "success",
            data: filteredAnimeList,
            total_item: filteredAnimeList.length,
            has_next: {
              has_next_page: !has_next_page,
            },
            has_prev: {
              has_prev_page: !has_prev_page,
            },
            current_page: current_pages,
          });
          resolve();
        }
      );
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
      reject(error);
    }
  });
};

export const getAnimeMovie = (req: Request, res: Response): Promise<void> => {
  const { order_by, page } = req.query;
  return new Promise((resolve, reject) => {
    try {
      const options = {
        url: `${baseURL}/quick/movie?order_by=${order_by || "latest"}&page=${
          page || 1
        }`,
      };
      let has_next_page = false;
      let has_prev_page = false;
      let current_pages = 0;
      const animeList: Array<any> = [];

      request(
        options,
        (error: Error | null, response: IncomingMessage, body: string) => {
          if (error || response.statusCode !== 200) {
            return res.status(500).json({
              status: "error",
              message: "Failed to retrieve anime list",
            });
          }

          const $ = cheerio.load(body);

          $("#animeList > div > div").each((index, el) => {
            const typeList = $(el)
              .find("div > ul > a")
              .map((i, index) => $(index).text())
              .get();

            const slug = $(el)
              .find("div > a")
              .attr("href")
              ?.replace(baseURL, "");

            const title = $(el)
              .find("div > h5")
              .text()
              ?.replace(/\n/g, "")
              ?.trim()
              ?.replace(/"/g, "");

            const episode = $(el)
              .find("a > div > div.ep > span")
              .text()
              ?.replace(/\n/g, "")
              ?.trim();

            const image = $(el).find("a > div").attr("data-setbg");
            const current_page = $(
              "#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a.current-page"
            )?.text();

            const get_hash_next = $(
              "#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a:nth-child(7)"
            )?.attr("aria-disabled");
            const get_hash_prev = $(
              "#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a:nth-child(1)"
            )?.attr("aria-disabled");

            if (current_page) {
              current_pages = parseInt(current_page);
            }

            if (get_hash_prev) {
              has_prev_page = true;
            }
            if (get_hash_next) {
              has_next_page = true;
            }

            // if()

            animeList.push({
              type: typeList,
              slug,
              title,
              episode,
              image,
            });
          });

          const filteredAnimeList = animeList.filter((anime) => {
            return anime.type.length > 0 || anime.title || anime.episode;
          });

          if (filteredAnimeList.length === 0) {
            return res.status(404).json({
              status: "error",
              message: "No anime found",
            });
          }

          res.status(200).json({
            status: "success",
            data: filteredAnimeList,
            total_item: filteredAnimeList.length,
            has_next: {
              has_next_page: !has_next_page,
            },
            has_prev: {
              has_prev_page: !has_prev_page,
            },
            current_page: current_pages,
          });

          resolve();
        }
      );
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
      reject(error);
    }
  });
};

export const getAnimeSeasonList = (
  req: Request,
  res: Response
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        url: `${baseURL}/properties/season`,
      };

      const seasonList: Array<any> = [];

      request(
        options,
        (error: Error | null, response: IncomingMessage, body: string) => {
          if (error || response.statusCode !== 200) {
            return res.status(500).json({
              status: "error",
              message: "Failed to retrieve anime list",
            });
          }

          const $ = cheerio.load(body);

          $("#animeList > div > div > ul > li").each((index, el) => {
            const season_title = $(el)
              .find("a > span")
              .text()
              ?.replace(/\n/g, "")
              ?.trim()
              ?.replace(/"/g, "");

            const season_slug = $(el)
              .find("a")
              .attr("href")
              ?.replace(baseURL, "")
              ?.replace("/properties/season/", "")
              ?.split("?")[0]
              ?.trim();

            seasonList.push({
              season_title,
              season_slug,
            });
          });

          res.status(200).json({
            status: "success",
            data: seasonList,
          });

          resolve();
        }
      );
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
      reject(error);
    }
  });
};

export const getAnimeBySeasonList = (
  req: Request,
  res: Response
): Promise<void> => {
  const { order_by, page } = req.query;
  const { season_id } = req.params;
  return new Promise((resolve, reject) => {
    try {
      const options = {
        url: `${baseURL}/properties/season/${season_id}?order_by=${
          order_by || "most_viewed"
        }&page=${page || 1}`,
      };

      const animeList: Array<any> = [];

      request(
        options,
        (error: Error | null, response: IncomingMessage, body: string) => {
          if (error || response.statusCode !== 200) {
            return res.status(500).json({
              status: "error",
              message: "Failed to retrieve anime list",
            });
          }

          const $ = cheerio.load(body);

          $("#animeList > div > div").each((index, el) => {
            const typeList = $(el)
              .find("div > ul > a")
              .map((i, index) => $(index).text())
              .get();

            const slug = $(el)
              .find("div > a")
              .attr("href")
              ?.replace(baseURL, "");

            const title = $(el)
              .find("div > h5")
              .text()
              ?.replace(/\n/g, "")
              ?.trim()
              ?.replace(/"/g, "");

            const rating = $(el)
              .find("a > div > div.ep > span")
              .text()
              ?.replace(/\n/g, "")
              ?.trim();

            const image = $(el).find("a > div").attr("data-setbg");

            animeList.push({
              type: typeList,
              slug,
              title,
              rating,
              image,
            });
          });

          const filteredAnimeList = animeList.filter((anime) => {
            return anime.type.length > 0 || anime.title || anime.episode;
          });

          if (filteredAnimeList.length === 0) {
            return res.status(404).json({
              status: "error",
              message: "No anime found",
            });
          }

          res.status(200).json({
            status: "success",
            data: filteredAnimeList,
          });

          resolve();
        }
      );
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
      reject(error);
    }
  });
};

export const getAnimeByDetails = (
  req: Request,
  res: Response
): Promise<void> => {
  const { page } = req.query;
  const { anime_code, anime_id } = req.params;
  return new Promise((resolve, reject) => {
    let has_next_page = false;
    let has_prev_page = false;
    let has_next_link: string | null = null;
    let has_prev_link: string | null = null;

    try {
      const options = {
        url: `${baseURL}/anime/${anime_code}/${anime_id}?page=${page || 1}`,
      };

      request(
        options,
        (error: Error | null, response: IncomingMessage, body: string) => {
          if (error || response.statusCode !== 200) {
            return res.status(500).json({
              status: "error",
              message: "Failed to retrieve anime list",
            });
          }

          const $ = cheerio.load(body);
          const episode: any = $("#episodeLists").attr("data-content");
          const $$ = cheerio.load(episode);
          const episode_list = new Array();
          $$("a").each((i, e) => {
            const eps = $$(e).attr("href")?.trim().replace(`${baseURL}`, "");
            const epsTitle = $$(e).text().replace(/\s+/g, " ");
            if (eps && epsTitle.trim()) {
              episode_list.push({
                episodeId: eps,
                epsTitle: epsTitle,
              });
            }
            if (i === $$("a").length - 1 && !epsTitle.trim()) {
              has_next_page = true;
              has_next_link = eps || null;
            }
          });

          const list_episode = $("#animeEpisodes > a")
            .map((i, index) => ({
              eps_title: $(index)
                .text()
                ?.replace(/\n/g, "")
                ?.replace("Ep", "Episode -"),
              eps_slug: $(index).attr("href")?.replace(baseURL, ""),
              active_eps: $(index)?.hasClass("active-ep"),
            }))
            ?.get();

          if (
            list_episode.length > 0 &&
            !list_episode[list_episode.length - 1].eps_title.trim()
          ) {
            has_next_link =
              list_episode[list_episode.length - 1].eps_slug || null;
            list_episode.pop();
            has_next_page = true;
          }

          if (list_episode.length > 0 && !list_episode[0].eps_title.trim()) {
            has_prev_link = list_episode[0].eps_slug || null;
            list_episode.shift();
            has_prev_page = true;
          }

          const title = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__title > h3"
          ).text();
          const images = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-3 > div"
          ).attr("data-setbg");
          const descriptions = $("#synopsisField")
            .text()
            ?.replace(/\n/g, "")
            ?.trim();
          const type = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(1) > div > div.col-9 > a"
          )
            .text()
            ?.replace(/\n/g, "")
            ?.trim();
          const total_eps = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(2) > div > div.col-9 > a"
          )
            .text()
            ?.replace(/\n/g, "")
            ?.trim();
          const status = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(3) > div > div.col-9 > a"
          )
            .text()
            ?.replace(/\n/g, "")
            ?.trim();
          const release = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(4) > div > div.col-9"
          )
            .text()
            ?.replace(/\n/g, "")
            ?.trim();
          const season = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(5) > div > div.col-9 > a"
          )
            .text()
            ?.replace(/\n/g, "")
            ?.trim();
          const duration = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(6) > div > div.col-9 > a"
          ).text();
          const quality = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(7) > div > div.col-9 > a"
          ).text();
          const counrty = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(8) > div > div.col-9 > a"
          ).text();
          const adaptation = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(9) > div > div.col-9 > a"
          ).text();
          const genre = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(1) > div > div.col-9 > a"
          )
            .map((i, index) => $(index).text()?.replace(/\n/g, "")?.trim())
            .get();
          const explisit = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(2) > div > div.col-9"
          )
            .text()
            ?.replace(/\n/g, "")
            ?.trim();
          const demogration = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(3) > div > div.col-9"
          )
            .text()
            ?.replace(/\n/g, "")
            ?.trim();

          const themes = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(4) > div > div.col-9 > a"
          )
            .map((i, index) => $(index).text()?.replace(/\n/g, "")?.trim())
            .get();
          const studio = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(5) > div > div.col-9 > a"
          )
            .text()
            ?.replace(/\n/g, "")
            ?.trim();
          const ratings = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(6) > div > div.col-9 > a"
          ).text();
          const popularity = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(7) > div > div.col-9 > a"
          ).text();
          const rating_policy = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(8) > div > div.col-9 > a"
          ).text();
          const credit = $(
            "body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(9) > div > div.col-9 > a"
          )
            .text()
            ?.replace(/\n/g, "")
            ?.trim();
          res.status(200).json({
            status: "success",
            data: {
              type,
              title,
              images,
              descriptions,
              status,
              release,
              season,
              duration,
              quality,
              counrty,
              adaptation,
              genre,
              explisit,
              demogration,
              themes,
              studio,
              ratings,
              popularity,
              rating_policy,
              total_eps,
              credit,
              episode_list,
              has_next: {
                has_next_link,
                has_next_page,
              },
              // has_prev: {
              //   has_prev_link,
              //   has_prev_page,
              // },
            },
          });
          resolve();
        }
      );
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
      reject(error);
    }
  });
};

export const getAnimePropertiesGenre = (
  req: Request,
  res: Response
): Promise<void> => {
  const { page } = req.query;
  return new Promise((resolve, reject) => {
    try {
      const options = {
        url: `${baseURL}/properties/genre?genre_type=all&page=${page || 1}`,
      };

      const genreList: Array<any> = [];

      request(
        options,
        (error: Error | null, response: IncomingMessage, body: string) => {
          if (error || response.statusCode !== 200) {
            return res.status(500).json({
              status: "error",
              message: "Failed to retrieve anime list",
            });
          }

          const $ = cheerio.load(body);

          $("#animeList > div > div > ul > li").each((index, el) => {
            const genre_title = $(el)
              .find("a")
              .text()
              ?.replace(/\n/g, "")
              ?.trim()
              ?.replace(/"/g, "");

            const genre_slug = $(el)
              .find("a")
              .attr("href")
              ?.replace(baseURL, "")
              ?.replace("/properties/genre/", "")
              ?.split("?")[0]
              ?.trim();

            genreList.push({
              genre_title,
              genre_slug,
            });
          });

          res.status(200).json({
            status: "success",
            data: genreList,
          });

          resolve();
        }
      );
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
      reject(error);
    }
  });
};

export const getAnimeByGenre = (req: Request, res: Response): Promise<void> => {
  const { genre_id } = req.params;
  const { order_by, page } = req.query;
  return new Promise((resolve, reject) => {
    try {
      const options = {
        url: `${baseURL}/properties/genre/${genre_id}?order_by=${
          order_by || "latest"
        }&page=${page || 1}`,
      };

      const animeList: Array<any> = [];

      request(
        options,
        (error: Error | null, response: IncomingMessage, body: string) => {
          if (error || response.statusCode !== 200) {
            return res.status(500).json({
              status: "error",
              message: "Failed to retrieve anime list",
            });
          }

          const $ = cheerio.load(body);

          $("#animeList > div > div").each((index, el) => {
            const typeList = $(el)
              .find("div > ul > a")
              .map((i, index) => $(index).text())
              .get();

            const slug = $(el)
              .find("div > a")
              .attr("href")
              ?.replace(baseURL, "");

            const title = $(el)
              .find("div > h5")
              .text()
              ?.replace(/\n/g, "")
              ?.trim()
              ?.replace(/"/g, "");

            const rating = $(el)
              .find("a > div > div.ep > span")
              .text()
              ?.replace(/\n/g, "")
              ?.trim();

            const image = $(el).find("a > div").attr("data-setbg");

            animeList.push({
              type: typeList,
              slug,
              title,
              rating,
              image,
            });
          });

          const filteredAnimeList = animeList.filter((anime) => {
            return anime.type.length > 0 || anime.title || anime.episode;
          });

          if (filteredAnimeList.length === 0) {
            return res.status(404).json({
              status: "error",
              message: "No anime found",
            });
          }

          res.status(200).json({
            status: "success",
            data: filteredAnimeList,
          });

          resolve();
        }
      );
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
      reject(error);
    }
  });
};

export const getAnimeBySchedule = (
  req: Request,
  res: Response
): Promise<void> => {
  const { scheduled_day, page } = req.query;
  return new Promise((resolve, reject) => {
    try {
      const options = {
        url: `${baseURL}/schedule?scheduled_day=${
          scheduled_day || "monday"
        }&page=${page || 1}`,
      };

      const animeList: Array<any> = [];

      request(
        options,
        (error: Error | null, response: IncomingMessage, body: string) => {
          if (error || response.statusCode !== 200) {
            return res.status(500).json({
              status: "error",
              message: "Failed to retrieve anime list",
            });
          }

          const $ = cheerio.load(body);

          $("#animeList > div > div").each((index, el) => {
            const typeList = $(el)
              .find("div > ul > a")
              .map((i, index) => $(index).text())
              .get();

            const slug = $(el)
              .find("div > a")
              .attr("href")
              ?.replace(baseURL, "");

            const title = $(el)
              .find("div > h5")
              .text()
              ?.replace(/\n/g, "")
              ?.trim()
              ?.replace(/"/g, "");

            const episode = $(el)
              .find("a > div > div.ep > span:last-child")
              .text()
              ?.replace(/\n/g, "")
              ?.trim();

            const image = $(el).find("a > div").attr("data-setbg");
            const release_day = $(el)
              .find("a > div > div.view-end > ul > li:nth-child(1) > span")
              .text()
              ?.replace(/\n/g, "")
              ?.trim();
            const release_time = $(el)
              .find("a > div > div.view-end > ul > li:nth-child(2) > span")
              .text()
              ?.replace(/\n/g, "")
              ?.trim();

            animeList.push({
              type: typeList,
              slug,
              title,
              image,
              episode,
              release_day,
              release_time,
            });
          });

          const filteredAnimeList = animeList.filter((anime) => {
            return anime.type.length > 0 || anime.title || anime.episode;
          });

          if (filteredAnimeList.length === 0) {
            return res.status(404).json({
              status: "error",
              message: "No anime found",
            });
          }

          res.status(200).json({
            status: "success",
            data: filteredAnimeList,
          });

          resolve();
        }
      );
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
      reject(error);
    }
  });
};

export const getAnimeByEpisode = (
  req: Request,
  res: Response
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const { anime_code, anime_id, episode_id } = req.params;
      const { page } = req.query;
      const options = {
        url: `${baseURL}/anime/${anime_code}/${anime_id}/episode/${episode_id}?QXCKFC2hpmVFvvv=8vIFROsi7w&PsAdpiUFrAc3n85=kuramadrive&page=${
          page || 1
        }`,
      };
      let has_next_page = false;
      let has_next_link: any = null;
      let has_prev_link: any = null;
      let has_prev_page = false;
      request(
        options,
        (error: Error | null, response: IncomingMessage, body: string) => {
          if (error || response.statusCode !== 200) {
            return res.status(500).json({
              status: "error",
              message: "Failed to retrieve anime list",
            });
          }

          const $ = cheerio.load(body);

          const episode_list = $("#player > source")
            .map((i, index) => ({
              source_video: $(index).attr("src"),
              type_video: $(index).attr("type"),
              size: $(index).attr("size"),
            }))
            ?.get();
          const eps_title = $("#episodeTitle").text();
          const list_episode = $("#animeEpisodes > a")
            .map((i, index) => ({
              eps_title: $(index)
                .text()
                ?.replace(/\n/g, "")
                ?.replace("Ep", "Episode -"),
              eps_slug: $(index).attr("href")?.replace(baseURL, ""),
              active_eps: $(index)?.hasClass("active-ep"),
            }))
            ?.get();
          const total_eps = $("#animeEpisodes > a")
            .map((i, index) => $(index).text())
            .get().length;

          if (
            list_episode.length > 0 &&
            !list_episode[list_episode.length - 1].eps_title.trim()
          ) {
            has_next_link = list_episode[list_episode.length - 1].eps_slug;
            list_episode.pop();
            has_next_page = true;
          }

          if (list_episode.length > 0 && !list_episode[0].eps_title.trim()) {
            has_prev_link = list_episode[0].eps_slug;
            list_episode.shift();
            has_prev_page = true;
          }

          res.status(200).json({
            status: "success",
            data: {
              eps_title,
              list_episode,
              total_eps,
              episode_list: episode_list,
              has_next: {
                has_next_page,
                has_next_link,
              },
              has_previous: {
                has_prev_page,
                has_prev_link,
              },
            },
          });

          resolve();
        }
      );
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  });
};
