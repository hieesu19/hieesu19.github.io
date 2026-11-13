---
title: My first checks when opening a PE file
description: Headers, sections, imports, strings, and the entry point—what I check before reaching for a debugger.
date: '2026-11-09'
tags:
- Reverse Engineering
- PE
- IDA
image: late-night
read: 7
---

Before opening a debugger, I check the file type, architecture, and basic metadata. It gives me a starting point and often saves time later.

Then I look at the section table, imports, strings, and entry point. None of these tells the whole story, but each can suggest what to inspect next.

For anything suspicious, I work in an isolated lab, record the file hash, and avoid executing it on my everyday machine.

```bash
file sample.exe
sha256sum sample.exe
# Then inspect the sections, imports, and entry point
```
