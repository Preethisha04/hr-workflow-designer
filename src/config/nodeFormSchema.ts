import type { FieldConfig } from '../types/form.types';

export const nodeFormSchema: Record<string, FieldConfig[]> = {
  start: [
    { name: 'label', label: 'Workflow Name', type: 'text', placeholder: 'e.g. New Employee Onboarding', required: true },
  ],

  task: [
    { name: 'label', label: 'Task Title', type: 'text', required: true, placeholder: 'e.g. Collect documents' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'What needs to be done?' },
    { name: 'assignee', label: 'Assignee', type: 'text', placeholder: 'e.g. HR Manager' },
    { name: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high'] },
    { name: 'dueDate', label: 'Due Date', type: 'date' },
  ],

  approval: [
    { name: 'label', label: 'Approval Step Title', type: 'text', required: true, placeholder: 'e.g. Manager Sign-off' },
    {
      name: 'approverRole',
      label: 'Approver Role',
      type: 'select',
      options: ['Manager', 'HRBP', 'Director', 'VP HR', 'CFO', 'CEO'],
    },
    { name: 'threshold', label: 'Auto-Approve Threshold (days)', type: 'number' },
    { name: 'escalationDays', label: 'Escalation After (days)', type: 'number' },
  ],

  automation: [
    { name: 'label', label: 'Automation Title', type: 'text', required: true, placeholder: 'e.g. Send Welcome Email' },
    {
      name: 'actionId',
      label: 'Action Type',
      type: 'select',
      options: [], // dynamically populated
    },
  ],

  condition: [
    { name: 'label', label: 'Condition Label', type: 'text', required: true, placeholder: 'e.g. Check department' },
    { name: 'field', label: 'Field to Check', type: 'text', placeholder: 'e.g. department' },
    {
      name: 'operator',
      label: 'Operator',
      type: 'select',
      options: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than'],
    },
    { name: 'value', label: 'Value', type: 'text', placeholder: 'e.g. Engineering' },
  ],

  end: [
    { name: 'label', label: 'Completion Message', type: 'text', placeholder: 'e.g. Onboarding Complete!' },
  ],
};
