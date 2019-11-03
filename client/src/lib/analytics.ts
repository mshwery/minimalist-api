export interface Analytics {
  page(): void
  identify(userId: string, traits?: object): void
  track(message: { userId?: string; event: string; properties?: object }): void
}

export const track: Analytics['track'] = args => {
  if (window.analytics) {
    window.analytics.track(args)
  }
}

export const page: Analytics['page'] = () => {
  if (window.analytics) {
    window.analytics.page()
  }
}

export const identify: Analytics['identify'] = (userId, traits) => {
  if (window.analytics) {
    window.analytics.identify(userId, traits)
  }
}
