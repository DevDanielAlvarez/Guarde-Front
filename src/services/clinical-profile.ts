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

export type PatientAllergy = {
  id: string;
  medicationId: string;
  medicationName: string;
  severity: 'mild' | 'moderate' | 'severe';
};

export type PatientCondition = {
  id: string;
  healthConditionId: string;
  conditionName: string;
  status: 'active' | 'resolved';
};

export type PatientContinuousMedication = {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
};

export type PatientProfile = {
  name: string;
  cpf: string | null;
  age: number | null;
  bloodType: BloodType | null;
  allergies: PatientAllergy[];
  conditions: PatientCondition[];
  continuousMedications: PatientContinuousMedication[];
};

type PatientProfileResponse = {
  data: {
    name: string;
    cpf: string | null;
    age: number | null;
    blood_type: BloodType | null;
    allergies: { id: string; medication_id: string; medication_name: string; severity: string }[];
    conditions: { id: string; health_condition_id: string; condition_name: string; status: string }[];
    continuous_medications: {
      id: string;
      medication_id: string;
      medication_name: string;
      dosage: string;
      frequency: string;
    }[];
  };
};

export async function getProfile(token: string): Promise<PatientProfile> {
  const response = await apiRequest<PatientProfileResponse>('/api/profile', { token });
  const { data } = response;

  return {
    name: data.name,
    cpf: data.cpf,
    age: data.age,
    bloodType: data.blood_type,
    allergies: data.allergies.map((allergy) => ({
      id: allergy.id,
      medicationId: allergy.medication_id,
      medicationName: allergy.medication_name,
      severity: allergy.severity as PatientAllergy['severity'],
    })),
    conditions: data.conditions.map((condition) => ({
      id: condition.id,
      healthConditionId: condition.health_condition_id,
      conditionName: condition.condition_name,
      status: condition.status as PatientCondition['status'],
    })),
    continuousMedications: data.continuous_medications.map((medication) => ({
      id: medication.id,
      medicationId: medication.medication_id,
      medicationName: medication.medication_name,
      dosage: medication.dosage,
      frequency: medication.frequency,
    })),
  };
}
