// Sound effects using ZzFX (< 1KB library)
// Sounds designed at https://killedbyapixel.github.io/ZzFX/

const SFX = {
  // Short click/tap — tile slide, light toggle, number input
  click()   { zzfx(...[,,925,.04,.01,.08,1,.3,,,,,,,,,.04]); },

  // Card flip
  flip()    { zzfx(...[,,1200,.02,.01,.04,1,.5,,,,,,,,,,.5]); },

  // Pair matched / box on goal
  match()   { zzfx(...[,,537,.02,.07,.22,1,1.59,,4.97,,,,,,,.06]); },

  // Mismatch — memory fail
  miss()    { zzfx(...[1.5,,270,.03,.01,.12,4,1.7,,-3,,,.06,,,,,.6]); },

  // Error — sudoku wrong number
  error()   { zzfx(...[1.2,,150,.06,.02,.15,4,2.5,-6,,,,,,,,,.5]); },

  // Move — sokoban step
  move()    { zzfx(...[,,700,.01,.005,.04,1,.2,,,,,,,,,,.4]); },

  // Level clear fanfare
  fanfare() {
    zzfx(...[,,523,.02,.12,.3,1,1.2,,,,,,,,,,.5]);
    setTimeout(() => zzfx(...[,,659,.02,.12,.3,1,1.2,,,,,,,,,,.5]), 150);
    setTimeout(() => zzfx(...[,,784,.02,.18,.4,1,1.2,,,,,,,,,,.5]), 300);
  },

  // All clear — bigger fanfare
  complete() {
    zzfx(...[,,523,.02,.1,.25,1,1.4,,,,,,,,,,.5]);
    setTimeout(() => zzfx(...[,,659,.02,.1,.25,1,1.4,,,,,,,,,,.5]), 120);
    setTimeout(() => zzfx(...[,,784,.02,.1,.25,1,1.4,,,,,,,,,,.5]), 240);
    setTimeout(() => zzfx(...[,,1047,.03,.2,.5,1,1.4,,,,,,,,,,.5]), 400);
  },

  // Undo
  undo()    { zzfx(...[,,400,.02,.01,.06,1,.4,-5,,,,,,,,,.4]); },
};
