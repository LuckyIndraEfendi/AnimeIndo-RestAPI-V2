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
exports.getAnimeByEpisode = exports.getAnimeBySchedule = exports.getAnimeByGenre = exports.getAnimePropertiesGenre = exports.getAnimeByDetails = exports.getAnimeBySeasonList = exports.getAnimeSeasonList = exports.getAnimeMovie = exports.getAnimeLatest = exports.getAnimeOnGoing = void 0;
const cheerio = __importStar(require("cheerio"));
const request_1 = __importDefault(require("request"));
const baseURL_1 = require("../lib/baseURL");
const getAnimeOnGoing = (req, res) => {
    const { order_by, page } = req.query;
    return new Promise((resolve, reject) => {
        try {
            const options = {
                url: `${baseURL_1.baseURL}/quick/ongoing?order_by=${order_by || "updated"}&page=${page || 1}`,
            };
            let has_next_page = false;
            let has_prev_page = false;
            let current_pages = 0;
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
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
                    const current_page = (_g = $("#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a.current-page")) === null || _g === void 0 ? void 0 : _g.text();
                    const get_hash_next = (_h = $("#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a:nth-child(7)")) === null || _h === void 0 ? void 0 : _h.attr("aria-disabled");
                    const get_hash_prev = (_j = $("#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a:nth-child(1)")) === null || _j === void 0 ? void 0 : _j.attr("aria-disabled");
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
const getAnimeLatest = (req, res) => {
    const { order_by, page } = req.query;
    return new Promise((resolve, reject) => {
        try {
            const options = {
                url: `${baseURL_1.baseURL}/quick/finished?order_by=${order_by || "latest"}&page=${page || 1}`,
            };
            let has_next_page = false;
            let has_prev_page = false;
            let current_pages = 0;
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
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
                    const current_page = (_g = $("#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a.current-page")) === null || _g === void 0 ? void 0 : _g.text();
                    const get_hash_next = (_h = $("#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a:nth-child(7)")) === null || _h === void 0 ? void 0 : _h.attr("aria-disabled");
                    const get_hash_prev = (_j = $("#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a:nth-child(1)")) === null || _j === void 0 ? void 0 : _j.attr("aria-disabled");
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
exports.getAnimeLatest = getAnimeLatest;
const getAnimeMovie = (req, res) => {
    const { order_by, page } = req.query;
    return new Promise((resolve, reject) => {
        try {
            const options = {
                url: `${baseURL_1.baseURL}/quick/movie?order_by=${order_by || "latest"}&page=${page || 1}`,
            };
            let has_next_page = false;
            let has_prev_page = false;
            let current_pages = 0;
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
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
                    const current_page = (_g = $("#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a.current-page")) === null || _g === void 0 ? void 0 : _g.text();
                    const get_hash_next = (_h = $("#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a:nth-child(7)")) === null || _h === void 0 ? void 0 : _h.attr("aria-disabled");
                    const get_hash_prev = (_j = $("#animeList > div.col-lg-12.col-md-12.col-sm-12.mt-3 > div > div > a:nth-child(1)")) === null || _j === void 0 ? void 0 : _j.attr("aria-disabled");
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
exports.getAnimeMovie = getAnimeMovie;
const getAnimeSeasonList = (req, res) => {
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
                        .find("a > span")
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
            console.log(error);
            res.status(500).json({
                status: "error",
                message: error.message,
            });
            reject(error);
        }
    });
};
exports.getAnimeSeasonList = getAnimeSeasonList;
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
const getAnimeByDetails = (req, res) => {
    const { page } = req.query;
    const { anime_code, anime_id } = req.params;
    return new Promise((resolve, reject) => {
        let has_next_page = false;
        let has_prev_page = false;
        let has_next_link = null;
        let has_prev_link = null;
        try {
            const options = {
                url: `${baseURL_1.baseURL}/anime/${anime_code}/${anime_id}?page=${page || 1}`,
            };
            (0, request_1.default)(options, (error, response, body) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
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
                    const eps = (_a = $$(e).attr("href")) === null || _a === void 0 ? void 0 : _a.trim().replace(`${baseURL_1.baseURL}`, "");
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
                const list_episode = (_a = $("#animeEpisodes > a")
                    .map((i, index) => {
                    var _a, _b, _c, _d;
                    return ({
                        eps_title: (_b = (_a = $(index)
                            .text()) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, "")) === null || _b === void 0 ? void 0 : _b.replace("Ep", "Episode -"),
                        eps_slug: (_c = $(index).attr("href")) === null || _c === void 0 ? void 0 : _c.replace(baseURL_1.baseURL, ""),
                        active_eps: (_d = $(index)) === null || _d === void 0 ? void 0 : _d.hasClass("active-ep"),
                    });
                })) === null || _a === void 0 ? void 0 : _a.get();
                if (list_episode.length > 0 &&
                    !list_episode[list_episode.length - 1].eps_title.trim()) {
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
                const title = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__title > h3").text();
                const images = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-3 > div").attr("data-setbg");
                const descriptions = (_c = (_b = $("#synopsisField")
                    .text()) === null || _b === void 0 ? void 0 : _b.replace(/\n/g, "")) === null || _c === void 0 ? void 0 : _c.trim();
                const type = (_e = (_d = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(1) > div > div.col-9 > a")
                    .text()) === null || _d === void 0 ? void 0 : _d.replace(/\n/g, "")) === null || _e === void 0 ? void 0 : _e.trim();
                const total_eps = (_g = (_f = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(2) > div > div.col-9 > a")
                    .text()) === null || _f === void 0 ? void 0 : _f.replace(/\n/g, "")) === null || _g === void 0 ? void 0 : _g.trim();
                const status = (_j = (_h = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(3) > div > div.col-9 > a")
                    .text()) === null || _h === void 0 ? void 0 : _h.replace(/\n/g, "")) === null || _j === void 0 ? void 0 : _j.trim();
                const release = (_l = (_k = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(4) > div > div.col-9")
                    .text()) === null || _k === void 0 ? void 0 : _k.replace(/\n/g, "")) === null || _l === void 0 ? void 0 : _l.trim();
                const season = (_o = (_m = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(5) > div > div.col-9 > a")
                    .text()) === null || _m === void 0 ? void 0 : _m.replace(/\n/g, "")) === null || _o === void 0 ? void 0 : _o.trim();
                const duration = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(6) > div > div.col-9 > a").text();
                const quality = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(7) > div > div.col-9 > a").text();
                const counrty = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(8) > div > div.col-9 > a").text();
                const adaptation = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(9) > div > div.col-9 > a").text();
                const genre = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(1) > div > div.col-9 > a")
                    .map((i, index) => { var _a, _b; return (_b = (_a = $(index).text()) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, "")) === null || _b === void 0 ? void 0 : _b.trim(); })
                    .get();
                const explisit = (_q = (_p = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(2) > div > div.col-9")
                    .text()) === null || _p === void 0 ? void 0 : _p.replace(/\n/g, "")) === null || _q === void 0 ? void 0 : _q.trim();
                const demogration = (_s = (_r = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(3) > div > div.col-9")
                    .text()) === null || _r === void 0 ? void 0 : _r.replace(/\n/g, "")) === null || _s === void 0 ? void 0 : _s.trim();
                const themes = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(4) > div > div.col-9 > a")
                    .map((i, index) => { var _a, _b; return (_b = (_a = $(index).text()) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, "")) === null || _b === void 0 ? void 0 : _b.trim(); })
                    .get();
                const studio = (_u = (_t = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(5) > div > div.col-9 > a")
                    .text()) === null || _t === void 0 ? void 0 : _t.replace(/\n/g, "")) === null || _u === void 0 ? void 0 : _u.trim();
                const ratings = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(6) > div > div.col-9 > a").text();
                const popularity = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(7) > div > div.col-9 > a").text();
                const rating_policy = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(8) > div > div.col-9 > a").text();
                const credit = (_w = (_v = $("body > section.anime-details.spad > div > div.anime__details__content > div > div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(9) > div > div.col-9 > a")
                    .text()) === null || _v === void 0 ? void 0 : _v.replace(/\n/g, "")) === null || _w === void 0 ? void 0 : _w.trim();
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
const getAnimeByEpisode = (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            const { anime_code, anime_id, episode_id } = req.params;
            const { page } = req.query;
            const options = {
                url: `${baseURL_1.baseURL}/anime/${anime_code}/${anime_id}/episode/${episode_id}?QXCKFC2hpmVFvvv=8vIFROsi7w&PsAdpiUFrAc3n85=kuramadrive&page=${page || 1}`,
            };
            let has_next_page = false;
            let has_next_link = null;
            let has_prev_link = null;
            let has_prev_page = false;
            (0, request_1.default)(options, (error, response, body) => {
                var _a, _b;
                if (error || response.statusCode !== 200) {
                    return res.status(500).json({
                        status: "error",
                        message: "Failed to retrieve anime list",
                    });
                }
                const $ = cheerio.load(body);
                const episode_list = (_a = $("#player > source")
                    .map((i, index) => ({
                    source_video: $(index).attr("src"),
                    type_video: $(index).attr("type"),
                    size: $(index).attr("size"),
                }))) === null || _a === void 0 ? void 0 : _a.get();
                const eps_title = $("#episodeTitle").text();
                const list_episode = (_b = $("#animeEpisodes > a")
                    .map((i, index) => {
                    var _a, _b, _c, _d;
                    return ({
                        eps_title: (_b = (_a = $(index)
                            .text()) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, "")) === null || _b === void 0 ? void 0 : _b.replace("Ep", "Episode -"),
                        eps_slug: (_c = $(index).attr("href")) === null || _c === void 0 ? void 0 : _c.replace(baseURL_1.baseURL, ""),
                        active_eps: (_d = $(index)) === null || _d === void 0 ? void 0 : _d.hasClass("active-ep"),
                    });
                })) === null || _b === void 0 ? void 0 : _b.get();
                const total_eps = $("#animeEpisodes > a")
                    .map((i, index) => $(index).text())
                    .get().length;
                if (list_episode.length > 0 &&
                    !list_episode[list_episode.length - 1].eps_title.trim()) {
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
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    });
};
exports.getAnimeByEpisode = getAnimeByEpisode;
