# VULCAN Implementation Plan & Checklist

## Objective
Implement the Orthogonal Tension Injection (OTI) and Epistemic Escrow Monitor (EEM) features, enforcing the Pluriversal Emergence Inversion strategy.

## Phase 1: State Topology (Manifold Isolation)
- [ ] Refactor `hooks/useHistory.ts` to strictly prevent sequential appending of `origin: ai` nodes onto `origin: user` nodes without explicit DSP invocation.
- [ ] Create an `EpistemicEscrow` buffer within the state management layer to house high-entropy (CFDI > 0.15) AI generations.
- [ ] Update `types.ts` to support `TensionNode` graph types.

## Phase 2: Agentic Routing (The OTI & EEM)
- [ ] Implement the EEM background validation loop in `services/gemini.ts`.
- [ ] Update the AI streaming logic to evaluate incoming chunks against the CFDI threshold.
- [ ] If CFDI > 0.15, reroute the stream output away from the primary Virtual DOM and into the Epistemic Escrow buffer.
- [ ] Implement the OTI prompt chain. Ensure the `+++EntropyAnchor` PDL decorator is used to force the LLM to retrieve Isomorphic Bridges from distant domains.

## Phase 3: Dialectical Synthesis UI (The DSP)
- [ ] Update `components/DSPModal.tsx` to handle the visualization of `TensionNode` structures.
- [ ] Implement the visual styling for "Tension" state (e.g., specific color markers or structural indicators).
- [ ] Ensure the "Merge" action inside the DSP creates a single, unified `origin: system` node in the SPUG, mathematically closing the topological loop.

## Phase 4: Validation (VULCAN Gates)
- [ ] **Mereological Gate:** Verify that no cross-domain state mutations occur between the Escrow buffer and the Main Graph.
- [ ] **Database/State Gate:** Ensure no "shared database" equivalent exists. The AI must publish "Domain Events" (Tension Nodes) that the UI consumes, rather than mutating the UI's state directly.
- [ ] **CFDI Escrow Gate:** Verify that setting a mock CFDI > 0.15 correctly triggers the Escrow circuit breaker and prevents UI contamination.
