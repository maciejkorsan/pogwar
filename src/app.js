import * as Tone from "tone";
import p5 from "p5";
import { Note, Scale, Interval } from "tonal";

let ready = false;

let s = (sk) => {

	const delay = new Tone.FeedbackDelay("2n", 0.1).toDestination();


  const glock = new Tone.Sampler({
    urls: {
      C5: "glock_medium_C5.wav",
      G5: "glock_medium_G5.wav",
    },
    baseUrl: "/",
  }).connect(delay);



  const chordInstrument = new Tone.Sampler({
    urls: {
      C4: "UR1_C4_f_RR1.wav",
    },
    baseUrl:  "/",
  });

  chordInstrument.volume.value = -30;

  chordInstrument.toDestination();

  const reverb = new Tone.Freeverb({ roomSize: 0.4 }).toDestination();

  const compressor = new Tone.Compressor();

  const sampler3 = new Tone.Sampler({
    urls: {
      A3: "pogwar.mp3",
    },
    baseUrl: "/",
  }).connect(reverb);

  sampler3.volume.value = -25;

  const bgSynth = new Tone.Synth({
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.6,
      release: 0.4,
    },
  }).connect(reverb);
  bgSynth.volume.value = -20;

  const constSynth = new Tone.Synth({
    oscillator: {
      type: "sine1",
    },
    envelope: {
      attack: 0.5,
      decay: 0.2,
      sustain: 0.6,
      release: 0.9,
    },
  }).toDestination();

  constSynth.volume.value = -10;

  const piano = new Tone.Sampler({
    urls: {
      C4: "UR1_C4_f_RR1.wav",
    },
    baseUrl: "/",
  }).toDestination();
  piano.volume.value = -20;

  sk.setup = () => {
    sk.createCanvas(window.innerWidth, window.innerHeight);
    sk.background(40);
  };

  initializeAudio = () => {
    const chords = ["G3", "D3", "E3", "B3"];

    constSynth.triggerAttack("C3");

    function getRandom(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    let chord = getRandom(chords);

    const playChord = () => {
      const index = chords.indexOf(chord);
      const tmp = [...chords];
      tmp.splice(index, 1);
      chord = getRandom(tmp);
      bgSynth.triggerAttackRelease(chord, Math.random() * 3 + 3);
      Tone.Transport.scheduleOnce(playChord, `+7`);
    };

    const playPogwar = () => {
      sampler3.triggerAttackRelease(
        ["C3", "D3", "A2"][Math.floor(Math.random() * 3)],
        1
      );
      Tone.Transport.scheduleOnce(playPogwar, `+21`);
    };

    const melodies = [
      ["C4", "D4", "E4"],
      ["C4", "D4", "A4", "B4"],
      ["F4", "G4", "B4", "A4"],
      ["A4", "B4"],
      ["C4", "D4", "C4", "D4", "E4"],
	  ["E4", "D4", "E4", "F4", "G4", "E4", "F4"],
	  ["A4", "G4", "F4", "E4", "D4", "E4", "F4"]
    ];

    let melody = getRandom(melodies);

    const playPiano = () => {
      const index = melodies.indexOf(melody);
      const tmp = [...melodies];
      tmp.splice(index, 1);
      melody = getRandom(tmp);

      const noteTime = Math.random() * 2 + 2 / melody.length;

      (Math.random() > 0.5 ? melody : [...melody].reverse()).forEach(
        (notes, i) => {

		  glock.triggerAttack(
            notes,
            `+${
              (1 + i + Math.random() / 20 - 0.015) * noteTime +
              Math.random() / 25 -
              0.1
            }`
          );
        }
      );
      Tone.Transport.scheduleOnce(playPiano, `+9.5}`);
    };

    Tone.Transport.start();
    playChord();
    playPogwar();
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
