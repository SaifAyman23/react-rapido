import { axiosInstance } from '@/api/axiosInstance'
import type {
  CustomReminderRequest,
  CustomReminderResponse,
  DeviceRegisterRequest,
  DeviceResponse,
  NotificationsResponse,
} from '@/api/contracts'

/** Notifications live beside their devices and reminders under `/notifications`. */
export const notificationEndpoints = {
  notifications: '/notifications/',
  markRead: (id: string) => `/notifications/${id}/read/`,
  markAllRead: '/notifications/read-all/',
  unreadCount: '/notifications/unread-count/',
  reminders: '/notifications/custom-reminders/',
  reminder: (id: string) => `/notifications/custom-reminders/${id}/`,
  devices: '/notifications/devices/',
  unregisterDevice: '/notifications/devices/unregister/',
} as const

export const notificationApi = {
  list: () =>
    axiosInstance
      .get<NotificationsResponse>(notificationEndpoints.notifications)
      .then((response) => response.data),

  markRead: (id: string) =>
    axiosInstance.patch(notificationEndpoints.markRead(id), {}).then((response) => response.data),

  markAllRead: () => axiosInstance.post(notificationEndpoints.markAllRead).then(() => undefined),

  unreadCount: () =>
    axiosInstance
      .get<{ unread_count: number }>(notificationEndpoints.unreadCount)
      .then((response) => response.data),

  reminders: () =>
    axiosInstance
      .get<CustomReminderResponse[]>(notificationEndpoints.reminders)
      .then((response) => response.data),

  createReminder: (data: CustomReminderRequest) =>
    axiosInstance
      .post<CustomReminderResponse>(notificationEndpoints.reminders, data)
      .then((response) => response.data),

  updateReminder: (id: string, data: Partial<CustomReminderRequest>) =>
    axiosInstance
      .patch<CustomReminderResponse>(notificationEndpoints.reminder(id), data)
      .then((response) => response.data),

  deleteReminder: (id: string) =>
    axiosInstance.delete(notificationEndpoints.reminder(id)).then(() => undefined),

  registerDevice: (data: DeviceRegisterRequest) =>
    axiosInstance
      .post<DeviceResponse>(notificationEndpoints.devices, data)
      .then((response) => response.data),

  unregisterDevice: (deviceUuid: string) =>
    axiosInstance
      .post(notificationEndpoints.unregisterDevice, { device_uuid: deviceUuid })
      .then(() => undefined),
}
