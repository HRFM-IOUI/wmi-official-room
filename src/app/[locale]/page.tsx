import { TranslationProvider } from "@/context/TranslationContext";
import Main from "@/components/Main";

// Next.jsの規約通り PageProps 型を作成
type PageProps = {
  params: {
    locale: string;
  };
};

export default function LocalePage({ params }: PageProps) {
  return (
    <TranslationProvider locale={params.locale}>
      <Main />
    </TranslationProvider>
  );
}
