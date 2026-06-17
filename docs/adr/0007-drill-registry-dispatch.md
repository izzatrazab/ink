# Grade Drills are dispatched through one Drill registry

The Standard 1 and Standard 6 Drills are reached through a single **Drill registry** — `src/lib/server/exports/registry.ts`, a slug → `{ label, make(numberOfPages) }` map per grade — consumed by one dynamic `[type]/+server.ts` route per grade. The registry is the one place that answers "which grade Drills are reachable, and by what name."

Previously the two grades dispatched differently: Standard 6 had four near-identical explicit route files (one per operation), while Standard 1 used a `[type]` route with a `switch`. Both restated the same per-Drill knowledge — which class to construct and what to call the file — and the Standard 1 route carried a bug from that duplication: it hardcoded every filename to "Standard 1 Addition", so a subtraction Worksheet downloaded mislabelled. Apply the deletion test: delete the registry and that `{ constructor, filename }` knowledge scatters back across one `+server.ts` per Drill, where it drifts out of sync again. Adding a grade Drill is now one registry entry, and the filename convention lives once.

ColumnMethod and LongDivisionMethod are deliberately **not** in the registry. They are not `DrillBase` drills (ADR-0004), and they take operation/difficulty/remainder parameters rather than a bare page count, so they do not fit the registry's `make(numberOfPages)` shape. They keep their own routes. This is recorded so a future pass does not flag them as "the two drills missing from the registry" and try to force them in — the registry covers the `DrillBase` grade Drills only.

An unknown slug is now a 404 (it previously fell through to addition on the Standard 1 route). The generator pages only link valid slugs, so this affects malformed requests only, and surfacing them is more honest than silently serving addition.

## Consequences

- A new grade Drill is added by writing its Generator + drawing class (ADR-0001), then one registry entry — not a new route file. Re-introducing a per-Drill `+server.ts` re-opens the duplication and the filename drift this consolidation closed.
- The registry's `make(numberOfPages)` shape is the price of entry. A Drill that needs other parameters (as ColumnMethod and LongDivisionMethod do) does not belong here; give it its own route rather than widening the registry's interface to fit one caller.
