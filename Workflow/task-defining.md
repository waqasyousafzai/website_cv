# Task Defining

## 1. Invocation Example

```markdown
@task-defining.md execute on 1. of @project-lifecycle.md
```

## 2. Initial Classification

Review **[Insert Process Here]** in the process diagram and determine whether it should be treated as a **task**, **subprocess**, or **subproject**.

Use these working definitions:

- **Task:** A bounded piece of work with a clear outcome that can be completed directly without needing its own internal workflow. A runbook may help prevent omissions.
- **Subprocess:** Related activities within the parent process that benefit from an explicit internal workflow while remaining managed as part of the parent.
- **Subproject:** A distinct deliverable that warrants its own scope, coordination, and lifecycle within the larger project.

## 3. Acceptance Criteria

For a **task** or **subprocess** classification (not a subproject), define draft acceptance criteria that describe how the work will be verified as complete.

Present the draft acceptance criteria to the user and wait for explicit confirmation. Do not create the task or subprocess markdown file until the user has confirmed the acceptance criteria.

Once confirmed, include the acceptance criteria in the markdown file under an `## Acceptance Criteria` heading, as shown in the templates below.

## 4. Execution Instructions

Create the appropriate markdown output using the rules below for the classification that has already been determined.

### Task

If the process is a **task**, create a markdown file in the same folder as the project's project lifecycle markdown file.

Use a clear, lowercase, hyphenated filename based on the process name, followed by `-task.md`. The file must contain:

```markdown
# [Process Name] - Task

[ ] [The single item of work that needs to be completed]

## Acceptance Criteria

- [First confirmed criterion]
- [Second confirmed criterion]
```

Keep the task file to a single checklist item unless a short runbook is required to prevent important omissions.

### Subprocess

If the process is a **subprocess**, create a markdown file in the same folder as the project's project lifecycle markdown file.

Use a clear, lowercase, hyphenated filename based on the process name, followed by `-subprocess.md`. The file must contain the process name as a heading, followed by a hyphen and its definition, and a numbered checklist of the subprocess activities:

```markdown
# [Process Name] - Subprocess

[ ] 1. [First subprocess activity]
[ ] 2. [Second subprocess activity]
[ ] 3. [Third subprocess activity]

## Acceptance Criteria

- [First confirmed criterion]
- [Second confirmed criterion]
```

The numbered checklist should contain only the main activities required to complete the subprocess.

### Subproject

If the process is a **subproject**, create a new folder inside the project folder. The folder name must be the name of the subproject.

Within that subproject folder, repeat the project lifecycle and task-defining workflow. Create the subproject's lifecycle markdown file and use it to identify and classify the subproject's tasks, subprocesses, and any further subprojects.

The resulting structure should follow this pattern:

```text
project-docs/
└── [project-name]/
    ├── project-lifecycle.md
    └── [subproject-name]/
        ├── project-lifecycle.md
        └── [task-or-subprocess-files].md
```

## Output Requirements

- Use the existing project folder and lifecycle file to determine where outputs belong.
- Use clear, lowercase, hyphenated filenames.
- Preserve the process name in the markdown heading.
- For a task or subprocess, confirm the acceptance criteria with the user before creating the file, and include them under an `## Acceptance Criteria` heading.
- Update `project-lifecycle.md` with the classification next to the relevant process step. For example: [ ] 1. Discovery — Subprocess
- Do not create a subproject folder for a task or subprocess.
- Do not create additional files unless the classification requires them.
