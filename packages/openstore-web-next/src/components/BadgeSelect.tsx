import { useState } from "preact/hooks";
import CopyToClipboard from "./CopyToClipboard";
import { localeSlugToCode } from "@/lib/utils";

const LANGUAGES = [
  { code: "en_US", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "ca", label: "Catalan" },
  { code: "zh_Hant_HK", label: "Chinese (Hong Kong)" },
  { code: "zh_Hans", label: "Chinese (Simplified)" },
  { code: "zh_Hant", label: "Chinese (Traditional)" },
  { code: "cs", label: "Czech" },
  { code: "nl", label: "Dutch" },
  { code: "eo", label: "Esperanto" },
  { code: "fi", label: "Finnish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "pl", label: "Polish" },
  { code: "pt", label: "Portuguese" },
  { code: "ru", label: "Russian" },
  { code: "es", label: "Spanish" },
  { code: "sv", label: "Swedish" },
];

const BadgeSelect = ({ appId, currentLocale }: { appId?: string, currentLocale?: string }) => {
  const code = localeSlugToCode(currentLocale);
  const defaultLanguage = LANGUAGES.find((lang) => lang.code === code);
  const [language, setLanguage] = useState(defaultLanguage?.code ?? 'en_US');

  const appUrl = `${import.meta.env.SITE}app/${appId}`;
  const svgUrl = `${import.meta.env.SITE}badges/${language}.svg`;
  const svgHtml = `<a href="${appUrl}"><img src="${svgUrl}" alt="OpenStore" /></a>`;
  const svgMarkdown = `[![OpenStore](${svgUrl})](${appUrl})`;
  const pngUrl = `${import.meta.env.SITE}badges/${language}.png`;
  const pngHtml = `<a href="${appUrl}"><img src="${pngUrl}" alt="OpenStore" /></a>`;
  const pngMarkdown = `[![OpenStore](${pngUrl})](${appUrl})`;

  return (
    <>
      <div class="mb-4">
        <label for="language">Language</label>
        <select
          class="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-xl placeholder:text-gray-400 sm:text-sm max-w-xs"
          name="language"
          onInput={(e) => setLanguage(e.currentTarget.value)}
        >
          {LANGUAGES.map(({ code, label }) => (
            <option value={code} key={code}>{label}</option>
          ))}
        </select>
      </div>

      <div class="flex flex-row text-center">
        <div class="w-1/2 space-y-4 mx-4">
          <h2 class="text-2xl">PNG</h2>

          {appId ? (
            <>
              <a href={appUrl}>
                <img class="h-12 inline-block" src={pngUrl} alt="OpenStore" />
              </a>

              <h3 class="text-xl">HTML</h3>
              <CopyToClipboard code={pngHtml} />

              <h3 class="text-xl">Markdown</h3>
              <CopyToClipboard code={pngMarkdown} />
            </>
          ) : (
            <>
              <img class="h-12 inline-block" src={pngUrl} alt="OpenStore" />
              <CopyToClipboard code={pngUrl} />
            </>
          )}
        </div>

        <div class="w-1/2 space-y-4">
          <h2 class="text-2xl">SVG</h2>

          {appId ? (
            <>
              <a href={appUrl}>
                <img class="h-12 inline-block" src={svgUrl} alt="OpenStore" />
              </a>

              <h3 class="text-xl">HTML</h3>
              <CopyToClipboard code={svgHtml} />

              <h3 class="text-xl">Markdown</h3>
              <CopyToClipboard code={svgMarkdown} />
            </>
          ) : (
            <>
              <img class="h-12 inline-block" src={svgUrl} alt="OpenStore" />
              <CopyToClipboard code={svgUrl} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default BadgeSelect;
