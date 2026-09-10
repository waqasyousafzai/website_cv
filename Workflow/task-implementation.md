# Task Implementation

## 1. Invocation Example

```markdown
@task-implementation.md execute on @task-file.md
```

Optional commands: `/grill-with-docs` and `/implement`.

## 2. Project Lifecycle Tracking — After Task Completion

Begin this section after the task is complete, including any optionally invoked `/grill-with-docs` and `/implement` workflows.

1. Identify the project associated with the task and locate the task's own entry in the relevant project folder, whether it is documented in a task file or a subprocess file.
2. Present the identified project to the user and wait for confirmation before updating project lifecycle documentation.
3. After confirmation, mark the completed task with a tick in its task or subprocess file.
4. If the completed task was the final task in that file, locate the project's lifecycle markdown and mark the corresponding lifecycle stage with a tick.

## 3. Remote Branch and Pull Request

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

4. Ask the user if the branch's commits should be squashed before merging.
5. Present the review summary to the user in a Markdown file in the IDE and obtain explicit sign-off before executing the merge. Delete the Markdown file after the merge.
6. After the pull request is merged, fetch `origin/main`, switch to local `main`, and fast-forward it to `origin/main`.
7. Suggest to the user if the merged local and remote branches should be deleted.
