import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CustomReminderRequest, DeviceRegisterRequest } from '@/api/contracts'
import { notificationApi } from '@/api/notifications/endpoints'
import { queryKeys } from '@/lib/queryKeys'

export const useNotifications = () =>
  useQuery({ queryKey: queryKeys.notifications.list, queryFn: notificationApi.list })

export const useUnreadNotificationCount = () =>
  useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: notificationApi.unreadCount,
  })

export const useMarkNotificationRead = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.markRead,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.notifications.list })
      void client.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount })
    },
  })
}

export const useMarkAllNotificationsRead = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.markAllRead,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.notifications.list })
      void client.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount })
    },
  })
}

export const useCustomReminders = () =>
  useQuery({ queryKey: queryKeys.notifications.reminders, queryFn: notificationApi.reminders })

export const useCreateCustomReminder = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (data: CustomReminderRequest) => notificationApi.createReminder(data),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.notifications.reminders })
    },
  })
}

export const useUpdateCustomReminder = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomReminderRequest> }) =>
      notificationApi.updateReminder(id, data),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.notifications.reminders })
    },
  })
}

export const useDeleteCustomReminder = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.deleteReminder,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.notifications.reminders })
    },
  })
}

export const useRegisterDevice = () =>
  useMutation({
    mutationFn: (data: DeviceRegisterRequest) => notificationApi.registerDevice(data),
  })

export const useUnregisterDevice = () =>
  useMutation({ mutationFn: notificationApi.unregisterDevice })
