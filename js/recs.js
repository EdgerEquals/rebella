/* ==========================================================================
   REBELLA RECOMMENDATIONS: the ONLY file you need to edit to update the
   Recommendations page (recommendations.html). See README.md for an example.

   - Fill in the text between the quote marks. Leave a field as "" and the page
     shows a friendly "coming soon" placeholder for that section instead.
   - Links must start with https:// (songs and videos are LINKS only: never
     upload audio to the site).
   - For the celebrity's kind deed, add a "source" link to a trustworthy news
     article so readers (and Bonnie) can check it really happened.
   - About me: interests only. NO name, school, suburb, age or photos.
   - Bonnie checks every update before it goes live.
   ========================================================================== */
window.REBELLA_RECS = {
  updated: "",            // e.g. "Week of 26 October 2026"

  song: {
    title: "",            // song name
    artist: "",           // who sings it
    why: "",              // why I chose this
    link: ""              // optional https:// link to the song (e.g. a music site)
  },

  celebrity: {
    name: "",             // who they are
    who: "",              // one line: what they're known for
    deed: "",             // the kind thing they did
    why: "",              // why I chose them
    source: ""            // https:// link to a news story about the kind deed
  },

  quote: {
    text: "",             // the quote, without quote marks
    by: "",               // who said it
    why: ""               // why I chose it
  },

  goal: {
    goal: "",             // the goal for everyone this week
    why: ""               // why I chose it
  },

  // Anything else I recommend. Copy the { ... } block to add more.
  other: [
    // { title: "", type: "Book", why: "", link: "" }
  ],

  about: {
    interests: [],        // e.g. ["drawing", "space", "netball", "baking"]
    note: ""              // one or two sentences about what I love. No personal details!
  }
};
