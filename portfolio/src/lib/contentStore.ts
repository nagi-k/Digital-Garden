import { defaultContent } from '../data/defaultContent';
import type { SiteContent } from '../types';

const STORAGE_KEY = 'portfolio-content-v1';
const ADMIN_KEY = 'portfolio-admin-auth';

/** 深合并：用存储中的值覆盖默认值，兼容后续新增字段 */
function merge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base)) return (override as T) ?? base;
  if (typeof base === 'object' && base !== null) {
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(override as Record<string, unknown>)) {
      if (key in result) {
        result[key] = merge(result[key], (override as Record<string, unknown>)[key]);
      }
    }
    return result as T;
  }
  return override as T;
}

export function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent;
    return merge(defaultContent, JSON.parse(raw));
  } catch {
    return defaultContent;
  }
}

export function saveContent(content: SiteContent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function resetContent() {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportContent(): string {
  return JSON.stringify(loadContent(), null, 2);
}

export function importContent(json: string): SiteContent {
  const parsed = JSON.parse(json);
  const merged = merge(defaultContent, parsed);
  saveContent(merged);
  return merged;
}

/* ---------- 管理后台口令（纯前端门禁，静态站点下用于防误改，非安全方案） ---------- */

export function getAdminPassword(): string {
  return localStorage.getItem(ADMIN_KEY) || 'admin123';
}

export function setAdminPassword(pwd: string) {
  localStorage.setItem(ADMIN_KEY, pwd);
}

export function isAuthed(): boolean {
  return sessionStorage.getItem('portfolio-admin-ok') === '1';
}

export function setAuthed(ok: boolean) {
  if (ok) sessionStorage.setItem('portfolio-admin-ok', '1');
  else sessionStorage.removeItem('portfolio-admin-ok');
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
