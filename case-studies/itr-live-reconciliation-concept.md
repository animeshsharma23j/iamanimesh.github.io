# A Live-Reconciliation ITR
### A concept note, not a case study — no research or testing behind this yet

---

**Status:** Idea stage only. Nothing here has been built, tested, or validated with a single participant. Written the same way [itr-whatsapp-concept.md](itr-whatsapp-concept.md) was — to decide whether it's worth turning into real research, sitting next to [income-tax.html](../income-tax.html).

---

## Where this idea comes from

Two things collided.

The original [Income Tax concept](../income-tax.html) already found the core complaint on the record: *"Salary, TDS, and broker data already sit in AIS and Form 26AS, but capital gains, dividends, and challan numbers still have to be typed in by hand."* Its Recover mockup — "We've filled in what your AIS already shows" — was a first answer to that, built from what interview participants asked for directly.

Separately, a side conversation asked which developed country has the easiest filing process and whether it was worth reading how they actually do it. Two systems came back with concrete, checkable detail: Estonia's e-MTA and Sweden's Skatteverket. Skatteverket in particular has three mechanics that go further than anything in the original concept's mockups:

- A **live preliminary tax calculation** on the dashboard that recalculates in real time as any section is edited — you always see "refund of X" or "owe Y" before committing to anything, not just at the end.
- A dedicated **"Check" step** for pre-filled data, separate from data entry — reviewing isn't implicit in scrolling past a field, it's a named screen with its own state.
- **Auto-generated schedule annexes** (K4 for securities sales, K5/K6 for property) built from data the tax authority already has, which the filer can accept as-is, edit line-by-line, or ignore and build manually.

None of that is a new principle — the original concept's "reuse what the system already knows" theme already named the problem. What Sweden adds is a specific mechanism for it, mapped onto the exact schedule structure India's own portal uses.

## What this deliberately is not

Same boundary as the WhatsApp note, for the same reason: a return is a legal submission, and AIS data in India is not as reliable as the employer/bank reporting Sweden and Estonia pre-fill from — broker and RTA reporting to AIS has known lag and mismatch issues today. So this stays scoped to the two mechanics above, not a claim that India's data is clean enough to auto-file anything.

- **Not auto-filing.** Every pre-filled figure stays a proposal until the filer confirms it, the same way the original concept's Recover screen already worked — this just makes the confirmation step do more.
- **Not a claim that AIS is accurate enough to trust blindly.** Sweden's pre-fill works because employer and bank reporting is near-100% complete and timely. Whether AIS is close enough to that bar for capital gains specifically is an open question, not an assumption this note gets to make.
- **Not a redesign of Schedule CG's legal structure.** The schedule stays what it is — this only changes how a filer gets from "AIS transaction data" to "the numbers this schedule already asks for."

## What the flow might look like

Illustrative only — extends the original concept's Ask → Resolve → Recover sequence, using the same stock-sale-plus-rental scenario the WhatsApp note used as its example.

**Ask / Resolve**, unchanged from the original concept: guided eligibility questions land on "you'll likely file ITR-2" — salary, capital gains, rental income, no business income.

**Recover, extended.** The original mockup showed three lines: salary matched, interest matched, capital gains needs a look. A live-reconciliation version adds what's underneath "needs a look":

> **Schedule CG — capital gains**
> Your AIS shows 2 sale transactions in March: 40 shares of [Company], holding period 8 months. We've built a draft Schedule CG entry from this — short-term, since it's under 12 months.
>
> *[Draft entry shown: sale value, cost basis, gain, tax treatment — each field editable]*
>
> This is a draft, not a filed number. Check it against your own records before continuing.
>
> **Schedule HP — house property**
> AIS doesn't carry rental income — that's expected, it isn't broker- or bank-reported. You told us ₹1,80,000 for the year; nothing here was auto-filled.

**A running total, visible throughout.** Instead of only surfacing tax owed/refund on a final summary screen, the same number sits at the top of every review screen and updates the moment a draft figure is edited — the mechanic Skatteverket's live calculation demonstrates, applied to India's own computation.

**Before submission**, a specific, typed confirmation replacing a generic checkbox: *"I've checked the capital gains draft above against my own records and it's correct."* Tied to the specific schedule that was auto-drafted, not a blanket "I agree to the above."

## What would have to be true for this to survive contact with research

In descending order of "would kill the concept if wrong":

1. **AIS capital-gains data is complete and accurate enough to draft from.** This is the load-bearing assumption and untested here. Sweden's K4 works because broker reporting to Skatteverket is mandated, standardized, and essentially complete. If AIS is missing transactions, has settlement-date mismatches, or lags broker records by weeks, a "draft" schedule becomes a wrong draft that looks authoritative — worse than a blank field, not better. This needs checking against real AIS exports before anything else here is worth building.
2. **A visible draft number anchors people instead of just being overwritten.** The original concept already found that a stated recommendation ("you'll likely file ITR-2") needed a visible way to say "that's not right," because early testing showed people trusted a confident-looking answer more than they should have. A draft Schedule CG entry carries the same risk at higher stakes — wrong numbers, not wrong form choice. Whether the "check it against your own records" framing actually gets read, or gets clicked past the way pre-filled fields usually do, is a real usability question, not a given.
3. **A live running total changes behavior, not just visibility.** Sweden's design bet is that seeing the number update live makes people scrutinize a change instead of clicking past it. That's plausible, not established — it could just as easily become another number to ignore. Worth testing directly rather than assumed from the fact that Skatteverket does it.
4. **This is additive to the existing concept's Recover screen, not a competing direction.** If it turns out the auto-draft adds review burden without reducing entry burden — because the filer still has to verify every field line by line — this collapses back into "the same manual entry, with extra steps first." That's a real failure mode, not a hypothetical one, and testing should watch for it explicitly.

## Where this sits

This stays a note until (1) gets checked against real AIS data structure and (2) gets tested with participants who actually have capital gains to report — ideally in the same second round the original concept's reflection section already called for, since it's the same audience question either way. If AIS turns out too unreliable to draft from confidently, the honest move is to say so and keep the original concept's simpler "flag the gap, don't fill it" approach instead.
