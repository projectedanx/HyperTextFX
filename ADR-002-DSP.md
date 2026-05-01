# ADR 002: Implementation of the Dialectical Synthesis Plane (DSP)

## Status
Accepted

## Context
The Symbiotic Paraconsistent Undo Graph (SPUG) creates divergent branches of text state when user edits and AI generation occur concurrently. Traditional merge conflict resolution forces a binary choice (accept user OR accept AI) or tedious line-by-line manual reconciliation. This approach violates the pluriversal, non-linear goals of HyperTextFX. We need a method to synthesize these divergent branches by understanding their semantic intent rather than just their lexical diffs.

## Decision
We implemented the Dialectical Synthesis Plane (DSP), an AI-driven intent synthesis mechanism.

1. **DAG History Update:** We updated `types.ts` to allow `HistoryNode` objects to have multiple `parentIds`. The `useHistory.ts` hook was expanded to include `getDivergentBranches()` (which detects when a node has multiple children) and `mergeBranches()` (which takes multiple branch IDs and creates a new node that has those branches as parents).
2. **Semantic Synthesis:** We created `synthesizeBranches` in `services/gemini.ts`. Instead of a standard code diff, we prompt Gemini with the ancestor text and the text from both divergent branches, instructing it to analyze the intent behind each branch and merge their valuable additions into a single "Dialectical Merge".
3. **User Interface:** We built `DSPModal.tsx` to visualize the divergent branches side-by-side and provide a button to trigger the intent synthesis. The UI offers the synthesis result for review before applying it as a unified state in the SPUG.

## Consequences
**Positive:**
- Eliminates "merge conflict anxiety" for writers.
- Maintains the Pluriversal logic by treating contradictions as generative opportunities rather than fatal errors.
- Establishes a true Directed Acyclic Graph (DAG) for the history state.

**Negative/Risks:**
- Requires an additional LLM API call, increasing latency and cost during merges.
- The success of the merge relies entirely on Gemini's ability to accurately infer intent; hallucinated intents could result in lost edits.
- Memory usage for the history tree will grow more complex as branching and merging creates a tangled DAG instead of a simple tree. We will eventually need robust garbage collection or node pruning.

## Lessons Learned
- **Intent over Syntax:** We realized early on that asking an LLM to resolve a standard git-style `<<<<<<<` diff was ineffective for prose. By providing the ancestor and the full text of both branches, the LLM can perform semantic synthesis much more reliably.
- **Isomorphic Bridge:** The DSP serves as an isomorphic bridge between the asynchronous AI streaming capability and the deterministic local state graph, ensuring neither corrupts the other.
