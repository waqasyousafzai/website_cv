# Project Lifecycle

## 1. Invocation Example

```markdown
@project-lifecycle-creation.md execute 
```

## 2. Initial Prompts

Prompt the user for these two values separately. Do not infer one from the other.

1. Prompt for `project_name`:
   > What should this project be called?

2. Prompt for `project_brief`:
   > What are you creating, and what should the lifecycle cover?

3. Use `project_name` only for the lifecycle title and output folder name. Use `project_brief` to understand the project and shape its lifecycle stages.

4. Represent the lifecycle as a simple, linear, text process diagram.

5. Show the generated diagram to the user for confirmation.

6. Do not save the file until the user confirms the diagram.

## 3. Saving the File

1. After confirmation, add a concise, project-specific purpose statement.
2. Make an exact numbered, vertical, tickable copy of the diagram containing only the main headers.
3. Save the result as:
   `project-docs/[project_name]/project-lifecycle.md`

   Sanitize `project_name` for the folder name using lowercase, hyphen-separated words. Never substitute `project_brief` for `project_name`.

### Formatting Example

```markdown
# Website Project Lifecycle

Purpose: Guide the build of a new website from initial discovery through launch and ongoing maintenance.

[ ] 1. Discovery
[ ] 2. Planning
[ ] 3. Design
[ ] 4. Content
[ ] 5. Development
[ ] 6. Testing
[ ] 7. Launch
[ ] 8. Maintenance
```
