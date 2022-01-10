
export function useI18n() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t, te, tm, rt, d, n, ...globalApi } = i18n.global;
  
    return {
      t: t.bind(i18n),
      te: te.bind(i18n),
      tm: tm.bind(i18n),
      rt: rt.bind(i18n),
      d: d.bind(i18n),
      n: n.bind(i18n),
      ...globalApi,
    };
  }