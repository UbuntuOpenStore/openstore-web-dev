import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getRelativeLocaleUrl, localeSlugToCode, removeLocaleFromPath } from "@/lib/utils"
import localesJson from '@/locales.json';
import SvgGlobe from "./icons/Globe";

const LanguageSelect = ({ currentLocale, currentPath }: { currentLocale: string | undefined, currentPath: string }) => {
  const code = localeSlugToCode(currentLocale);
  const currentLanguage = localesJson.find((locale) => locale.code === code);
  let path = removeLocaleFromPath(currentPath);
  if (path.startsWith('/manage/')) {
    path = '/';
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 text-black cursor-pointer">
          <SvgGlobe className="h-4 w-4" />
          <span>{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-64 overflow-auto">
        {localesJson.map((locale) => (
          <DropdownMenuItem
            key={locale.slug}
            asChild
          >
            <a href={getRelativeLocaleUrl(locale.slug, path)} className="cursor-pointer">{locale.name}</a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSelect;
