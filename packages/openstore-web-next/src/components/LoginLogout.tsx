const LoginLogout = ({ messages } : { messages: { manage: string, logout: string, login: string } }) => {
  if (document.cookie.includes('apikey=')) {
    return (
      <>
        <li>
          <a class="header-link" href="/manage/">{messages.manage}</a>
        </li>

        <li>
          <a class="header-link" href="/logout/">{messages.logout}</a>
        </li>
      </>
    );
  }

  return (
    <li>
      <a class="header-link" href="/login/">{messages.login}</a>
    </li>
  );
}

export default LoginLogout;
