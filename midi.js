const DEFAULT_VOLUME = 90;
const DEFAULT_DURATION = 128;
const DEFAULT_CHANNEL = 0;

// These are the different values that compose a MID header. They are already
// expressed in their string form, so no useless conversion has to take place
// since they are constants.

const HDR_CHUNKID = 'MThd';
const HDR_CHUNK_SIZE = '\x00\x00\x00\x06'; // Header size for SMF
const HDR_TYPE0 = '\x00\x00'; // Midi Type 0 id
// const HDR_TYPE1 = '\x00\x01'; // Midi Type 1 id
const HDR_SPEED = '\x00\x80'; // Defaults to 128 ticks per beat

// Midi event codes
const EVT_NOTE_OFF = 0x8;
const EVT_NOTE_ON = 0x9;
// const EVT_AFTER_TOUCH = 0xa;
// const EVT_CONTROLLER = 0xb;
// const EVT_PROGRAM_CHANGE = 0xc;
// const EVT_CHANNEL_AFTERTOUCH = 0xd;
const EVT_PITCH_BEND = 0xe;

// const META_SEQUENCE = 0x00;
const META_TEXT = 0x01;
const META_COPYRIGHT = 0x02;
const META_TRACK_NAME = 0x03;
const META_INSTRUMENT = 0x04;
const META_LYRIC = 0x05;
const META_MARKER = 0x06;
const META_CUE_POINT = 0x07;
// const META_CHANNEL_PREFIX = 0x20;
// const META_END_OF_TRACK = 0x2f;
const META_TEMPO = 0x51;
// const META_SMPTE = 0x54;
// const META_TIME_SIG = 0x58;
// const META_KEY_SIG = 0x59;
// const META_SEQ_EVENT = 0x7f;

// This is the conversion table from notes to its MIDI number. Provided for
// convenience, it is not used in this code.
const noteTable = {
  G9: 0x7f,
  Gb9: 0x7e,
  F9: 0x7d,
  E9: 0x7c,
  Eb9: 0x7b,
  D9: 0x7a,
  Db9: 0x79,
  C9: 0x78,
  B8: 0x77,
  Bb8: 0x76,
  A8: 0x75,
  Ab8: 0x74,
  G8: 0x73,
  Gb8: 0x72,
  F8: 0x71,
  E8: 0x70,
  Eb8: 0x6f,
  D8: 0x6e,
  Db8: 0x6d,
  C8: 0x6c,
  B7: 0x6b,
  Bb7: 0x6a,
  A7: 0x69,
  Ab7: 0x68,
  G7: 0x67,
  Gb7: 0x66,
  F7: 0x65,
  E7: 0x64,
  Eb7: 0x63,
  D7: 0x62,
  Db7: 0x61,
  C7: 0x60,
  B6: 0x5f,
  Bb6: 0x5e,
  A6: 0x5d,
  Ab6: 0x5c,
  G6: 0x5b,
  Gb6: 0x5a,
  F6: 0x59,
  E6: 0x58,
  Eb6: 0x57,
  D6: 0x56,
  Db6: 0x55,
  C6: 0x54,
  B5: 0x53,
  Bb5: 0x52,
  A5: 0x51,
  Ab5: 0x50,
  G5: 0x4f,
  Gb5: 0x4e,
  F5: 0x4d,
  E5: 0x4c,
  Eb5: 0x4b,
  D5: 0x4a,
  Db5: 0x49,
  C5: 0x48,
  B4: 0x47,
  Bb4: 0x46,
  A4: 0x45,
  Ab4: 0x44,
  G4: 0x43,
  Gb4: 0x42,
  F4: 0x41,
  E4: 0x40,
  Eb4: 0x3f,
  D4: 0x3e,
  Db4: 0x3d,
  C4: 0x3c,
  B3: 0x3b,
  Bb3: 0x3a,
  A3: 0x39,
  Ab3: 0x38,
  G3: 0x37,
  Gb3: 0x36,
  F3: 0x35,
  E3: 0x34,
  Eb3: 0x33,
  D3: 0x32,
  Db3: 0x31,
  C3: 0x30,
  B2: 0x2f,
  Bb2: 0x2e,
  A2: 0x2d,
  Ab2: 0x2c,
  G2: 0x2b,
  Gb2: 0x2a,
  F2: 0x29,
  E2: 0x28,
  Eb2: 0x27,
  D2: 0x26,
  Db2: 0x25,
  C2: 0x24,
  B1: 0x23,
  Bb1: 0x22,
  A1: 0x21,
  Ab1: 0x20,
  G1: 0x1f,
  Gb1: 0x1e,
  F1: 0x1d,
  E1: 0x1c,
  Eb1: 0x1b,
  D1: 0x1a,
  Db1: 0x19,
  C1: 0x18,
  B0: 0x17,
  Bb0: 0x16,
  A0: 0x15,
  Ab0: 0x14,
  G0: 0x13,
  Gb0: 0x12,
  F0: 0x11,
  E0: 0x10,
  Eb0: 0x0f,
  D0: 0x0e,
  Db0: 0x0d,
  C0: 0x0c,
};

// Helper functions

/**
 * Converts an array of bytes to a string of hexadecimal characters. Prepares
 * it to be converted into a base64 string.
 *
 * @param byteArray {Array} array of bytes that will be converted to a string
 * @returns hexadecimal string
 */
function codes2Str(byteArray) {
  return String.fromCharCode(...byteArray);
}

/**
 * Converts a String of hexadecimal values to an array of bytes. It can also
 * add remaining "0" nibbles in order to have enough bytes in the array as the
 * |finalBytes| parameter.
 *
 * @param str {String} string of hexadecimal values e.g. "097B8A"
 * @param finalBytes {Integer} Optional. The desired number of bytes that the returned array should contain
 * @returns array of nibbles.
 */

function str2Bytes(str, finalBytes) {
  if (finalBytes) {
    while (str.length / 2 < finalBytes) {
      str = '0' + str;
    }
  }

  const bytes = [];
  for (let i = str.length - 1; i >= 0; i = i - 2) {
    const chars = i === 0 ? str[i] : str[i - 1] + str[i];
    bytes.unshift(parseInt(chars, 16));
  }

  return bytes;
}

function isArray(obj) {
  return !!(obj && obj.concat && obj.unshift && !obj.callee);
}

/**
 * Translates number of ticks to MIDI timestamp format, returning an array of
 * bytes with the time values. Midi has a very particular time to express time,
 * take a good look at the spec before ever touching this function.
 *
 * @param ticks {Integer} Number of ticks to be translated
 * @returns Array of bytes that form the MIDI time value
 */
const translateTickTime = function(ticks) {
  let buffer = ticks & 0x7f;

  while ((ticks = ticks >> 7)) {
    buffer <<= 8;
    buffer |= (ticks & 0x7f) | 0x80;
  }

  const bList = [];
  let loop = true;
  while (loop) {
    bList.push(buffer & 0xff);

    if (buffer & 0x80) {
      buffer >>= 8;
    } else {
      loop = false;
    }
  }
  return bList;
};

/**
 * This is the function that assembles the MIDI file. It writes the
 * necessary constants for the MIDI header and goes through all the tracks, appending
 * their data to the final MIDI stream.
 * It returns an object with the final values in hex and in base64, and with
 * some useful methods to play an manipulate the resulting MIDI stream.
 *
 * @param config {Object} Configuration object. It contains the tracks, tempo
 * and other values necessary to generate the MIDI stream.
 *
 * @returns An object with the hex and base64 resulting streams, as well as
 * with some useful methods.
 */
const MidiWriter = function(config) {
  if (config) {
    const tracks = config.tracks || [];
    // Number of tracks in hexadecimal
    const tracksLength = tracks.length.toString(16);

    // This constiable will hold the whole midi stream and we will add every
    // chunk of MIDI data to it in the next lines.
    let hexMidi = HDR_CHUNKID + HDR_CHUNK_SIZE + HDR_TYPE0;

    // Appends the number of tracks expressed in 2 bytes, as the MIDI
    // standard requires.
    hexMidi += codes2Str(str2Bytes(tracksLength, 2));
    hexMidi += HDR_SPEED;
    // Goes through the tracks appending the hex strings that compose them.
    tracks.forEach(function(trk) {
      hexMidi += codes2Str(trk.toBytes());
    });

    return {
      b64: Buffer.from(hexMidi, 'utf-8').toString('base64'),
      play() {
        if (document) {
          const embed = document.createElement('embed');
          embed.setAttribute('src', 'data:audio/midi;base64,' + this.b64);
          embed.setAttribute('type', 'audio/midi');
          document.body.appendChild(embed);
        }
      },
      save() {
        // window.open(
        //   'data:audio/midi;base64,' + this.b64,
        //   'JSMidi generated output',
        //   'resizable=yes,scrollbars=no,status=no',
        // );
      },
    };
  } else {
    throw new Error('No parameters have been passed to MidiWriter.');
  }
};

/**
 * Generic MidiEvent object. This object is used to create standard MIDI events
 * (note Meta events nor SysEx events). It is passed a |params| object that may
 * contain the keys time, type, channel, param1 and param2. Note that only the
 * type, channel and param1 are strictly required. If the time is not provided,
 * a time of 0 will be assumed.
 */
class MidiEvent {
  /**
   * @param {object} params Object containing the properties of the event.
   */
  constructor(params) {
    if (
      params &&
      (params.type !== null || params.type !== undefined) &&
      (params.channel !== null || params.channel !== undefined) &&
      (params.param1 !== null || params.param1 !== undefined)
    ) {
      this.setTime(params.time);
      this.setType(params.type);
      this.setChannel(params.channel);
      this.setParam1(params.param1);
      this.setParam2(params.param2);
    } else {
      throw new Error('Not enough parameters to create an event.');
    }
  }

  /**
   * Returns the list of events that form a note in MIDI. If the |sustained|
   * parameter is not specified, it creates the noteOff event, which stops the
   * note after it has been played, instead of keeping it playing.
   *
   * This method accepts two ways of expressing notes. The first one is a string,
   * which will be looked up in the global |noteTable| but it will take the
   * default values for pitch, channel, durtion and volume.
   *
   * If a note object is passed to the method instead, it should contain the properties
   * channel, pitch, duration and volume, of which pitch is mandatory. In case the
   * channel, the duration or the volume are not passed, default values will be
   * used.
   *
   * @param note {object || String} Object with note properties or string
   * @param sustained {Boolean} Whether the note has to end or keep playing
   * @returns Array of events, with a maximum of two events (noteOn and noteOff)
   */
  static createNote(note, sustained) {
    if (!note) {
      throw new Error('Note not specified');
    }

    if (typeof note === 'string') {
      note = noteTable[note];
      // The pitch is mandatory if the note object is used.
    } else if (!note.pitch) {
      throw new Error('The pitch is required in order to create a note.');
    }

    const events = [];
    events.push(MidiEvent.noteOn(note));

    // If there is a |sustained| parameter, the note will keep playing until
    // a noteOff event is issued for it.
    if (!sustained) {
      // The noteOff event will be the one that is passed the actual duration
      // value for the note, since it is the one that will stop playing the
      // note at a particular time. If not specified it takes the default
      // value for it.
      // TODO: Is is good to have a default value for it?
      events.push(MidiEvent.noteOff(note, note.duration || DEFAULT_DURATION));
    }

    return events;
  }

  /**
   * Returns an event of the type NOTE_ON taking the values passed and falling
   * back to defaults if they are not specified.
   *
   * @param note {Note || String} Note object or string
   * @param time {Number} Duration of the note in ticks
   * @returns MIDI event with type NOTE_ON for the note specified
   */
  static noteOn(note, duration) {
    return new MidiEvent({
      time: note.duration || duration || 0,
      type: EVT_NOTE_ON,
      channel: note.channel || DEFAULT_CHANNEL,
      param1: note.pitch || note,
      param2: note.volume || DEFAULT_VOLUME,
    });
  }

  /**
   * Returns an event of the type NOTE_OFF taking the values passed and falling
   * back to defaults if they are not specified.
   *
   * @param note {Note || String} Note object or string
   * @param time {Number} Duration of the note in ticks
   * @returns MIDI event with type NOTE_OFF for the note specified
   */

  static noteOff(note, duration) {
    return new MidiEvent({
      time: note.duration || duration || 0,
      type: EVT_NOTE_OFF,
      channel: note.channel || DEFAULT_CHANNEL,
      param1: note.pitch || note,
      param2: note.volume || DEFAULT_VOLUME,
    });
  }

  type = 0;
  channel = 0;
  time = 0;
  setTime(ticks) {
    // The 0x00 byte is always the last one. This is how Midi
    // interpreters know that the time measure specification ends and the
    // rest of the event signature starts.

    this.time = translateTickTime(ticks || 0);
  }
  setType(type) {
    if (type < EVT_NOTE_OFF || type > EVT_PITCH_BEND) {
      throw new Error('Trying to set an unknown event: ' + type);
    }

    this.type = type;
  }
  setChannel(channel) {
    if (channel < 0 || channel > 15) {
      throw new Error('Channel is out of bounds.');
    }

    this.channel = channel;
  }
  setParam1(p) {
    this.param1 = p;
  }
  setParam2(p) {
    this.param2 = p;
  }
  toBytes() {
    const byteArray = [];

    const typeChannelByte = parseInt(this.type.toString(16) + this.channel.toString(16), 16);

    byteArray.push.apply(byteArray, this.time);
    byteArray.push(typeChannelByte);
    byteArray.push(this.param1);

    // Some events don't have a second parameter
    if (this.param2 !== undefined && this.param2 !== null) {
      byteArray.push(this.param2);
    }
    return byteArray;
  }
}

class MetaEvent {
  constructor(params) {
    if (params) {
      this.setType(params.type);
      this.setData(params.data);
    }
  }
  setType(t) {
    this.type = t;
  }
  setData(d) {
    this.data = d;
  }
  toBytes() {
    if (!this.type || !this.data) {
      throw new Error('Type or data for meta-event not specified.');
    }

    const byteArray = [0xff, this.type];

    // If data is an array, we assume that it contains several bytes. We
    // apend them to byteArray.
    if (isArray(this.data)) {
      byteArray.push(...this.data);
    }

    return byteArray;
  }
}

class MidiTrack {
  constructor(cfg) {
    this.events = [];
    for (const p in cfg) {
      if (Object.prototype.hasOwnProperty.call(cfg, p)) {
        // Get the setter for the property. The property is capitalized.
        // Probably a try/catch should go here.
        this['set' + p.charAt(0).toUpperCase() + p.substring(1)](cfg[p]);
      }
    }
  }

  //"MTrk" Marks the start of the track data
  static TRACK_START = [0x4d, 0x54, 0x72, 0x6b];
  static TRACK_END = [0x0, 0xff, 0x2f, 0x0];
  /**
   * Adds an event to the track.
   *
   * @param event {MidiEvent} Event to add to the track
   * @returns the track where the event has been added
   */
  addEvent(event) {
    this.events.push(event);
    return this;
  }
  setEvents(events) {
    this.events.push(...events);
    return this;
  }
  /**
   * Adds a text meta-event to the track.
   *
   * @param type {Number} type of the text meta-event
   * @param text {String} Optional. Text of the meta-event.
   * @returns the track where the event ahs been added
   */
  setText(type, text) {
    // If the param text is not specified, it is assumed that a generic
    // text is wanted and that the type parameter is the actual text to be
    // used.
    if (!text) {
      type = META_TEXT;
      text = type;
    }
    return this.addEvent(new MetaEvent({ type: type, data: text }));
  }
  // The following are setters for different kinds of text in MIDI, they all
  // use the |setText| method as a proxy.
  setCopyright(text) {
    return this.setText(META_COPYRIGHT, text);
  }
  setTrackName(text) {
    return this.setText(META_TRACK_NAME, text);
  }
  setInstrument(text) {
    return this.setText(META_INSTRUMENT, text);
  }
  setLyric(text) {
    return this.setText(META_LYRIC, text);
  }
  setMarker(text) {
    return this.setText(META_MARKER, text);
  }
  setCuePoint(text) {
    return this.setText(META_CUE_POINT, text);
  }

  setTempo(tempo) {
    this.addEvent(new MetaEvent({ type: META_TEMPO, data: tempo }));
  }
  setTimeSig() {
    // TBD
  }
  setKeySig() {
    // TBD
  }

  toBytes() {
    let trackLength = 0;
    const eventBytes = [];
    const startBytes = MidiTrack.TRACK_START;
    const endBytes = MidiTrack.TRACK_END;

    /**
     * Adds the bytes of an event to the eventBytes array and add the
     * amount of bytes to |trackLength|.
     *
     * @param event {MidiEvent} MIDI event we want the bytes from.
     */
    const addEventBytes = function(event) {
      const bytes = event.toBytes();
      trackLength += bytes.length;
      eventBytes.push(...bytes);
    };

    this.events.forEach(addEventBytes);

    // Add the end-of-track bytes to the sum of bytes for the track, since
    // they are counted (unlike the start-of-track ones).
    trackLength += endBytes.length;

    // Makes sure that track length will fill up 4 bytes with 0s in case
    // the length is less than that (the usual case).
    const lengthBytes = str2Bytes(trackLength.toString(16), 4);

    return startBytes.concat(lengthBytes, eventBytes, endBytes);
  }
}

module.exports = { MidiWriter, MidiEvent, MetaEvent, MidiTrack, noteTable };
