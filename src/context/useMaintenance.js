import { useContext } from 'react';
import { MaintenanceContext } from './maintenanceContextObject';

export function useMaintenance() {
  return useContext(MaintenanceContext);
}
