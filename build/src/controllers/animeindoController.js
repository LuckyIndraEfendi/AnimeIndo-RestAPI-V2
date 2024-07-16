"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimeBySchedule = exports.getAnimeByGenre = exports.getAnimePropertiesGenre = exports.getAnimeBySeasonList = exports.getAnimeByDetails = exports.getAnimeSeasonList = exports.getAnimeOnGoing = void 0;
const cheerio = __importStar(require("cheerio"));
const request_1 = __importDefault(require("request"));
const baseURL_1 = require("../lib/baseURL");
const getAnimeOnGoing = (req, res) => {
    const { order_by, page } = req.query;
    return new Promise((resolve, reject) => {
        try {
            const options = {
                url: `${baseURL_1.baseURL}/quick/ongoing?order_by=${order_by || "ongoing"}&page=${page || 1}`,
            };
            const animeList = [];
            (0, request_1.default)(options, (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    return res.status(500).json({
                        status: "error",
                        message: "Failed to retrieve anime list",
                    });
                }
                const $ = cheerio.load(body);
                $("#animeList > div > div").each((index, el) => {
                    var _a, _b, _c, _d, _e, _f;
                    const typeList = $(el)
                        .find("div > ul > a")
                        .map((i, index) => $(index).text())
                        .get();
                    const slug = (_a = $(el)
                        .find("div > a")
                        .attr("href")) === null || _a === void 0 ? void 0 : _a.replace(baseURL_1.baseURL, "");
                    const title = (_d = (_c = (_b = $(el)
                        .find("div > h5")
                        .text()) === null || _b === void 0 ? void 0 : _b.replace(/\n/g, "")) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.replace(/"/g, "");
                    const episode = (_f = (_e = $(el)
                        .find("a > div > div.ep > span")
                        .text()) === null || _e === void 0 ? void 0 : _e.replace(/\n/g, "")) === null || _f === void 0 ? void 0 : _f.trim();
                    const image = $(el).find("a > div").attr("data-setbg");
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
                });
                resolve();
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
            reject(error);
        }
    });
};
exports.getAnimeOnGoing = getAnimeOnGoing;
const getAnimeSeasonList = (req, res) => {
    const { page } = req.query;
    return new Promise((resolve, reject) => {
        try {
            const options = {
                url: `${baseURL_1.baseURL}/properties/season`,
            };
            const seasonList = [];
            (0, request_1.default)(options, (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    return res.status(500).json({
                        status: "error",
                        message: "Failed to retrieve anime list",
                    });
                }
                const $ = cheerio.load(body);
                $("#animeList > div > div > ul > li").each((index, el) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    const season_title = (_c = (_b = (_a = $(el)
                        .find("a")
                        .text()) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, "")) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.replace(/"/g, "");
                    const season_slug = (_g = (_f = (_e = (_d = $(el)
                        .find("a")
                        .attr("href")) === null || _d === void 0 ? void 0 : _d.replace(baseURL_1.baseURL, "")) === null || _e === void 0 ? void 0 : _e.replace("/properties/season/", "")) === null || _f === void 0 ? void 0 : _f.split("?")[0]) === null || _g === void 0 ? void 0 : _g.trim();
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
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
            reject(error);
        }
    });
};
exports.getAnimeSeasonList = getAnimeSeasonList;
const getAnimeByDetails = (req, res) => {
    const { anime_code, anime_id } = req.params;
    return new Promise((resolve, reject) => {
        try {
            const options = {
                url: `${baseURL_1.baseURL}/anime/${anime_code}/${anime_id}`,
            };
            (0, request_1.default)(options, (error, response, body) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                if (error || response.statusCode !== 200) {
                    return res.status(500).json({
                        status: "error",
                        message: "Failed to retrieve anime list",
                    });
                }
                const $ = cheerio.load(body);
                const episode = $("#episodeLists").attr("data-content");
                const $$ = cheerio.load(episode);
                const episode_list = new Array();
                $$("a").each((i, e) => {
                    var _a;
                    const eps = (_a = $(e).attr("href")) === null || _a === void 0 ? void 0 : _a.trim().replace(`${baseURL_1.baseURL}`, "");
                    const epsTitle = $(e).text().replace(/\s+/g, " ");
                    episode_list.push({
                        episodeId: eps,
                        epsTitle: epsTitle,
                    });
                });
                const title = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__title > h3").text();
                const images = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-3 > div").attr("data-setbg");
                const descriptions = (_b = (_a = $("#synopsisField")
                    .text()) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, "")) === null || _b === void 0 ? void 0 : _b.trim();
                const type = (_d = (_c = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(1) > div > div.col-9 > a")
                    .text()) === null || _c === void 0 ? void 0 : _c.replace(/\n/g, "")) === null || _d === void 0 ? void 0 : _d.trim();
                const total_eps = (_f = (_e = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(2) > div > div.col-9 > a")
                    .text()) === null || _e === void 0 ? void 0 : _e.replace(/\n/g, "")) === null || _f === void 0 ? void 0 : _f.trim();
                const status = (_h = (_g = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(3) > div > div.col-9 > a")
                    .text()) === null || _g === void 0 ? void 0 : _g.replace(/\n/g, "")) === null || _h === void 0 ? void 0 : _h.trim();
                const release = (_k = (_j = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(4) > div > div.col-9")
                    .text()) === null || _j === void 0 ? void 0 : _j.replace(/\n/g, "")) === null || _k === void 0 ? void 0 : _k.trim();
                const season = (_m = (_l = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(5) > div > div.col-9 > a")
                    .text()) === null || _l === void 0 ? void 0 : _l.replace(/\n/g, "")) === null || _m === void 0 ? void 0 : _m.trim();
                const duration = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(6) > div > div.col-9 > a").text();
                const quality = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(7) > div > div.col-9 > a").text();
                const counrty = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(8) > div > div.col-9 > a").text();
                const adaptation = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(9) > div > div.col-9 > a").text();
                const genre = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(1) > div > div.col-9 > a")
                    .map((i, index) => { var _a, _b; return (_b = (_a = $(index).text()) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, "")) === null || _b === void 0 ? void 0 : _b.trim(); })
                    .get();
                const explisit = (_p = (_o = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(2) > div > div.col-9")
                    .text()) === null || _o === void 0 ? void 0 : _o.replace(/\n/g, "")) === null || _p === void 0 ? void 0 : _p.trim();
                const demogration = (_r = (_q = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(3) > div > div.col-9")
                    .text()) === null || _q === void 0 ? void 0 : _q.replace(/\n/g, "")) === null || _r === void 0 ? void 0 : _r.trim();
                const themes = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(4) > div > div.col-9 > a")
                    .map((i, index) => { var _a, _b; return (_b = (_a = $(index).text()) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, "")) === null || _b === void 0 ? void 0 : _b.trim(); })
                    .get();
                const studio = (_t = (_s = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(5) > div > div.col-9 > a")
                    .text()) === null || _s === void 0 ? void 0 : _s.replace(/\n/g, "")) === null || _t === void 0 ? void 0 : _t.trim();
                const ratings = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(6) > div > div.col-9 > a").text();
                const popularity = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(7) > div > div.col-9 > a").text();
                const rating_policy = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(8) > div > div.col-9 > a").text();
                const credit = (_v = (_u = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(9) > div > div.col-9 > a")
                    .text()) === null || _u === void 0 ? void 0 : _u.replace(/\n/g, "")) === null || _v === void 0 ? void 0 : _v.trim();
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
                    },
                });
                resolve();
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
            reject(error);
        }
    });
};
exports.getAnimeByDetails = getAnimeByDetails;
const getAnimeBySeasonList = (req, res) => {
    const { order_by, page } = req.query;
    const { season_id } = req.params;
    return new Promise((resolve, reject) => {
        try {
            const options = {
                url: `${baseURL_1.baseURL}/properties/season/${season_id}?order_by=${order_by || "most_viewed"}&page=${page || 1}`,
            };
            const animeList = [];
            (0, request_1.default)(options, (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    return res.status(500).json({
                        status: "error",
                        message: "Failed to retrieve anime list",
                    });
                }
                const $ = cheerio.load(body);
                $("#animeList > div > div").each((index, el) => {
                    var _a, _b, _c, _d, _e, _f;
                    const typeList = $(el)
                        .find("div > ul > a")
                        .map((i, index) => $(index).text())
                        .get();
                    const slug = (_a = $(el)
                        .find("div > a")
                        .attr("href")) === null || _a === void 0 ? void 0 : _a.replace(baseURL_1.baseURL, "");
                    const title = (_d = (_c = (_b = $(el)
                        .find("div > h5")
                        .text()) === null || _b === void 0 ? void 0 : _b.replace(/\n/g, "")) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.replace(/"/g, "");
                    const rating = (_f = (_e = $(el)
                        .find("a > div > div.ep > span")
                        .text()) === null || _e === void 0 ? void 0 : _e.replace(/\n/g, "")) === null || _f === void 0 ? void 0 : _f.trim();
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
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
            reject(error);
        }
    });
};
exports.getAnimeBySeasonList = getAnimeBySeasonList;
const getAnimePropertiesGenre = (req, res) => {
    const { page } = req.query;
    return new Promise((resolve, reject) => {
        try {
            const options = {
                url: `${baseURL_1.baseURL}/properties/genre?genre_type=all&page=${page || 1}`,
            };
            const genreList = [];
            (0, request_1.default)(options, (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    return res.status(500).json({
                        status: "error",
                        message: "Failed to retrieve anime list",
                    });
                }
                const $ = cheerio.load(body);
                $("#animeList > div > div > ul > li").each((index, el) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    const genre_title = (_c = (_b = (_a = $(el)
                        .find("a")
                        .text()) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, "")) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.replace(/"/g, "");
                    const genre_slug = (_g = (_f = (_e = (_d = $(el)
                        .find("a")
                        .attr("href")) === null || _d === void 0 ? void 0 : _d.replace(baseURL_1.baseURL, "")) === null || _e === void 0 ? void 0 : _e.replace("/properties/genre/", "")) === null || _f === void 0 ? void 0 : _f.split("?")[0]) === null || _g === void 0 ? void 0 : _g.trim();
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
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
            reject(error);
        }
    });
};
exports.getAnimePropertiesGenre = getAnimePropertiesGenre;
const getAnimeByGenre = (req, res) => {
    const { genre_id } = req.params;
    const { order_by, page } = req.query;
    return new Promise((resolve, reject) => {
        try {
            const options = {
                url: `${baseURL_1.baseURL}/properties/genre/${genre_id}?order_by=${order_by || "latest"}&page=${page || 1}`,
            };
            const animeList = [];
            (0, request_1.default)(options, (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    return res.status(500).json({
                        status: "error",
                        message: "Failed to retrieve anime list",
                    });
                }
                const $ = cheerio.load(body);
                $("#animeList > div > div").each((index, el) => {
                    var _a, _b, _c, _d, _e, _f;
                    const typeList = $(el)
                        .find("div > ul > a")
                        .map((i, index) => $(index).text())
                        .get();
                    const slug = (_a = $(el)
                        .find("div > a")
                        .attr("href")) === null || _a === void 0 ? void 0 : _a.replace(baseURL_1.baseURL, "");
                    const title = (_d = (_c = (_b = $(el)
                        .find("div > h5")
                        .text()) === null || _b === void 0 ? void 0 : _b.replace(/\n/g, "")) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.replace(/"/g, "");
                    const rating = (_f = (_e = $(el)
                        .find("a > div > div.ep > span")
                        .text()) === null || _e === void 0 ? void 0 : _e.replace(/\n/g, "")) === null || _f === void 0 ? void 0 : _f.trim();
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
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
            reject(error);
        }
    });
};
exports.getAnimeByGenre = getAnimeByGenre;
const getAnimeBySchedule = (req, res) => {
    const { scheduled_day, page } = req.query;
    return new Promise((resolve, reject) => {
        try {
            const options = {
                url: `${baseURL_1.baseURL}/schedule?scheduled_day=${scheduled_day || "monday"}&page=${page || 1}`,
            };
            const animeList = [];
            (0, request_1.default)(options, (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    return res.status(500).json({
                        status: "error",
                        message: "Failed to retrieve anime list",
                    });
                }
                const $ = cheerio.load(body);
                $("#animeList > div > div").each((index, el) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    const typeList = $(el)
                        .find("div > ul > a")
                        .map((i, index) => $(index).text())
                        .get();
                    const slug = (_a = $(el)
                        .find("div > a")
                        .attr("href")) === null || _a === void 0 ? void 0 : _a.replace(baseURL_1.baseURL, "");
                    const title = (_d = (_c = (_b = $(el)
                        .find("div > h5")
                        .text()) === null || _b === void 0 ? void 0 : _b.replace(/\n/g, "")) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.replace(/"/g, "");
                    const episode = (_f = (_e = $(el)
                        .find("a > div > div.ep > span:last-child")
                        .text()) === null || _e === void 0 ? void 0 : _e.replace(/\n/g, "")) === null || _f === void 0 ? void 0 : _f.trim();
                    const image = $(el).find("a > div").attr("data-setbg");
                    const release_day = (_h = (_g = $(el)
                        .find("a > div > div.view-end > ul > li:nth-child(1) > span")
                        .text()) === null || _g === void 0 ? void 0 : _g.replace(/\n/g, "")) === null || _h === void 0 ? void 0 : _h.trim();
                    const release_time = (_k = (_j = $(el)
                        .find("a > div > div.view-end > ul > li:nth-child(2) > span")
                        .text()) === null || _j === void 0 ? void 0 : _j.replace(/\n/g, "")) === null || _k === void 0 ? void 0 : _k.trim();
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
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
            reject(error);
        }
    });
};
exports.getAnimeBySchedule = getAnimeBySchedule;
