declare module "request";

declare module "cheerio" {
  interface Cheerio<T> {
    logHtml(this: Cheerio<T>): void;
  }
}
