const containsNoDigits = (element) => {
  const digitRegex = /\d/;
  return !digitRegex.test(element.innerText);
}
const filters = {
  youtube: {
    btn: (element) => {
      return element && getComputedStyle(element).display !== 'none';
    },
    video: (element, selector) => {
      return 'rgb(255, 0, 0)' !== getComputedStyle(document.querySelector(selector.progressBar)).backgroundColor;
    }
  },
  rezka: {
    btn: (element) => {
      return element && containsNoDigits(element);
    },
    video: (element, selector) => {
      return true;
    }
  },
  dailymotion: {
    btn: (element) => {
      return element && '1' === element.parentNode.style.opacity;
    },
    video: (element, selector) => {
      return element && 'none' !== element.parentNode.style.display;
    }
  },
  googleapis: {
    btn: (element) => {
      return element && '1' === element.parentNode.style.opacity;
    },
    video: (element, selector) => {
      return element && 'none' !== element.parentNode.style.display;
    }
  }
}
let selectors = {}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getSelectorByDomain = (currentUrl) => {
  for (const k in selectors) {
    const selector = selectors[k];
    for (const domain of selector.domain) {
      if (-1 !== currentUrl.indexOf(domain)) {
        return [selector, k];
      }
    }
  }
  return [null, null];
}

const findBtn = (selector) => {
  if (selector) {
    for (const path of selector.skipPath) {
      if (path) {
        const skipButton = document.querySelector(path);
        if (skipButton) {
          return skipButton;
        }
      }
    }
  }
  return null;
}
const findVideo = (selector) => {
  if (selector) {
    for (const path of selector.videoPath) {
      if (path) {
        const video = document.querySelector(path);
        if (video) {
          return video;
        }
      }
    }
  }
  return null;
}

let canDo = true;
let loaded = false;

const skiper = async () => {
  selectors = {
    'youtube': {
      domain: ['youtube.com'],
      skipPath: ['[id^="skip-button"] > span'],
      videoPath: ['.html5-video-player.ad-showing video'],
      progressBar: '#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-progress-bar > div.ytp-chapters-container > div > div.ytp-progress-list > div.ytp-play-progress.ytp-swatch-background-color',
      rollback: 0.1
    },
    'rezka': {
      domain: ['rezka.ag', 'hdrezka.ag', 'hdrezka.co', 'hd.hdrezka.best', 'rezka.so', 'hdrezka.pro', 'hdrezka.name', 'hdrezka.ink', 'hdrezka.quest', 'the-hdrezka.com', 'rezka.'],
      skipPath: ['#oframecdnplayer > pjsdiv:nth-child(29) > pjsdiv:nth-child(6) > pjsdiv'],
      videoPath: ['#oframecdnplayer > pjsdiv:nth-child(29) > video'],
      rollback: 0.1
    },
    'dailymotion': {
      domain: ['geo.dailymotion.com'],
      skipPath: ['button[aria-label="Skip Ad"]'],
      videoPath: ['video[title="Advertisement"]'],
      rollback: 0.1
    },
    'googleapis': {
      domain: ['googleapis.com'],
      skipPath: ['button[aria-label="Skip Ad"]'],
      videoPath: ['video[title="Advertisement"]'],
      rollback: 0.1
    }
  };
  try {
    if (!loaded) {
      loaded = true;
      const response = await fetch('https://ad-skipy.com/api/selectors', {
        method: 'POST'
      })
      selectors = await response.json();
    }
  } catch (err) {
    //skip
  }
  const currentUrl = window.location.href;
  await sleep(1e1);
  let [selector, key] = getSelectorByDomain(currentUrl);
  if (selector) {
    const processingVideo = async (selector) => {
      const video = findVideo(selector);
      if (video && filters[key].video(video, selector) && canDo) {
        canDo = false;
        setTimeout(() => canDo = true, 2e1);
        video.currentTime = isNaN(video.duration) ? 0 : (+video.duration - selector.rollback);
      }
    }
    const processingBtn = async (selector) => {
      const skipButton = findBtn(selector);
      if (skipButton && filters[key].btn(skipButton)) {
        await sleep(5.1e1);
        skipButton.click();
      }
    }

    if (-1 !== ['dailymotion'].indexOf(key)) {
      await sleep(2e3);
      let busy = false;
      setInterval(async () => {
        if (!busy) {
          busy = true;
          await processingVideo(selector);
          busy = false;
        }
      }, 1e3 + 2 * selector.rollback);
      let busy2 = false;
      setInterval(async () => {
        if (!busy2) {
          busy2 = true;
          await processingBtn(selector);
          busy2 = false;
        }
      }, 1e2);
    } else {
      const observer = new MutationObserver(async (mutations, obs) => {
        await processingVideo(selector);
        await processingBtn(selector);
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', skiper);
} else {
  skiper();
}