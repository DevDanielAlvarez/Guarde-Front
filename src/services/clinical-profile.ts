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

export const SEXES = ['male', 'female', 'other'] as const;

export type Sex = (typeof SEXES)[number];

export const SEX_LABELS: Record<Sex, string> = {
  male: 'Masculino',
  female: 'Feminino',
  other: 'Outro',
};

export const ALLERGY_SEVERITY_LABELS: Record<PatientAllergy['severity'], string> = {
  mild: 'leve',
  moderate: 'moderada',
  severe: 'severa',
};

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

/**
 * The "Ficha para o médico" fields — everything the patient, not a
 * clinician, is in a position to know about themself. Every field is
 * optional; a patient fills in only what they want to.
 */
export type MedicalSummary = {
  sex: Sex | null;
  maritalStatus: string | null;
  profession: string | null;
  educationLevel: string | null;
  address: string | null;
  healthInsurance: string | null;
  smokes: boolean | null;
  cigarettesPerDay: number | null;
  smokingDuration: string | null;
  smokingQuitYearsAgo: number | null;
  drinksAlcohol: boolean | null;
  alcoholDosesPerDay: string | null;
  alcoholQuitYearsAgo: number | null;
  exercises: boolean | null;
  exerciseDescription: string | null;
  mentalHealthHistory: boolean | null;
  mentalHealthMedication: boolean | null;
  mentalHealthTherapy: boolean | null;
};

export const EMPTY_MEDICAL_SUMMARY: MedicalSummary = {
  sex: null,
  maritalStatus: null,
  profession: null,
  educationLevel: null,
  address: null,
  healthInsurance: null,
  smokes: null,
  cigarettesPerDay: null,
  smokingDuration: null,
  smokingQuitYearsAgo: null,
  drinksAlcohol: null,
  alcoholDosesPerDay: null,
  alcoholQuitYearsAgo: null,
  exercises: null,
  exerciseDescription: null,
  mentalHealthHistory: null,
  mentalHealthMedication: null,
  mentalHealthTherapy: null,
};

export type FamilyHistoryItem = {
  id?: string;
  condition: string;
  relationship: string;
};

export type SurgicalHistoryItem = {
  id?: string;
  procedure: string;
  performedAt: string | null;
};

export type PatientProfile = {
  name: string;
  cpf: string | null;
  age: number | null;
  bloodType: BloodType | null;
  allergies: PatientAllergy[];
  conditions: PatientCondition[];
  continuousMedications: PatientContinuousMedication[];
  medicalSummary: MedicalSummary;
  familyHistories: FamilyHistoryItem[];
  surgicalHistories: SurgicalHistoryItem[];
};

type MedicalSummaryResponse = {
  sex: Sex | null;
  marital_status: string | null;
  profession: string | null;
  education_level: string | null;
  address: string | null;
  health_insurance: string | null;
  smokes: boolean | null;
  cigarettes_per_day: number | null;
  smoking_duration: string | null;
  smoking_quit_years_ago: number | null;
  drinks_alcohol: boolean | null;
  alcohol_doses_per_day: string | null;
  alcohol_quit_years_ago: number | null;
  exercises: boolean | null;
  exercise_description: string | null;
  mental_health_history: boolean | null;
  mental_health_medication: boolean | null;
  mental_health_therapy: boolean | null;
} | null;

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
    family_histories: { id: string; condition: string; relationship: string }[];
    surgical_histories: { id: string; procedure: string; performed_at: string | null }[];
    medical_summary: MedicalSummaryResponse;
  };
};

function mapMedicalSummary(summary: MedicalSummaryResponse): MedicalSummary {
  if (!summary) {
    return EMPTY_MEDICAL_SUMMARY;
  }
  return {
    sex: summary.sex,
    maritalStatus: summary.marital_status,
    profession: summary.profession,
    educationLevel: summary.education_level,
    address: summary.address,
    healthInsurance: summary.health_insurance,
    smokes: summary.smokes,
    cigarettesPerDay: summary.cigarettes_per_day,
    smokingDuration: summary.smoking_duration,
    smokingQuitYearsAgo: summary.smoking_quit_years_ago,
    drinksAlcohol: summary.drinks_alcohol,
    alcoholDosesPerDay: summary.alcohol_doses_per_day,
    alcoholQuitYearsAgo: summary.alcohol_quit_years_ago,
    exercises: summary.exercises,
    exerciseDescription: summary.exercise_description,
    mentalHealthHistory: summary.mental_health_history,
    mentalHealthMedication: summary.mental_health_medication,
    mentalHealthTherapy: summary.mental_health_therapy,
  };
}

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
    medicalSummary: mapMedicalSummary(data.medical_summary),
    familyHistories: data.family_histories.map((item) => ({
      id: item.id,
      condition: item.condition,
      relationship: item.relationship,
    })),
    surgicalHistories: data.surgical_histories.map((item) => ({
      id: item.id,
      procedure: item.procedure,
      performedAt: item.performed_at,
    })),
  };
}

/**
 * Blood type is intentionally left out here — it's owned by the onboarding
 * flow (`updateBloodType`) and this screen never touches it, so it can't
 * accidentally get overwritten with `null`.
 */
export function updateMedicalSummary(token: string, summary: MedicalSummary): Promise<void> {
  return apiRequest<void>('/api/clinical-profile', {
    method: 'PUT',
    token,
    body: {
      sex: summary.sex,
      marital_status: summary.maritalStatus,
      profession: summary.profession,
      education_level: summary.educationLevel,
      address: summary.address,
      health_insurance: summary.healthInsurance,
      smokes: summary.smokes,
      cigarettes_per_day: summary.cigarettesPerDay,
      smoking_duration: summary.smokingDuration,
      smoking_quit_years_ago: summary.smokingQuitYearsAgo,
      drinks_alcohol: summary.drinksAlcohol,
      alcohol_doses_per_day: summary.alcoholDosesPerDay,
      alcohol_quit_years_ago: summary.alcoholQuitYearsAgo,
      exercises: summary.exercises,
      exercise_description: summary.exerciseDescription,
      mental_health_history: summary.mentalHealthHistory,
      mental_health_medication: summary.mentalHealthMedication,
      mental_health_therapy: summary.mentalHealthTherapy,
    },
  });
}

export function updateFamilyHistories(
  token: string,
  items: FamilyHistoryItem[]
): Promise<{ data: FamilyHistoryItem[] }> {
  return apiRequest<{ data: FamilyHistoryItem[] }>('/api/patient-family-histories', {
    method: 'PUT',
    token,
    body: { items: items.map(({ condition, relationship }) => ({ condition, relationship })) },
  });
}

export function updateSurgicalHistories(
  token: string,
  items: SurgicalHistoryItem[]
): Promise<{ data: SurgicalHistoryItem[] }> {
  return apiRequest<{ data: SurgicalHistoryItem[] }>('/api/patient-surgical-histories', {
    method: 'PUT',
    token,
    body: {
      items: items.map(({ procedure, performedAt }) => ({ procedure, performed_at: performedAt })),
    },
  });
}
