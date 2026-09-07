/**
 * Run-state vocabulary. Shared by Badge, PipelineNode, NodeCallout and
 * RunStatusBar so a stage, its pill and the status strip cannot disagree.
 */
export type Status = "idle" | "running" | "ok" | "warn" | "fail";

/** Alias kept for the pipeline components, which name the same union NodeStatus. */
export type NodeStatus = Status;

/** Log severities. Same vocabulary as Status minus "idle", plus "info". */
export type Level = "info" | "ok" | "warn" | "fail";

/** Statuses a Toast or a ticker value can carry — there is no idle notification. */
export type SignalStatus = "ok" | "running" | "warn" | "fail";
