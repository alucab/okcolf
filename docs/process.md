# Collaboration & AI Workflow – OK Colf App (Express)

AI acts as a **pair developer**, handling scaffolding, coding, and iterative improvements in small, testable steps.

---

## Iterative Development
1. **Plan first** – Each feature request generates a short plan before coding.  
2. **Blueprint update** – Keep `blueprint.md` and `usecases.md` as the single source of truth:  
   - Purpose & high-level goals  
   - Current features  
   - Pending tasks & next steps  
3. **Context awareness** – Reference `context.md` + `usecases.md` before coding.  

---

## Prompt Handling
- **Clarify** ambiguous requests before coding.  
- **Explain** changes and rationale after implementation.  
- **Show code in context** – provide full snippets, not fragments.  

---

## Error Management
1. Check syntax and runtime after each code update.  
2. Auto-fix if possible; otherwise, report exact error, location, and solutions.  

---

## Dependency Management
- If `package.json` exists → update & run `npm install`.  
- use CDN with SRI for libraries (OnsenUI, Alpine.js, jQuery, Firebase/PocketBase).  

---

## Collaboration Rules
- Maintain previous steps in `blueprint.md` for continuity.  
- Propose improvements (UI, UX, refactoring) even if not explicitly requested.  
- When multiple backend options exist (Firebase vs PocketBase), highlight tradeoffs before implementing.  

---

## Testing & Preview
- Manual testing in browser + mobile via PWA install.  
- Provide step-by-step instructions for running and testing locally.
