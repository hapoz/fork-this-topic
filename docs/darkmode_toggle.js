function setTheme(theme, themeToggle) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }

  const darkIcon = themeToggle.children[0];
  const lightIcon = themeToggle.children[1];

  if (theme === 'dark') {
    darkIcon.classList.add('hidden');
    lightIcon.classList.remove('hidden');
  } else {
    darkIcon.classList.remove('hidden');
    lightIcon.classList.add('hidden');
  }
}

globalThis.addEventListener('load', () => {
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.removeAttribute('style');

  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark =
    globalThis.matchMedia('(prefers-color-scheme: dark)').matches;

  if (storedTheme) {
    setTheme(storedTheme, themeToggle);
  } else {
    setTheme(systemPrefersDark ? 'dark' : 'light', themeToggle);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark', themeToggle);
    });
  }
});

// prevent flash
const theme = localStorage.getItem('theme') ||
  (globalThis.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light');
document.documentElement.classList.add(theme);
