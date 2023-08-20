import * as Tone from "tone";
import p5 from "p5";

let ready = false;

let s = (sk) => {



  const glock = new Tone.Sampler({
    urls: {
      C5: "glock_medium_C5.wav",
      G5: "glock_medium_G5.wav",
    },
    baseUrl: "/",
  }).connect(Tone.Destination);

  const chordInstrument = new Tone.Sampler({
    urls: {
      C4: "UR1_C4_f_RR1.wav",
    },
    baseUrl: "/",
  });

  chordInstrument.volume.value = -30;

  chordInstrument.toDestination();


  const compressor = new Tone.Compressor();

  const sampler3 = new Tone.Sampler({
    urls: {
      A3: "pogwar.mp3",
    },
    baseUrl: "/",
  }).toDestination();

  sampler3.volume.value = -25;

  const delay =   new Tone.FeedbackDelay(.2,.2)

  const bgSynth = new Tone.Synth({
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: .8,
      release: 2,
    },
  }).chain(delay, Tone.Destination);;
  bgSynth.volume.value = -10;

  const bgSynthB = new Tone.PolySynth({
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: .8,
      release: 2,
    },
  }).chain(delay, Tone.Destination);;
  bgSynthB.volume.value = -10;

  const delay2 =  new Tone.FeedbackDelay(.2,.3)
  const reverb = new Tone.Reverb(5);


  const bgSynth2 = new Tone.FMSynth({
    harmonicity: 2,
    modulationIndex: 3.5,
    oscillator: {
      type: "custom",
      partials: [0, 1, 0, 2]
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: .8,
      release: 2,
    },
    modulation: {
      type: "sawtooth"
    },
    modulationEnvelope: {
      attack: 1,
      decay: 0,
      sustain: .8,
      release: 5,
    },
  }).chain(delay2, reverb, Tone.Destination);;
  bgSynth2.volume.value = -15;

  const constSynth = new Tone.FMSynth({
    harmonicity: 3,
    modulationIndex: 4,
    detune: 15,
    portamento: 1,
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 5,
      decay: 2,
      sustain: 1,
      release: 15,
    },
  })


  constSynth.volume.value = -25;


  const piano = new Tone.Sampler({
    urls: {
      C4: "UR1_C4_f_RR1.wav",

    },
    baseUrl: "/",
  }).toDestination();
  piano.volume.value = -2;

  sk.setup = () => {
    sk.createCanvas(window.innerWidth, window.innerHeight);
    sk.background(40);
  };

  const initializeAudio = () => {

    Tone.start();
    const chords = [["C3", "G3", "D3"], "E3", "B2"];

    constSynth.triggerAttack();

    function getRandom(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    let chord = getRandom(chords);

    const playChord = () => {
      const index = chords.indexOf(chord);
      const tmp = [...chords];
      tmp.splice(index, 1);
      chord = getRandom(tmp);
      bgSynth.triggerAttackRelease(chord, 8.5);
      Tone.Transport.scheduleOnce(playChord, `+9.8`);
    };

   




    const playPogwar = () => {
      if (sampler3.loaded)
        sampler3.triggerAttackRelease(
          ["C3", "D3", "A2"][Math.floor(Math.random() * 3)],
          1
        );
      Tone.Transport.scheduleOnce(playPogwar, `+21`);
    };

    const melodies = [
      ["C4", "B3", "A3", "G3", "A3", "G3", "E3"],
      ["C5", "B4", "A4", "G4", "A4", "G4", "E4"],
      ["C4", "B3", "A3", "G3", "A3", "G3", "E3"],
    ];

    let melody = getRandom(melodies);

    const playPiano = () => {
      const index = melodies.indexOf(melody);
      const tmp = [...melodies];
      tmp.splice(index, 1);
      melody = getRandom(tmp);

      const noteTime = Math.random() * 1 + 2 / melody.length;

      (Math.random() > 0.5 ? melody : [...melody].reverse()).forEach(
        (notes, i) => {
          if (piano.loaded)
            piano.triggerAttack(
              notes,
              `+${
                (1 + i + Math.random() / 20 - 0.015) * noteTime +
                Math.random() / 25 -
                0.1
              }`  
            );
        }
      );
      Tone.Transport.scheduleOnce(playPiano, `+12.5}`);
    };

    Tone.Transport.start();
    playChord();
    // playChord2();
    // playPogwar();
    playPiano();
  };

  sk.draw = () => {
    if (!ready) {
      sk.background("black");
      sk.fill("white");
      sk.textAlign(sk.CENTER, sk.CENTER);
      sk.text("CLICK TO START!", sk.width / 2, sk.height / 2);
    } else {
      sk.background("white");
      sk.fill("black");
      sk.textAlign(sk.CENTER, sk.CENTER);
      sk.text("POGWAR", sk.width / 2, sk.height / 2);
    }
  };

  sk.mousePressed = () => {
    if (ready == false) {
      ready = true;
      initializeAudio();
    } else {
    }
  };
};
const P5 = new p5(s);
