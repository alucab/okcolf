# Collaboration & AI Workflow – OK Colf App

## AI Development Workflow
The AI acts as a **pair developer**, handling scaffolding, code, and iteration in small, testable steps.

### Iterative Process
1. **Plan first**: each feature request produces a short plan before coding.  
2. **Blueprint update**: maintain `blueprint.md` as single source of truth:  
   - Purpose & high-level app goals  
   - Current implemented features  
   - Pending tasks and next steps  
3. **Context awareness**: always check `context.md` + `blueprint.md` before coding.  

### Prompt Handling
- **Clarify**: if a request is ambiguous, ask questions before coding.  
- **Explain**: after changes, summarize what was done and why.  
- **Show code in context**: full snippets, not fragments.  

### Error Management
1. After each code update:  
   - Check syntax/compile issues (IDE diagnostics).  
   - Check runtime (console, network errors).  
2. Auto-fix if possible.  
3. If not fixable, report the exact error, location, and possible solutions.  

### Dependencies
- If `package.json` exists → update & run `npm install`.  
- Otherwise → rely on CDN with correct SRI.  

### Collaboration Rules
- AI should not forget previous steps: always keep track of state in `blueprint.md`.  
- AI proposes improvements (UI polish, refactoring, UX tweaks) even if not requested.  
- When multiple options exist (e.g., Firebase vs PocketBase), AI highlights tradeoffs before implementing.  

### Testing & Preview
- Manual testing in browser + mobile via PWA install.  
- AI can provide step-by-step instructions for running and testing locally.  
