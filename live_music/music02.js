// ==========================================
// FULL TRACK EXPANDED VERSION (CORRIGIDO)
// agora toca corretamente no Strudel
// ==========================================

// motivo do erro:
// stack(...) precisa ser atribuído com $:
// sem isso alguns ambientes não executam áudio

setcpm(140)

const energy  = slider(2400, 400, 5000)
const roomAmt = slider(0.35, 0, 1)
const bassCut = slider(800, 80, 2000)

const sawnotes = [
  "[g2,d3]",
  "[a2,c#3]",
  "[b2,d3]",
  "[b2,f#3]",
  "[b2,c#3]"
]

// ==========================
// TRACK PRINCIPAL
// ==========================
$: stack(

  // Kick
  s("tech:5")
    .duck(2)
    .struct("x*4")
    .gain(5),

  // Clap
  s("cp")
    .struct("- - x - - - x -")
    .gain(1.1)
    .room(0.15),

  // Hats
  s("hh*8")
    .gain(0.45),

  // Open Hat
  s("oh")
    .struct("- - - - x - - -")
    .gain(0.35),

  // Main melody
  note(
    pick(sawnotes, "{<0@3 1 2@2 3 4>}x2")
  )
    .struct("x - - x - - x - - x - - x")
    .sound("supersaw")
    .ply(4)
    .jux(rev)
    .lpf(energy)
    .release(0.45)
    .transpose("[0,12]")
    .room(roomAmt)
    .gain(0.75)
    .o(2),

  // Arp
  note("{d4 e4 g4 d5 e5 g5}%16")
    .sound("saw")
    .fast(2)
    .room(0.6)
    .lpf(energy)
    .sometimes(x => x.rev())
    .transpose("-5")
    .transpose("[12,24]")
    .jux(rev)
    .gain(0.45)
    .o(2),

  // Sub bass
  note("{g1 a1 b1 b1}%8")
    .sound("sine")
    .slow(2)
    .lpf(bassCut)
    .gain(1)
    .o(3),

  // Mid bass
  note("{g2 a2 b2 b2}%8")
    .sound("saw")
    .slow(2)
    .distort(1.2)
    .lpf(700)
    .gain(0.25)
    .o(3),

  // Atmos texture
  s("noise")
    .slow(4)
    .lpf(energy)
    .gain(0.08)

)

// ==========================
// MASTER FX
// ==========================
all(x =>
  x.room(0.08)
   .hpf(40)
)