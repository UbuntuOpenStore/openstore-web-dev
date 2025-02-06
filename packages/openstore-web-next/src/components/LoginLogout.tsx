const LoginLogout = () => {
  if (document.cookie.includes('apikey=')) {
    return (
      <>
        <li>
          <a class="header-link" href="/manage/">Manage</a>
        </li>

        <li>
          <a class="header-link" href="/logout/">Logout</a>
        </li>
      </>
    );
  }

  return (
    <li>
      <a class="header-link" href="/login/">Login</a>
    </li>
  );
}

export default LoginLogout;
