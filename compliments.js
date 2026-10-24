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
  herName: "Hopie",  
  fromName: "Keegan", 
};

var COMPLIMENTS = {
  "2026-10-24": ["your hair", "your smile"],
  "2026-10-25": ["your laugh", "your thighs"],
  "2026-10-26": ["your hands", "your style"],
  "2026-10-27": ["your artist's eye", "your perspective"],
  "2026-10-28": ["your eyes", "your lips"],
  "2026-10-29": ["your morning stretches", "that spot on your hip"],
  "2026-10-30": ["kissing you", "your torso"],
  "2026-10-31": ["your back", "kissing your shoulders"],
  "2026-11-01": ["talking to you", "your tipsy smile"],
  "2026-11-02": ["kissing your fingers", "listening to you"],
  "2026-11-03": ["admiring you", "making things for you"],
  "2026-11-04": ["your cheeks when you smile", "spending time with you"],
  "2026-11-05": ["your humor", "watching TV with you"],
  "2026-11-06": ["how much I miss you", "sleeping with you"],
  "2026-11-07": ["holding you", "getting you gifts"],
  "2026-11-08": ["waking up next to you", "making your bed"],
  "2026-11-09": ["your face", "getting calls from you"],
  "2026-11-10": ["dreaming about you", "how you make me feel"],
  "2026-11-11": ["showering with you", "envisioning a future with you"],
  "2026-11-12": ["waking up to notifications from you", "hugging you"],
  "2026-11-13": ["looking forward to seeing you", "how we only have a week left!!!"],
  "2026-11-14": ["your positivity", "experiencing life with you"],
  "2026-11-15": ["talking about you", "showing you off"],
  "2026-11-16": ["how talented you are", "your work ethic"],
  "2026-11-17": ["how safe you feel", "that mattress in Nashville"],
  "2026-11-18": ["going out with you", "your reels"],
  "2026-11-19": ["your obsession with LOTR", "dancing with you"],
  "2026-11-20": ["looking forward to seeing you", "that I get to see you tomorrow!!!"],
  "2026-11-21": ["that I will see you soon", "that we will be sleeping together tonight"],
  "2026-11-22": ["that I woke up next to you", "spending time with you"],
  "2026-11-23": ["being in Italy with you", "bringing you to dinner with my family"],
  "2026-11-24": ["how fun you are", "that you're ethereal"],
  "2026-11-25": ["your jewelry", "your heart"],
  "2026-11-26": { special: "I am so happy to spend my Thanksgiving with you" },  // Thanksgiving: no "I love", no respin
  "2026-11-27": ["your calves ", "when you wear the slippers I got you"],
  "2026-11-28": ["the gifts you've given me", "loving you"],
  "2026-11-29": ["your smile when you look at me", "looking at photos of you"],
  "2026-11-30": ["your kindness", "literally everything about you"],
  "2026-12-01": ["meeting people with you", "introducing you to people"],
  "2026-12-02": ["your friends", "your ears"],
  "2026-12-03": ["our relationship", "beholding you"],
  "2026-12-04": ["getting invisible texts from you", "your stories"],
  "2026-12-05": ["treating you well", "your collarbone"],
  "2026-12-06": ["your jaw", "giving you massages"],
  "2026-12-07": ["your body", "your mind"],
  "2026-12-08": ["your soul", "getting you candy"],
  "2026-12-09": ["dinners with you", "your wit"],
  "2026-12-10": ["when your clothes match your eyes", "your juicy biceps"],
  "2026-12-11": ["sleeping in with you", "staying up late with you ;)"],
  "2026-12-12": ["driving you around", "your mannerisms"],
  "2026-12-13": ["knowing you", "reading to you"],
  "2026-12-14": ["shopping with you", "picking you up"],
  "2026-12-15": ["visiting you", "kissing your spine"],
  "2026-12-16": ["your hobbies", "bragging about you"],
  "2026-12-17": ["your family", "you resting your legs on my lap"],
  "2026-12-18": ["your head on my chest", "your hair down"],
  "2026-12-19": ["you showing me your Pinterest boards", "your interests"],
  "2026-12-20": ["drinking with you", "your hand on my face"],
  "2026-12-21": ["loving you", "your mismatched socks"],
  "2026-12-22": ["how you talk to me", "that you make me want to be a better man"],
  "2026-12-23": ["that you will finally see my gifts tomorrow!", "you more than anything"],
  "2026-12-24": { special: "Your Christmas gift will take over from here" },  // Christmas Eve: no "I love", no respin
};
