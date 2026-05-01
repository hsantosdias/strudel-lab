// ==========================================
// STRUDEL LAB - FULL TRACK EXPANDED VERSION
// mais completa / pronta para jam session
// ==========================================

setcpm(140)

const energy = slider(2400, 400, 5000)
const roomAmt = slider(0.35, 0, 1)
const bassCut = slider(800, 80, 2000)

// --------------------
// HARMONY
// --------------------
const sawnotes = [
  "[g2,d3]",
  "[a2,c#3]",
  "[b2,d3]",
  "[b2,f#3]",
  "[b2,c#3]"
]

// --------------------
// MAIN TRACK
// --------------------
stack(

  // KICK
  s("tech:5")
    .duck(2)
    .struct("x*4")
    .gain(5),

  // SNARE / CLAP
  s("cp")
    .struct("- - x - - - x -")
    .gain(1.2)
    .room(0.2),

  // HIHATS
  s("hh*8")
    .gain(0.55)
    .sometimes(rev),

  // OPEN HAT
  s("oh")
    .struct("- - - - x - - -")
    .gain(0.45),

  // MAIN SUPERSAW CHORDS
  note(
    pick(
      sawnotes,
      "{<0@3 1 2@2 3 4>}x2"
    )
  )
    .struct("x - - x - - x - - x - - x - - x - - x")
    .sound("supersaw")
    .ply(4)
    .jux(rev)
    .lpf(energy)
    .release(0.5)
    .transpose("[0,12]")
    .room(roomAmt)
    .gain(0.8)
    .orbit(2),

  // ARP
  note("{d4 e4 g4 d5 e5 g5}%16")
    .sound("saw")
    .fast(2)
    .room(0.8)
    .lpf(energy)
    .sometimes(rev)
    .transpose(
      cat("-5","-5")
        .add(cat("12","24"))
    )
    .jux(rev)
    .gain(0.6)
    .orbit(2),

  // SUB BASS
  note("{g1 a1 b1 b1 b1}%8")
    .sound("sine")
    .struct("x@2 x x@2 x")
    .lpf(bassCut)
    .gain(1.2)
    .orbit(3),

  // MID BASS DRIVE
  note("{g2 a2 b2 b2}%8")
    .sound("saw")
    .distort(1.5)
    .lpf(600)
    .gain(0.45)
    .orbit(3),

  // FX RISER
  s("noise")
    .slow(4)
    .lpf(energy)
    .gain(0.25)
    .sometimes(rev),

  // TEXTURE
  s("hh")
    .fast(16)
    .gain(0.08)
    .room(1)

)

// --------------------
// MASTER FX
// --------------------
all(x =>
  x.room(
    mouseX.segment(4).range(0,1.2)
  )
   .hpf(
    mouseY.segment(3).range(0,250)
  )
)