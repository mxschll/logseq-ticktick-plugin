# Logseq TickTick Plugin

**Disclaimer:** This is not an official plugin and is not affiliated with TickTick in any way.

This is a plugin for [Logseq](https://logseq.com/) that allows you to create tasks in [TickTick](https://ticktick.com/) without leaving Logseq.

## Features

- [x] Create tasks in TickTick from Logseq
- [x] Set the priority of the task
- [x] Create subtasks

Future features:

- [ ] Create tasks with due dates
- [ ] Create tasks with reminders
- [ ] Create tasks with tags
- [ ] Create tasks with notes
- [ ] OAuth2 authentication

## Installation

1. Install the plugin from the marketplace or build it from source and load unpacked plugin
2. Go to <https://mxschll.github.io/logseq-ticktick-plugin/> and follow the instructions to get your TickTick credentials
3. Copy the credentials and paste them into the plugin settings in Logseq

## Usage

- Use the `/tt`-command to create a task in TickTick
- The task's priority level is determined by the presence of `[#A]`, `[#B]`, or `[#C]` and set in TickTick accordingly where `[#A]` is the highest priority and `[#C]` is the lowest priority
- Subtasks are automaticaly created from child blocks


