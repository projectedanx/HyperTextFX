# Dependency Matrix & Entropy Audit

Thermodynamic Lens (L3) applied. Entropy Score: 0 = deterministic, 1 = fully chaotic.

## Build Reproducibility Index

| Dependency | Version Pin | Production? | CI Invoked? | Entropy Vector |
| :--- | :--- | :--- | :--- | :--- |
| `react` | `^19.2.1` | ✅ Yes | ❌ No | ⚠️ MEDIUM — range allows drift |
| `react-dom` | `^19.2.1` | ✅ Yes | ❌ No | ⚠️ MEDIUM — range allows drift |
| `lucide-react` | `^0.556.0` | ✅ Yes | ❌ No | ⚠️ MEDIUM — range allows drift |
| `@google/genai` | `^1.31.0` | ✅ Yes | ❌ No | ⚠️ MEDIUM — range allows drift |
| `typescript` | `~5.8.2` | ❌ Dev only | ❌ No | ⚠️ MEDIUM — tilde range allows minor drift |
| `vite` | `^6.2.0` | ❌ Dev only | ❌ No | ⚠️ MEDIUM — range allows drift |

## Entropy Score by Layer

| Layer | Score | Primary Source |
| :--- | :--- | :--- |
| Environment | 0.30 | Missing `.env.example`, implicit `process.env.API_KEY` mapping |
| Application Dependencies | 0.50 | 100% of dependencies use semver ranges |
| CI Pipeline | 0.10 | Only CodeQL present, no deployment complexity |
| Infrastructure (IaC) | 0.00 | None present |
| Test Coverage | 1.00 | 0% test coverage |
| **Overall Repository Entropy** | **0.38** | Target: < 0.15 |
