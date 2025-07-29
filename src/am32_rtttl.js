class AM32_Rtttl {
    static parse(rtttl) {
        // Ensure rtttl is a string
        if (typeof rtttl !== 'string') {
            rtttl = String(rtttl || '');
        }
        
        const REQUIRED_SECTIONS_NUM = 3;
        const SECTIONS = rtttl.split(':');

        // Validate format
        if (SECTIONS.length !== REQUIRED_SECTIONS_NUM) {
            // Instead of throwing, provide a default minimal valid structure
            console.warn('Invalid RTTTL string, using default values');
            return {
                name: 'Empty',
                defaults: {
                    duration: '4',
                    octave: '5',
                    bpm: '120'
                },
                melody: []
            };
        }

        const NAME = AM32_Rtttl.get_name(SECTIONS[0]);
        const DEFAULTS = AM32_Rtttl.get_defaults(SECTIONS[1]);
        const MELODY = AM32_Rtttl.get_data(SECTIONS[2], DEFAULTS);

        return {
            name: NAME,
            defaults: DEFAULTS,
            melody: MELODY
        };
    }

    static to_am32_startup_melody(rtttl, startup_melody_length = 128) {
        if (rtttl === '') {
            return {
                data: new Uint8Array(128),
                errorCodes: null
            };
        }
        const parsed_data = AM32_Rtttl.parse(rtttl);

        if (startup_melody_length < 4) {
            throw new Error('startupMelodyLength is too small to fit a am32 Startup Melody');
        }

        const MAX_ITEM_VALUE = 2**8;
        const melody = parsed_data.melody;
        const result = new Uint8Array(startup_melody_length);
        const error_codes = Array(melody.length).fill(0);

        const bpm = parseInt(parsed_data.defaults.bpm) % (2**16);
        result[0] = (bpm >> 8) & (2**8 - 1);
        result[1] = bpm & (2**8 - 1);
        result[2] = parseInt(parsed_data.defaults.octave) % MAX_ITEM_VALUE;
        result[3] = parseInt(parsed_data.defaults.duration) % MAX_ITEM_VALUE;

        let current_result_index = 4;
        let current_melody_index = 0;

        while (current_melody_index < melody.length && current_result_index < result.length) {
            const item = melody[current_melody_index];

            if (item.frequency !== 0) {
                const temp3 = AM32_Rtttl._calculate_am32_temp3_from_frequency(item.frequency);

                if (0 < temp3 && temp3 < MAX_ITEM_VALUE) {
                    const duration_per_pulse_ms = 1000 / item.frequency;
                    let pulses_needed = Math.round(item.duration / duration_per_pulse_ms);

                    while (pulses_needed > 0 && current_result_index < result.length) {
                        result[current_result_index] = Math.min(pulses_needed, MAX_ITEM_VALUE - 1);
                        result[current_result_index + 1] = temp3;
                        current_result_index += 2;
                        pulses_needed -= result[current_result_index - 2];
                    }

                    if (pulses_needed > 0) {
                        error_codes[current_melody_index] = 2;
                    } else {
                        error_codes[current_melody_index] = 0;
                    }
                } else {
                    error_codes[current_melody_index] = 1;
                }
            } else {
                let duration = Math.round(item.duration);

                while (duration > 0 && current_result_index < result.length) {
                    result[current_result_index] = Math.min(duration, MAX_ITEM_VALUE - 1);
                    result[current_result_index + 1] = 0;
                    current_result_index += 2;
                    duration -= result[current_result_index - 2];
                }

                if (duration > 0) {
                    error_codes[current_melody_index] = 2;
                } else {
                    error_codes[current_melody_index] = 0;
                }
            }

            current_melody_index += 1;
        }

        while (current_melody_index < melody.length) {
            error_codes[current_melody_index] = 2;
            current_melody_index += 1;
        }

        return {
            data: result,
            errorCodes: error_codes
        };
    }

    static is_am32_melody_param(param_struct) {
        // Note: Adapt to your specific DroneCAN implementation
        return param_struct.name === "STARTUP_TUNE" && 
               (param_struct.getActiveUnionField?.() === 'string_value' ||
                param_struct.value.hasOwnProperty('string_value'));
    }

    static is_am32_melody_param_from_file(name) {
        return name === "STARTUP_TUNE";
    }

    static from_am32_startup_melody(startup_melody_data, melody_name = 'Melody') {
        if (startup_melody_data instanceof Uint8Array && 
            startup_melody_data.every(byte => byte === 255 || byte === 0)) {
            return `${melody_name}:d=1,o=4,bpm=100:`;
        }

        if (startup_melody_data.length < 4) {
            return `${melody_name}:d=1,o=4,bpm=100:`;
        }

        const defaults = {
            bpm: (startup_melody_data[0] << 8) + startup_melody_data[1],
            octave: startup_melody_data[2],
            duration: startup_melody_data[3]
        };

        const melody_notes = [];
        for (let i = 4; i < startup_melody_data.length - 1; i += 2) {
            const freq = AM32_Rtttl._calculate_frequency_from_am32_temp3(startup_melody_data[i + 1]);
            const note = AM32_Rtttl._calculate_note_name_from_frequency(freq);
            const octave = AM32_Rtttl._calculate_note_octave_from_frequency(freq);
            const dur = freq === 0 ? 
                startup_melody_data[i] : 
                (1000 / AM32_Rtttl._calculate_frequency(note, octave)) * startup_melody_data[i];

            if (dur > 0) {
                if (melody_notes.length > 0 && 
                    Math.abs(melody_notes[melody_notes.length - 1].frequency - freq) < 0.01 && 
                    startup_melody_data[i - 2] === 255) {
                    melody_notes[melody_notes.length - 1].duration += dur;
                } else {
                    melody_notes.push({
                        duration: dur,
                        frequency: freq,
                        musicalNote: note,
                        musicalOctave: octave
                    });
                }
            } else {
                break;
            }
        }

        const full_note_duration = 4 * 60000 / defaults.bpm;
        const smallest_musical_duration = full_note_duration / 64;

        const quantized_duration = (duration) => {
            return Math.round(duration / smallest_musical_duration) * smallest_musical_duration;
        };

        let melody_string = '';
        for (const item of melody_notes) {
            let musical_duration = quantized_duration(item.duration) / full_note_duration;

            while (musical_duration > 1 / 64) {
                const current_duration = Math.min(1.5, musical_duration);
                const rtttl_duration = 2 ** -Math.floor(Math.log2(current_duration));
                const is_dotted_note = current_duration * rtttl_duration > 1;
                melody_string += (rtttl_duration === defaults.duration ? '' : rtttl_duration.toString()) +
                               item.musicalNote +
                               (item.musicalOctave === defaults.octave || item.musicalOctave === 0 ? '' : item.musicalOctave.toString()) +
                               (is_dotted_note ? '.' : '') + ',';
                musical_duration -= current_duration;
            }
        }

        return `${melody_name}:b=${defaults.bpm},o=${defaults.octave},d=${defaults.duration}:${melody_string.replace(/,$/,'')}`;
    }

    static get_melody_string_from_dronecan_param_value(value) {
        if (value.every(item => item === 255)) {
            return 'MelodyMelody:d=1,o=4,bpm=100:';
        }
        const melody_array = new Uint8Array(128);
        for (let i = 0; i < value.length; i++) {
            melody_array[i] = value[i];
        }
        const melody_string = AM32_Rtttl.from_am32_startup_melody(melody_array, "Melody");
        return melody_string;
    }

    static get_name(name) {
        const MAX_LENGTH = 10;

        if (name.length > MAX_LENGTH) {
            console.warn('Warning: Tune name should not exceed 10 characters.');
        }

        return name || 'Unknown';
    }

    static get_defaults(defaults) {
        const VALUES = defaults.split(',');

        const ALLOWED_DURATION = ['1', '2', '4', '8', '16', '32'];
        const ALLOWED_OCTAVE = ['4', '5', '6', '7'];
        const ALLOWED_BPM = [
            '25', '28', '31', '35', '40', '45', '50', '56', '63', '70', '80', '90', '100',
            '112', '125', '140', '160', '180', '200', '225', '250', '285', '320', '355',
            '400', '450', '500', '565', '570', '635', '715', '800', '900'
        ];

        const DEFAULT_VALUES = {
            duration: '4',
            octave: '6',
            bpm: '63'
        };

        for (const value of VALUES) {
            if (value) {
                const [KEY, VAL] = value.split('=');
                if (KEY === 'd' && ALLOWED_DURATION.includes(VAL)) {
                    DEFAULT_VALUES.duration = VAL;
                } else if (KEY === 'o' && ALLOWED_OCTAVE.includes(VAL)) {
                    DEFAULT_VALUES.octave = VAL;
                } else if (KEY === 'b' && ALLOWED_BPM.includes(VAL)) {
                    DEFAULT_VALUES.bpm = VAL;
                }
            }
        }

        return { ...DEFAULT_VALUES };
    }

    static _calculate_semitones_from_c4(note, octave) {
        const NOTE_ORDER = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
        const MIDDLE_OCTAVE = 4;
        const SEMITONES_IN_OCTAVE = 12;
        const OCTAVE_JUMP = (parseInt(octave) - MIDDLE_OCTAVE) * SEMITONES_IN_OCTAVE;
        return NOTE_ORDER.indexOf(note) + OCTAVE_JUMP;
    }

    static get_data(melody, defaults) {
        const NOTES = melody.split(',');
        const BEAT_EVERY = 60000 / parseInt(defaults.bpm);

        const calculate_duration = (beat_every, note_duration, dots) => {
            const DURATION = (beat_every * 4) / note_duration;
            return DURATION * (dots === 4 ? 1.9375 : dots === 3 ? 1.875 : dots === 2 ? 1.75 : dots === 1 ? 1.5 : 1);
        };

        const calculate_frequency = (note, octave) => {
            if (note === 'p') {
                return 0;
            }
            const C4 = 261.63;
            const TWELFTH_ROOT = Math.pow(2, 1/12);
            const N = AM32_Rtttl._calculate_semitones_from_c4(note, octave);
            return Math.round(C4 * Math.pow(TWELFTH_ROOT, N) * 10) / 10;
        };

        const NOTE_REGEX = /^(1|2|4|8|16|32|64)?((?:[a-g]|h|p)#?)(\.*)(1|2|3|4|5|6|7|8)?(\.*)/;
        const parsed_notes = [];

        for (const note of NOTES) {
            if (!note) continue;
            
            const match = NOTE_REGEX.exec(note);
            if (match) {
                const NOTE_DURATION = match[1] || defaults.duration;
                const NOTE = match[2] === 'h' ? 'b' : match[2];
                const NOTE_OCTAVE = match[4] || defaults.octave;
                const NOTE_DOTS = (match[3] ? match[3].length : 0) + (match[5] ? match[5].length : 0);

                parsed_notes.push({
                    note: NOTE,
                    duration: calculate_duration(BEAT_EVERY, parseFloat(NOTE_DURATION), NOTE_DOTS),
                    frequency: calculate_frequency(NOTE, NOTE_OCTAVE)
                });
            }
        }

        return parsed_notes;
    }

    static _calculate_am32_temp3_from_frequency(freq) {
        return freq === 0 ? 0 : Math.round(1000000 / (freq * 24.72) - 399.3 / 24.72);
    }

    static _calculate_frequency_from_am32_temp3(temp3) {
        return temp3 === 0 ? 0 : 1000000 / (24.72 * temp3 + 399.3);
    }

    static _calculate_note_name_from_frequency(freq) {
        if (freq === 0) {
            return 'p';
        }
        const C4 = 261.63;
        const NOTE_ORDER = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
        const SEMITONES_IN_OCTAVE = 12;
        const note_semitones = Math.round(SEMITONES_IN_OCTAVE * Math.log2(freq / C4));
        const note_index = note_semitones >= 0 
            ? note_semitones % SEMITONES_IN_OCTAVE 
            : 12 + (note_semitones % SEMITONES_IN_OCTAVE);
        return NOTE_ORDER[note_index];
    }

    static _calculate_frequency(note, octave) {
        if (note === 'p') {
            return 0;
        }
        const C4 = 261.63;
        const NOTE_ORDER = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
        const SEMITONES_IN_OCTAVE = 12;
        const MIDDLE_OCTAVE = 4;
        const note_index = NOTE_ORDER.indexOf(note);
        const octave_diff = parseInt(octave) - MIDDLE_OCTAVE;
        const semitone_diff = note_index + (octave_diff * SEMITONES_IN_OCTAVE);
        return C4 * Math.pow(2, semitone_diff / SEMITONES_IN_OCTAVE);
    }

    static _calculate_note_octave_from_frequency(freq) {
        if (freq === 0) {
            return 0;
        }
        const C4 = 261.63;
        const MIDDLE_OCTAVE = 4;
        const SEMITONES_IN_OCTAVE = 12;
        const note_semitones = Math.round(SEMITONES_IN_OCTAVE * Math.log2(freq / C4));
        return MIDDLE_OCTAVE + Math.floor(note_semitones / SEMITONES_IN_OCTAVE);
    }

    static _audioContext = null; // Class property to store the current audio context
    static _onMelodyEndListeners = [];

    static playMelody(rtttl) {
        try {
            // Stop any currently playing melody first
            this.stopMelody();
            
            // Basic validation
            if (!rtttl || typeof rtttl !== 'string' || !rtttl.includes(':')) {
                console.warn("Invalid RTTTL format, cannot play");
                return false;
            }
            
            // Create new audio context
            this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioContext = this._audioContext;
            
            const parsedData = this.parse(rtttl);
            let startTime = audioContext.currentTime;
            
            // Only proceed if we have melody data
            if (!parsedData.melody || parsedData.melody.length === 0) {
                console.warn("No melody data to play");
                return false;
            }
            
            // Store references to oscillators and gain nodes for potential cleanup
            this._audioNodes = [];
            
            // Calculate total melody duration for the end callback
            let totalDuration = 0;
            
            parsedData.melody.forEach(note => {
                // Create audio nodes for each note
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.frequency.value = note.frequency || 0;
                oscillator.type = 'sine';
                
                gainNode.gain.value = 0.3; // Adjust volume
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                if (note.frequency > 0) {
                    oscillator.start(startTime);
                    oscillator.stop(startTime + note.duration / 1000);
                }
                
                // Store nodes for potential cleanup
                this._audioNodes.push({ oscillator, gainNode });
                
                // Update total duration
                totalDuration = Math.max(totalDuration, startTime + note.duration / 1000 - audioContext.currentTime);
                
                startTime += note.duration / 1000;
            });
            
            // Set up a timer to notify when melody ends
            setTimeout(() => {
                this._notifyMelodyEnd();
            }, (totalDuration * 1000) + 100); // Convert to ms and add a small buffer
            
            return true;
        } catch (err) {
            console.error("Error in playMelody:", err);
            // Clean up in case of error
            this.stopMelody();
            return false;
        }
    }

    static stopMelody() {
        try {
            // If there's an active AudioContext, close it
            if (this._audioContext) {
                // In most browsers, close() is asynchronous and returns a promise
                this._audioContext.close().catch(err => {
                    console.warn("Error closing AudioContext:", err);
                });
                
                // Clear the reference
                this._audioContext = null;
                this._audioNodes = [];
                
                // Notify melody end listeners
                this._notifyMelodyEnd();
            }
        } catch (err) {
            console.warn("Error in stopMelody:", err);
        }
    }

    static _notifyMelodyEnd() {
        // Call all registered listeners
        this._onMelodyEndListeners.forEach(callback => {
            try {
                callback();
            } catch (err) {
                console.warn("Error in melody end listener:", err);
            }
        });
    }

    static addMelodyEndListener(callback) {
        this._onMelodyEndListeners.push(callback);
    }

    static removeMelodyEndListener(callback) {
        this._onMelodyEndListeners = this._onMelodyEndListeners.filter(cb => cb !== callback);
    }
}

export default AM32_Rtttl;

// Example of how to use the class
// const rtttl_string = "bluejay:b=570,o=4,d=32:4b,p,4e5,p,4b,p,4f#5,2p,4e5,2b5,8b5";
// const am32_melody = AM32_Rtttl.to_am32_startup_melody(rtttl_string, 128);
// console.log("AM32 EEPROM Struct:", Array.from(am32_melody.data));
// const melody_string = AM32_Rtttl.from_am32_startup_melody(am32_melody.data, "bluejay_converted");
// console.log("Converted Melody String:", ody_string);