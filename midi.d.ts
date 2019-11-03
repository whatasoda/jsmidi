export = jsmidi;
declare namespace jsmidi {
  const MidiEvent: {
    noteOn(note: Note): MidiEvent;
    noteOff(note: Note): MidiEvent;
  };

  class MidiTrack {
    constructor(options: MidiTrackOptions);
  }

  const MidiWriter: (arg: { tracks: MidiTrack[] }) => Song;

  const noteTable: Record<MidiNoteName, number>;

  interface Note {
    duration: number;
    channel: number;
    pitch: number;
    volume: number;
  }
  interface MidiEvent {}

  interface MidiTrackOptions {
    events: MidiEvent[];
  }

  interface Song {
    b64: string;
  }

  type MidiNoteName =
    | 'G9'
    | 'Gb9'
    | 'F9'
    | 'E9'
    | 'Eb9'
    | 'D9'
    | 'Db9'
    | 'C9'
    | 'B8'
    | 'Bb8'
    | 'A8'
    | 'Ab8'
    | 'G8'
    | 'Gb8'
    | 'F8'
    | 'E8'
    | 'Eb8'
    | 'D8'
    | 'Db8'
    | 'C8'
    | 'B7'
    | 'Bb7'
    | 'A7'
    | 'Ab7'
    | 'G7'
    | 'Gb7'
    | 'F7'
    | 'E7'
    | 'Eb7'
    | 'D7'
    | 'Db7'
    | 'C7'
    | 'B6'
    | 'Bb6'
    | 'A6'
    | 'Ab6'
    | 'G6'
    | 'Gb6'
    | 'F6'
    | 'E6'
    | 'Eb6'
    | 'D6'
    | 'Db6'
    | 'C6'
    | 'B5'
    | 'Bb5'
    | 'A5'
    | 'Ab5'
    | 'G5'
    | 'Gb5'
    | 'F5'
    | 'E5'
    | 'Eb5'
    | 'D5'
    | 'Db5'
    | 'C5'
    | 'B4'
    | 'Bb4'
    | 'A4'
    | 'Ab4'
    | 'G4'
    | 'Gb4'
    | 'F4'
    | 'E4'
    | 'Eb4'
    | 'D4'
    | 'Db4'
    | 'C4'
    | 'B3'
    | 'Bb3'
    | 'A3'
    | 'Ab3'
    | 'G3'
    | 'Gb3'
    | 'F3'
    | 'E3'
    | 'Eb3'
    | 'D3'
    | 'Db3'
    | 'C3'
    | 'B2'
    | 'Bb2'
    | 'A2'
    | 'Ab2'
    | 'G2'
    | 'Gb2'
    | 'F2'
    | 'E2'
    | 'Eb2'
    | 'D2'
    | 'Db2'
    | 'C2'
    | 'B1'
    | 'Bb1'
    | 'A1'
    | 'Ab1'
    | 'G1'
    | 'Gb1'
    | 'F1'
    | 'E1'
    | 'Eb1'
    | 'D1'
    | 'Db1'
    | 'C1'
    | 'B0'
    | 'Bb0'
    | 'A0'
    | 'Ab0'
    | 'G0'
    | 'Gb0'
    | 'F0'
    | 'E0'
    | 'Eb0'
    | 'D0'
    | 'Db0'
    | 'C0';
}
