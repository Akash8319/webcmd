import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const playwright = require('playwright');
const path = require('path');

async function main() {
  console.log("🚀 Launching FEED-TO-MESSAGE Automated Agent...");

  const userDataDir = path.join(process.cwd(), 'user_data');

  const context = await playwright.chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: ['--start-maximized'],
    viewport: null
  });
  
  const pages = context.pages();
  const page = pages.length > 0 ? pages[0] : await context.newPage();

  try {
    // 1. Land safely on feed page first
    console.log("📂 Step 1: Loading LinkedIn Main Feed...");
    await page.goto('https://www.linkedin.com', { waitUntil: 'load' });
    await page.waitForTimeout(4000); 

    // 2. Click the Messaging tab visually from the top bar
    console.log("🖱️ Step 2: Clicking the top-bar Messaging icon automatically...");
    const messagingTab = page.locator('#messaging-nav-item, a[href*="/messaging"]').first();
    await messagingTab.waitFor({ state: 'visible', timeout: 5000 });
    await messagingTab.click({ force: true });
    
    console.log("⏳ Step 3: Waiting for Messaging inbox panel to slide open...");
    await page.waitForTimeout(4000);

    // 3. Locate unread messages using structural bold styling filters
    console.log("🔍 Step 4: Scanning inbox rows for unread chats...");
    const unreadItem = page.locator('.msg-conversations-container__convo-item--unread, .msg-conversation-listitem--unread, [class*="unread"]').first();
    
    if (await unreadItem.isVisible()) {
      console.log("✉️ Unread message thread found! Opening chat container...");
      await unreadItem.click({ force: true });
      await page.waitForTimeout(2000);

      // Extract Sender and latest chat bubble content
      const senderName = await page.locator('.msg-thread__link-to-profile, [class*="profile-link"], h3').first().textContent().catch(() => 'Recruiter');
      const latestMessage = await page.locator('.msg-s-message-listitem__body, .msg-s-event-listitem__body, [class*="message-body"]').last().textContent().catch(() => 'No text extracted');

      console.log("\n====================================================");
      console.log(`📬 SENDER: ${senderName.trim()}`);
      console.log(`💬 UNREAD TEXT: "${latestMessage.trim()}"`);
      console.log("====================================================");
    } else {
      console.log("✅ Current inbox display view shows 0 unread messages.");
    }

    console.log("\n🚨 Safety Pause active for demo review. Press Ctrl+C to stop.");
    await new Promise(() => {});

  } catch (error) {
    console.error("❌ Execution stopped:", error.message);
    await context.close();
  }
}

main();