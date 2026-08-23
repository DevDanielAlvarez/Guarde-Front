import { apiRequest } from '@/services/api';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export type Appointment = {
  id: string;
  title: string;
  location: string | null;
  scheduled_at: string;
  status: AppointmentStatus;
  notes: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
};

export function listAppointments(token: string): Promise<{ data: Appointment[] }> {
  return apiRequest<{ data: Appointment[] }>('/api/appointments', { token });
}

type ScheduleAppointmentParams = {
  title: string;
  location?: string;
  scheduledAt: string;
};

export function scheduleAppointment(
  token: string,
  { title, location, scheduledAt }: ScheduleAppointmentParams
): Promise<{ data: Appointment }> {
  return apiRequest<{ data: Appointment }>('/api/appointments', {
    method: 'POST',
    body: { title, location, scheduled_at: scheduledAt },
    token,
  });
}

export function cancelAppointment(
  token: string,
  id: string,
  reason?: string
): Promise<{ data: Appointment }> {
  return apiRequest<{ data: Appointment }>(`/api/appointments/${id}/cancel`, {
    method: 'POST',
    body: { reason },
    token,
  });
}

export function recordAppointmentOutcome(
  token: string,
  id: string,
  notes: string
): Promise<{ data: Appointment }> {
  return apiRequest<{ data: Appointment }>(`/api/appointments/${id}/outcome`, {
    method: 'POST',
    body: { notes },
    token,
  });
}
