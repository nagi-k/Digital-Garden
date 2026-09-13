import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { SiteContent } from '../types';
import { loadContent, resetContent, saveContent } from '../lib/contentStore';

interface ContentContextValue {
  content: SiteContent;
  update: (next: SiteContent) => void;
  reset: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => loadContent());

  const update = useCallback((next: SiteContent) => {
    setContent(next);
    saveContent(next);
  }, []);

  const reset = useCallback(() => {
    resetContent();
    setContent(loadContent());
  }, []);

  const value = useMemo(() => ({ content, update, reset }), [content, update, reset]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent 必须在 ContentProvider 内使用');
  return ctx;
}
