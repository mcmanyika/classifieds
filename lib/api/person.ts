import { Person } from '@/types/person';

// In a real application, this would connect to a real API or database
export async function searchPerson(name: string): Promise<Person | null> {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a realistic-looking phone number
  const areaCode = ['512', '214', '713', '817', '210'][Math.floor(Math.random() * 5)];
  const prefix = Math.floor(Math.random() * 900) + 100;
  const lineNumber = Math.floor(Math.random() * 9000) + 1000;
  
  return {
    name,
    phone: `(${areaCode}) ${prefix}-${lineNumber}`
  };
}