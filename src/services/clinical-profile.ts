import { apiRequest } from '@/services/api';

export type HealthCondition = {
  id: string;
  name: string;
  category: 'injury' | 'chronic_condition';
};

export type Medication = {
  id: string;
  name: string;
};

export type ContinuousMedicationInput = {
  medicationId: string;
  dosage: string;
  frequency: string;
};

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export type BloodType = (typeof BLOOD_TYPES)[number];

export function listHealthConditions(token: string): Promise<{ data: HealthCondition[] }> {
  return apiRequest<{ data: HealthCondition[] }>('/api/health-conditions', { token });
}

export function listMedications(token: string): Promise<{ data: Medication[] }> {
  return apiRequest<{ data: Medication[] }>('/api/medications', { token });
}

export function submitConditions(token: string, healthConditionIds: string[]): Promise<void> {
  return apiRequest<void>('/api/patient-conditions', {
    method: 'POST',
    token,
    body: { items: healthConditionIds.map((health_condition_id) => ({ health_condition_id })) },
  });
}

export function submitMedicationAllergies(token: string, medicationIds: string[]): Promise<void> {
  return apiRequest<void>('/api/patient-medication-allergies', {
    method: 'POST',
    token,
    body: { items: medicationIds.map((medication_id) => ({ medication_id })) },
  });
}

export function submitContinuousMedications(
  token: string,
  items: ContinuousMedicationInput[]
): Promise<void> {
  return apiRequest<void>('/api/patient-continuous-medications', {
    method: 'POST',
    token,
    body: {
      items: items.map(({ medicationId, dosage, frequency }) => ({
        medication_id: medicationId,
        dosage,
        frequency,
      })),
    },
  });
}

export function updateBloodType(token: string, bloodType: BloodType): Promise<void> {
  return apiRequest<void>('/api/clinical-profile', {
    method: 'PUT',
    token,
    body: { blood_type: bloodType },
  });
}
