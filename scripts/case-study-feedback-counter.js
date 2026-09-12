(() => {
  const apiRoot = 'https://my-own-counter-api-production.up.railway.app';
  const namespace = 'iamanimesh';
  const counters = {
    'income-tax': 'case-income-tax-up-7c9f2a',
    'itba': 'case-itba-up-4e8d1b',
    'unitx-case-study': 'case-unitx-up-2f6a9c',
    'cgda-case-study': 'case-cgda-up-8b3e5d',
    'trade-cloud-apps': 'case-trade-cloud-up-6d1c4f'
  };

  const counterName = pageKey => counters[pageKey];
  const readCount = payload => Number.isFinite(Number(payload?.count)) ? Number(payload.count) : null;

  async function request(pageKey, action, options = {}) {
    const name = counterName(pageKey);
    if (!name) return null;
    const response = await fetch(`${apiRoot}/${action}/${namespace}/${name}`, {
      cache: 'no-store',
      ...options
    });
    if (!response.ok) throw new Error(`Counter request failed with ${response.status}`);
    return readCount(await response.json());
  }

  window.CaseStudyFeedbackCounter = {
    get(pageKey) {
      return request(pageKey, 'get');
    },
    recordThumbsUp(pageKey) {
      return request(pageKey, 'hit', { method: 'POST' });
    }
  };
})();
