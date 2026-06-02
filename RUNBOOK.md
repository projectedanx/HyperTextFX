# Operational Runbook

## Time-to-Deploy (TTD) Sequence
**Measured TTD**: N/A (No automated deployment pipeline exists).
**Target TTD**: < 3 minutes
**Bottleneck**: All deployments are presumed manual.

## To Deploy a Change to Production
1. Merge your PR to `main` (triggers `codeql.yml` — validation only).
2. [UNDOCUMENTED STEP] Perform manual deployment.

## Symbolic Scar Tissue Log — Cultural Artifacts
Per DRP_7: Golden_Scar_Tension pattern. These artifacts are PRESERVED, not standardized. Φ-weighting: 1.618 (native logic) vs 1.000 (standard).

**Golden Scar #001: Vite Env Injection**
*   **Location**: `vite.config.ts:L18`
*   **Tension**: Code expects `process.env.API_KEY`, but the user configures `GEMINI_API_KEY`. The Vite config manually maps this. Normalizing this to only use `import.meta.env` would break the `services/gemini.ts` structural assumption which might be shared with server-side executions or agent scripts.
*   **Recommendation**: Preserve the mapping, document the injection.

**Golden Scar #002: CodeQL Notes**
*   **Location**: `.github/workflows/codeql.yml`
*   **Tension**: L5 Paraconsistent State — large block of boilerplate comments regarding language support.
*   **Recommendation**: Preserve to retain explicit operational context for GitHub action runners.
