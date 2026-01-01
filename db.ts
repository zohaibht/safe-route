import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AdminUser, Driver, Student } from './types';

const DB_KEY = 'saferoute360_db';

const initialData: AppState = {
  admins: [],
  drivers: [],
  students: []
};

/**
 * Helper function to generate a UUID in React Native without external polyfills.
 * In a real project, consider using 'uuid' library or 'expo-crypto'.
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const repository = {
  getData: async (): Promise<AppState> => {
    try {
      const data = await AsyncStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : initialData;
    } catch (error) {
      console.error('Error getting data:', error);
      return initialData;
    }
  },

  saveData: async (data: AppState): Promise<void> => {
    try {
      await AsyncStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  // Admin CRUD
  addAdmin: async (admin: Omit<AdminUser, 'id'>) => {
    const data = await repository.getData();
    const newAdmin = { ...admin, id: generateUUID() };
    data.admins.push(newAdmin);
    await repository.saveData(data);
    return newAdmin;
  },

  // Driver CRUD
  addDriver: async (driver: Omit<Driver, 'id' | 'role'>) => {
    const data = await repository.getData();
    const newDriver: Driver = { ...driver, id: generateUUID(), role: 'DRIVER' };
    data.drivers.push(newDriver);
    await repository.saveData(data);
    return newDriver;
  },

  // Student CRUD
  addStudent: async (student: Omit<Student, 'id' | 'status'>) => {
    const data = await repository.getData();
    const newStudent: Student = { ...student, id: generateUUID(), status: 'WAITING' };
    data.students.push(newStudent);
    await repository.saveData(data);
    return newStudent;
  },

  getStudentsByDriver: async (driverId: string) => {
    const data = await repository.getData();
    return data.students.filter(s => s.driverId === driverId);
  },

  getDriverById: async (driverId: string) => {
    const data = await repository.getData();
    return data.drivers.find(d => d.id === driverId);
  }
};