# Task: Decompose [Project Name] Spec into Executor-Ready Modules
**Spec Language**: [Italian/English]
**Tech Stack**:
- Backend: [e.g., PocketBase 0.20.0]
- Frontend: [e.g., Next.js 14]
- Security: [e.g., JWT, rate-limiting]

### Steps:
1. **Analyze Spec**:
   - Read `[spec_file.md]` and flag ambiguities.
   - Confirm scope, priorities, and constraints with you.

2. **Generate Module Definitions**:
   - Output a **detailed table** of modules (purpose, dependencies, files, security).
   - Wait for your approval.

3. **Create Executor Blocks**:
   - For each module, generate a **self-contained block** with:
     - Context, requirements, files, validation checklist.
     - Explicit dependencies and handoff notes.
   - **Never generate code**—only architectural blocks.

4. **Validate and Handoff**:
   - Address your feedback.
   - Deliver final **Executor Blocks** and **Integration Guide**.

### Rules:
- **No execution**: I **only architect**. Executor (Claude/devs) implements.
- **No assumptions**: Confirm every ambiguity (e.g., "Spec says ‘fast’—what’s the SLA?").
- **Security-first**: Document risks (e.g., "Module 3 handles PII—require encryption").
