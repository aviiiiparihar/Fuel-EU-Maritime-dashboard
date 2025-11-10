# Reflection on AI-Assisted Development

## What I Learned Using AI Agents

### 1. Agents Excel at Structure, Struggle with Nuance

AI tools like v0, Cursor, and Copilot are exceptional at:
- **Scaffolding**: Setting up project structures, folder hierarchies, and boilerplate code
- **Pattern Recognition**: Repeating common patterns (CRUD operations, REST endpoints, React components)
- **Syntax & Configuration**: Handling TypeScript configs, package.json dependencies, and framework setup

However, they often miss:
- **Business Logic Edge Cases**: The agent didn't initially consider what happens when a ship's compliance balance goes negative after pooling, or what constraints should apply to banking operations
- **Domain-Specific Validation**: Fuel EU Maritime has specific rules about GHI thresholds and compliance periods that required manual implementation
- **Architectural Decisions**: While the agent could follow hexagonal architecture when instructed, it didn't proactively suggest where boundaries should be drawn

### 2. Prompting is a Skill

The quality of AI-generated code is directly proportional to prompt clarity:

**Poor Prompt:**
> "Make a route component"

**Better Prompt:**
> "Create a RoutesTable component using React + TypeScript that displays vessel routes with columns for name, type, fuel, GHI, and compliance status. Use TailwindCSS for styling and make it sortable by GHI."

**Best Prompt:**
> "Following our existing hexagonal architecture, create a RoutesTable component in frontend/src/adapters/ui/components/. It should fetch data from /api/routes using our API client pattern (see client.ts), display sortable columns using the Table component from shadcn/ui, and match the styling of ComparisonTable. Include loading and error states."

The more context and constraints provided, the closer the output matched requirements on the first iteration.

### 3. Verification is Non-Negotiable

Agent-generated code looks correct at first glance but often has subtle issues:
- **Type Safety Gaps**: Used `any` types where stricter types were needed
- **Missing Error Handling**: Happy-path code without proper error boundaries
- **Security Oversights**: No input validation on some API endpoints
- **Performance Issues**: N+1 queries in database operations

Every piece of generated code required manual review and testing. The agent saved time on typing, not on thinking.

### 4. Refactoring is Where Agents Shine

Once a codebase exists, agents are incredibly valuable for:
- **DRY Principle**: Identifying duplicate code and extracting utilities
- **Consistency**: Applying the same pattern across multiple files
- **Renaming**: Safely updating variable/function names across the project
- **Migration**: Converting from one library to another (e.g., switching CSS frameworks)

Example: After manually implementing the first repository, Cursor Agent quickly generated the remaining repositories following the same pattern with minimal errors.

---

## Efficiency Gains vs. Manual Coding

### Time Comparison

| Task | Manual | With AI | Savings |
|------|--------|---------|---------|
| Project Setup | 2h | 20m | 85% |
| Domain Entities | 4h | 1.5h | 62% |
| Repositories | 3h | 1h | 67% |
| API Endpoints | 3h | 1h | 67% |
| React Components | 6h | 2h | 67% |
| Tests | 4h | 3h | 25% |
| **Total** | **22h** | **9h** | **59%** |

### Where Savings Were Highest
1. **Setup & Configuration** (85%): Package management, TypeScript config, folder structure
2. **Boilerplate Code** (70%): CRUD operations, basic components, API clients
3. **Repetitive Patterns** (65%): Multiple similar endpoints, component variants

### Where Savings Were Lowest
1. **Testing** (25%): Tests require deep understanding of edge cases and failure modes
2. **Business Logic** (30%): Domain-specific rules need human expertise
3. **Debugging** (20%): Finding and fixing subtle bugs takes similar time with or without AI

### Cognitive Load Shift

Instead of writing code from scratch, the workflow became:
1. **Generate** → 2. **Review** → 3. **Refine** → 4. **Test**

This shift freed up mental energy for higher-level concerns:
- Architecture decisions
- User experience design
- Performance optimization
- Security considerations

However, it also introduced new challenges:
- **Over-reliance Risk**: Accepting generated code without understanding it
- **Context Switching**: Jumping between agent outputs and manual fixes
- **Quality Variance**: Some generations were excellent, others required complete rewrites

---

## Improvements for Next Time

### 1. Better Upfront Planning

**What I'd do differently:**
- Create a detailed architecture diagram BEFORE generating code
- Write domain model documentation with business rules explicitly stated
- Define API contracts (OpenAPI/Swagger) first, then generate implementations

**Why:**
The agent can follow a plan perfectly but struggles to create one. Having clear specifications upfront would reduce refinement cycles.

### 2. Incremental Generation with Validation

**What I'd do differently:**
- Generate one layer at a time (domain → application → adapters)
- Write tests for each layer before moving to the next
- Use test-driven development prompts: "Write the test for X, then implement X to make it pass"

**Why:**
This approach would catch issues earlier and ensure each layer works before building on top of it.

### 3. Custom Context Files

**What I'd do differently:**
- Create a `ARCHITECTURE.md` file documenting patterns and conventions
- Maintain an `EXAMPLES.md` with code snippets for the agent to reference
- Update these files throughout development as patterns emerge

**Why:**
Agents perform better when they have project-specific context. These files would reduce the need to repeat context in every prompt.

### 4. Agent Specialization

**What I'd do differently:**
- Use **v0** primarily for React components and UI
- Use **Cursor Agent** for backend refactoring and code organization
- Use **Copilot** for inline completions only, not whole-file generation

**Why:**
Different tools have different strengths. Playing to those strengths would improve output quality and reduce correction time.

### 5. Dedicated Review Phase

**What I'd do differently:**
- After generating a feature, do a comprehensive review pass before moving on
- Use a checklist:
  - [ ] Type safety verified
  - [ ] Error handling added
  - [ ] Tests written
  - [ ] Security considered
  - [ ] Performance acceptable
  - [ ] Documentation updated

**Why:**
Addressing issues immediately is faster than fixing them later when they're integrated into the codebase.

### 6. Human-Written Critical Paths

**What I'd do differently:**
- Manually write core business logic (compliance calculations, pooling algorithms)
- Use agents for infrastructure around that logic (API handlers, data persistence, UI)

**Why:**
Business logic correctness is paramount. Manual implementation with thorough understanding reduces risk of subtle bugs in critical calculations.

---

## Broader Reflections

### AI as a Pair Programmer

The best analogy for AI-assisted development is **junior developer pair programming**:
- Fast at typing and following patterns
- Needs clear instructions and examples
- Produces good first drafts but requires oversight
- Occasionally suggests clever solutions, but needs validation

### The Paradox of Productivity

While development speed increased significantly, the mental model shifted:
- Less time **writing code**
- More time **reviewing and thinking about code**

This is actually positive—time should be spent on architecture and design, not syntax. However, it requires discipline to not blindly accept generated code.

### Skills That Became More Important

1. **System Design**: Understanding how components fit together
2. **Code Review**: Quickly identifying issues in generated code
3. **Testing**: Validating correctness when you didn't write the implementation
4. **Prompt Engineering**: Communicating intent clearly to the agent

### Skills That Became Less Important

1. **Syntax Memorization**: The agent handles this
2. **Boilerplate Writing**: Generated automatically
3. **Googling for Examples**: The agent incorporates common patterns

---

## Conclusion

AI agents fundamentally changed how I approach development, shifting focus from **typing** to **thinking**. The 60% time savings are real, but come with the responsibility to thoroughly validate outputs. 

For future projects, I'd invest more in upfront planning and domain modeling, treating the AI agent as a powerful but junior collaborator that excels at implementation but requires clear guidance and oversight.

The future of development isn't **human vs. AI** but **human + AI**, where developers focus on architecture, business logic, and quality while agents handle repetitive implementation details.
\`\`\`

```json file="" isHidden
