/**
 * dsh-skill-mcp-panel —— MCP 行运行时状态读取（loader entry + 工具计数）。
 */
const FIBER_PHASE = {
    0: "pending",
    1: "loading",
    2: "active",
    3: "failed",
    4: null,
    5: "unloading"
};
export function fiberPhaseOf(state) {
    if (typeof state !== "number")
        return null;
    const phase = FIBER_PHASE[state];
    return phase === undefined ? null : phase;
}
/**
 * cordis-plugin-loader 的嵌套 entry 会把父级前缀拼进 `entry.id`
 * （`EntryTree.sep`，取自 loader 的 `config/tree.ts`，实际字符为 ":"）。
 * 面板写入的是 `patch.yml` 里的裸行 id，因此运行时读回的 id 可能是
 * `父id:panel-mcp-<name>`；这里同时接受裸 id 与带父级前缀的后缀匹配。
 */
const ENTRY_ID_SEP = ":";
/** entry 行 id 是否指向 `id`（裸 id 或嵌套子树的 `父id + sep + id`）。 */
export function matchesLoaderEntryId(entryId, id) {
    if (typeof entryId !== "string")
        return false;
    return entryId === id || entryId.endsWith(ENTRY_ID_SEP + id);
}
export function getLoaderEntry(ctx, id) {
    const loader = ctx.loader;
    if (loader === undefined || typeof loader.entries !== "function")
        return undefined;
    for (const entry of loader.entries()) {
        if (matchesLoaderEntryId(entry.id, id))
            return entry;
    }
    return undefined;
}
export function mcpToolCount(ctx, serverName) {
    const tools = ctx.tools;
    if (tools === undefined || typeof tools.schemas !== "function")
        return 0;
    const prefix = `mcp__${serverName}__`;
    const schemas = tools.schemas();
    return Array.isArray(schemas) ? schemas.filter((schema) => typeof schema?.name === "string" && schema.name.startsWith(prefix)).length : 0;
}
const delay = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
/**
 * 写入 patch 后轮询 loader，直到 entry 满足 predicate 或超时。
 * 默认 3s；每 200ms 查一次。
 */
export async function waitForLoaderState(ctx, id, predicate, timeoutMs = 3000) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
        const entry = getLoaderEntry(ctx, id);
        if (entry !== undefined && predicate(entry))
            return true;
        if (entry === undefined && predicate(undefined))
            return true;
        await delay(200);
    }
    return false;
}
