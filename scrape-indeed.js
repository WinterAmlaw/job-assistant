#!/usr/bin/env node
const fs = require("fs");
const cheerio = require("cheerio");
const https = require("https");

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

async function scrapeIndeed(query) {
  const q = encodeURIComponent(query);
  const url = `https://www.indeed.com/jobs?q=${q}&l=`;
  const html = await fetch(url);
  const $ = cheerio.load(html);
  const jobs = [];
  $(".jobsearch-SerpJobCard, .result").each((_, el) => {
    const title = $(el).find("h2.jobTitle span").first().text() || $(el).find("h2.title a").text();
    const company = $(el).find(".companyName").text() || $(el).find(".company").text();
    const location = $(el).find(".companyLocation").text() || $(el).find(".location").text();
    const summary = $(el).find(".job-snippet").text().trim() || $(el).find(".summary").text().trim();
    const url = "https://www.indeed.com" + ($(el).find("a[data-jk]").attr("href") || $(el).find("h2.title a").attr("href") || "");
    if (title && company) {
      jobs.push({ title, company, location, summary, url });
    }
  });
  return jobs;
}

async function main() {
  const query = process.argv.slice(2).join(" ");
  if (!query) {
    console.error("Usage: node scrape-indeed.js <search terms>");
    process.exit(1);
  }
  const jobs = await scrapeIndeed(query);
  fs.writeFileSync("scraped-jobs.json", JSON.stringify(jobs, null, 2));
  console.log(`Saved ${jobs.length} jobs to scraped-jobs.json`);
}

if (require.main === module) main();
