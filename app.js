class PitchBlock {
	constructor(pitch, interval, color) {
		//data
		this.pitch = pitch;
		this.interval = interval;
		this.color = color;
		this.duration = '8n';
		this.toneInterval = Tone.Time('8n')*this.interval;
		this.element = document.createElement('div');
		this.parentElement = document.getElementById('blocks');
		
		//tone js init
		this.synth = new Tone.Synth({
			oscillator: {
				type: 'triangle16'
			}
		}).toMaster();
		
		this.synth.volume.value = -5;
		
		//methods
		this.createElement();
		this.schedule();
	}
	
	schedule() {
		this.loop = new Tone.Loop((time)=>{
			this.synth.triggerAttackRelease(this.pitch, this.duration, time);
			
			Tone.Draw.schedule(()=>{
				this.flash();
			}, time);
		}, this.toneInterval);
		
		this.loop.start(this.toneInterval);
	}
	
	createElement() {
		this.element.classList.add('block');
		this.element.style.backgroundColor = this.color;
		this.parentElement.appendChild(this.element);
		
		let num = document.createElement('div');
		num.classList.add('block__num');
		num.innerHTML = this.interval.toString();
		this.element.appendChild(num);
		
		let note = document.createElement('div');
		note.classList.add('block__note');
		note.innerHTML = this.pitch;
		this.element.appendChild(note);
	}
	
	flash() {
		let duration = .05;
		let decay = () => TweenLite.to(this.element, duration*4, {opacity: .2});
		TweenLite.to(this.element, duration, {opacity: 1, onComplete: decay});
	}
}

class Drums {
	constructor() {
		this.bd = new Tone.MembraneSynth().toMaster();
		this.bd.volume.value = -7;
		
		this.schedule();
	}
	
	schedule() {
		let bdLoop = new Tone.Loop((time)=>{
			this.bd.triggerAttackRelease('C1', '8n', time);
		}, "4n");
		
		bdLoop.start(0);
	}
	
	//debug methods
	playHat() {
		this.hh.triggerAttackRelease('8n');
	}
}

class Loop {
	constructor() {
		//data
		this.pitchNames = ['C2', 'G2', 'C3', 'E3', 'G3', 'B3', 'D4', 'F4', 'G4', 'B4', 'C5', 'D5', 'E5', 'G5', 'A5'];
		this.primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
		this.pitchBlocks = [];
		this.playButton = document.getElementById('play-button');
		this.beatCount = -1;
		this.beatCountEl = document.getElementById('beatcount');
		this.active = false;
		
		//init methods
		this.generatePitchBlocks();
		this.setListeners();
		this.schedule();
	}
	
	generatePitchBlocks() {
		let pitches = this.pitchNames;
		let nums = this.primeNumbers;
		let blueValueIncrement = 255 / pitches.length;
		let blueValue = blueValueIncrement;
		
		for(let i=0; i<pitches.length; i++) {
			let color = `rgb(0,210,${blueValue})`;
			blueValue += blueValueIncrement;
			this.pitchBlocks.push(new PitchBlock(pitches[i], nums[i], color));
		}
	}
	
	schedule() {
		let loop = new Tone.Loop((time)=>{
			
			Tone.Draw.schedule(()=>{
				this.beatCount++;
				this.beatCountEl.innerHTML = this.beatCount.toString();
			}, time);
			
		}, '8n');
		
		loop.start(0);
	}
	
	togglePlayState() {
		this.active = !this.active;
		Tone.Transport.toggle();
		
		if(this.active) {
			this.playButton.innerHTML = 'stop';
			this.beatCount = -1;
		} else {
			this.playButton.innerHTML = 'play';
		}
	}
	
	setListeners() {
		this.playButton.addEventListener('click', ()=>this.togglePlayState());
	}
}

class Main {
	constructor() {
		this.loop = new Loop();
		this.drums = new Drums();
		Tone.context.latencyHint = 'playback';
		Tone.Transport.bpm.value = 120;
	}
	
	
}

let main = new Main();
