# Feed-to-Message Automated Agent

A lightweight browser automation agent that logs into LinkedIn, navigates from the main feed to the Messaging inbox, and surfaces the most recent unread conversation — sender name and message preview — straight to the console.

Built with [Playwright](https://playwright.dev/) for the hackathon submission.

## What It Does

1. Launches a persistent Chromium browser session (so your LinkedIn login is reused across runs).
2. Loads the LinkedIn feed as a natural entry point.
3. Clicks the top navigation bar's **Messaging** icon, just like a real user would.
4. Waits for the inbox panel to load, then scans the conversation list for unread threads.
5. If an unread thread is found, opens it and extracts:
   - The sender's name
   - The latest message text in that thread
6. Prints a clean summary to the terminal.
7. Pauses at the end (`Ctrl+C` to exit) so the browser state stays visible for a live demo.

## Tech Stack

- **Node.js** (ES Modules)
- **Playwright** — for driving a real, persistent Chromium browser instance
- Vanilla JS, no external framework — kept intentionally minimal for a hackathon build

## Prerequisites

- Node.js 18+
- A LinkedIn account (you'll log in manually the first time; the session persists afterward)

## Installation

```bash
npm install playwright
npx playwright install chromium
```

## Usage

```bash
node hackathon_agent.js
```

- On the first run, a visible Chromium window opens with a fresh persistent profile stored in a local `user_data/` folder. Log in to LinkedIn manually when prompted.
- On subsequent runs, the saved session is reused, so the agent goes straight to the feed and then Messaging without requiring you to log in again.
- Once the agent finds an unread conversation, it prints the sender and message text to the console, then keeps the browser window open for review.

### Example Output

```
🚀 Launching FEED-TO-MESSAGE Automated Agent...
📂 Step 1: Loading LinkedIn Main Feed...
🖱️ Step 2: Clicking the top-bar Messaging icon automatically...
⏳ Step 3: Waiting for Messaging inbox panel to slide open...
🔍 Step 4: Scanning inbox rows for unread chats...
✉️ Unread message thread found! Opening chat container...

====================================================
📬 SENDER: Jane Doe
💬 UNREAD TEXT: "Hey, are you still available for a call this week?"
====================================================

🚨 Safety Pause active for demo review. Press Ctrl+C to stop.
```

If there are no unread messages, the agent reports that instead:

```
✅ Current inbox display view shows 0 unread messages.
```

## Project Structure

```
.
├── hackathon_agent.js   # Main automation script
├── user_data/           # Persistent browser profile (auto-created, git-ignored)
└── README.md
```

## How the Agent Navigates

The script uses resilient, fallback-friendly selectors at each step rather than a single brittle CSS class, so it keeps working even if LinkedIn tweaks its markup slightly:

- **Messaging entry point:** `#messaging-nav-item, a[href*="/messaging"]`
- **Unread indicator:** `.msg-conversations-container__convo-item--unread, .msg-conversation-listitem--unread, [class*="unread"]`
- **Sender name:** `.msg-thread__link-to-profile, [class*="profile-link"], h3`
- **Message body:** `.msg-s-message-listitem__body, .msg-s-event-listitem__body, [class*="message-body"]`

## Limitations & Disclaimer

- This project automates interactions with a real LinkedIn account using Playwright. Automating LinkedIn is against LinkedIn's [User Agreement](https://www.linkedin.com/legal/user-agreement) — this project is intended strictly as a **hackathon demo / proof of concept**, run against your own account, and not for production or unattended use.
- Selectors are based on LinkedIn's current DOM structure and may break if LinkedIn changes its UI.
- The script currently surfaces only the single most recent unread conversation; it does not send replies or mark messages as read/unread.
- No credentials are hardcoded — authentication relies entirely on the persistent browser profile created on first login.

## Possible Next Steps

- Loop through and summarize **all** unread conversations, not just the first.
- Feed extracted messages into an LLM to draft suggested replies.
- Add a headless mode with structured (JSON) output for pipeline integration.
- Package as a CLI with configurable polling intervals.

## License

For hackathon/demo purposes only.
