import { browser } from '$app/environment';

function createSettings() {
  let easterEggsEnabled = $state(
    browser ? localStorage.getItem('easterEggsEnabled') !== 'false' : true
  );

  return {
    get easterEggsEnabled() {
      return easterEggsEnabled;
    },
    setEasterEggs(val: boolean) {
      easterEggsEnabled = val;
      if (browser) localStorage.setItem('easterEggsEnabled', val ? 'true' : 'false');
    }
  };
}

export const settings = createSettings();
