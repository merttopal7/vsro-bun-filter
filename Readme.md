![alt text](ftemir.png)

# FTemir

## What is FTemir?

FTemir is a high-performance packet filter for Silkroad Online (v188), designed with a strong focus on  
**type safety, maintainability, and long-term stability**.

The project is built from scratch with a modern architecture, aiming to provide a clean,  
extensible, and developer-friendly filtering system without unnecessary abstractions or magic.  
FTemir prioritizes **clarity and correctness over feature bloat**.

---

## Core Philosophy

FTemir is built around the following principles:

- **Quality over quantity**
- **Explicit over implicit**
- **Zero reflection, zero magic**
- **Type-safe packet definitions**
- **Predictable runtime behavior**

Every packet explicitly defines how it is read and written.  
There are no hidden serializers, no reflection, and no runtime guessing.

---

## Key Features

- ⚡ **High performance** packet processing
- 🔒 **Type-safe fields** (byte, short, int, string, enums, flags)
- 🔁 **Reusable packet components**
- 🧩 Clean separation between **packet logic** and **business logic**
- 🌍 Designed for long-running, production-grade filters

---

## Packet Design

Packets in FTemir are defined using strongly-typed field descriptors:

```ts
hasShardEntries = byte();
shardId = short();
shardName = stringASCII();

this.TryRead(shardName);
this.TryRead(byte()); // skip unused field

shardName.set("Test");
this.TryWrite(shardName);
```

This approach ensures:
- No ambiguity in packet structure
- No accidental read/write mismatches
- Full control over protocol behavior

---

## Requirements

- **Bun** (v1.3+ recommended)
- Windows or Linux (x64)
- Silkroad Online v188 protocol knowledge (recommended)

Install Bun from:  
https://bun.sh

---

## Running FTemir (Development)

Install dependencies:

```txt
bun install
```

Run directly from source:

```txt
bun run src/index.ts
```

Or using npm scripts:

```txt
bun run start
```

---

## Building (Production)

To build a standalone executable:

```txt
bun run build
```

This will compile the project into a single binary using Bun’s compiler.

---

## Special Thanks

- [DuckSoup](https://github.com/ducksoup-sro/ducksoup)
    - for being a high-quality, well-structured Silkroad packet filter
    - for inspiration regarding maintainability, packet handling concepts and overall architecture
    - project repository: https://github.com/ducksoup-sro/ducksoup

- [pushedx](https://www.elitepvpers.com/forum/members/900141-pushedx.html)
    - for the original SilkroadSecurityAPI
    - original release: https://www.elitepvpers.com/forum/sro-coding-corner/1063078-c-silkroadsecurity.html

- [DaxterSoul](https://www.elitepvpers.com/forum/members/1084164-daxtersoul.html)
    - for the SilkroadDocs
    - documentation repository: https://github.com/DummkopfOfHachtenduden/SilkroadDoc/
