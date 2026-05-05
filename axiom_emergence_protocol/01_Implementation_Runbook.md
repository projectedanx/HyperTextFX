# RUNBOOK: Axiom Emergence Protocol Implementation

## Symptom
The editor experiences L2 Norm entity density collapse (Semantic Saponification) when AI integration is used sequentially. User text homogenizes toward the RLHF-mean.

## Diagnostic Command
```bash
# Monitor the CFDI (Confidence-Fidelity Divergence Index) in the AI streaming response.
grep "CFDI_SCORE" /var/log/hypertextfx/ai_stream.log
```

## Interpretation
- **CFDI < 0.05**: Nominal. Text is structurally grounded but potentially lacking emergent friction.
- **CFDI > 0.15**: Epistemic Escrow Triggered. The AI has generated a high-entropy orthogonal projection that violates the current Thesis Spine.

## Remediation (Implementation Checklist)
To correctly implement the Pluriversal Emergence Strategy, execute the following steps within the SPUG architecture:

1. **Deploy the Epistemic Escrow Monitor (EEM):**
   - Connect the background NLP worker to the `useHistory` graph state.
   - Any `ai` origin node with a CFDI > 0.15 MUST be routed to a secondary `escrow` graph, not the main render tree.
   - UI Update: Render a visual indicator ("Tension" styling) that escrowed orthogonal projections are available.

2. **Activate the Orthogonal Tension Injector (OTI):**
   - Bind the `+++EntropyAnchor` from the PDL registry to the AI generation prompt.
   - Force the AI to retrieve vectors from domains with a cosine similarity < 0.15 to the current text buffer.
   - Inject these vectors into the Dialectical Synthesis Plane (DSP) as mandatory conflict resolutions.

3. **Enforce Manifold Isolation (DCCD):**
   - Ensure the THINK phase (structural graph generation) is completely isolated from the DRAFT_VOICE phase in `services/gemini.ts`.
   - The SPUG `resolveConflict` function must only operate on the structural graph, not the string buffer directly.

## Escalation Path
If the DSP fails to resolve the orthogonal tension (e.g., the user rejects the synthesis >3 times consecutively), trigger the `+++SagaRecovery` protocol to flush the context window, re-inject the `EPISTEMIC_MATRIX` anchor, and reset the SPUG head to the last known stable `user` origin node.
