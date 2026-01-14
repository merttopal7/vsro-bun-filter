import { StaticType } from "./types";

export const StaticTypes = {
  byte<T extends number = number>(v?: T): StaticType<T> {
    return {
      value: v,
      read(r) { this.value = r.uint8(); },
      set(v) { this.value = v; },
      get() { return this.value; },
      write(w) { w.uint8(this.value); },
      valueOf() { return this.value; }
    };
  },

  bool(v = false): StaticType<boolean> {
    return {
      value: v,
      read(r) { this.value = (r.uint8() == 1); },
      set(v) { this.value = v; },
      get() { return this.value; },
      write(w) { w.uint8(this.value ? 1 : 0); },
      valueOf() { return this.value; }
    };
  },

  short(v = 0): StaticType<number> {
    return {
      value: v,
      read(r) { this.value = r.uint16(); },
      set(v) { this.value = v; },
      get() { return this.value; },
      write(w) { w.uint16(this.value); },
      valueOf() { return this.value; }
    };
  },

  int(v = 0): StaticType<number> {
    return {
      value: v,
      read(r) { this.value = r.uint32(); },
      set(v) { this.value = v; },
      get() { return this.value; },
      write(w) { w.uint32(this.value); },
      valueOf() { return this.value; }
    };
  },

  long(v = 0): StaticType<number> {
    return {
      value: v,
      read(r) { this.value = r.uint64(); },
      set(v) { this.value = v; },
      get() { return this.value; },
      write(w) { w.uint64(this.value); },
      valueOf() { return this.value; }
    };
  },

  string(v = ""): StaticType<string> {
    return {
      value: v,
      read(r) { this.value = r.string(); },
      set(v) { this.value = v; },
      get() { return this.value; },
      write(w) { w.string(this.value); },
      valueOf() { return this.value; }
    };
  },
  stringASCII(v = ""): StaticType<string> {
    return {
      value: v,
      read(r) { this.value = r.stringAscii(); },
      set(v) { this.value = v; },
      get() { return this.value; },
      write(w) { w.stringAscii(this.value); },
      valueOf() { return this.value; }
    };
  }
};