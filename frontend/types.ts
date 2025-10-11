
export interface VehicleType {
  id: string;
  name: string;
  chargingFee: number;
}

export interface Transaction {
  id: string;
  timestamp: string;
  vehicleTypeId?: string;
  payableAmount: number;
  cashReceived: number;
  due: number;
}

export interface Client {
  id: string;
  name: string;
  fatherName: string;
  phone: string;
  nid: string;
  address: string;
  vehicleTypeId: string;
  imageUrl?: string;
  transactions: Transaction[];
  createdAt: string;
}
