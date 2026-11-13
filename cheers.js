/* Playful "your turn is coming" lines, shared by the join page and the Worker's push notifications. */
function reefCheers(stage,name,title,seed){
  const n=name||'superstar',t=title||'your song';
  const L={
    two:[
      [`🐠 Two songs till showtime, ${n}!`,`Warm up those gills. ${t} is almost here.`],
      [`🦀 Scuttle closer, ${n}!`,`Just two songs before the reef is yours. Get ready for ${t}!`],
      [`🫧 Bubbles are rising, ${n}…`,`You're two songs out. Stretch those fins for ${t}.`],
      [`🐡 Puff up, ${n}!`,`Two more songs, then it's ${t} time.`]],
    next:[
      [`🐙 You're NEXT, ${n}!`,`Wiggle all eight arms over to the reef float. ${t} is coming in hot!`],
      [`🦈 Fin-tastic, ${n}, you're up next!`,`Swim to the reef float and grab the mic for ${t}.`],
      [`🐬 Next up: ${n}!`,`Splash your way to the front. ${t} starts after this song!`],
      [`🦭 Clap those flippers, ${n}!`,`You're next! Head to the reef float for ${t}.`]],
    up:[
      [`🎤 The reef is yours, ${n}!`,`Grab the mic, the whole street is waiting. ${t}!`],
      [`🌊 It's showtime, ${n}!`,`Make a splash with ${t}. Sing it like a humpback!`],
      [`🐳 Big whale energy, ${n}!`,`You're on! Belt out ${t}.`],
      [`✨ Spotlight on ${n}!`,`${t} is starting. Go get 'em, superstar!`]]};
  const arr=L[stage]||L.up;let h=0;String(seed||n).split('').forEach(c=>h=(h*31+c.charCodeAt(0))>>>0);
  const [title_,body]=arr[h%arr.length];return {title:title_,body};
}
if(typeof module!=='undefined'&&module.exports)module.exports=reefCheers;
