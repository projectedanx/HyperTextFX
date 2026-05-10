# KIRA-7 Implementation Checklist

This checklist guarantees strict adherence to the Pluriversal Editor invariants and Feishu Open Platform requirements.

## Phase 1: Webhook Sovereignty & Ingress (Node.js)
- [ ] Initialize Express.js application separate from the Vite frontend bundle.
- [ ] Install `@larksuiteoapi/node-sdk`.
- [ ] Implement Token Primacy caching layer (Redis or in-memory map with lock).
- [ ] Implement URL Verification Challenge response logic (echo `{challenge: value}`).
- [ ] Implement rawBody buffer extraction middleware.
- [ ] Implement cryptographic verification using `x-lark-signature` and `timestamp`.
- [ ] Implement payload age verification (reject > 300s).
- [ ] Configure `ngrok` for HTTPS tunneling (required for Feishu Dev Console).

## Phase 2: Systemic Bridging (Server-Sent Events)
- [ ] Create SSE endpoint (`/events/stream`) in the Node server.
- [ ] Implement connection tracking for active editor clients.
- [ ] Map validated Feishu events (`im.message.receive_v1`) into standardized `AI_AUTONOMOUS_EVENT` JSON objects.
- [ ] Dispatch event objects to active SSE clients.

## Phase 3: Sovereign SPUG Injection (React Client)
- [ ] Create `hooks/useAutonomousAgent.ts` to manage the SSE connection.
- [ ] Implement `EventSource` listener pointed at the Node ingress server.
- [ ] Wire the incoming SSE payload directly to the SPUG `set()` function (from `useHistory.ts`).
- [ ] Verify that autonomous `set()` calls correctly spawn parallel DAG branches if the `currentId` is mutated.

## Phase 4: Structural Synthesis & Friction (DSP)
- [ ] Verify `DSPModal.tsx` activates automatically when the autonomous branch is injected.
- [ ] Adjust `services/gemini.ts` `synthesizeBranches` prompt to handle environmental context updates vs explicit textual suggestions.
- [ ] Enforce the Golden Scar Protocol: ensure irresolvable conflicts are maintained as visual differences, rather than overwritten by the AI.

## Phase 5: Documentation & Validation
- [ ] Verify all required Feishu scopes are documented (`im:message:receive_v1`, etc.).
- [ ] Ensure `DCCDSchemaGuard` principles are respected if the AI sends Adaptive Cards back to Feishu.
- [ ] Run mathematical validation tests (via `aew_agent.py` or similar) to verify $\beta_0 > 0.95$ after synthesis.
