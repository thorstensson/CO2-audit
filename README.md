# Carbonlog

> **WIP** — An upcoming CO₂ measurement tool that uses [`@tgwf/co2`](https://www.thegreenwebfoundation.org/) and Puppeteer to estimate the carbon emissions of web pages. Honestly, I could do with a carbonlog of some of my own work. This project will be developed in stages. The beta version will be a public main...
> :coffee:

Built with Nuxt 4, Tailwind CSS 4, Supabase, and TypeScript.

## What it does

CarbonLog runs Lighthouse audits via Puppeteer, extracts performance metrics, and calculates estimated CO₂ emissions per page visit using the [Sustainable Web Design (SWD)](https://www.thegreenwebfoundation.org/) model. The goal is to give developers a simple dashboard for tracking the carbon footprint of their sites.

## Status

:herb: Early development.

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
