export interface AutomationAction {
  id: string;
  label: string;
  description: string;
  params: string[];
  icon: string;
}

// Mock API - can be swapped with real backend
export const fetchAutomations = async (): Promise<AutomationAction[]> => {
  await new Promise((r) => setTimeout(r, 200)); // simulate network
  return [
    {
      id: 'send_email',
      label: 'Send Email',
      description: 'Send automated email notification',
      params: ['to', 'subject', 'body'],
      icon: '📧',
    },
    {
      id: 'send_slack',
      label: 'Send Slack Message',
      description: 'Post a message to a Slack channel',
      params: ['channel', 'message'],
      icon: '💬',
    },
    {
      id: 'generate_doc',
      label: 'Generate Document',
      description: 'Create a document from a template',
      params: ['template', 'recipient', 'format'],
      icon: '📄',
    },
    {
      id: 'update_hris',
      label: 'Update HRIS Record',
      description: 'Update an employee record in HRIS',
      params: ['employeeId', 'field', 'value'],
      icon: '🔄',
    },
    {
      id: 'schedule_meeting',
      label: 'Schedule Meeting',
      description: 'Auto-schedule a calendar meeting',
      params: ['attendees', 'duration', 'title'],
      icon: '📅',
    },
    {
      id: 'create_ticket',
      label: 'Create IT Ticket',
      description: 'Raise an IT support ticket',
      params: ['category', 'priority', 'description'],
      icon: '🎫',
    },
  ];
};
