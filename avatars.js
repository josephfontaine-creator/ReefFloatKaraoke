/* Reef Float Karaoke avatars. Names live here and in each file's metadata, never drawn on the image.
   reefAvatar(name) picks a default for a guest: a creature that alliterates with their first name
   (Mandy -> Manatee), otherwise any creature at random. Guests only ever see their own name plus the
   creature ("Mandy Manatee") and can spin to a different one; the fun names are for the DJ booth and files. */
window.REEF_AVATARS = [{"id": "zany-fish","name": "Zany Fish","adj": "Zany","creature": "Fish","file": "avatars/zany-fish.webp","y": "Fishy"},{"id": "goofy-crab","name": "Goofy Crab","adj": "Goofy","creature": "Crab","file": "avatars/goofy-crab.webp","y": "Crabby"},{"id": "anxious-jelly","name": "Anxious Jelly","adj": "Anxious","creature": "Jelly","file": "avatars/anxious-jelly.webp","y": "Jelly"},{"id": "manic-seahorse","name": "Manic Seahorse","adj": "Manic","creature": "Seahorse","file": "avatars/manic-seahorse.webp"},{"id": "goofy-shark","name": "Goofy Shark","adj": "Goofy","creature": "Shark","file": "avatars/goofy-shark.webp","y": "Sharky"},{"id": "eccentric-turtle","name": "Eccentric Turtle","adj": "Eccentric","creature": "Turtle","file": "avatars/eccentric-turtle.webp"},{"id": "frantic-octopus","name": "Frantic Octopus","adj": "Frantic","creature": "Octopus","file": "avatars/frantic-octopus.webp"},{"id": "goofy-jellyfish","name": "Goofy Jellyfish","adj": "Goofy","creature": "Jellyfish","file": "avatars/goofy-jellyfish.webp","y": "Jelly"},{"id": "eccentric-shark","name": "Eccentric Shark","adj": "Eccentric","creature": "Shark","file": "avatars/eccentric-shark.webp","y": "Sharky"},{"id": "mesmerized-seahorse","name": "Mesmerized Seahorse","adj": "Mesmerized","creature": "Seahorse","file": "avatars/mesmerized-seahorse.webp"},{"id": "zany-crab","name": "Zany Crab","adj": "Zany","creature": "Crab","file": "avatars/zany-crab.webp","y": "Crabby"},{"id": "nervous-turtle","name": "Nervous Turtle","adj": "Nervous","creature": "Turtle","file": "avatars/nervous-turtle.webp"},{"id": "zany-tang","name": "Zany Tang","adj": "Zany","creature": "Tang","file": "avatars/zany-tang.webp","y": "Tangy"},{"id": "goofy-marlin","name": "Goofy Marlin","adj": "Goofy","creature": "Marlin","file": "avatars/goofy-marlin.webp"},{"id": "frantic-puffer","name": "Frantic Puffer","adj": "Frantic","creature": "Puffer","file": "avatars/frantic-puffer.webp","y": "Puffy"},{"id": "wacky-geoduck","name": "Wacky Geoduck","adj": "Wacky","creature": "Geoduck","file": "avatars/wacky-geoduck.webp","hidden": true},{"id": "grinning-oyster","name": "Grinning Oyster","adj": "Grinning","creature": "Oyster","file": "avatars/grinning-oyster.webp"},{"id": "sarcastic-clam","name": "Sarcastic Clam","adj": "Sarcastic","creature": "Clam","file": "avatars/sarcastic-clam.webp"},{"id": "shell-shock-hermit-crab","name": "Shell Shock Hermit Crab","adj": "Shell Shock","creature": "Hermit Crab","file": "avatars/shell-shock-hermit-crab.webp","y": "Crabby"},{"id": "party-parrotfish","name": "Party Parrotfish","adj": "Party","creature": "Parrotfish","file": "avatars/party-parrotfish.webp"},{"id": "funky-ray","name": "Funky Ray","adj": "Funky","creature": "Ray","file": "avatars/funky-ray.webp"},{"id": "mellow-manatee","name": "Mellow Manatee","adj": "Mellow","creature": "Manatee","file": "avatars/mellow-manatee.webp"},{"id": "bouncing-boxfish","name": "Bouncing Boxfish","adj": "Bouncing","creature": "Boxfish","file": "avatars/bouncing-boxfish.webp","y": "Boxy"},{"id": "slick-eel","name": "Slick Eel","adj": "Slick","creature": "Eel","file": "avatars/slick-eel.webp"},{"id": "cheeky-coral","name": "Cheeky Coral","adj": "Cheeky","creature": "Coral","file": "avatars/cheeky-coral.webp"},{"id": "surfer-turtle","name": "Surfer Turtle","adj": "Surfer","creature": "Turtle","file": "avatars/surfer-turtle.webp"},{"id": "clumsy-seal","name": "Clumsy Seal","adj": "Clumsy","creature": "Seal","file": "avatars/clumsy-seal.webp"},{"id": "goofy-walrus","name": "Goofy Walrus","adj": "Goofy","creature": "Walrus","file": "avatars/goofy-walrus.webp"},{"id": "hyper-damselfish","name": "Hyper Damselfish","adj": "Hyper","creature": "Damselfish","file": "avatars/hyper-damselfish.webp"},{"id": "zippy-wrasse","name": "Zippy Wrasse","adj": "Zippy","creature": "Wrasse","file": "avatars/zippy-wrasse.webp"},{"id": "bold-stingray","name": "Bold Stingray","adj": "Bold","creature": "Stingray","file": "avatars/bold-stingray.webp"},{"id": "dreamy-seahorse","name": "Dreamy Seahorse","adj": "Dreamy","creature": "Seahorse","file": "avatars/dreamy-seahorse.webp"},{"id": "shocked-eel","name": "Shocked Eel","adj": "Shocked","creature": "Eel","file": "avatars/shocked-eel.webp"},{"id": "smug-lobster","name": "Smug Lobster","adj": "Smug","creature": "Lobster","file": "avatars/smug-lobster.webp"},{"id": "sleepy-starfish","name": "Sleepy Starfish","adj": "Sleepy","creature": "Starfish","file": "avatars/sleepy-starfish.webp","y": "Starry"},{"id": "thrilled-pelican-eel","name": "Thrilled Pelican Eel","adj": "Thrilled","creature": "Pelican Eel","file": "avatars/thrilled-pelican-eel.webp"},{"id": "brash-stingray","name": "Brash Stingray","adj": "Brash","creature": "Stingray","file": "avatars/brash-stingray.webp"},{"id": "dazzling-seahorse","name": "Dazzling Seahorse","adj": "Dazzling","creature": "Seahorse","file": "avatars/dazzling-seahorse.webp"},{"id": "sparky-eel","name": "Sparky Eel","adj": "Sparky","creature": "Eel","file": "avatars/sparky-eel.webp"},{"id": "salty-lobster","name": "Salty Lobster","adj": "Salty","creature": "Lobster","file": "avatars/salty-lobster.webp"},{"id": "snoozy-starfish","name": "Snoozy Starfish","adj": "Snoozy","creature": "Starfish","file": "avatars/snoozy-starfish.webp","y": "Starry"},{"id": "tickled-pelican-eel","name": "Tickled Pelican Eel","adj": "Tickled","creature": "Pelican Eel","file": "avatars/tickled-pelican-eel.webp"},{"id": "prickly-puffer","name": "Prickly Puffer","adj": "Prickly","creature": "Puffer","file": "avatars/prickly-puffer.webp","y": "Puffy"},{"id": "happy-hermit-crab","name": "Happy Hermit Crab","adj": "Happy","creature": "Hermit Crab","file": "avatars/happy-hermit-crab.webp","y": "Crabby"},{"id": "silly-shrimp","name": "Silly Shrimp","adj": "Silly","creature": "Shrimp","file": "avatars/silly-shrimp.webp","y": "Shrimpy"},{"id": "sunny-fish","name": "Sunny Fish","adj": "Sunny","creature": "Fish","file": "avatars/sunny-fish.webp","y": "Fishy"},{"id": "rad-ray","name": "Rad Ray","adj": "Rad","creature": "Ray","file": "avatars/rad-ray.webp"},{"id": "jolly-jelly","name": "Jolly Jelly","adj": "Jolly","creature": "Jelly","file": "avatars/jolly-jelly.webp","y": "Jelly"}];
(function(){
const A = window.REEF_AVATARS.filter(a => !a.hidden);
const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const first = n => String(n || '').trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
const sound = w => { w = w.toLowerCase(); const d = w.slice(0, 2); return ['sh', 'ch', 'th', 'ph', 'wh'].includes(d) ? (d === 'ph' ? 'f' : d) : w[0]; };
function candidates(name) {
  const f = first(name); if (!f) return { tier: 'random', list: A };
  const s = sound(f);
  const both = A.filter(a => sound(a.creature) === s && sound(a.adj) === s);
  if (both.length) return { tier: 'alliteration', list: both };
  const crt = A.filter(a => sound(a.creature) === s);
  if (crt.length) return { tier: 'alliteration', list: crt };
  const loose = A.filter(a => a.creature[0].toLowerCase() === f[0]);
  if (loose.length) return { tier: 'alliteration', list: loose };
  return { tier: 'random', list: A };
}
window.reefAvatar = function (name) {
  const c = candidates(name); const a = c.list[Math.floor(Math.random() * c.list.length)];
  return Object.assign({ tier: c.tier }, a);
};
const cap = s => s.replace(/^./, c => c.toUpperCase());
const capw = s => s.split(' ').map(cap).join(' ');
/* "Mandy & Joe", "Mandy and Joe", "Mandy, Joe + Kim" -> ['Mandy','Joe','Kim']. A single name with a space ("Mary Ann") stays whole. */
const names = n => String(n || '').replace(/\s+/g, ' ').trim().split(/\s*(?:&|\+|,|\/|\band\b|\bn\b)\s*/i).map(x => x.trim()).filter(Boolean);
const plural = c => { const w = c.split(' '); let l = w.pop();
  if (/(fish|shrimp|squid|krill|sheep)$/i.test(l)) {} else if (/(s|x|z|ch|sh)$/i.test(l)) l += 'es';
  else if (/[^aeiou]y$/i.test(l)) l = l.slice(0, -1) + 'ies'; else l += 's'; return w.concat(l).join(' '); };
window.reefNames = names;
window.reefIsGroup = n => names(n).length > 1;
window.reefAvatarTitle = (name, a) => {
  const ns = names(name).map(capw);
  if (ns.length > 1) {
    if (ns.length > 3) return ns[0] + ' & the ' + a.creature + ' Crew';
    const who = ns.length === 2 ? ns.join(' & ') : ns[0] + ', ' + ns[1] + ' & ' + ns[2];
    return who + ' the ' + plural(a.creature);
  }
  const f = ns[0] || 'Guest';
  if (a.y) return a.y + ' ' + f;
  const n = first(f);
  return n && (sound(n) === sound(a.creature) || n[0] === a.creature[0].toLowerCase()) ? f + ' ' + a.creature : f + ' the ' + a.creature;
};
window.reefAvatarById = id => window.REEF_AVATARS.find(a => a.id === id) || null;
window.reefAvatarList = () => A.slice();
})();
