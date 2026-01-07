# FTemir

## What is FTemir?

FTemir is a high-performance packet filter for Silkroad Online (v188), designed with a strong focus on
**type safety, maintainability, and long-term stability**.

The project is built from scratch with a modern architecture, aiming to provide a clean,
extensible, and developer-friendly filtering system without unnecessary abstractions or magic.
FTemir prioritizes **clarity and correctness over feature bloat**.

Unlike traditional filters, FTemir uses a **schema-based packet design** with explicit read/write
definitions, making packet logic easy to reason about and hard to misuse.

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
this.TryRead(byte()); // for unnecessary fields

shardName.set("Test");
this.TryWrite(shardName);