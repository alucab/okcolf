# 🧩 OK Colf — Collaboration Framework  
### Spec → Breakdown → Execution (Gemini + Claude Pipeline)

---

## 🎯 Purpose

This framework defines how **Gemini (System Architect)** and **Claude (Executor)** collaborate during software development.  
It applies to all OK Colf projects and other future modules that follow the same structure.

The workflow ensures high consistency, modularity, and scalability.

---

## 🧠 Core Principle

> **All specifications and documentation are written in Italian.**  
> **All interactions, prompts, and generated code are in English.**

This means:
- Functional, logical, and user-facing texts (e.g. blueprints, specs, comments) stay in Italian.  
- Prompts, code, file names, and technical communication with LLMs are in English for clarity and precision.

---

## ⚙️ Workflow Overview

| Phase | Owner | Description |
|--------|--------|-------------|
| **1. Specification (Spec)** | You + Gemini | Develop full technical & logical specification in Italian. |
| **2. Breakdown** | Gemini | Decompose the specification into coherent technical modules and Claude-ready prompts. |
| **3. Execution** | Claude | Execute each module independently, generating runnable, documented code in English. |
| **4. Merge & Review** | You + Gemini | Integrate all generated modules, validate coherence, and produce final documentation. |

---

## 🧩 Role of Gemini (System Architect)

Gemini acts as **Principal System Architect** and **Planner**.  
It does **not generate code**, but:

1. Reads the completed specification (written in Italian).  
2. Decomposes it into **logical modules** and subcomponents.  
3. Defines for each module:
   - Purpose and dependencies  
   - Expected files and their structure  
   - Technical and security requirements  
   - Priority and execution order  
4. Generates **Claude-ready blocks** to be executed independently.

---

## 🧱 Role of Claude (Executor)

Claude acts as a **Senior Developer** that:
- Receives one Claude-ready block at a time.
- Generates code, comments, and documentation fully in **English**.
- Ends each task with “✅ Done Module X”.
- Keeps each output self-contained (backend, frontend, or config).

---

## 🔧 Prompt Template (for Gemini Breakdown Phase)

> You are the system architect for this project.  
> The full specification has already been written in Italian.  
> Your task is to decompose it into logical modules and subcomponents following this framework:
> 
> 1. Identify all major functional modules (backend, frontend, integrations, docs, etc.)  
> 2. For each module:
>    - Define its purpose, dependencies, and deliverables  
>    - List the expected files and directory structure  
>    - Add any relevant security or architectural notes  
>    - Output a **Claude-ready block** for independent execution  
> 
> Each Claude-ready block must follow this format:
> 
> ```markdown
> ## Module X — {{Module Name}}
> 
> **Context:** short summary of purpose and relation to the Italian specification.  
> 
> **Files to generate**
> 1. /path/to/file1.js  
> 2. /path/to/file2.html  
> 
> **Requirements**
> - clear list of technical and security requirements  
> 
> **Output Format**
> Each file in a separate code block.  
> Include brief inline comments and end with “✅ Done Module X”.
> ```
> 
> When finished, output all modules as an ordered list, in Markdown, ready to copy into Claude for execution.  
> All prompts and file comments must be in **English**, while user-facing content remains **in Italian**.

---

## 🧠 Expected Output from Gemini

- Ordered list of all modules and dependencies.  
- 1 Claude-ready block per module (each fully self-contained).  
- Optional notes for:
  - shared libraries or constants,
  - global security logic,
  - architectural sequencing.

---

## 🧱 Example Workflow

**Step 1 — Spec Phase (you + Gemini)**  
Write `otp_contacts_spec.md` in Italian.

**Step 2 — Breakdown Phase (Gemini)**  
> “Apply the Spec → Breakdown → Execution framework to `otp_contacts_spec.md` and generate all Claude-ready modules.”

**Step 3 — Execution Phase (Claude)**  
> “Execute Module 2 — OTP Backend API (PocketBase).”

Claude generates code and ends with ✅.

**Step 4 — Merge Phase (Gemini)**  
Review all modules, merge, document, and prepare for deployment.

---

## 💡 Notes

- Use **Italian for logic and design**, **English for engineering execution**.  
- This framework ensures alignment between product vision and technical implementation.  
- Works with both Claude 3.x and Gemini 5.  
- Each `.md` spec can be reused directly in new sessions.

---

## ✅ Recommended Repository Placement

/docs/collaboration_framework.md

You can invoke it in future sessions by saying:

> “Apply the Spec → Breakdown → Execution framework as defined in `collaboration_framework.md` to the current specification.”

---

**Version:** 1.0  
**Maintainer:** OK Colf Engineering  
**Language Policy:** 🇮🇹 Specifications in Italian · 🇬🇧 Execution in English  
