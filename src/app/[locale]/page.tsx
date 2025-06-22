import { TranslationProvider } from "@/context/TranslationContext";
import Main from "@/components/Main";

export default function LocalePage({ params }: { params: { locale: string } }) {
  return (
    <TranslationProvider locale={params.locale}>
      <Main />
    </TranslationProvider>
  );
}
