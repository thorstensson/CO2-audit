# Carbonlog

> **v1** — A CO₂ measurement tool that uses [`@tgwf/co2`](https://www.thegreenwebfoundation.org/) and Puppeteer to estimate the carbon emissions of web pages. Built with Nuxt 4, Tailwind CSS 4, Supabase, and TypeScript :coffee:

## Why it matters

The internet isn't invisible. Every megabyte downloaded emits CO₂ — heavy, unoptimized websites quietly add to the digital ecosystem's **2.1–4% share of global greenhouse gas emissions**. That rivals the entire aviation industry.

Sustainability and performance go hand-in-hand. Lighter pages mean lower emissions and faster load times, which directly impact user conversion and SEO. And for millions of users on slower connections or older devices, a lightweight web isn't just a nice-to-have — it's a matter of digital inclusion.

Carbonlog helps developers measure and track the carbon footprint of their sites so they can build a greener, faster, fairer web.

## What it does

Carbonlog runs Lighthouse audits via Puppeteer, extracts performance metrics, and calculates estimated CO₂ emissions per page visit using the [Sustainable Web Design (SWD)](https://www.thegreenwebfoundation.org/) model. Goose.

## Status

:white_check_mark: v1 live.

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```
