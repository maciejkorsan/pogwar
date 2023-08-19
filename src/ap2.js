import * as Tone from "tone";
import p5 from "p5";
import getSamples from "@generative-music/samples-alex-bainter";

let ready = false;

const samples = getSamples({ format: "mp3" });





let s = (sk) => {

  const phrase2 = [["F2"], ["E2"], ["D3"]];
  const phrase3 = [["C3"], ["G3"]];
  const phrase4 = [["D3"], ["C3"], ["G2"]];
  const phrase5 = [["F4"], ["E4"], ["D3"], ["C3"]];
  const phrase6 = [["G3"], ["C4"]];
  const phrase7 = [["C3"], ["G3"], ["C4"]];


  const phrases = [
    phrase2,
    phrase3,
    phrase4,
    phrase5,
    phrase6,
    phrase7,
    [["C3", "E3", "G3"]],
    [["G2", "B3", "D2"]],
    [["F2", "A3", "C2"]],
    [["C3", "E3", "G3"]],
    [["G2", "B3", "D2"]],
  ];

  //   const sampler2 = new Tone.Sampler({
  //     urls: {
  //       A1: "A1.mp3",
  //       A2: "A2.mp3",
  //     },
  //     baseUrl: "https://tonejs.github.io/audio/casio/",
  //   }).connect(dist);

  const sampler4 = new Tone.Sampler({
    urls: {
      C5: "glock_medium_C5.wav",
      G5: "glock_medium_G5.wav",
    },
    baseUrl: "http://localhost:1234/",
  }).connect(compressor);

//   const bassSynth = new Tone.PolySynth(Tone.FMSynth);
//   bassSynth.set({
//     harmonicity: 2,
//     modulationIndex: 4,
//     detune: 15,
//     portamento: 1,
//     oscillator: {
//       type: "sine",
//     },
//     envelope: {
//       attack: 0.3,
//       decay: 0.3,
//       sustain: 0.5,
//       release: 0.5,
//     },
//     modulation: {
//       type: "square",
//     },
//     modulationEnvelope: {
//       attack: 0.7,
//       decay: 0.5,
//       sustain: 1,
//       release: 0.5,
//     },
//   });
//   bassSynth.connect(compressor);
//   bassSynth.volume.value = -20;



  const bassSynth = new Tone.Sampler({
	urls: {
	  C4: "UR1_C4_f_RR1.wav"
	},
	baseUrl: "http://localhost:1234/",
  });
  bassSynth.volume.value = -5;

  bassSynth.connect(compressor);

  const sampler = new Tone.Sampler({
    urls: {
      A1: "A1.mp3",
      A2: "A2.mp3",
    },
    baseUrl: "https://tonejs.github.io/audio/casio/",
  }).toDestination();

    const sampler2 = new Tone.Sampler({
      urls: {
        A1: "A1.mp3",
        A2: "A2.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/casio/",
    }).toDestination();


	const phaser = new Tone.Phaser({
		frequency: 15,
		octaves: 5,
		baseFrequency: 1000
	}).toDestination();

	const delay = new Tone.Reverb(5).connect(compressor);


	const sampler3 = new Tone.Sampler({
		urls: {
		  A3: "pogwar.mp3",
		},
		baseUrl: "http://localhost:1234/",
	  }).connect(delay);

	  sampler3.volume.value = -10;


  //   sampler2.volume.value = -12;

  //   sampler3.toDestination();

  sk.setup = () => {
    sk.createCanvas(window.innerWidth, window.innerHeight);
    sk.background(40);
  };

  initializeAudio = () => {
	const patterns = [
        [["C3", "E3", "G3"]],
        [["G2", "B3", "D2"]],
        [["F2", "A3", "C2"]],
        [["C3", "E3", "G3"]],
        [["G2", "B3", "D2"]],
        [["F2", "A3", "C2"]],
        [["C3", "E3", "G3"]],
        [["G2", "B3", "D2"]],
        [["F2", "A2", "C2"]],
        [["C4", "E3", "G3"]],
        [["G2", "B3", "D2"]],
        [["F2", "A3", "C3"]],
        [["C3", "E3", "G3"]],
        [["G2", "B2", "D2"]],
        [["F2", "A3", "C2"]],
        [["C3", "E3", "G3"]],
        [["G3", "B3", "D2"]],
        [["F2", "A3", "C2"]],
        [["C2", "E3", "G3"]],
        [["G2", "B3", "D2"]],
        [["F2", "A3", "C4"]],
      ];
	Tone.start();

	function playPhrase  ()  {
		const phrase =  phrases[Math.floor(Math.random() * phrases.length)];
        const noteTime = Math.random() * 1 + 2 / phrase.length;
		console.log(phrase)
        phrase.forEach((notes, i) => {
			bassSynth.triggerAttack(
            notes,
            `+${
              (1 + i + Math.random() / 20 - 0.015) * noteTime +
              Math.random() / 10 -
              0.05
            }`
          );
        });
        console.log(Tone.Transport.scheduleOnce(playPhrase, `+${Math.random() * 9 + 3}`));
      };

	  const playPogwar = () => {
		sampler3.triggerAttackRelease(['C3', 'F3', 'A3'][Math.floor(Math.random()*3)], 1);
		Tone.Transport.scheduleOnce(playPogwar, `+${Math.random() * 21 + 3}`);
	  }

	  const playChords = () => {
		const chord = patterns[Math.floor(Math.random() * patterns.length)][0];
		const noteTime = Math.random() * 2 + 10;
		console.log(chord)
		bassSynth.triggerAttackRelease(chord, noteTime);
		Tone.Transport.scheduleOnce(playChords, `+${Math.random() * 4 + 6}`);
	  }

	  Tone.Transport.bpm.value = 120;


      Tone.Transport.start();
	  playPhrase();
	  // playChords();
	//   playPogwar();

  };

  sk.draw = () => {
    if (!ready) {
      sk.background("black");
      sk.fill("white");
      sk.textAlign(sk.CENTER, sk.CENTER);
      sk.text("CLICK TO START!", sk.width / 2, sk.height / 2);
    }
  };

  sk.mousePressed = () => {
    if (ready == false) {
      ready = true;
      initializeAudio();
    } else {
      //   const notes = ["C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3"];
      //   const pattern = new Tone.Pattern(
      //     (time, note) => {
      //       sampler.triggerAttackRelease(note, 0.5, time);
      //     },
      //     notes,
      //     "downUp"
      //   );

      //   const melody = [
      //     { note: "", duration: "8n" },
      //     { note: "F5", duration: "8n" },
      //     { note: "E5", duration: "8n" },
      //     { note: "F5", duration: "4n" },
      //     { note: "D5", duration: "8n" },
      //     { note: "E5", duration: "4n" },
      //     { note: "D5", duration: "4n" },
      //     { note: "C5", duration: "4n" },
      //     { note: "G5", duration: "2n" },
      //   ];

      //   let startTime = 0;
      //   const notesWithStartTimes = timedNotes.map((item) => {
      //     const ret = {
      //       ...item,
      //       startTime: startTime,
      //     };
      //     startTime += Tone.Time(item.duration).toSeconds();
      //     return ret;
      //   });
      let time = 0;

      //   const pattern2 = new Tone.Pattern(
      //     (time, timedNote) => {
      //       const { note, duration } = timedNote;
      //       sampler4.triggerAttackRelease(note, duration, time);
      //     },
      //     timedNotes,
      //     "up"
      //   );

      let currentPattern = null;



      //   const bassPattern = new Tone.Pattern(
      //     (time, note) => {
      //       bassSynth.triggerAttackRelease(note, "1m", time);
      //     },
      //     [
      //       ["C3", "E3", "G3"],
      //       ["G3", "B3", "D4"],
      //       ["F3", "A3", "C4"],
      //     ],
      //     "up"
      //   );

      // //   pattern2.interval = "4n"; // 1 measure
      // //   pattern2.humanize = true;
      // //   pattern2.probability = 0.7;
      // //   pattern2.start();
      //   bassPattern.interval = "1m";
      //   bassPattern.start();


    }
  };
};
const P5 = new p5(s);

// const playNote = () => {
//   const synth = new Tone.Synth().toDestination();
//   Tone.start();

//   synth.triggerAttack("D4", Tone.now);
//   synth.triggerAttack("F4", Tone.now + 0.5);
//   synth.triggerAttack("A4", Tone.now + 1);
//   synth.triggerAttack("C5", Tone.now + 1.5);
//   synth.triggerAttack("E5", Tone.now + 2);
//   synth.triggerRelease(["D4", "F4", "A4", "C5", "E5"], Tone.now + 4);
//   // create two monophonic synths
//   const player = new Tone.Player({
//     url: "https://tonejs.github.io/audio/drum-samples/loops/ominous.mp3",
//     autostart: false,
//   });
// };

// document.addEventListener("click", playNote);
