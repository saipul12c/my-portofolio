import experiencesData from '../../../data/pengalaman/experiences.json';

export const experiences = experiencesData.experiences || experiencesData;

export const educations = [
  {
    degree: 'S1 Teknik Informatika',
    institution: 'Universitas Indonesia',
    period: '2018 - 2022',
    gpa: '3.75/4.00'
  }
];

export const languages = [
  { language: 'Bahasa Indonesia', proficiency: 'Native', level: 100 },
  { language: 'English', proficiency: 'Professional', level: 85 },
  { language: 'Arabic', proficiency: 'Intermediate', level: 65 }
];

export const additionalInfo = [
  {
    icon: 'Award',
    text: '3x Hackathon Winner'
  },
  {
    icon: 'Users',
    text: 'Active Open Source Contributor'
  },
  {
    icon: 'FileText',
    text: 'Available for freelance projects',
    link: '/contact'
  }
];