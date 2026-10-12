import { describe, it, expect, beforeEach } from 'vitest';
import { GTM_PRODUCTION_HOSTNAME, gtmLoaderScript } from './gtm';

const GTM_SRC = 'https://www.googletagmanager.com/gtm.js?id=GTM-TEST';

describe('gtmLoaderScript', () => {
  type Win = { dataLayer?: unknown[] };

  // Runs the inline loader exactly as emitted, with the hostname under test.
  function runLoader(hostname: string): Win {
    const win: Win = {};
    const run = new Function('window', 'document', 'location', gtmLoaderScript('GTM-TEST'));
    run(win, document, { hostname });
    return win;
  }

  function gtmScripts() {
    return Array.from(document.querySelectorAll('script')).filter((s) => s.src === GTM_SRC);
  }

  beforeEach(() => {
    document.head.innerHTML = '<script id="anchor"></script>';
  });

  it('injects the GTM script on the production hostname', () => {
    expect(GTM_PRODUCTION_HOSTNAME).toBe('sigilzero.com');
    const win = runLoader('sigilzero.com');
    expect(gtmScripts()).toHaveLength(1);
    expect(win.dataLayer).toEqual([expect.objectContaining({ event: 'gtm.js' })]);
  });

  it('does not inject the GTM script on localhost', () => {
    const win = runLoader('localhost');
    expect(gtmScripts()).toHaveLength(0);
    // dataLayer still exists so page code that pushes to it keeps working.
    expect(Array.isArray(win.dataLayer)).toBe(true);
  });

  it.each(['127.0.0.1', '192.168.0.10', 'jasoncookdesign.github.io', 'www.sigilzero.com', 'sigilzero.com.example.test'])(
    'does not inject the GTM script on %s',
    (hostname) => {
      runLoader(hostname);
      expect(gtmScripts()).toHaveLength(0);
    },
  );
});
