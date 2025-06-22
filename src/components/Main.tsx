import { useTranslation } from "@/context/TranslationContext";

export default function Main() {
  const { t } = useTranslation();
  return (
    <main>
      <h1>{t("site_title")}</h1>
      <p>{t("description")}</p>
      <p>{t("greeting", { name: "ドラえもん" })}</p>
    </main>
  );
}
