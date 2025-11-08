export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  LAB_TECH = 'lab_tech',
  PHARMACIST = 'pharmacist',
  ACCOUNTANT = 'accountant',
  RECEPTIONIST = 'receptionist',
  PATIENT = 'patient',
}

// Permission levels for role hierarchy
export const ROLE_HIERARCHY = {
  [UserRole.SUPER_ADMIN]: 1000,
  [UserRole.ADMIN]: 900,
  [UserRole.DOCTOR]: 800,
  [UserRole.NURSE]: 700,
  [UserRole.PHARMACIST]: 600,
  [UserRole.LAB_TECH]: 500,
  [UserRole.ACCOUNTANT]: 400,
  [UserRole.RECEPTIONIST]: 300,
  [UserRole.PATIENT]: 100,
};

// Helper functions
export const hasPermission = (
  userRole: UserRole,
  requiredRole: UserRole,
): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const getHigherRoles = (role: UserRole): UserRole[] => {
  return Object.keys(ROLE_HIERARCHY)
    .filter((r) => ROLE_HIERARCHY[r] >= ROLE_HIERARCHY[role])
    .map((r) => r as UserRole);
};
