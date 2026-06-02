# Architecture Topology Map

Generated via Mycelial CI Trace (DRP_7_PATTERN_MODEL).
Betti-1 Cycle Status: CLEAN
Dependency Graph Depth: 4

```mermaid
graph TD
subgraph ENV["Environment Layer"]
    E1[GEMINI_API_KEY]
    E2[SILENT_REQUIRED_ENV: API_KEY<br/>⚠️ Injected via vite.config.ts]
end

subgraph APP["Application Layer (src/)"]
    A1[Entry Point<br/>index.tsx]
    A2[Core Domain<br/>App.tsx]
    A3[DSP Modals<br/>components/DSPModal.tsx]
    A4[Hooks<br/>hooks/useHistory.ts]
    A5[AI Services<br/>services/gemini.ts]
end

subgraph CI["CI/CD Layer (.github/workflows/)"]
    C1[codeql.yml<br/>on: push, pull_request, schedule]
    C2[⚠️ GOLDEN_SCAR: NOTE section preserved]
end

subgraph TEST["Test Layer"]
    T1["PHANTOM: No test coverage<br/>⚠️ 0% coverage detected"]
end

E1 --> E2
E2 -->|configures| APP
A1 --> A2
A2 --> A3 & A4 & A5
CI --> C1 & C2

classDef warning fill:#fef3c7,stroke:#d97706,color:#000
classDef golden fill:#fde68a,stroke:#b45309,color:#000
classDef phantom fill:#fee2e2,stroke:#dc2626,color:#000
classDef clean fill:#d1fae5,stroke:#059669,color:#000

class E2,T1 warning
class C2 golden
```

# CI/CD Pipeline Cartograph

AST-to-YAML Reverse Trace complete. Temporal Flow: Left → Right = Commit → Production.

```mermaid
sequenceDiagram
autonumber
actor Dev as Developer
participant GH as GitHub
participant CQL as codeql.yml

Dev->>GH: git push (main branch)
GH->>CQL: trigger on:push

rect rgb(254, 243, 199)
    Note over CQL: Phase 1 — Security Validation
    CQL->>CQL: actions/checkout@v4
    CQL->>CQL: github/codeql-action/init@v4
    CQL->>CQL: github/codeql-action/analyze@v4
    CQL-->>GH: Status: PASS/FAIL
end

Note over CQL: ⚠️ MISSING LINK: No deployment workflow exists.<br/>Only security analysis is currently performed.
```
