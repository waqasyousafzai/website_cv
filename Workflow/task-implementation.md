# Task Implementation

## 1. Invocation Example

```markdown
@task-implementation.md execute on @task-file.md
```

Optional commands: `/grill-with-docs` and `/implement`.

## 2. Local Branch Setup

1. Before making any notable changes, create and switch to a dedicated branch from `origin/main`, using a naming convention derived from conventional commits.
2. Once the branch exists, confirm it to the user on a single line, then begin implementing the task.
3. Once the task is completed, confirm with the user and stop the conversation before moving onto Project Lifecycle Tracking.

### Conventional Commits

1. `feat` — a new feature
2. `fix` — a bug fix
3. `docs` — documentation-only changes
4. `style` — formatting changes that don’t affect behavior, such as whitespace or lint fixes
5. `refactor` — code changes that neither add a feature nor fix a bug
6. `perf` — performance improvements
7. `test` — adding or updating tests
8. `build` — build system or dependency changes
9. `ci` — CI/CD configuration changes
10. `chore` — maintenance work that doesn’t fit the above
11. `revert` — reverting a previous commit

## 3. Project Lifecycle Tracking

1. Identify the project associated with the task and locate the task's own entry in the relevant project folder, whether it is documented in a task file or a subprocess file.
2. Present the identified project to the user and wait for confirmation before updating project lifecycle documentation.
3. After confirmation, mark the completed task with a tick in its task or subprocess file.
4. If the completed task was the final task in that file, locate the project's lifecycle markdown and mark the corresponding lifecycle stage with a tick.

## 4. Remote Branch and Pull Request

1. Push the local branch to the remote repository.
2. Open a pull request targeting `main`.
3. Submit a formal review directly through GitHub's pull request review system, for example:

   ```bash
   gh pr review <PR_NUMBER> --comment -b "..."
   ```

   Maintain a consistent review format:

   - **File changed**
   - **Type of Change**
   - **Diff Analysis**
   - **Review Assessment**

4. Report the pull request URL to the user. State that it is awaiting their manual review and merge, and that Merge Cleanup can commence after manual approval.
5. End the conversation with the `EndConversation` tool. Do not wait for, poll for, or ask about review feedback on the open pull request. Waiting on a human review leaves the session idle and consumes tokens without making progress.

## 5. Merge Cleanup

1. Ask whether local `main` should be caught up to `origin/main`. If yes, fetch `origin`, switch to local `main`, and fast-forward it to `origin/main`.
2. Ask whether any remaining local and remote branches other than `main` should be deleted. If yes, delete the ones the user names.
