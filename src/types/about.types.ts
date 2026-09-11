export interface AboutValue {
  title: string;
  description: string;
  icon?: string;
}

export interface AboutTeamMember {
  name: string;
  role: string;
  image?: string;
}

export interface About {
  id: string;
  title: string;
  subtitle: string;
  historyTitle: string;
  historyDescription: string;
  historyImage?: string;
  mission: string;
  vision: string;
  values: AboutValue[];
  teamMembers: AboutTeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface AboutPayload {
  title: string;
  subtitle: string;
  historyTitle: string;
  historyDescription: string;
  mission: string;
  vision: string;
  values: AboutValue[];
  teamMembers: AboutTeamMember[];
  historyImage?: File;
  teamImages?: File[];
}
