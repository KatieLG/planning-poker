import { browser } from '$app/environment';

function createSettings() {
  let easterEggsEnabled = $state(
    browser ? localStorage.getItem('easterEggsEnabled') !== 'false' : true
  );

  let systemDefaultIsDark = $state(false);
  let toggleTheme = $state(false);
  const isDark = $derived(
    (systemDefaultIsDark && !toggleTheme) || (!systemDefaultIsDark && toggleTheme)
  );

  function applyTheme() {
    if (!browser) return;
    localStorage.setItem('toggleTheme', toggleTheme ? 'true' : 'false');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  return {
    get easterEggsEnabled() {
      return easterEggsEnabled;
    },
    setEasterEggs(val: boolean) {
      easterEggsEnabled = val;
      if (browser) localStorage.setItem('easterEggsEnabled', val ? 'true' : 'false');
    },
    get isDark() {
      return isDark;
    },
    get systemDefaultIsDark() {
      return systemDefaultIsDark;
    },
    get toggleTheme() {
      return toggleTheme;
    },
    initTheme() {
      systemDefaultIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      toggleTheme = localStorage.getItem('toggleTheme') === 'true';
    },
    setToggleTheme(val: boolean) {
      toggleTheme = val;
      applyTheme();
    },
    setDark(val: boolean) {
      toggleTheme = val !== systemDefaultIsDark;
      applyTheme();
    }
  };
}

export const settings = createSettings();
