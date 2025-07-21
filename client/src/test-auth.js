// Test file to check if auth module is accessible
import { login, getCurrentUser } from '@/lib/auth';

console.log('Auth module loaded successfully');
console.log('Functions available:', { login, getCurrentUser });

// Test login
const result = login('adil@gmail.com', 'adil123');
console.log('Test login result:', result);