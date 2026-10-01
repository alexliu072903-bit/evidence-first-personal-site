# Revising an Existing Site

## 1. Find the true latest version

The working directory may be behind the deployed repository, and other tools may have edited it. Before changing anything:

1. Fetch or clone the deployed repository into a scratch location and compare it with the working directory (`git log` on both, then a file diff).
2. If the working directory is behind, merge the newer commits into the copy you edit. Use a three-way merge per changed file (`git merge-file`), not a manual re-type.
3. Never edit the live directory in place. Work in a copy; propose the merge back and wait.

Symptoms of a stale base: content the owner remembers is missing, links that exist online are absent, a second article is gone.

## 2. Diagnose before redesigning

Write down, in plain words, what a first-time visitor cannot tell in the first screen. Typical gaps:

- the person's main strengths are implied, not stated;
- claims and the evidence for them sit far apart;
- large screenshots are used to fill space;
- alignment and density are uneven (a column off by a few pixels reads as carelessness).

## 3. Learn structure, keep content

When the owner gives a reference site, extract what it makes clear (for example, the three things the person does stated at the top), and how. Do not copy its sentences, projects, or visuals. State what you took and what you left.

## 4. Respect existing decisions

Read the repository's product and design notes and content decisions before editing. If your change contradicts one, say so, and let the owner decide which to update. Update the note once decided, with the date.

## 5. Report

End with: what changed and why, what was removed, what needs a decision, and how to view it. Do not publish.
