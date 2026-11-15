import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UI_EN } from './en';
import { UI_PT, type UiDictionary } from './pt';
import { translatePtToEn } from './ptToEnCatalog';

export type Language = 'en' | 'pt';

export const LANGUAGE_STORAGE_KEY = 'astro_capi_lang';

const TRANSLATABLE_ATTRS = ['title', 'placeholder', 'aria-label'] as const;

interface LanguageContextValue {
  lang: Language;
  dict: UiDictionary;
  setLang: (next: Language) => void;
  toggleLang: () => void;
  tx: (enText: string, ptText: string) => string;
  translateText: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'pt' || saved === 'en') {
      return saved;
    }
  } catch {
    // Ignore storage read failures in restricted contexts
  }
  return 'en';
}

function isInsideExcludedSubtree(node: Node | null): boolean {
  let curr: Node | null = node;
  while (curr) {
    if (curr instanceof HTMLElement) {
      if (curr.dataset.noI18n === 'true') return true;
      const tag = curr.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') {
        return true;
      }
    }
    curr = curr.parentNode;
  }
  return false;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Language>(readInitialLanguage);

  // Separate WeakMaps so DOM translations remain idempotent and never clobber native tx() updates
  const ptTextSourceMap = useRef(new WeakMap<Text, string>());
  const enTextAppliedMap = useRef(new WeakMap<Text, string>());

  const ptAttrSourceMap = useRef(new WeakMap<Element, Map<string, string>>());
  const enAttrAppliedMap = useRef(new WeakMap<Element, Map<string, string>>());

  const isApplyingRef = useRef(false);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      // Ignore storage write errors
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'pt' : 'en');
  }, [lang, setLang]);

  const processTextNode = useCallback((node: Text, targetLang: Language) => {
    if (isInsideExcludedSubtree(node)) return;
    const current = node.nodeValue ?? '';
    if (!current.trim()) return;

    if (targetLang === 'en') {
      const lastApplied = enTextAppliedMap.current.get(node);
      if (lastApplied === current) return;

      const translated = translatePtToEn(current);
      if (translated !== current) {
        ptTextSourceMap.current.set(node, current);
        enTextAppliedMap.current.set(node, translated);
        node.nodeValue = translated;
      }
    } else {
      const lastApplied = enTextAppliedMap.current.get(node);
      const originalPt = ptTextSourceMap.current.get(node);
      if (lastApplied && originalPt && current === lastApplied) {
        enTextAppliedMap.current.delete(node);
        node.nodeValue = originalPt;
      }
    }
  }, []);

  const processElementAttrs = useCallback(
    (el: Element, targetLang: Language) => {
      if (isInsideExcludedSubtree(el)) return;
      for (const attr of TRANSLATABLE_ATTRS) {
        const val = el.getAttribute(attr);
        if (!val) continue;

        let ptMap = ptAttrSourceMap.current.get(el);
        let enMap = enAttrAppliedMap.current.get(el);

        if (targetLang === 'en') {
          if (enMap?.get(attr) === val) continue;
          const translated = translatePtToEn(val);
          if (translated !== val) {
            if (!ptMap) {
              ptMap = new Map();
              ptAttrSourceMap.current.set(el, ptMap);
            }
            if (!enMap) {
              enMap = new Map();
              enAttrAppliedMap.current.set(el, enMap);
            }
            ptMap.set(attr, val);
            enMap.set(attr, translated);
            el.setAttribute(attr, translated);
          }
        } else if (enMap && ptMap) {
          const lastApplied = enMap.get(attr);
          const originalPt = ptMap.get(attr);
          if (lastApplied && originalPt && val === lastApplied) {
            enMap.delete(attr);
            el.setAttribute(attr, originalPt);
          }
        }
      }
    },
    []
  );

  const sweepSubtree = useCallback(
    (root: Node, targetLang: Language) => {
      if (isInsideExcludedSubtree(root)) return;

      if (root instanceof Element) {
        processElementAttrs(root, targetLang);
      } else if (root instanceof Text) {
        processTextNode(root, targetLang);
        return;
      }

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
      );
      let currentNode: Node | null = walker.nextNode();
      while (currentNode) {
        if (currentNode instanceof Element) {
          processElementAttrs(currentNode, targetLang);
        } else if (currentNode instanceof Text) {
          processTextNode(currentNode, targetLang);
        }
        currentNode = walker.nextNode();
      }
    },
    [processElementAttrs, processTextNode]
  );

  useEffect(() => {
    const d = lang === 'en' ? UI_EN : UI_PT;
    document.documentElement.lang = d.meta.htmlLang;
    document.title = d.meta.pageTitle;
  }, [lang]);

  useLayoutEffect(() => {
    const rootEl = document.getElementById('root') ?? document.body;
    if (!rootEl) return;

    const runSweep = (targetNode: Node) => {
      if (isApplyingRef.current) return;
      isApplyingRef.current = true;
      try {
        sweepSubtree(targetNode, lang);
      } finally {
        isApplyingRef.current = false;
      }
    };

    runSweep(rootEl);

    const observer = new MutationObserver((mutations) => {
      if (isApplyingRef.current) return;
      isApplyingRef.current = true;
      try {
        for (const mutation of mutations) {
          if (mutation.type === 'characterData') {
            if (mutation.target instanceof Text) {
              processTextNode(mutation.target, lang);
            }
          } else if (mutation.type === 'attributes') {
            if (mutation.target instanceof Element) {
              processElementAttrs(mutation.target, lang);
            }
          } else if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((added) => {
              sweepSubtree(added, lang);
            });
          }
        }
      } finally {
        isApplyingRef.current = false;
      }
    });

    observer.observe(rootEl, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRS],
    });

    return () => observer.disconnect();
  }, [lang, processElementAttrs, processTextNode, sweepSubtree]);

  const value = useMemo<LanguageContextValue>(() => {
    const dict = lang === 'en' ? UI_EN : UI_PT;
    return {
      lang,
      dict,
      setLang,
      toggleLang,
      tx: (enText: string, ptText: string) => (lang === 'en' ? enText : ptText),
      translateText: (text: string) =>
        lang === 'en' ? translatePtToEn(text) : text,
    };
  }, [lang, setLang, toggleLang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

export const LanguageToggleButton: React.FC<{
  compact?: boolean;
  className?: string;
}> = ({ compact = false, className = '' }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div
      data-no-i18n="true"
      role="group"
      aria-label="Language switcher (English / Portuguese)"
      className={`inline-flex min-h-[40px] items-center rounded border-2 border-cyan-500/70 bg-slate-950/90 p-0.5 font-mono shadow-sm ${className}`}
    >
      <span className="px-1.5 text-[11px] sm:text-xs" aria-hidden="true">
        🌐
      </span>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`min-h-[34px] rounded-sm px-2 text-[11px] font-bold transition sm:px-2.5 sm:text-xs ${
          lang === 'en'
            ? 'bg-cyan-500 text-slate-950 shadow'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        EN
      </button>
      <span className="px-0.5 text-[10px] text-slate-600" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => setLang('pt')}
        aria-pressed={lang === 'pt'}
        className={`min-h-[34px] rounded-sm px-2 text-[11px] font-bold transition sm:px-2.5 sm:text-xs ${
          lang === 'pt'
            ? 'bg-emerald-500 text-slate-950 shadow'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        {compact ? 'PT' : 'PT'}
      </button>
    </div>
  );
};
