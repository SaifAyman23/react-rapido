export default {
  account: {
    switchFailed: 'Could not switch accounts.',
    switchTo: 'Switch to {name}',

    switcher: {
      title: 'Switch account',
      subtitle: 'Switch between your connected accounts without signing out.',
      noOtherAccounts: 'You have no other connected accounts yet.',
      addAnother: 'Add another account',
      connectedAccount: 'Connected account',
      switchesActiveAccount: 'Switches to this account',
      role: {
        client: 'Client',
        coach: 'Coach',
      },
    },

    removeAccount: {
      button: 'Remove account',
      confirmTitle: 'Remove {name}?',
      confirmBody:
        'This permanently deletes this account and its data. Your other accounts will remain.',
      confirm: 'Remove',
      cancel: 'Keep it',
      removedToast: '{name} removed.',
      failedToast: 'Could not remove that account.',
    },

    changePassword: {
      navTitle: 'Change password',
      currentPassword: 'Current password',
      newPassword: 'New password',
      confirmNewPassword: 'Confirm new password',
      currentError: 'Enter your current password.',
      newError: 'Use at least 8 characters.',
      confirmError: 'These passwords do not match.',
      button: 'Change password',
      changedToast: 'Password changed.',
      failedToast: 'Could not change your password.',
    },

    privacyTerms: {
      navTitle: 'Privacy and terms',
      acceptedAt: 'Accepted {date}',
      acceptancePending: 'Version {version}, action required',
      accepted: 'Accepted',
      actionRequired: 'Action required',
      noPolicies: 'No policies yet',
    },
  },
}
