export interface User {
  id: string;
  name: string;
  email: string;
  newUser: boolean;
  phoneNo?: string;
  college?: string;
  address?: string;
  pinCode?: number;
  participatingEvents?: Array<string>;
  transportation?: boolean;
  gender?: string;
  city?: string;
  state?: string;
}
