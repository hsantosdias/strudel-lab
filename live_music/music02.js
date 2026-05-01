// =====================================================
// STRUDEL LAB - FULL TRACK EXPANDED (ESTUDO COMENTADO)
// versão educativa / comentada / com camadas extras
// =====================================================

// -----------------------------------------------------
// BPM = velocidade da música
// 140 = techno / trance / melodic techno
// -----------------------------------------------------
setcpm(140)


// -----------------------------------------------------
// SLIDERS = controles ao vivo na interface
// mexa durante a música
// -----------------------------------------------------

// filtro principal (abre / fecha brilho)
const energy = slider(2400, 400, 5000)

// quantidade de reverb geral
const roomAmt = slider(0.35, 0, 1)

// filtro do bass
const bassCut = slider(800, 80, 2000)

// volume extra do drop
const drop = slider(0.7, 0, 2)


// -----------------------------------------------------
// PROGRESSÃO HARMÔNICA
// acordes usados pela melodia
// -----------------------------------------------------
const sawnotes = [
  "[g2,d3]",
  "[a2,c#3]",
  "[b2,d3]",
  "[b2,f#3]",
  "[b2,c#3]"
]


// =====================================================
// TRACK PRINCIPAL
// $: = executa áudio
// stack() = várias camadas juntas
// =====================================================
$: stack(

  // =================================================
  // KICK
  // =================================================
  s("tech:5")
    .duck(2)         // sidechain
    .struct("x*4")   // 4 no chão
    .gain(5),

  // =================================================
  // CLAP / SNARE
  // =================================================
  s("cp")
    .struct("- - x - - - x -")
    .gain(1.1)
    .room(0.15),

  // =================================================
  // CLOSED HATS
  // =================================================
  s("hh*8")
    .gain(0.45)
    .sometimes(rev),

  // =================================================
  // OPEN HAT
  // =================================================
  s("oh")
    .struct("- - - - x - - -")
    .gain(0.35),

  // =================================================
  // EXTRA PERCUSSION
  // =================================================
  s("perc")
    .struct("- x - - x - - x")
    .gain(0.18)
    .room(0.2),

  // =================================================
  // MAIN SUPERSAW
  // =================================================
  note(
    pick(
      sawnotes,
      "{<0@3 1 2@2 3 4>}x2"
    )
  )
    .struct("x - - x - - x - - x - - x")
    .sound("supersaw")
    .ply(4)
    .jux(rev)
    .lpf(energy)
    .release(0.45)
    .transpose("[0,12]")
    .room(roomAmt)
    .gain(drop)
    .o(2),

  // =================================================
  // LAYER EXTRA DA MELODIA
  // engrossa o som
  // =================================================
  note(
    pick(
      sawnotes,
      "{<0 1 2 3 4>}"
    )
  )
    .sound("supersaw")
    .transpose("[7,12]")
    .gain(0.18)
    .lpf(energy)
    .room(0.6)
    .o(2),

  // =================================================
  // ARPEGGIO PRINCIPAL
  // =================================================
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

  // =================================================
  // ARP EXTRA AGUDO
  // =================================================
  note("d5 g5 a5 b5")
    .sound("square")
    .fast(4)
    .gain(0.12)
    .room(0.8)
    .lpf(energy)
    .o(2),

  // =================================================
  // SUB BASS
  // grave puro
  // =================================================
  note("{g1 a1 b1 b1}%8")
    .sound("sine")
    .slow(2)
    .lpf(bassCut)
    .gain(1)
    .o(3),

  // =================================================
  // MID BASS DRIVE
  // =================================================
  note("{g2 a2 b2 b2}%8")
    .sound("saw")
    .slow(2)
    .distort(1.2)
    .lpf(700)
    .gain(0.25)
    .o(3),

  // =================================================
  // BASS STAB EXTRA
  // =================================================
  note("g2 ~ a2 ~ b2")
    .sound("square")
    .struct("x - x -")
    .gain(0.18)
    .lpf(600)
    .o(3),

  // =================================================
  // RISER / ATMOS
  // =================================================
  s("noise")
    .slow(4)
    .lpf(energy)
    .gain(0.08),

  // =================================================
  // TEXTURE HIHAT MICRO
  // =================================================
  s("hh")
    .fast(16)
    .gain(0.05)
    .room(1),

  // =================================================
  // FX IMPACT
  // =================================================
  s("bd")
    .slow(8)
    .gain(0.08)
    .room(1)

)


// =====================================================
// MASTER FX GLOBAL
// afeta tudo
// =====================================================
all(x =>
  x.room(0.08)
   .hpf(40)
)


// =====================================================
// IDEIAS DE ESTUDO
// =====================================================

// 1. aumentar drop slider no refrão
// 2. subir energy para abrir filtro
// 3. baixar bassCut para grave fechado
// 4. mutar linhas removendo do stack
// 5. trocar setcpm(140) para 128 / 150
// 6. trocar supersaw por saw / square