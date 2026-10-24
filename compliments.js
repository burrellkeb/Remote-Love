// compliments.js - the only file you need to edit.
// Used by both the widget (Scriptable) and the web app.
//
// Each date is the day the pair is SHOWN: it appears at 10:00 PM Central
// the night before and stays until 10:00 PM Central on that date.
//   "2026-10-25" shows from 10 PM Oct 24 until 10 PM Oct 25.
//
// Regular days: ["first compliment", "respin compliment"]
//   Write only what comes AFTER "I love" - the app adds "I love".
// Special days: { special: "full message" }   (no "I love", no respin)
// "2026-10-24" is what shows if she sets it up before 10 PM tonight.
//
// After editing, commit + push. Changes reach her within ~10 minutes.

var CONFIG = {
  herName: "",               // e.g. "Ava" (leave "" to hide)
  fromName: "Keegan",        // shown as "Pick Messages, then pick Keegan"
};

var COMPLIMENTS = {
  "2026-10-24": ["placeholder Oct 24 A", "placeholder Oct 24 B"],
  "2026-10-25": ["placeholder Oct 25 A", "placeholder Oct 25 B"],
  "2026-10-26": ["placeholder Oct 26 A", "placeholder Oct 26 B"],
  "2026-10-27": ["placeholder Oct 27 A", "placeholder Oct 27 B"],
  "2026-10-28": ["placeholder Oct 28 A", "placeholder Oct 28 B"],
  "2026-10-29": ["placeholder Oct 29 A", "placeholder Oct 29 B"],
  "2026-10-30": ["placeholder Oct 30 A", "placeholder Oct 30 B"],
  "2026-10-31": ["placeholder Oct 31 A", "placeholder Oct 31 B"],
  "2026-11-01": ["placeholder Nov 1 A", "placeholder Nov 1 B"],
  "2026-11-02": ["placeholder Nov 2 A", "placeholder Nov 2 B"],
  "2026-11-03": ["placeholder Nov 3 A", "placeholder Nov 3 B"],
  "2026-11-04": ["placeholder Nov 4 A", "placeholder Nov 4 B"],
  "2026-11-05": ["placeholder Nov 5 A", "placeholder Nov 5 B"],
  "2026-11-06": ["placeholder Nov 6 A", "placeholder Nov 6 B"],
  "2026-11-07": ["placeholder Nov 7 A", "placeholder Nov 7 B"],
  "2026-11-08": ["placeholder Nov 8 A", "placeholder Nov 8 B"],
  "2026-11-09": ["placeholder Nov 9 A", "placeholder Nov 9 B"],
  "2026-11-10": ["placeholder Nov 10 A", "placeholder Nov 10 B"],
  "2026-11-11": ["placeholder Nov 11 A", "placeholder Nov 11 B"],
  "2026-11-12": ["placeholder Nov 12 A", "placeholder Nov 12 B"],
  "2026-11-13": ["placeholder Nov 13 A", "placeholder Nov 13 B"],
  "2026-11-14": ["placeholder Nov 14 A", "placeholder Nov 14 B"],
  "2026-11-15": ["placeholder Nov 15 A", "placeholder Nov 15 B"],
  "2026-11-16": ["placeholder Nov 16 A", "placeholder Nov 16 B"],
  "2026-11-17": ["placeholder Nov 17 A", "placeholder Nov 17 B"],
  "2026-11-18": ["placeholder Nov 18 A", "placeholder Nov 18 B"],
  "2026-11-19": ["placeholder Nov 19 A", "placeholder Nov 19 B"],
  "2026-11-20": ["placeholder Nov 20 A", "placeholder Nov 20 B"],
  "2026-11-21": ["placeholder Nov 21 A", "placeholder Nov 21 B"],
  "2026-11-22": ["placeholder Nov 22 A", "placeholder Nov 22 B"],
  "2026-11-23": ["placeholder Nov 23 A", "placeholder Nov 23 B"],
  "2026-11-24": ["placeholder Nov 24 A", "placeholder Nov 24 B"],
  "2026-11-25": ["placeholder Nov 25 A", "placeholder Nov 25 B"],
  "2026-11-26": { special: "I am so happy to spend my Thanksgiving with you" },  // Thanksgiving: no "I love", no respin
  "2026-11-27": ["placeholder Nov 27 A", "placeholder Nov 27 B"],
  "2026-11-28": ["placeholder Nov 28 A", "placeholder Nov 28 B"],
  "2026-11-29": ["placeholder Nov 29 A", "placeholder Nov 29 B"],
  "2026-11-30": ["placeholder Nov 30 A", "placeholder Nov 30 B"],
  "2026-12-01": ["placeholder Dec 1 A", "placeholder Dec 1 B"],
  "2026-12-02": ["placeholder Dec 2 A", "placeholder Dec 2 B"],
  "2026-12-03": ["placeholder Dec 3 A", "placeholder Dec 3 B"],
  "2026-12-04": ["placeholder Dec 4 A", "placeholder Dec 4 B"],
  "2026-12-05": ["placeholder Dec 5 A", "placeholder Dec 5 B"],
  "2026-12-06": ["placeholder Dec 6 A", "placeholder Dec 6 B"],
  "2026-12-07": ["placeholder Dec 7 A", "placeholder Dec 7 B"],
  "2026-12-08": ["placeholder Dec 8 A", "placeholder Dec 8 B"],
  "2026-12-09": ["placeholder Dec 9 A", "placeholder Dec 9 B"],
  "2026-12-10": ["placeholder Dec 10 A", "placeholder Dec 10 B"],
  "2026-12-11": ["placeholder Dec 11 A", "placeholder Dec 11 B"],
  "2026-12-12": ["placeholder Dec 12 A", "placeholder Dec 12 B"],
  "2026-12-13": ["placeholder Dec 13 A", "placeholder Dec 13 B"],
  "2026-12-14": ["placeholder Dec 14 A", "placeholder Dec 14 B"],
  "2026-12-15": ["placeholder Dec 15 A", "placeholder Dec 15 B"],
  "2026-12-16": ["placeholder Dec 16 A", "placeholder Dec 16 B"],
  "2026-12-17": ["placeholder Dec 17 A", "placeholder Dec 17 B"],
  "2026-12-18": ["placeholder Dec 18 A", "placeholder Dec 18 B"],
  "2026-12-19": ["placeholder Dec 19 A", "placeholder Dec 19 B"],
  "2026-12-20": ["placeholder Dec 20 A", "placeholder Dec 20 B"],
  "2026-12-21": ["placeholder Dec 21 A", "placeholder Dec 21 B"],
  "2026-12-22": ["placeholder Dec 22 A", "placeholder Dec 22 B"],
  "2026-12-23": ["placeholder Dec 23 A", "placeholder Dec 23 B"],
  "2026-12-24": { special: "Your Christmas gift will take over from here" },  // Christmas Eve: no "I love", no respin
};
