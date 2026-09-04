export interface SocialNetwork {
  name: string;
  link: string;
  icon: string;
}

export interface Information {
  id: string;
  address?: string;
  phone?: string;
  email?: string;
  businessHours?: string;
  logo?: string;
  socialNetworks: SocialNetwork[];
  createdAt: string;
  updatedAt: string;
}

export interface InformationPayload {
  address: string;
  phone: string;
  email: string;
  businessHours: string;
  socialNetworks: SocialNetwork[];
  logo?: File;
}
