import React, { createContext, useContext, ReactNode } from "react";
import ja from "@/locales/ja.json";
import en from "@/locales/en.json";
// 必要なら他言語もimport

// 型生成（全言語キーを共通型化）
type TranslationKeys = keyof typeof ja; // ja.jsonのキーを型として利用（全言語で揃える運用推奨）

type DictType = typeof ja; // 単一言語の型（全言語同じ形が理想）

const translations: Record<string, DictType> = {
  ja, en // 必要な言語を追加
};

type TranslationContextType = {
  t: (key: TranslationKeys, vars?: Record<string, any>) => string;
};

const TranslationContext = createContext<TranslationContextType>({
  t: (key) => key
});

export function TranslationProvider({
  locale,
  children
}: {
  locale: string;
  children: ReactNode;
}) {
  const dict = translations[locale] || translations.ja;
  const t = (key: TranslationKeys, vars?: Record<string, any>) => {
    let str = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(k => {
        str = str.replace(`{${k}}`, vars[k]);
      });
    }
    return str;
  };

  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
