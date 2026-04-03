export interface Resume {
  about: string;
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    year: string;
  }[];
  skills: string[];
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
  };
}
