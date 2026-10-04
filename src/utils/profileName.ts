/**
 * Central helper to derive the searched target profile's display first name.
 * Priority: profile.fullName (first word) -> profile.username -> fallback 'Você'.
 */

export interface ProfileLike {
  fullName?: string;
  username?: string;
}

export function getSearchedProfileDisplayName(profile?: ProfileLike | null): string {
  if (!profile) return 'Você';

  const fullName = profile.fullName?.trim();
  if (fullName) {
    const firstName = fullName.split(/\s+/)[0];
    if (firstName) return firstName;
  }

  if (profile.username) {
    const cleanUser = profile.username.replace(/^@/, '').trim();
    if (cleanUser) return cleanUser;
  }

  return 'Você';
}
