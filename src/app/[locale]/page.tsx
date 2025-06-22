import { TranslationProvider } from "@/context/TranslationContext";
import Main from "@/components/Main";

export default function LocalePage({ params }: any) {
  return (
    <TranslationProvider locale={params.locale}>
      <Main />
    </TranslationProvider>
  );
}
