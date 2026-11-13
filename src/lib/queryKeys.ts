/** Query keys shared by the API hooks and screen-level invalidations. */
export const queryKeys = {
  auth: {
    root: ['auth'] as const,
    me: ['auth', 'me'] as const,
    accounts: ['auth', 'accounts'] as const,
  },
  notifications: {
    list: ['notifications'] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
    reminders: ['notifications', 'reminders'] as const,
  },
} as const
