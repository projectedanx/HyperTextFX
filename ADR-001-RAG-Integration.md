# ADR-001: Integration of Retrieval-Augmented Generation (RAG) & Citation Engine via Client-Side Execution Pipeline (CxEP)

**Status:** Proposed
**Date:** 2026-04-27
**Author:** Zora (The System Architect)
**Context Link:** `AGENTS-NextJS-Frontend.md` (Reference Artifact)

## 1. Context

We have received an architectural specification (`AGENTS-NextJS-Frontend.md`) detailing a server-side Next.js agent designed for Retrieval-Augmented Generation (RAG), utilizing Firestore as a vector database, LLM-based re-ranking, and strict citation validation.

Our current architecture is a purely client-side React application built with Vite, utilizing the `@google/genai` SDK for direct-to-API streaming. The application heavily relies on experimental, non-linear text management paradigms (e.g., the Symbiotic Paraconsistent Undo Graph - SPUG, and Dialectical Synthesis).

Direct implementation of the Next.js/Firestore code is impossible without violating our stateless, client-heavy deployment topology. However, the *epistemic intent* of the agent—grounding AI generations in verifiable context and mapping claims to source citations—is highly desirable to prevent "Semantic Saponification" and hallucination within the Editor.

We must construct an Isomorphic Bridge to adapt the RAG and Citation workflows into our Vite environment without creating monolithic bottlenecks or degrading the real-time editing experience.

## 2. Decision

We will implement the RAG and Citation capabilities entirely within the Client-Side Execution Pipeline (CxEP), utilizing Web Workers for intensive tasks and replacing server-side infrastructure with local browser equivalents. We will maintain strict Manifold Isolation, separating the retrieval/validation processes from the primary UI thread and the synchronous text editor state.

### C4 Model Decomposition

#### Level 1: System Context
The **HyperTextFX Editor** acts as the primary system. It interacts with the **User** (providing queries/edits), the **Gemini API** (providing LLM synthesis and re-ranking capabilities), and a new logical boundary: the **Local Knowledge Corpus** (user-provided documents acting as the ground truth).

#### Level 2: Container
Instead of a Next.js Server environment and Firestore, we will introduce two new client-side containers:
1.  **Vite App (Main Thread):** Manages the React UI, the SPUG state graph, and user interactions.
2.  **RAG Web Worker (Background Thread):** A dedicated Web Worker responsible for running embedding models (e.g., via `transformers.js` or similar lightweight ONNX runtimes), managing a local Vector Store (IndexedDB), and orchestrating the multi-step retrieval/validation pipeline.

#### Level 3: Component (RAG Web Worker Internals)
Within the RAG Web Worker, the following components map to the original Next.js agent's tools:
1.  **Local Vector Engine (Component):** Replaces `retrieve_documents` (Firestore). Uses an in-memory or IndexedDB-backed HNSW graph to perform cosine similarity searches on chunked user documents.
2.  **Re-ranking Middleware (Component):** Replaces `rerank_results`. Dispatches a secondary, low-latency call to the Gemini API (`gemini-1.5-flash` or similar) to score retrieved chunks against the query.
3.  **Synthesis & Citation Engine (Component):** Replaces `generate_citations`. Takes the re-ranked chunks and the user query, prompts the primary Gemini model to synthesize an answer, and strictly maps the output phrases to the source chunk IDs.
4.  **Validation Gate (Component):** Inspects the final payload. If `unmapped_claims` exist (hallucinations), it triggers an internal retry loop or flags the specific text segments for "Pluriversal Syntax Highlighting" (Tension styling) in the UI.

## 3. Consequences

### Positive
*   **Zero Infrastructure Cost:** By moving vector storage and retrieval to the client, we eliminate the need for an expensive Firestore or dedicated vector DB instance.
*   **Privacy:** User documents processed for RAG never leave the local browser unless explicitly sent as context to the Gemini API, aligning with privacy-first principles.
*   **Architectural Consistency:** We preserve the Vite/React topology and avoid introducing a Node.js backend monolith.

### Negative / Risks
*   **Client Compute Overhead:** Running embedding models and vector searches in the browser (even in a Web Worker) will consume significant CPU/RAM, potentially degrading battery life on lower-end devices.
*   **Cold Start Latency:** Initializing the Web Worker and loading the embedding model (e.g., 20-50MB ONNX file) will introduce a noticeable delay on first load.
*   **State Synchronization:** Managing the synchronization between the Web Worker's vector indices and the main thread's SPUG text state requires complex asynchronous message passing.

## 4. Compliance & Traceability
This ADR satisfies the structural preservation requirement (β0 > 0.95) defined in the Cognitive Contract by ensuring the new capabilities do not shatter the existing client-side autonomy, while adapting the topological novelty (β1) of the provided AGENTS.md specification.
