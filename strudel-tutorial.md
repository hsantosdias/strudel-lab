# 🎛️ Tutorial: Live Coding com Strudel

> **Strudel** é um ambiente de live coding musical que roda no navegador, inspirado no TidalCycles. Você escreve código JavaScript com mini-notações para criar música procedural em tempo real.
> 
> Acesse: [strudel.cc](https://strudel.cc)

---

## 📑 Índice

1. [Estrutura geral do código](#1-estrutura-geral-do-código)
2. [Labels nomeados vs const](#2-labels-nomeados-vs-const)
3. [Mini-notação: a linguagem dos padrões](#3-mini-notação-a-linguagem-dos-padrões)
4. [Sons e samples](#4-sons-e-samples)
5. [Notas e harmonia](#5-notas-e-harmonia)
6. [Efeitos e processamento](#6-efeitos-e-processamento)
7. [Sliders e controles interativos](#7-sliders-e-controles-interativos)
8. [Funções de transformação](#8-funções-de-transformação)
9. [Orbit: roteamento de áudio](#9-orbit-roteamento-de-áudio)
10. [Padrões avançados: pick, irand, scale](#10-padrões-avançados-pick-irand-scale)
11. [Ideias para ampliação](#11-ideias-para-ampliação)
12. [Referência rápida do código base](#12-referência-rápida-do-código-base)

---

## 1. Estrutura geral do código

Um patch Strudel é um conjunto de **camadas sonoras** (layers) que tocam simultaneamente. Cada layer é uma cadeia de métodos encadeados com ponto (`.`).

```javascript
// Estrutura básica de um layer
fonte_de_som
  .efeito1(valor)
  .efeito2(valor)
  .saida(orbit)
```

No código de referência deste tutorial, temos:

```javascript
kick: s("tech:5").duck(2).struct("x*4").gain(5)
```

Isso significa: **toque o sample `tech:5`**, aplique ducking de sidechain, dê uma estrutura rítmica de 4 batidas por ciclo e aumente o volume.

---

## 2. Labels nomeados vs `const`

Strudel oferece duas formas de declarar layers:

### Labels nomeados — tocam automaticamente

```javascript
kick: s("tech:5").struct("x*4").gain(1)

main_melody: note("c4 e4 g4").sound("supersaw")
```

O nome antes dos dois pontos é só uma etiqueta visual. O Strudel executa todos os labels ao avaliar o código.

### `const` — declarados mas silenciosos

```javascript
const bassline1 = note("{g2@3 a2 b2@3 d3}%8")
  .slow(4).lpf(energy).distort(2).o(2)
```

Variáveis declaradas com `const` **não tocam sozinhas**. Você precisa referenciá-las em um `stack()` ou ativá-las manualmente. Isso é útil para:

- Preparar layers antes de colocá-los no mix
- Organizar variações de um mesmo instrumento
- Live coding: você escreve antes e solta na hora certa

### Combinando layers com `stack()`

```javascript
stack(
  s("tech:5").struct("x*4"),
  note("c4 e4 g4").sound("supersaw"),
  bassline1,
  bassline2
)
```

---

## 3. Mini-notação: a linguagem dos padrões

A mini-notação é uma linguagem declarativa embutida nas strings dos padrões.

### Sequência simples

```javascript
note("c4 e4 g4 b4")   // 4 notas dividindo o ciclo igualmente
```

### Grupos e subdivisões

```javascript
note("c4 [e4 g4] b4")  // e4 e g4 dividem o tempo de um slot
```

### Repetição

```javascript
s("bd*4")              // bd toca 4 vezes por ciclo
s("bd!4")              // bd é repetido 4 vezes (sem acelerar)
```

### Peso (duração relativa)

```javascript
note("{g2@3 a2 b2@3 d3}%8")
// g2 dura 3x mais que a2; b2 dura 3x mais que d3
// %8 = 8 eventos por ciclo
```

### Alternância por ciclo com `< >`

```javascript
note("<c4 e4 g4>")
// Ciclo 1: c4 | Ciclo 2: e4 | Ciclo 3: g4
```

### Alternância com peso

```javascript
pick(sawnotes, "{<0@3 1 2@2 3 4>}x2")
// índice 0 aparece por 3 ciclos, índice 1 por 1, índice 2 por 2...
```

### Polifonia com `[ , ]`

```javascript
note("[g2, d3]")   // g2 e d3 tocam ao mesmo tempo (acorde)
```

---

## 4. Sons e samples

### `s()` — sample do banco de sons

```javascript
s("tech:5")        // sample "tech", variação número 5
s("bd")            // bumbo padrão
s("krystal_blitz") // sample personalizado
```

### `.sound()` — sintetizador ou sample

```javascript
note("c4").sound("supersaw")    // sintetizador supersaw
note("c4").sound("saw")         // onda dente-de-serra simples
note("c4").sound("gm_epiano1")  // piano elétrico General MIDI
note("c4").sound("gm_epiano1, square") // dois sons ao mesmo tempo
```

### `.chop()`, `.striate()`, `.loopAt()`

```javascript
s("14U:1").chop(16)        // divide o sample em 16 pedaços, toca em sequência
s("14U:1").loopAt(16)      // estica/comprime o sample para durar 16 ciclos
s("krystal_blitz").striate(8)  // granularização: divide e embaralha em 8 grãos
```

---

## 5. Notas e harmonia

### `.note()` vs `n()`

```javascript
note("c4 e4 g4")         // notas literais com oitava
n("0 2 4").scale("C:major")  // graus da escala (0 = tônica)
```

### `.transpose()`

```javascript
note("c4").transpose(12)         // sobe uma oitava
note("c4").transpose("[0, 12]")  // toca original E uma oitava acima
note("c4").transpose("-5")       // desce 5 semitons
```

### `.scale()` — escalas

```javascript
n(irand("7")).scale("C:major")
n(irand("4").slow(2)).scale("<b>:minor:pentatonic")
// A escala também pode alternar: "<C D E>:minor"
```

### Acordes inline

```javascript
const sawnotes = [
  "[g2, d3]",    // quinta
  "[a2, c#3]",   // terça menor
  "[b2, d3]",    // terça menor
]
note(pick(sawnotes, "0 1 2"))
```

---

## 6. Efeitos e processamento

### Filtros

```javascript
.lpf(2000)              // low-pass filter: corta frequências acima de 2000Hz
.hpf(200)               // high-pass filter: corta frequências abaixo de 200Hz
.lpf(energy)            // filtro controlado por slider
.lpf(energy.add(100))   // filtro + offset fixo
```

### Envelope

```javascript
.decay(0.15)    // tempo de decaimento
.release(0.4)   // tempo de soltar a nota
.attack(0.01)   // tempo de ataque
```

### Dinâmica

```javascript
.gain(0.5)        // volume (0 a 1, pode passar de 1)
.postgain(3.5)    // ganho pós-efeitos (amplifica o sinal processado)
.duck(2)          // sidechain: reduz volume quando o kick toca
```

### Espacialização e reverb

```javascript
.room(1)          // reverb (0 = seco, 1 = muito molhado)
.jux(rev)         // toca normal na esquerda, reverso na direita
.pan(0.8)         // panorâmica (0 = esquerda, 1 = direita)
```

### Distorção e textura

```javascript
.distort(2)       // distorção waveshaper
.coarse(0)        // bit crusher (0 = limpo, 8 = muito pixelado)
.seg(16)          // segmenta o envelope em 16 degraus (efeito de stutter)
```

### Delay

```javascript
.delay(1)         // delay úmido (0 a 1)
.delaytime(0.25)  // tempo do delay em frações de ciclo
.delayfeedback(0.5) // feedback do delay
```

---

## 7. Sliders e controles interativos

Sliders criam controles deslizantes na interface do Strudel.

```javascript
const energy = slider(2516.8, 400, 4000)
// valor_inicial, mínimo, máximo
```

Você pode usar o slider como parâmetro de qualquer efeito:

```javascript
.lpf(energy)              // filtro varia com o slider
.lpf(energy.add(500))     // filtro + offset
.lpf(energy.mul(0.5))     // filtro * fator
```

### Múltiplos sliders

```javascript
const cutoff  = slider(1000, 200, 8000)
const roomAmt = slider(0.3, 0, 1)
const tempo   = slider(1, 0.5, 2)

note("c4 e4 g4")
  .sound("supersaw")
  .lpf(cutoff)
  .room(roomAmt)
  .slow(tempo)
```

---

## 8. Funções de transformação

### `.slow()` e `.fast()`

```javascript
note("c4 e4 g4").slow(2)   // toca na metade da velocidade
note("c4 e4 g4").fast(2)   // toca no dobro da velocidade
```

### `.struct()` — máscara rítmica

```javascript
note("c4").struct("x - - x - - x -")
// define QUANDO a nota toca; "x" = toca, "-" = silêncio
```

### `.ply()` — multiplicação de eventos

```javascript
note("c4 e4").ply(4)
// cada nota é tocada 4 vezes rápidas no seu slot de tempo
```

### `.almostNever()`, `.rarely()`, `.sometimes()`, `.often()`

Aplicam uma transformação probabilisticamente:

```javascript
note("c4 e4 g4")
  .almostNever(x => x.rev())  // quase nunca reverte
  .rarely(x => x.fast(2))     // raramente acelera
  .sometimes(x => x.gain(0))  // às vezes silencia
  .often(x => x.room(1))      // frequentemente adiciona reverb
```

### `.clip()`, `.loopAt()`

```javascript
s("vocals").clip(1)       // corta o sample no fim do slot
s("vocals").loopAt(4)     // faz o sample durar exatamente 4 ciclos
```

---

## 9. Orbit: roteamento de áudio

Orbits são canais de saída de áudio independentes, cada um com seu próprio processamento de efeitos.

```javascript
note("c4").sound("supersaw").o(1)   // canal 1
note("g2").sound("bass").o(2)       // canal 2 (efeitos independentes)
s("kick").o(3)                       // canal 3
```

Útil para:
- Enviar camadas diferentes para efeitos externos (DAW, mixer)
- Separar processamento de reverb por grupo
- Evitar que o reverb de um layer contamine outro

---

## 10. Padrões avançados: `pick`, `irand`, `scale`

### `pick()` — seleciona de um array

```javascript
const sawnotes = ["[g2, d3]", "[a2, c#3]", "[b2, d3]"]

note(pick(sawnotes, "0 1 2 1"))
// seleciona o índice 0, depois 1, depois 2, depois 1
```

Com alternância e peso:
```javascript
note(pick(sawnotes, "{<0@3 1 2@2 3 4>}x2"))
```

### `irand()` — número inteiro aleatório

```javascript
n(irand("7"))               // número aleatório de 0 a 6
n(irand("4").slow(2))       // novo número a cada 2 ciclos
```

### `n()` + `.scale()` — graus de escala

```javascript
n("0 2 4 7")
  .scale("C:major")
// 0=C, 2=E, 4=G, 7=C(oitava)
```

Escalas disponíveis: `major`, `minor`, `pentatonic`, `dorian`, `phrygian`, `lydian`, `mixolydian`, `locrian`, `minor:pentatonic`, `chromatic`...

---

## 11. Ideias para ampliação

### 💡 Adicionar variação automática de tempo

```javascript
const tempo = slider(1, 0.5, 2)

main_melody: note(pick(sawnotes, "{<0@3 1 2@2 3 4>}x2"))
  .sound("supersaw")
  .slow(tempo)
```

### 💡 Adicionar camada de percussão completa

```javascript
const drums = stack(
  s("bd").struct("x - - - x - - -"),          // bumbo
  s("sd").struct("- - x - - - x -"),           // caixa
  s("hh*8").gain(0.4),                          // hi-hat
  s("cp").struct("- - - - x - - -").room(0.5)  // palma
)
```

### 💡 Linha de baixo reativa ao filtro

```javascript
const cutoff = slider(400, 80, 2000)

const sub = note("{c2@3 g1 a1 f1}%4")
  .sound("sine")
  .lpf(cutoff)
  .distort(1.5)
  .gain(0.8)
  .o(3)
```

### 💡 Melodia com escala aleatória que muda por ciclo

```javascript
const rand_melody = n(irand("6").slow(0.5))
  .scale("<C D F G>:minor:pentatonic")
  .sound("supersaw")
  .ply(2)
  .room(0.6)
  .lpf(energy)
  .o(2)
```

### 💡 Vozes paralelas (harmonização)

```javascript
const harmony = note(pick(sawnotes, "{<0@3 1 2@2 3 4>}x2"))
  .sound("supersaw")
  .transpose("[0, 7, 12]")   // tônica + quinta + oitava
  .gain(0.3)
  .lpf(energy)
  .o(2)
```

### 💡 Glitch rítmico com `striate` variável

```javascript
const glitch2 = s("krystal_blitz")
  .striate("<4 8 16 32>")
  .speed("<1 -1 0.5 2>")
  .gain(0.6)
  .lpf(energy)
  .o(3)
```

### 💡 Efeito de build-up com `slow` decrescente

```javascript
// Vai acelerando a cada 4 ciclos
const buildup = note("c4 e4 g4 b4")
  .sound("supersaw")
  .slow("<4 3 2 1>")
  .lpf(energy)
  .o(2)
```

### 💡 Controle por mouse (comentado no código original)

```javascript
all(x =>
  x.room(mouseX.segment(4).range(0, 2))
   .hpf(mouseX.segment(3).range(0, 1000))
)
// mouseX controla reverb e filtro high-pass em todos os layers
```

### 💡 Chord progression automática

```javascript
const chordprog = note(
  "<[c3,e3,g3] [a2,c3,e3] [f2,a2,c3] [g2,b2,d3]>"
)
  .sound("supersaw")
  .slow(4)
  .room(0.4)
  .lpf(energy)
  .gain(0.3)
  .o(2)
```

---

## 12. Referência rápida do código base

| Layer | Função | Detalhe |
|---|---|---|
| `kick` | Percussão base | Sample `tech:5` com sidechain `.duck(2)` |
| `main_melody` | Melodia principal | Supersaw polifônico com acordes do array `sawnotes` |
| `arp` (label) | Arpejo simples | Saw com jux(rev) e dois transposes |
| `const arp` | Piano elétrico generativo | Escala pentatônica B menor com notas aleatórias |
| `anthem_notes` | Melodia expandida | Igual ao `main_melody` + `coarse`, `hpf`, ganho menor |
| `arp2` | Arpejo alternativo | Saw com gain reduzido e menos dominante |
| `chops` | Textura granular | Sample `krystal_blitz` granularizado |
| `bassline1` | Baixo agressivo | Notas em 3 oitavas com distorção forte |
| `bassline2` | Baixo suave | Mesma progressão com `.seg(16)` e ganho menor |
| `vox` | Vocal | Sample `14U:1` em loop de 16 ciclos |
| `glitch` | Glitch | `krystal_blitz` em loop curto, pós-ganho alto |
| `onenotes` | Array de frases | Progressão melódica para usar com `pick` |

---

## 🔗 Recursos

- **REPL online:** [strudel.cc](https://strudel.cc)
- **Documentação:** [strudel.cc/learn](https://strudel.cc/learn)
- **Referência de mini-notação:** [strudel.cc/learn/mini-notation](https://strudel.cc/learn/mini-notation)
- **Banco de samples:** [strudel.cc/learn/samples](https://strudel.cc/learn/samples)
- **Comunidade:** [discord.gg/tidal](https://discord.gg/tidal)

---

> *"O código não precisa ser perfeito para soar bem."*
> — filosofia do live coding
