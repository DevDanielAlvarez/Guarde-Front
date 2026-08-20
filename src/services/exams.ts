import { Platform } from 'react-native';

import { apiRequest, apiUpload } from '@/services/api';

export type Folder = {
  id: string;
  name: string;
};

export type ExamAttachment = {
  id: string;
  title: string;
  exam_date: string | null;
  mime_type: string;
  size: number;
  folder_id: string | null;
  url: string;
};

export function listFolders(token: string): Promise<{ data: Folder[] }> {
  return apiRequest<{ data: Folder[] }>('/api/folders', { token });
}

export function createFolder(token: string, name: string): Promise<{ data: Folder }> {
  return apiRequest<{ data: Folder }>('/api/folders', { method: 'POST', body: { name }, token });
}

export function listExamAttachments(token: string): Promise<{ data: ExamAttachment[] }> {
  return apiRequest<{ data: ExamAttachment[] }>('/api/exam-attachments', { token });
}

type UploadExamAttachmentParams = {
  uri: string;
  fileName: string;
  mimeType: string;
  title: string;
  examDate?: string;
  folderId?: string | null;
};

export async function uploadExamAttachment(
  token: string,
  { uri, fileName, mimeType, title, examDate, folderId }: UploadExamAttachmentParams
): Promise<{ data: ExamAttachment }> {
  const formData = new FormData();

  if (Platform.OS === 'web') {
    // On web the picker returns a blob:/data: URI — fetch needs an actual Blob to upload,
    // the {uri, name, type} shorthand below only works with React Native's fetch polyfill.
    const blob = await (await fetch(uri)).blob();
    formData.append('file', blob, fileName);
  } else {
    formData.append('file', { uri, name: fileName, type: mimeType } as unknown as Blob);
  }

  formData.append('title', title);
  if (examDate) {
    formData.append('exam_date', examDate);
  }
  if (folderId) {
    formData.append('folder_id', folderId);
  }

  return apiUpload<{ data: ExamAttachment }>('/api/exam-attachments', { formData, token });
}

export function deleteExamAttachment(token: string, id: string): Promise<void> {
  return apiRequest<void>(`/api/exam-attachments/${id}`, { method: 'DELETE', token });
}
