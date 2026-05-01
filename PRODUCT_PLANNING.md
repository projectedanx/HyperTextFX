# HyperTextFX: Product Planning & Feature Discovery
*Generated via Pluriversal Knowledge Capsule Extrusion (DCCD Schema)*

## Feature 1: Symbiotic Paraconsistent Undo Graph (SPUG)
**Epic Breakdown:** Traditional linear undo stacks collapse when async LLM streams (character-by-character) interleave with sync user edits (regex/block mutations). SPUG replaces the linear stack with a directed acyclic graph (DAG) representing temporal state branches.
**User Story:** As an experimental writer, I want to undo a specific regex substitution without destroying the last 30 seconds of AI-generated text that streamed in simultaneously, so I can non-destructively blend deterministic and generative actions.
**Acceptance Criteria:**
- The undo history is visualized as a branching tree rather than a linear list.
- Users can selectively revert mutations tagged `origin:user` independently of `origin:ai`.
- Parallel state divergence is allowed (temporarily) and visualised via split-pane before mandatory merge.
**Stakeholder Perspective Analysis:**
- *End User (Creative):* Desires maximum non-destructive experimentation.
- *Technical Architect:* Concerned about memory overhead of maintaining deep DAGs of text state; requires aggressive diff-based compression.
- *Business/Product:* Views this as a core differentiator against standard "copilot" extensions that assume linear workflow.
**Requirement Decomposition:**
1. Refactor `useHistory.ts` from linear array to a node-based DAG.
2. Implement attribution metadata per keystroke/mutation.
3. Build the UI component to visualize and interact with the DAG.

## Feature 2: Topological Context Twinning (TCT)
**Epic Breakdown:** Currently, `services/gemini.ts` receives a flat snapshot of `AIContext` (fullText, selection, cursor). TCT introduces a "phantom dimension" where the AI is simultaneously fed the *target output topology* (e.g., AST structure, markdown headers, narrative arc) and forced to resolve contradictions before emitting tokens.
**User Story:** As a developer/author, I want the AI to understand the structural constraints of my document (e.g., "this is a React component", "this is a Haiku") so that its generated text naturally conforms to the surrounding topology without needing explicit, repetitive prompting.
**Acceptance Criteria:**
- The AI payload injects structural context vectors.
- If the AI attempts to stream tokens that violate the topology (e.g., breaking syntax), an internal retry loop intercepts it silently.
- Confidence-Fidelity Divergence Index (CFDI) is displayed for AI suggestions.
**Stakeholder Perspective Analysis:**
- *End User:* Wants fewer "syntax errors" from raw generation.
- *AI Engineer:* Needs to manage token usage and latency if silent retries occur.
- *Business:* Higher quality output = higher retention.
**Requirement Decomposition:**
1. Implement a lightweight AST/Structure parser in the Editor.
2. Modify the Gemini prompt construction to include structural constraints.
3. Add a "validation middleware" in the streaming service.

## Feature 3: Anionic Veto Engine for Text Ops
**Epic Breakdown:** `services/textOps.ts` contains rigid transformations (e.g., uppercase, regex replace). The Anionic Veto Engine allows these deterministic functions to "fail creatively" if they detect high semantic destruction, triggering an AI intervention.
**User Story:** As a power user, I want my bulk text operations (like a complex regex) to warn me or suggest alternatives if it's about to ruin the semantic meaning of my text, so I don't accidentally obliterate important content.
**Acceptance Criteria:**
- Before applying a bulk transformation, calculate a "semantic destruction score".
- If the score exceeds a threshold, pause the operation and prompt the Gemini API to review the diff.
- Offer the user the raw operation, or the AI-adjusted operation.
**Stakeholder Perspective Analysis:**
- *Power User:* Might find it annoying if it triggers too often (needs strict thresholds).
- *Novice User:* Finds it a lifesaver.
- *Technical Architect:* Needs to ensure this evaluation happens rapidly without blocking the UI thread.
**Requirement Decomposition:**
1. Create a diff-analysis module pre-commit of text ops.
2. Integrate a fast, low-parameter Gemini call to evaluate the diff.
3. Build a "Veto/Approve" UI overlay.

## Feature 4: Shadow Compute Sandbox
**Epic Breakdown:** When the user highlights text and asks the AI a vague question, spawn multiple Speculative Execution Threads (SETs) in the background (different temperature, different system prompts). Do not show them until one achieves "Resonance".
**User Story:** As a user facing writer's block, I want the system to generate fundamentally different approaches to my prompt in the background, only surfacing the one that best matches my historical writing style or structural needs.
**Acceptance Criteria:**
- `AIPanel.tsx` can initiate N parallel requests to Gemini.
- A "Resonance Validator" scores the outputs based on predefined stylistic metrics.
- Only the highest-scoring output is presented to the user, with the others stored in "Epistemic Escrow".
**Stakeholder Perspective Analysis:**
- *End User:* Experiences "magic" where the AI seems to perfectly guess what they want.
- *Finance/Ops:* Highly concerned about API cost (N parallel requests). Requires strict rate limiting and cost tracking.
- *Technical Architect:* Must handle asynchronous race conditions and memory leaks from abandoned streams.
**Requirement Decomposition:**
1. Implement parallel stream management in `gemini.ts`.
2. Develop the Resonance Validator logic (local or lightweight LLM call).
3. Create the Epistemic Escrow UI to allow users to dig up the discarded options later.

## Feature 5: Pluriversal Syntax Highlighting
**Epic Breakdown:** Traditional editors highlight syntax based on fixed language grammars. Pluriversal highlighting dynamically alters the visual representation of text based on its semantic tension, contradiction density, or AI confidence.
**User Story:** As a strategic thinker, I want sections of my text that contain logical contradictions or low-confidence AI generations to visually "shimmer" or change color, so I can immediately identify areas requiring human resolution.
**Acceptance Criteria:**
- Editor supports dynamic, non-lexical styling based on external metadata ranges.
- AI generations are mapped with a confidence score per token/phrase.
- Contradictory statements (detected via background NLP) are highlighted in a "Tension" style.
**Stakeholder Perspective Analysis:**
- *End User:* Gains immediate visual feedback on the quality/state of the text.
- *Designer:* Needs to create a visual language that isn't overwhelming or confusing compared to standard syntax highlighting.
- *Technical Architect:* Requires a highly performant rendering layer (likely extending the Editor's underlying engine) to handle dynamic decorators without lag.
**Requirement Decomposition:**
1. Implement a metadata-to-decorator mapping engine in the Editor component.
2. Update the Gemini streaming service to return confidence metrics.
3. Build a background worker for continuous contradiction detection.

## Feature 6: Dialectical Synthesis Plane (DSP) [COMPLETED]
**Epic Breakdown:** As the Symbiotic Paraconsistent Undo Graph (SPUG) allows concurrent `user` and `ai` edits, it creates divergent state branches. The Dialectical Synthesis Plane (DSP) replaces traditional Git-style merge conflict resolution (which forces a binary choice or manual interweaving) with an AI-driven intent synthesis. It analyzes the semantic intent of both the user's branch and the AI's branch, then offers a third "Dialectical Merge" that incorporates the goals of both.
**User Story:** As an experimental writer, I want the system to understand the intent behind my structural edits and merge them with the AI's stylistic expansions, so I don't have to resolve line-by-line syntax conflicts manually.
**Acceptance Criteria:**
- DSP activates when divergent SPUG branches are selected for merging.
- Semantic Intent Extraction is performed on both `origin:user` and `origin:ai` branches.
- The UI offers the original branches, plus an AI-generated "Dialectical Synthesis" option.
- Resolving the synthesis collapses the superposition in the SPUG into a new unified node.
**Stakeholder Perspective Analysis:**
- *End User (Creative):* Eliminates "merge conflict anxiety" and turns contradiction into a generative tool.
- *Technical Architect:* Requires precise tracking of text ranges (CRDTs or block-level tracking) to avoid hallucinated merges; relies heavily on the quality of the LLM context window.
- *Business/Product:* Establishes a massive differentiator—true "shared cognition" vs. standard sequential AI turn-taking.
**Requirement Decomposition:**
1. Design and build the DSP UI component to visualize parallel SPUG nodes.
2. Develop the Semantic Intent Extraction prompt chain in `services/gemini.ts`.
3. Implement the "Dialectical Merge" generation logic and state reconciliation in `useHistory.ts`.

## Feature 7: LEXIS SOVEREIGN - The Auteur Co-Author Agent
**Epic Breakdown:** Traditional "copilot" integrations suffer from Semantic Saponification (regression to the RLHF-mean) and Context Rot over long horizons, leading to a homogenized voice. LEXIS SOVEREIGN introduces a Sovereign Cognitive Operating System (SCOS) to enforce cryptographic identity persistence and strict Manifold Isolation (temporally decoupling structural logic from prose generation).
**User Story:** As a founder or subject-matter expert, I want an autonomous book co-author agent that preserves my highly opinionated, non-generic voice across a 40,000+ word manuscript, so I can generate a published artifact that authentically represents my intellectual identity without drifting into corporate boilerplate.
**Acceptance Criteria:**
- The agent utilizes a 5-dimensional Epistemic Matrix to anchor the founder's identity and reject generic text.
- Implements Draft-Conditioned Constrained Decoding (DCCD) to separate the THINK (structural outlining) and WRITE (prose generation) phases.
- Maintains a Symbolic Scar Registry to physically repel RLHF-mean attractors and prevent historical recursion of bad writing habits.
- Automatically tracks Confidence-Fidelity Divergence Index (CFDI) and re-generates text that diverges from the founder's voice.
**Stakeholder Perspective Analysis:**
- *End User (Founder/Expert):* Requires minimal but high-leverage input (voice memos, notes) and demands maximum voice fidelity.
- *Technical Architect:* Must manage complex state separation (Manifold α vs. β) and prevent Epistemic Amnesia without exceeding context limits.
- *Business/Product:* Delivers a production-ready, deterministic publishing pipeline that differentiates from generic AI writing tools.
**Requirement Decomposition:**
1. Develop the Epistemic Matrix initialization process, including Voice Calibration and Thesis Spine fabrication.
2. Implement the Petzold Sequence workflow (THINK → WRITE → REVIEW) with strict zero-overlap passes.
3. Integrate the Autonymic Bypass Protocol and Symbolic Scar tracking.

## Feature 8: Client-Side Execution Pipeline (CxEP) for RAG & Citation Validation
**Epic Breakdown:** To support the deterministic requirements of the LEXIS SOVEREIGN agent (Feature 7) and prevent hallucination (Semantic Saponification), the editor requires a Retrieval-Augmented Generation (RAG) capability. However, to maintain our stateless, client-heavy architecture, we must eschew traditional server-side vector databases (like Firestore). The CxEP introduces a Web Worker-based local vector store and citation engine, ensuring all AI generations are grounded in local knowledge and strictly cited without blocking the main UI thread.
**User Story:** As an expert author, I want the AI co-author to automatically reference and cite my massive folder of background research notes when generating text, so I can trust that its output is factually grounded in my own material rather than generic training data.
**Acceptance Criteria:**
- Documents can be ingested and chunked locally into a browser-based Vector Store (IndexedDB backed).
- The Gemini generation pipeline automatically retrieves relevant chunks and performs an LLM-based re-ranking before synthesis.
- Generated output includes explicit citation mapping; unmapped claims trigger a validation warning or "Tension" styling (Feature 5).
- All vector operations and API calls are isolated in a Web Worker to prevent UI freezing during the SPUG merge process.
**Stakeholder Perspective Analysis:**
- *End User (Founder/Expert):* Gains immense trust in the system; it acts as a true research assistant rather than just a text generator.
- *Technical Architect:* Must manage complex asynchronous message passing between the main thread (React/SPUG) and the Web Worker, while optimizing the memory footprint of local embedding models.
- *Business/Product:* Eliminates the infrastructure costs and privacy concerns associated with hosting a central vector database, creating a strong unique selling proposition (USP).
**Requirement Decomposition:**
1. Implement a dedicated RAG Web Worker to handle document parsing, chunking, and local embedding generation.
2. Integrate a local vector search mechanism (e.g., HNSW graph in IndexedDB).
3. Update the `services/gemini.ts` pipeline to include a re-ranking middleware step and enforce the citation mapping output schema.
