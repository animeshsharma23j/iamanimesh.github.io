# File Your ITR on WhatsApp
### A concept note, not a case study — no research or testing behind this yet

---

**Status:** Idea stage only. Nothing here has been built, tested, or validated with a single participant. Written to decide whether this is worth turning into real research, in the same way [income-tax.html](../income-tax.html) was.

---

## Where this idea comes from

Two pieces of existing work collide here.

**UnitX** treats a converter as a parsing problem, not a form: `72 kg to lb` gets read as intent, not filled into three separate dropdowns. The insight isn't "chat is a good interface" — it's that letting people state what they want in their own words removes setup steps that don't need to exist.

**The Income Tax concept** already asked whether that same idea applies to tax filing — and the honest answer, on the record, was *not yet*. The [research](../income-tax.html) found people asking for a chatbot, and the write-up talked itself out of it: *"read next to everything else, they look like a symptom of the same problem the plain-language decision already targets — help that lives outside the flow instead of inside it. The design bet here was to fix that first, rather than add a chat window on top of a process that still doesn't explain itself."*

So this note has to answer the objection its own prior work raised, not ignore it. A chat window bolted onto a confusing form is a worse form. The question worth testing is narrower: is WhatsApp a different *channel*, not just a different *widget* — one that changes who can even attempt filing in the first place, independent of how good the form itself is?

Two things point that way, both already sitting in the original research and neither followed up on:

- Three of five interview participants filed in English despite it not being their first language — flagged in the original write-up as "out of scope here, but it's now the first thing the next round should test properly." WhatsApp is where most of that audience already types in their own language, on a keyboard they already use daily.
- The senior-citizen participants' entire barrier was an unfamiliar interface, not the tax logic itself (*"my son used to do this"*). WhatsApp is the one interface they don't have to learn.

If neither of those turns out to matter in testing, the channel doesn't earn its place and this stays a note, not a project.

## What this deliberately is not

Filing a return is a legal submission, not a converted value — the cost of a parsing mistake is not "reopen and fix," it's a government notice. So the scope has to stop well short of "file it."

- **Not e-filing.** Actually submitting a return under someone else's login requires ERI (e-Return Intermediary) registration with the Income Tax Department — a compliance relationship, not a feature.
- **Not identity/signature handling.** Aadhaar-OTP and DSC e-verification stay on the government portal or with a licensed filer, never in a chat thread.
- **Not a place to hold PAN, bank, or income data at rest** without the same DPDP-grade handling the government portal itself is obligated to. A WhatsApp thread accumulating a person's full financial picture is itself a risk the concept has to design against, not route around.

What's left, once those are cut, is narrower and more honest: **collect and reconcile, then hand off.** The bot has a conversation, produces a filled draft and a plain-language summary of what it assumed, and the person carries that into the actual portal or to a CA — the same handoff the original concept already designed for the "resolve" screen, just reached by a different door.

## What the conversation might look like

Illustrative only — not a transcript of anything built or tested.

> **Bot:** Hi — I can help you get ready to file. Quick one first: any income this year besides salary? (freelance work, stocks, rent, etc.)
>
> **User:** yeah sold some stocks in march, and got rent from a flat
>
> **Bot:** Got it — capital gains and rental income, on top of salary. That usually means ITR-2 or ITR-3 depending on a couple more details. I'll ask as we go, not all at once.
>
> Can you send a photo or PDF of your AIS statement, or Form 26AS? I'll check it against what you tell me instead of asking you to retype numbers that are already on file.
>
> **User:** [sends PDF]
>
> **Bot:** Thanks. I see salary TDS and two stock sale entries in there already. One thing doesn't match yet: you mentioned rent, but I don't see it in this statement — that's normal, rent isn't reported there. Roughly how much did you receive in total this year?
>
> **User:** around 180000
>
> **Bot:** Noted. So far: ITR-2 looks right, based on capital gains + rental + salary, no business income. Nothing here says "you have to add a schedule" yet — that's determined, not chosen. I'll flag it plainly if that changes.
>
> When you're ready, I'll put together a summary of everything so far — what's confirmed from your documents, what you told me directly, and what still needs a number from you — so you can check it before it goes anywhere.

Every one of those bot turns is doing the same job the original wireframes named: guided eligibility instead of a form-number picker, reconciliation against what the system already has instead of re-asking, and a specific named gap ("rent isn't in this statement, that's normal") instead of a generic validation error. WhatsApp doesn't change the design principles — it changes who can reach them without opening an app they've never used.

## What would have to be true for this to survive contact with research

None of this is validated. In descending order of "would kill the concept if wrong":

1. **People don't want their tax details in a chat thread, full stop.** This is the most likely failure mode and the cheapest to test — a handful of the same kind of attitudinal interviews the original concept ran, asked directly: would you rather do this in an app you trust, or a chat you already use? If the answer is "app," WhatsApp adds a data-handling liability for no behavioral upside, and this note is done.
2. **Free-text financial figures are a worse error surface than free-text units.** `500 g to lb` parsed wrong is instantly, visibly wrong. `₹1,80,000` parsed as `₹18,00,000` from a typo or a garbled voice note is not visible until much later, and the stakes are a tax notice, not a re-conversion. Any real version needs the bot to read back every number it captured before moving on, every time — no exceptions for "obviously fine" ones.
3. **The vernacular-language advantage is real, not assumed.** The original research flagged this as untested; it has to be the first thing checked, with participants who don't file in English today, not inferred from where WhatsApp usage is high.
4. **There's a licensed filer or portal on the other end of the handoff**, otherwise "prepare and hand off" is a dead end at the exact moment someone needs it most. This is a partnership question before it's a design question.

## Where this sits

This stays a note until (1) and (3) above get tested the same way the original concept tested "guided eligibility vs. form picker" — with real participants, not assumption. If the channel genuinely changes who can start filing, it earns a real write-up next to [income-tax.html](../income-tax.html). If it turns out to just be a chat window on a confusing process wearing a different logo, the original write-up already predicted that outcome, and the honest move is to say so and drop it.
