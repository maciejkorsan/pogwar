import * as Tone from "tone";
import p5 from "p5";
import { Note, Scale } from "tonal";

let gain = null;

let ready = false;

let s = (sk) => {
  const reverb = new Tone.Reverb(5);
  const compressor = new Tone.Compressor(-30, 3);
  const delay = new Tone.FeedbackDelay(0.4, 0.7);

  let root = "G#2";
  // let NOTES = [""B3", "D3", "E3", "F#4", "A4"];

  let notesObjects = [
    { note: "B2", prob: 0.2 },
    { note: "D2", prob: 0.2 },
    { note: "E2", prob: 0.2 },
    { note: "F#2", prob: 0.2 },
    { note: "A3", prob: 0.6 },
    { note: "B3", prob: 0.6 },
    { note: "D3", prob: 0.6 },
    { note: "E3", prob: 0.6 },
    { note: "F#3", prob: 0.6 },

  ]


  const bassNotes = [
    { note: "B1", prob: 0.2 },
    { note: "D2", prob: 0.2 },
    { note: "E2", prob: 0.2 },]
  
  const synth = new Tone.Synth({
    oscillator: {
      type: "sine4"
    },
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.1,
      release: 0.1,
    }
    
  })


  synth.chain( delay, reverb,compressor, Tone.Destination)
  synth.volume.value = -10;

  const bassSynth = new Tone.Synth({
    oscillator: {
      type: "triangle19"
    },
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.1,
      release: 0.1,
    }
  })
  

  bassSynth.chain( delay, reverb,compressor, Tone.Destination);

  const synth2 = new Tone.Synth(
    {
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 0.1,
        decay: 0.1,
        sustain: 0.4,
        release: 0.1,
      }
    }
  )

  synth2.chain(reverb, compressor, Tone.Destination)
  synth2.volume.value = -3;
  

  sk.setup = () => {
    sk.createCanvas(window.innerWidth, window.innerHeight);
    sk.background(40);

    pianoSlider = sk.createSlider(-50, 0, -40);
    pianoSlider.position(200,200);
    noiseSlider = sk.createSlider(-40, 0, -40);
    noiseSlider.position(200,300);
    synthSlider = sk.createSlider(-40, 0, -40);
    synthSlider.position(200,400);
    synth2Slider = sk.createSlider(-40, 0, -40);
    synth2Slider.position(200,400);
  };

  const initializeAudio = () => {
    Tone.start();

    var noise = new Tone.Noise("pink").start();

    noise.volume.value = -40;

    //make an autofilter to shape the noise
    var autoFilter = new Tone.AutoFilter({
      "frequency" : "21m",
      "min" : 200,
      "max" : 5000,
      "depth" : .94,
      "type" : "sine2",
      "wet" : 1
    }).chain(compressor, Tone.Destination);
    noise.connect(autoFilter);
    autoFilter.start()

    const first = new Tone.Sequence( (time, note) => {
      const playNote = notesObjects[Math.floor(Math.random() * (notesObjects.length-1))]
      synth2.triggerAttackRelease(playNote.note, 1, time) 
    }, notesObjects, "1n").start(0)

    const second = new Tone.Sequence( (time, note) => {
      const playNote = notesObjects[Math.floor(Math.random() * (notesObjects.length-1))]
      Math.random() > .3 ? synth2.triggerAttackRelease(playNote.note, .75, time) : null
    }, notesObjects, "1n").start(0.5)

    const third = new Tone.Sequence( (time, note) => {
      console.log(note)
      const playNote = notesObjects[Math.floor(Math.random() * (notesObjects.length-1))]
      if (note && Math.random() > 0.5) 
      synth.triggerAttackRelease(playNote.note, 1, time)
    }, [...notesObjects, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] , "4n").start(5)
   
    const fourth = new Tone.Sequence( (time, note) => {
      const playNote = bassNotes[Math.floor(Math.random() * (bassNotes.length-1))]
      // if (note && Math.random() > 0.5)
      console.log('fourth')
      bassSynth.triggerAttackRelease(playNote.note, 3, time)
    }, [...bassNotes] , "7m").start()

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
    }
  };

  sk.mousePressed = () => {
    if (ready) {
     
      
    } else {
      ready = true;
      initializeAudio();
    }
  };
};
const P5 = new p5(s);
