# Workflow

## Synopsis

This workflow simplifies the path from an arbitrary goal to an implementable task. It continuously narrows a broad objective into a defined project lifecycle, classifies each stage, refines the resulting work until it is clear and actionable, prepares a dedicated Git branch, and then implements the task.

## Workflow Order

Use the markdown files in the following order:

1. **[project-lifecycle-creation.md](project-lifecycle-creation.md)** — Establish the project by gathering its name and brief, designing a linear lifecycle, confirming it with the user, and saving a tickable lifecycle document under `project-docs/[project-name]/`.

2. **[task-defining.md](task-defining.md)** — Take a lifecycle stage and classify it as a task, subprocess, or subproject. Create the appropriate markdown file or nested project structure, and record the classification in the project lifecycle.

3. **[task-refining.md](task-refining.md)** — Challenge the defined task for clarity, completeness, scope, and actionability. Resolve ambiguities and edit the task directly until it is ready to execute.

4. **[task-initiation.md](task-initiation.md)** — Prepare for implementation by creating a dedicated branch from `origin/main` and naming it according to the applicable conventional commit type.

5. **[task-implementation.md](task-implementation.md)** — Implement the refined task. After implementation is complete, identify the associated project and task entry, confirm the project with the user, mark the completed task, and mark the lifecycle stage when that was the final task in its file. Then push the branch, open a pull request against `main`, and submit a formal pull request review.

Together, these files turn an open-ended goal into a structured, trackable, and implementable unit of work.
