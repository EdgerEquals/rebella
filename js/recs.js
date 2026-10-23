/* ==========================================================================
   REBELLA RECOMMENDATIONS: the ONLY file you need to edit to update the
   Recommendations page (recommendations.html). See README.md for an example.

   - Fill in the text between the quote marks. Leave a field as "" and the page
     shows a friendly "coming soon" placeholder for that section instead.
   - Links must start with https:// (songs and videos are LINKS only: never
     upload audio to the site).
   - "Rightfully Famous" (the celebrity block): add a "source" link to a
     trustworthy news article so readers (and Bonnie) can check it's true.
     Leave "source" empty rather than guess.
   - "why" notes are optional: leave one as "" and that pick simply shows without it.
   - About me: interests only. NO name, school, suburb, age or photos.
   - Bonnie checks every update before it goes live.
   ========================================================================== */
window.REBELLA_RECS = {
  updated: "Week of 23 October 2026",

  song: {
    title: "Tattoos",     // song name
    artist: "Natalie Jane", // who sings it
    why: "",              // optional: why I chose this
    link: "https://www.youtube.com/watch?v=Zw8r03tVVFg"  // official video (NatalieJaneVEVO)
  },

  // "Rightfully Famous" section (key stays "celebrity" so nothing else breaks)
  celebrity: {
    name: "Spencer Barbosa", // who they are
    who: "Canadian TikTok creator who shares self-love and body-acceptance videos and talks openly about being bullied at school.",
    deed: "",             // optional: one specific kind thing they did
    why: "For standing up against bullying and using her fame to encourage everyone to be a better, kinder person.",
    source: "https://ca.style.yahoo.com/tiktok-star-spencer-barbosa-interview-193504407.html"  // Yahoo Canada interview, Aug 2023
  },

  quote: {
    text: "Change the world with your smile, but don't let the world change your smile",  // without quote marks
    by: "",               // who said it: left empty because its origin is unclear (shows "Author unknown")
    why: ""               // why I chose it
  },

  goal: {
    goal: "Compliment a stranger.", // the goal for everyone this week
    why: ""               // why I chose it
  },

  // Anything else I recommend. Copy the { ... } block to add more.
  other: [
    // { title: "", type: "Book", why: "", link: "" }
  ],

  about: {
    interests: [],        // e.g. ["drawing", "space", "netball", "baking"]
    // Approved by Bonnie 23 Oct 2026. Each "\n" starts a new line on the page. Keep in sync with ABOUT_ME in _generator.py (home page card).
    note: "Hello!!\nMy name is Florence and I created this website!\nI play soccer, and I love camping and swimming at the beach (even though I'm deathly scared of sharks!!). I paint, and I play the viola, the guitar and a range of other instruments.\nI'm a proud Aussie girl!! I love learning about nutrition, herbal medicines and botany, and I adore everlasting flowers!\nI hope you have a wonderful day. Sending you all love xx\nBe brave. Be different. Be a rebel."
  }
};
