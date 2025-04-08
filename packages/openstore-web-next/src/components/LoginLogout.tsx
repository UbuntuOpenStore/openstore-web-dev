import { getRelativeLocaleUrl } from "@/lib/utils";

const LoginLogout = ({ messages, currentLocale } : { currentLocale: string | undefined, messages: { manage: string, logout: string, login: string } }) => {
  if (document.cookie.includes('apikey=')) {
    return (
      <>
        <li>
          <a class="header-link" href="/manage/">{messages.manage}</a>
        </li>

        <li>
          <a class="header-link" href={getRelativeLocaleUrl(currentLocale, "/logout/")}>{messages.logout}</a>
        </li>
      </>
    );
  }

  return (
    <li>
      <a class="header-link" href={getRelativeLocaleUrl(currentLocale, "/login/")}>{messages.login}</a>
    </li>
  );
}

export default LoginLogout;
