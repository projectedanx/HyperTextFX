# V.I.P.E.R. Implementation Plan & Checklist

This document outlines the engineering steps required to integrate the V.I.P.E.R. ("The Gaffer") Optical Translation Engine into the HyperTextFX application.

## Phase 1: Engine Foundation & The Scar Archivist

The foundational layer involves setting up the core parsing and memory systems for the V.I.P.E.R. persona.

- [ ] **1.1. Create V.I.P.E.R. Service Module (`services/viperOps.ts`)**
    - Scaffold the core `ViperEngine` class.
    - Implement the four-phase Petzold Loop state machine methods: `think()`, `denoise()`, `physicalize()`, `extrude()`.
- [ ] **1.2. Implement the Banned Token Registry**
    - Define the constant array of banned aesthetic tokens (e.g., `["masterpiece", "epic", "stunning", "beautiful", "hyper-realistic", ...]`).
    - Build the `detectBannedTokens()` utility to scan user input and return specific [DIAGNOSTIC REJECTION] messages mapping vibe tokens to required hardware parameters.
- [ ] **1.3. Implement the Scar Archivist (Symbolic Scar Memory)**
    - Create a state management slice (or Context) for the `ScarArchive`.
    - Define the `SymbolicScar` interface (`id`, `failureMode`, `topology`, `remedyDecorator`, `lastFiredCycle`).
    - Implement the FIPI (Failure-Informed Prompt Inversion) mechanism to inject relevant active scars as `+++SpatialBind` constraints during the `physicalize()` phase.
    - Implement the Debridement Protocol (prune scars that haven't fired in > 20 cycles).

## Phase 2: Denoise & Physicalize Logic

This phase handles the transformation of user intent into the PDL v1.0 constraints.

- [ ] **2.1. Implement the Adjectival Bounds Engine**
    - Build a lightweight PoS (Part of Speech) parser or heuristic to calculate the Adjectival Dilution Score (ADS).
    - Implement the stripping logic to enforce the max 2 limiting adjectives per entity rule.
- [ ] **2.2. Implement Hardware-Forced Physicality (HFP) Mapping**
    - Create the `HardwareRegistry` database (Lens, Film Stock, Sensor, Lighting, Aperture definitions).
    - Implement logic to map stripped semantic residue to the `HardwareRegistry`.
    - Implement the Pluriversal Optical Parameters toggle (e.g., Wong Kar-wai vs. Nollywood defaults).
    - Ensure the Hardware Grounding Index (HGI) calculation validates 100% compliance.
- [ ] **2.3. Implement RCC-8 Spatial Binding Calculus**
    - Define the 8 RCC-8 topological enums.
    - Implement logic to detect multi-subject interactions in the prompt and enforce `+++SpatialBind` generation.

## Phase 3: Extrusion & Integration

This phase integrates the V.I.P.E.R. engine into the React frontend and handles the Optical State Matrix (OSM) output.

- [ ] **3.1. Build the OSM Extruder**
    - Implement the formatting logic to produce the final JSON/Markdown hybrid output.
    - Ensure strict separation between the `[DIAGNOSTIC]` block and the `[OPTICAL STATE MATRIX]` block.
- [ ] **3.2. Integrate with Gemini Service (`services/gemini.ts`)**
    - Route relevant image-generation or visual-intent queries through the `ViperEngine` instead of standard text generation.
    - If the user provides an invalid prompt (ADS > 0.15 or banned tokens), intercept the API call, halt generation, and return the V.I.P.E.R. Diagnostic Rejection directly to the UI.
- [ ] **3.3. Build the V.I.P.E.R. UI Components**
    - Create a `DiagnosticConsole` component to render V.I.P.E.R.'s terse, physics-based rejections and parameter demands.
    - Create an `OsmViewer` component to display the final PDL v1.0 syntax payload cleanly.
    - Update `App.tsx` or relevant view panels to support the `PHOTOGRAPHIC_PHYSICS` vs `ILLUSTRATIVE_TOPOLOGY` mode switch toggle.
