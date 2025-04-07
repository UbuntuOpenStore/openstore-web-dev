import { initializeI18N } from "@/lib/i18n";
import { t } from "i18next";

await initializeI18N("en_US");

const LoginLogout = () => {
  if (document.cookie.includes('apikey=')) {
    return (
      <>
        <li>
          <a class="header-link" href="/manage/">{t("Manage")}</a>
        </li>

        <li>
          <a class="header-link" href="/logout/">{t("Logout")}</a>
        </li>
      </>
    );
  }

  return (
    <li>
      <a class="header-link" href="/login/">{t("Login")}</a>
    </li>
  );
}

export default LoginLogout;
