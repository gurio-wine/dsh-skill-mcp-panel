#!/usr/bin/env node
/**
 * dsh-skill-mcp-panel —— 测试入口。
 *
 * 依序运行根目录下全部 test-*.mjs，每个文件用独立子进程执行（stdio 直通，
 * 输出实时可见），以退出码判定成败；任一文件失败，本进程退出码为 1。
 *
 *   npm test
 */
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(root)
  .filter((name) => /^test-.*\.mjs$/.test(name))
  .sort();

if (files.length === 0) {
  console.error("未找到 test-*.mjs");
  process.exit(1);
}

const results = [];
for (const file of files) {
  console.log("\n=== " + file + " ===");
  const started = Date.now();
  const result = spawnSync(process.execPath, [join(root, file)], { stdio: "inherit" });
  results.push({ file, ms: Date.now() - started, ok: result.status === 0, status: result.status, signal: result.signal });
}

const failed = results.filter((item) => !item.ok);
console.log("\n=== 测试汇总 ===");
for (const item of results) {
  const detail = item.ok ? "" : item.signal !== null ? "  (signal " + item.signal + ")" : "  (exit " + item.status + ")";
  console.log((item.ok ? "PASS  " : "FAIL  ") + item.file + "  (" + item.ms + " ms)" + detail);
}
console.log("\n" + (results.length - failed.length) + "/" + results.length + " 个测试文件通过");

if (failed.length > 0) {
  console.error("失败：" + failed.map((item) => item.file).join(", "));
  process.exit(1);
}
console.log("ALL TEST FILES PASSED");
