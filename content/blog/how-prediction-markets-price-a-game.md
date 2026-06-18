---
title: "How Prediction Markets Price a Game: Reading Kalshi and Polymarket Like a Bettor"
description: "A prediction market price is just a probability in cents. Here is how Kalshi and Polymarket turn a game into a number, and what a sharp reader watches for."
date: "2026-06-18"
category: "Prediction Markets"
author: "JT, founder of Lockr"
readMinutes: 6
keywords: ["prediction markets", "Kalshi", "Polymarket", "event contracts", "implied probability", "no-vig odds", "how prediction markets price a game", "reading prediction market prices"]
faq:
  - q: "What does a price of 65 cents mean on Kalshi or Polymarket?"
    a: "It means the market estimates roughly a 65 percent chance the outcome happens. Each contract pays 1 dollar if it resolves Yes and 0 if it resolves No, so the price in cents maps directly to implied probability. Buy at 65 cents and you risk 65 to make 35."
  - q: "Why are prediction market odds often better than a sportsbook?"
    a: "The Yes and No prices must sum to 1 dollar, so the implied probabilities total 100 percent with most of the house margin stripped out. A standard sportsbook line bakes in vig, about 4.76 percent on a -110 / -110 line, that pushes the implied odds above 100 percent. Prediction markets usually charge a much smaller trading fee instead, which is why their prices tend to sit closer to fair value."
  - q: "Do Kalshi and Polymarket set the prices themselves?"
    a: "No. Both run order books where traders post bids and asks and a matching engine pairs them, so price is driven by supply and demand. Kalshi is a CFTC-regulated exchange. Polymarket uses a hybrid order book that matches off-chain and settles on-chain on Polygon."
  - q: "How do prediction market prices move during a game?"
    a: "They reprice continuously as new information arrives. A goal, an injury update, a red card, or a surprising result shifts what traders are willing to pay, so the price updates in real time. You can also sell a contract before the event resolves to lock a gain or cut a loss."
  - q: "What is resolution risk on Polymarket?"
    a: "Polymarket settles through UMA's optimistic oracle. Someone proposes the outcome with a bond, there is roughly a two-hour window to dispute it, and a contested result can escalate to a token-holder vote. So even an obvious-looking result is not always paid instantly. Always read a market's resolution rules before assuming how and when it settles."
---
A prediction market price is a probability wearing a dollar sign. On Kalshi and Polymarket, a contract that pays out 1 dollar if an outcome happens trades somewhere between 0 and 100 cents, and that price is the market's estimate of how likely the outcome is. A 65 cent "Yes" share means the crowd thinks there is roughly a 65 percent chance, per [Polymarket's own help center](https://help.polymarket.com/en/articles/13364488-how-are-prices-calculated). Learn to read that number and you stop seeing odds. You start seeing a forecast you can argue with.

This is the skill that separates people who tail a play from people who understand it. Let us break down how a game becomes a number, why that number moves, and what a sharp reader looks for before clicking buy.

## How does a game become a single price?

Every event contract has the same simple plumbing. It settles at 1 dollar if the outcome happens and 0 if it does not. So the price you pay is the price of the probability. Buy a "Yes" contract at 25 cents and you are risking 25 cents to make 75, which is the market saying 25 percent, or 3 to 1, as [Kalshi's help center lays out](https://help.kalshi.com/markets/markets-101/how-are-prices-determined).

The Yes and No sides always sum to 1 dollar, because that is the total payout. If Yes is 56 cents, No has to be 44, and any gap gets arbitraged away in seconds. That constraint matters more than it sounds. It means the two implied probabilities sum to exactly 100 percent, [every time, on every contract](https://www.effortlessmath.com/blog/prediction-markets-vs-sportsbooks-pricing/).

A sportsbook line does not do that. A standard -110 / -110 line implies about 52.38 percent on each side, which adds up to 104.76 percent. That extra 4.76 percent is the vig, the house margin baked into both prices, [as the same breakdown shows](https://www.effortlessmath.com/blog/prediction-markets-vs-sportsbooks-pricing/). A prediction market price is closer to a clean, de-vigged number out of the box. That is the single most useful reason for a bettor to learn to read one.

> A sportsbook tells you the price. A prediction market shows you the probability the whole room agreed on, with most of the house margin stripped out.

## Who actually sets the number?

Neither venue sets prices the way a sportsbook does. Both run on order books, where traders post bids and asks and a matching engine pairs them.

Kalshi is a federally regulated exchange. It is a CFTC-designated contract market, the same regulatory category as the CME, and it [became the first exchange cleared for event contracts back in 2020](https://en.wikipedia.org/wiki/Kalshi). Orders flow into a central limit order book, a matching engine pairs them by price and time, and designated market makers help keep both sides liquid, [per Kalshi's overview](https://news.kalshi.com/p/what-is-kalshi-f573). Sports now make up the large majority of its weekly volume. In the week ending April 26, 2026, sports were about 88 percent of Kalshi's total volume, [per Cryptopolitan](https://www.cryptopolitan.com/kalshi-volume-ath-sports-prediction-market/), though that share moves with the sports calendar.

Polymarket reaches the same destination by a different road. It runs a hybrid central limit order book: orders are matched off-chain for speed, then settled on-chain on Polygon, [per its developer docs](https://docs.polymarket.com/developers/CLOB/introduction). It did not start there. Polymarket originally used an automated market maker based on Robin Hanson's logarithmic scoring rule, then [migrated fully to an order book by late 2022](https://rocknblock.io/blog/how-polymarket-works-the-tech-behind-prediction-markets). The displayed price is the midpoint of the bid-ask spread, unless that spread is wider than 10 cents, in which case it shows the last traded price, [per Polymarket](https://help.polymarket.com/en/articles/13364488-how-are-prices-calculated). Worth knowing: a wide spread means the midpoint you see may be softer than it looks.

## Why does the price move the moment news drops?

Because the price is a live forecast, not a posted line. It updates every time someone is willing to pay more or accept less. A score, an injury update, a comeback, a red card, all of it reprices in real time as traders react, [which is the entire point of the format](https://www.actionnetwork.com/online-sports-betting/reviews/kalshi-vs-polymarket).

The 2026 World Cup gave clean examples of this. When Spain opened with a scoreless draw against Cape Verde while other favorites dropped points, France moved ahead of Spain on Polymarket's tournament-winner market, [a shift DeFi Rate tracked](https://defirate.com/news/world-cup-odds-this-week-polymarket-and-kalshi-prices-for-every-match/). A single result moved the whole field. That is information becoming price in front of you.

The practical edge: you are not locked in. You can sell a contract before the event resolves to lock a gain or cut a loss, [which Polymarket builds in directly](https://help.polymarket.com/en/articles/13364060-what-is-polymarket). A price chart on these venues is a record of what the crowd learned, and when.

## What does a sharp reader look for?

Four things, fast.

First, the de-vig comparison. Convert the sportsbook line to a no-vig probability and put it next to the market price. A standard -110 / -110 sportsbook line carries about [4.76 percent of vig built into the two prices](https://www.effortlessmath.com/blog/prediction-markets-vs-sportsbooks-pricing/), while a prediction market's two sides sum to 100 percent with most of that margin gone and a typically thin trading fee in its place. When a market price beats your de-vigged book number, that is a real signal, not a vibe.

Second, fees, because they eat thin edges. Kalshi uses a maker-taker model where the taker fee is highest for mid-priced contracts near the 50 cent midpoint and lowest near the extremes, [per Deadspin's breakdown](https://deadspin.com/prediction-markets/kalshi/fees/). In plain terms, a coin-flip contract near 50 cents costs more in fees than a longshot priced in single digits. Price the fee in before you call something a value.

Third, liquidity and spread. A tight book with size on both sides is a price you can trust. A 12 cent spread on a thin market is a number to discount.

Fourth, resolution risk, which is unique to these venues. How does the contract actually settle? Kalshi resolves through the regulated exchange. Polymarket resolves through UMA's optimistic oracle: an outcome is proposed with a bond, there is a roughly [two-hour challenge window](https://startpolymarket.com/learn/how-markets-resolve/), and a dispute can escalate to a token-holder vote. Read the resolution rules before you assume an obvious result pays instantly.

## The takeaway

Reading a prediction market is reading a probability, sourced from people putting money behind their opinions, with most of the vig removed. That makes it one of the cleanest mirrors of true odds a bettor can find, and a sharp benchmark even on nights you never place a trade. It does not make you right. It tells you what the room believes and what it would cost to disagree.

This is education and entertainment, not betting or financial advice. Markets move, you can lose, and no read is a sure thing. Bet only what you can afford to lose, keep it 21-plus and legal where you are, and if it stops being fun, call 1-800-GAMBLER.
