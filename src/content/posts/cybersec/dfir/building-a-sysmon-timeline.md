---
title: Turning Sysmon events into a timeline
description: Putting process, file, and network events in the right order to understand what happened.
date: '2026-10-10'
tags:
- DFIR
- Sysmon
- Windows
read: 7
---

Logs become useful when they answer an investigation question. For a timeline, I want to know what happened first, what followed, and which events belong to the same activity.

A PID can be reused. When available, I use ProcessGuid and compare timestamps, parent processes, command lines, and network connections.
