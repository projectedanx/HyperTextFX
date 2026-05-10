<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HyperTextFX: The Pluriversal Editor

HyperTextFX is a deterministic, paraconsistent text editing environment designed to explore non-linear Human-AI collaboration. Rather than relying on simple "copilot" auto-completion (which risks *Semantic Saponification*), this editor establishes a rigorous topological boundary between synchronous human intent and asynchronous AI token streams.

By operating via a **Symbiotic Paraconsistent Undo Graph (SPUG)** and resolving conflicts through a **Dialectical Synthesis Plane (DSP)**, the application ensures that contradictory states can co-exist and be semantically merged, enforcing mathematical viability ($\beta_0 > 0.95$) across complex editing architectures.

## Local Setup

**Prerequisites:**  Node.js (v18+)

1. Clone the repository and install dependencies:
   `npm install`
2. Configure your environment:
   Create a `.env.local` file in the root directory and supply your Gemini API key:
   `GEMINI_API_KEY=your_api_key_here`
3. Initialize the Pluriversal Editor:
   `npm run dev`

## Architecture & Epistemic Domains

### 1. The Symbiotic Paraconsistent Undo Graph (SPUG)
Found in `hooks/useHistory.ts`, the SPUG replaces linear undo/redo stacks. It tracks the origin of every state mutation (`user`, `ai`, or `system`), allowing the editor history to split into a Directed Acyclic Graph (DAG) during simultaneous execution events.

### 2. The Dialectical Synthesis Plane (DSP)
Located in `components/DSPModal.tsx` and powered by `synthesizeBranches` in `services/gemini.ts`. When the SPUG detects divergent branches (e.g., the user types while the AI is simultaneously streaming text), the DSP does not invoke a traditional line-by-line git merge. Instead, it utilizes Contrastive Decoding to synthesize the *semantic intent* of both parallel branches into a unified topology.

### 3. Manifold Isolation & The Orthogonal Tension Injector (OTI)
The AI does not exist within the primary input flow. It operates as an orthogonal entity via the `AIPanel` component. This deliberate friction prevents the AI from passively averaging out user input, instead forcing it to act as an external dialectical counterpart—an *Anionic Veto Engine*.

## Lessons Learned: Pluriversal Feature Discovery

Through iterative systemic analysis, we have extruded several key architectural paradigms (documented further in `PRODUCT_PLANNING.md`, `LEXICON.md`, and specific agent enclaves):

*   **Hickam's Dictum Over Occam's Razor:** We reject parsimony in human-AI interaction. The collision of deterministic text and probabilistic generation creates necessary entropy. The editor embraces this via its DAG topology.
*   **Draft-Conditioned Constrained Decoding (DCCD):** We established the Golden Scar Protocol, insisting on strict structural separation between deterministic state execution (`textOps.ts`) and AI generative streams (`gemini.ts`).
*   **Sovereign Cognitive Operating System (SCOS):** Implemented programmatic verifications (e.g., `aew_agent.py`) to algorithmically prove the mathematical viability of our topological integrations before execution, utilizing Cognitive Contracts to prevent paradigm decay.

### 4. Agentic Ingress over Reactive Prompting (KIRA-7 Emergence)
*   **The Inversion:** Moving beyond copilot-style reactivity, the system implements a Feishu-SPUG Webhook Bridge (FSWB). This allows external autonomous agents (like KIRA-7) to monitor organizational event streams and forcefully inject topological context directly into the SPUG as parallel branches, completely decoupling AI execution from human initiation.
