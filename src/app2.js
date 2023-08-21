import * as Tone from "tone";
import p5 from "p5";
import { transpose } from "@tonaljs/note"


let ready = false;

let s = (sk) => {
  const reverb = new Tone.Reverb(5);
  const compressor = new Tone.Compressor(-30, 3);
  const delay = new Tone.FeedbackDelay(0.4, 0.7);

  let root = "G#2";
  let NOTES = ["B3", "D3", "E3", "F#4", "A4"];


let pianoSlider = null;
let noiseSlider = null;
let synthSlider = null;
let noise = null;




  const glock = new Tone.Sampler({
    urls: {
      C5: "glock_medium_C5.wav",
      G5: "glock_medium_G5.wav",
    },
    baseUrl: "/",
  }).chain(reverb, delay, compressor, Tone.Destination);

  const sampler3 = new Tone.Sampler({
    urls: {
      A3: "pogwar.mp3",
    },
    baseUrl: "/",
  }).chain(reverb, compressor, Tone.Destination);

  sampler3.volume.value = -10;

  const piano = new Tone.Sampler({
    urls: {
      C3: "UR1_C3_mf_RR2.wav",
      C4: "UR1_C4_mf_RR2.wav",
      C5: "UR1_C5_mf_RR2.wav",
    },
    baseUrl: "/",
  }).chain(reverb, compressor, Tone.Destination);
  piano.volume.value = -7;

  const horn = new Tone.Sampler({
    urls: {
      C3: "MOHorn_sus_C3_v3_1.wav",
      D2: "MOHorn_sus_D2_v3_1.wav",
    },
    baseUrl: "/",
  }).chain(reverb, compressor, Tone.Destination);
  horn.volume.value = -5;

  sk.setup = () => {
    sk.createCanvas(window.innerWidth, window.innerHeight);
    sk.background(40);
    pianoSlider = sk.createSlider(-40, 0, -40);
    pianoSlider.position(200,200);
    noiseSlider = sk.createSlider(-40, 0, -40);
    noiseSlider.position(200,300);
    synthSlider = sk.createSlider(-40, 0, -40);
    synthSlider.position(200,400);
  };

  const initializeAudio = () => {
    Tone.start();

    noise = new Tone.Noise("pink").start();

    noise.volume.value = -22;

    //make an autofilter to shape the noise
    var autoFilter = new Tone.AutoFilter({
      "frequency" : "21m",
      "min" : 800,
      "max" : 15000,
      "depth" : .98,
      "wet" : 1
    }).chain(compressor, Tone.Destination);
    noise.connect(autoFilter);
    autoFilter.start()



    const playPogwar = () => {
      if (sampler3.loaded)
        sampler3.set({
          detune: Math.random() * 100 - 50,
        });
      sampler3.triggerAttackRelease(
        ["A3", "E3", "F2"][Math.floor(Math.random() * 3)],
        1
      );
      Tone.Transport.scheduleOnce(playPogwar, `+31.3`);
    };



    const phrases = [];

    for (let i = 0; i < 54; i++) {
      const phrase = [];
      for (let j = 0; j < Math.random() * 5 + 4; j++) {
        const note = NOTES[Math.floor(Math.random() * (NOTES.length - 1))];
        phrase.push(note);
      }
      phrases.push(phrase);
    }

    console.log(phrases);

    const playHorn = (note) => {
      console.log(note);
      horn.set({
        detune: Math.random() * 100 - 50,
      });
      if (horn.loaded && Math.random() < 0.75) {
        const newNote = transpose(note, "P-8");
        horn.triggerAttack(newNote);
        horn.triggerAttack(transpose(newNote, "P-8"), `+0.5`);
      }
    };

    const playMelody = (note) => {
      console.log(note);

      if (glock.loaded) {
        const phrase = phrases[Math.floor(Math.random() * (phrases.length-1))];
        const noteTime = Math.random() * 1 + 1 / phrase.length;
        console.log(phrase);

        (Math.random() > 0.5 ? phrase : [...phrase].reverse()).forEach(
          (notes, i) => {
            glock.triggerAttack(
              notes,
              `+${
                (1 + i / 3 + Math.random() / 10 - 0.015) * noteTime +
                Math.random() / 10 -
                0.05
              }`
            );
          }
        );

      }
    };

    Tone.Transport.scheduleRepeat(
      () => playHorn(NOTES[Math.floor(Math.random() * (NOTES.length - 1))]),
      "9"
    );
    Tone.Transport.scheduleRepeat(() => playHorn(NOTES[Math.floor(Math.random() * (NOTES.length-1))]), "11");

    Tone.Transport.scheduleRepeat(playMelody, "17.3");


    if (Tone.Transport.state !== "started") {
      Tone.Transport.start();
    }
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

      glock.volume.value = pianoSlider.value();
      horn.volume.value = noiseSlider.value();
      noise.volume.value = synthSlider.value();
    }
  };

  sk.mousePressed = () => {
    if (ready) {
      NOTES.forEach((note) => {
        glock.triggerAttackRelease(note, 1);
      });

    } else {
      ready = true;
      initializeAudio();
    }
  };
};
const P5 = new p5(s);
