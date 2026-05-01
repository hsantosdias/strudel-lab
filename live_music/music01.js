kick: s("tech:5").duck(2).struct("x*4").gain(5)

const energy = slider(2516.8, 400, 4000)

const sawnotes = [
  "[g2, d3]",
  "[a2, c#3]",
  "[b2, d3]",
  "[b2, f#3]",
  "[b2, c#3]",
]

// --- Layers do código 1 (nomeados, tocam por padrão) ---

main_melody: note(pick(sawnotes, "{<0@3 1 2@2 3 4>}x2"))
  .struct("{x - - x - - x - - x - - x - - x - - x - - x - - x - - x - - x -}%16")
  .sound("supersaw")
  .ply(4)
  .lpf(energy)
  .release(0.4)
  .transpose("[0, 12]")
  .o(2)

arp: note("{d4 e4 g4 d5 e5 g5}%16")
  .sound("saw")
  .room(1)
  .lpf(1000)
  .almostNever(x => x.rev())
  .transpose("-5")
  .transpose("[12, 24]")
  .jux(rev)
  .o(2)
  .lpf(energy)

// --- Layers expandidos do código 2 (const, ativar manualmente) ---

const arp = n(irand("4").slow(2)).scale("<b>:minor:pentatonic")
  .seg("8").rarely(ply("2"))
  .sound("gm_epiano1, square")
  .lpf(energy.add(100)).decay(0.15).room(0.5).gain(0.4).o(2)

const anthem_notes = note(pick(sawnotes, "{<0@3 1 2@2 3 4>}%2"))
  .ply(4)
  .struct("{x -- x -- x -- x -- x -- x -- x -- x -- x -- x -- x -- x -- x -}%16")
  .sound("supersaw").coarse(0)
  .lpf(energy).hpf(200).release(0.4).gain(0.4)
  .transpose("[0, 12]").o(2)

const arp2 = note("{d4 e4 g4 d5 e5 g5}%16")
  .almostNever(x => x.rev())
  .sound("saw").transpose("-5").room(1).transpose("[24, 12]")
  .lpf(energy).jux(rev)
  .o(2).gain(0.25)

const chops = s("krystal_blitz") //.note("a#1")
  .clip(1).striate(8).postgain(3.5).lpf(8000).delay(1).lpf(energy.add(0))

const bassline1 = note("{g2@3 a2 b2@3 d3}%8")
  .slow(4).hpf(200).lpf(energy).distort(2).gain(0.5)
  .transpose("[0, -12, -24]").o(2)

const bassline2 = note("{g2@3 a2 b2@3 d3}%8")
  .slow(4).hpf(200).seg(16).lpf(energy).distort(2).gain(0.2)
  .transpose("[0, -12]").o(2)

const vox = s("14U:1")
  .chop(16).cut(1).loopAt(16).room(0.5).gain(0.65).o(2)
  //.lpf(8000).delay(0)//.lpf(energy.add(1000))

const glitch = s("krystal_blitz")
  .loopAt(4).postgain(1.5).o(2)

const onenotes = [
  "d4 a3 b3 f#3",
  "f#4 c#4 c#4 a3 f#3 f#3",
  "f#4 c#4 c#4 a3 e4 d4",
]

// all(x =>
//   x.room(mouseX.segment(4).range(0,2)).hpf(mouseX.segment(3).range(0,1000))
// )