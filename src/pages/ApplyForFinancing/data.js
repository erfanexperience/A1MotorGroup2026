export const VEHICLES = [
  {
    id: '2021-toyota-4runner',
    name: '2021 Toyota 4Runner',
    image: '/Assests/Cars/2021 Toyota 4Runner/2021 Toyota 4Runner  1.webp',
    specs: ['SUV', 'Automatic', 'Clean Title'],
  },
]

export const STEPS = [
  { id: 'vehicle', title: 'Vehicle', shortTitle: 'Vehicle' },
  { id: 'contact', title: 'Contact basics', shortTitle: 'Contact' },
  { id: 'identity', title: 'Identity', shortTitle: 'Identity' },
  { id: 'address', title: 'Home address', shortTitle: 'Address' },
  { id: 'employment', title: 'Employment', shortTitle: 'Employment' },
  { id: 'review', title: 'Review & submit', shortTitle: 'Review' },
]

export const INITIAL_FORM = {
  vehicleId: '',
  website: '', // honeypot
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  identity: {
    dateOfBirth: '',
    ssn: '',
    driverLicenseNumber: '',
    driverLicenseExpiry: '',
    maritalStatus: '',
  },
  residential: {
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    residenceType: '',
    residenceTypeOther: '',
    atAddressSince: '',
  },
  employment: {
    employer: '',
    occupation: '',
    employerType: '',
    monthlyIncome: '',
    employerAddress1: '',
    employerAddress2: '',
    employerPhone: '',
    employerCity: '',
    employerState: '',
    employerZip: '',
    atJobSince: '',
  },
  consents: {
    reviewAccepted: false,
  },
}

export const DRAFT_KEY = 'a1-financing-draft'
export const DRAFT_TIMESTAMP_KEY = 'a1-financing-draft-time'
