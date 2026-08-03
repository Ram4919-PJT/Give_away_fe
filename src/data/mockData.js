export const initialNgos = [
  {
    id: 'ngo-1', name: 'Asha Kiran Foundation', city: 'Mumbai',
    categories: ['Medical', 'Food', 'Shelter'], verified: true,
    description: 'Providing emergency relief, medical camps, and shelter support to underserved communities across Maharashtra.',
    peopleHelped: 12500, donationsReceived: 342, rating: 4.8, logo: '🏛',
    mission: 'To ensure no family goes without food, shelter, or medical care during crises.',
    about: 'Founded in 2010, Asha Kiran Foundation has served over 12,500 people through verified relief programs.',
    gallery: ['🍲', '🏥', '👨‍👩‍👧'],
    location: 'Andheri East, Mumbai, Maharashtra',
    contact: { email: 'contact@ashakiran.org', phone: '+91 22 4000 1234' },
    regNumber: 'MH/NGO/2010/004521',
    impact: { families: 3200, meals: 85000, shelters: 12 }
  },
  {
    id: 'ngo-2', name: 'Helpage India', city: 'Delhi',
    categories: ['Elderly Care', 'Medical', 'Food'], verified: true,
    description: 'Dedicated to the welfare of elderly citizens through lunch programs, healthcare, and livelihood support.',
    peopleHelped: 45000, donationsReceived: 890, rating: 4.9, logo: '💚',
    mission: "Championing the dignity and wellbeing of India's elderly population.",
    about: 'Helpage India operates nationwide programs for senior citizens.',
    gallery: ['👴', '🍽️', '💊'],
    location: 'C-14, Qutab Institutional Area, New Delhi',
    contact: { email: 'info@helpageindia.org', phone: '+91 11 4200 5000' },
    regNumber: 'DL/NGO/1978/001102',
    impact: { families: 18000, meals: 240000, shelters: 45 }
  },
  {
    id: 'ngo-3', name: 'Goonj Foundation', city: 'Delhi',
    categories: ['Clothes', 'Disaster Relief', 'Education'], verified: true,
    description: 'Transforming urban discard into rural development resource through dignified giving.',
    peopleHelped: 28000, donationsReceived: 567, rating: 4.7, logo: '🧥',
    mission: 'Making giving a joyful, dignified experience while addressing rural development needs.',
    about: 'Goonj channels donated materials to disaster-affected and remote communities.',
    gallery: ['📦', '🌾', '📚'],
    location: 'J-93, Sarita Vihar, New Delhi',
    contact: { email: 'mail@goonj.org', phone: '+91 11 4140 1212' },
    regNumber: 'DL/NGO/1999/002334',
    impact: { families: 9500, meals: 0, shelters: 28 }
  },
  {
    id: 'ngo-4', name: 'Akshaya Patra', city: 'Bengaluru',
    categories: ['Food', 'Education', 'Children'], verified: true,
    description: 'Mid-day meal program feeding millions of school children daily across India.',
    peopleHelped: 2000000, donationsReceived: 2100, rating: 4.9, logo: '🍛',
    mission: 'No child in India shall be deprived of education because of hunger.',
    about: 'Operating 65 kitchens across 14 states, Akshaya Patra serves nutritious meals.',
    gallery: ['🍲', '🏫', '👧'],
    location: 'HK Hill, Chord Road, Bengaluru',
    contact: { email: 'info@akshayapatra.org', phone: '+91 80 2347 1900' },
    regNumber: 'KA/NGO/2000/003891',
    impact: { families: 0, meals: 3000000, shelters: 0 }
  },
  {
    id: 'ngo-5', name: 'Smile Foundation', city: 'Gurugram',
    categories: ['Education', 'Healthcare', 'Livelihood'], verified: false,
    description: 'Empowering underprivileged children and youth through education and healthcare initiatives.',
    peopleHelped: 15000, donationsReceived: 198, rating: 4.5, logo: '😊',
    mission: 'To bring lasting positive change in the lives of underserved communities.',
    about: 'Smile Foundation runs education centers and mobile health clinics in 25 states.',
    gallery: ['📖', '🏥', '💼'],
    location: 'Vardhman Corporate Plaza, Gurugram',
    contact: { email: 'info@smilefoundationindia.org', phone: '+91 124 400 4444' },
    regNumber: 'HR/NGO/2002/005678',
    impact: { families: 4200, meals: 120000, shelters: 8 }
  },
  {
    id: 'ngo-6', name: 'Uday Foundation', city: 'Mumbai',
    categories: ['Medical', 'Children', 'Disaster Relief'], verified: true,
    description: 'Supporting children with critical illnesses and families affected by disasters.',
    peopleHelped: 8200, donationsReceived: 276, rating: 4.6, logo: '🏥',
    mission: 'Providing hope and healing to children battling life-threatening diseases.',
    about: 'Uday Foundation runs pediatric care programs and disaster response teams.',
    gallery: ['🧸', '❄️', '💉'],
    location: 'Bandra West, Mumbai',
    contact: { email: 'info@udayfoundation.org', phone: '+91 22 2640 1234' },
    regNumber: 'MH/NGO/2007/006789',
    impact: { families: 2100, meals: 45000, shelters: 5 }
  }
];

export function createInitialState() {
  return {
    verifications: [
      {
        id: 'v-1',
        name: 'Asha Kiran Foundation',
        email: 'ngo@ashakiran.org',
        type: 'NGO',
        registrationId: 'MH/NGO/2010/004521',
        doc: 'ngo_registration.pdf',
        status: 'Pending',
        submitted: '2026-07-08',
        documents: [
          { label: 'NGO Registration Certificate', filename: 'ngo_registration_certificate.pdf' },
          { label: 'PAN Card', filename: 'pan_card_ashakiran.pdf' },
          { label: 'Bank Account Details', filename: 'bank_account_details.pdf' },
          { label: 'Cancelled Cheque / Passbook', filename: 'cancelled_cheque.pdf' },
          { label: 'Authorized Representative Government ID', filename: 'representative_gov_id.pdf' },
          { label: 'Organization Address Proof', filename: 'address_proof.pdf' }
        ]
      },
      { id: 'v-2', name: 'Ravi Kumar', email: 'receiver@outlook.com', type: 'Receiver', doc: 'hardship_proof_rent.pdf', status: 'Pending', submitted: '2026-07-07' },
      { id: 'v-3', name: 'Helpage India', email: 'info@helpageindia.org', type: 'NGO', doc: 'trust_deed_12A.pdf', status: 'Verified', submitted: '2026-07-05' },
      { id: 'v-4', name: 'Sunita Deshmukh', email: 'sunita@example.com', type: 'Receiver', doc: 'income_cert.pdf', status: 'Pending', submitted: '2026-07-09' }
    ],
    requests: [
      { id: 'req-1', requester: 'Asha Kiran Foundation (NGO)', type: 'Items Assistance', details: 'Needs 20x Winter Blankets for shelter housing', status: 'Pending' },
      { id: 'req-2', requester: 'Ravi Kumar (Receiver)', type: 'Financial Support', details: 'Requires $400 for emergency house rent support.', status: 'Pending' },
      { id: 'req-3', requester: 'Sunita Deshmukh (Receiver)', type: 'Items Assistance', details: 'Category: Food & Rations. Needs monthly family ration kit.', status: 'Pending' },
      { id: 'req-4', requester: 'Helpage India (NGO)', type: 'Financial Assistance', details: 'Requesting $1,500 to expand elderly lunch program support', status: 'Approved' }
    ],
    inventory: [
      { id: 'inv-1', name: 'Winter Blankets', category: 'Shelter/Clothing', qty: 45, unit: 'pcs' },
      { id: 'inv-2', name: 'First Aid Kits', category: 'Medical Supplies', qty: 30, unit: 'kits' },
      { id: 'inv-3', name: 'Wheelchairs', category: 'Medical Equipment', qty: 8, unit: 'units' },
      { id: 'inv-4', name: 'Canned Vegetables', category: 'Food & Rations', qty: 250, unit: 'cans' },
      { id: 'inv-5', name: 'Hygiene Kits', category: 'Medical Supplies', qty: 0, unit: 'kits' }
    ],
    donations: [
      {
        id: 'don-1', donor: 'Rajesh Mehta', donorEmail: 'rajesh@example.com', type: 'Financial', amount: 500,
        fund: 'General Health Fund', details: '$500 donation towards General Health Fund', date: '2026-07-06',
        status: 'Fully Deployed',
        usage: {
          summary: 'Your contribution fully funded emergency medical supplies and partial rent relief.',
          purpose: 'General Health Fund', utilizationPercent: 100, updatedByAdmin: true, updatedAt: '2026-07-08',
          allocations: [
            { date: '2026-07-07', purpose: 'Emergency house rent support', recipient: 'Ravi Kumar (Receiver)', amount: '$400', status: 'Disbursed' },
            { date: '2026-07-08', purpose: 'First aid kit distribution', recipient: 'Asha Kiran Foundation (NGO)', amount: '$100', status: 'Disbursed' }
          ]
        }
      },
      {
        id: 'don-3', donor: 'Demo Donor', donorEmail: 'donor@gmail.com', type: 'Financial', amount: 1000,
        fund: 'Medical Support', purpose: 'Medical Support', details: '₹1,000 donation for Medical Support', date: '2026-07-05',
        status: 'Fully Deployed', paymentMethod: 'UPI', livesImpacted: 3, familiesHelped: 2,
        beneficiary: {
          displayName: 'Ravi K.', city: 'Mumbai', assistanceType: 'Medical Assistance',
          dateReceived: '2026-07-07', status: 'Assistance Received'
        },
        usage: {
          summary: 'Your donation supported verified medical relief for families in need through AJA Abayahastham.',
          purpose: 'Medical Support', utilizationPercent: 100, updatedByAdmin: true, updatedAt: '2026-07-07',
          allocations: [
            { date: '2026-07-06', purpose: 'Emergency medical consultation', amount: '₹450', status: 'Disbursed' },
            { date: '2026-07-07', purpose: 'Medicine supplies', amount: '₹550', status: 'Disbursed' }
          ]
        }
      },
      {
        id: 'don-4', donor: 'Demo Donor', donorEmail: 'donor@gmail.com', type: 'Financial', amount: 300,
        fund: 'Emergency Relief', purpose: 'Emergency Relief', details: '₹300 donation for Emergency Relief', date: '2026-07-08',
        status: 'Assigned', paymentMethod: 'UPI', livesImpacted: 1, familiesHelped: 1,
        usage: {
          summary: 'Funds are being routed to verified partners for emergency relief.',
          purpose: 'Emergency Relief', utilizationPercent: 65, updatedByAdmin: true, updatedAt: '2026-07-09',
          allocations: [
            { date: '2026-07-09', purpose: 'Shelter materials', amount: '₹195', status: 'Disbursed' },
            { date: '2026-07-10', purpose: 'Food supplies', amount: '₹105', status: 'In Progress' }
          ]
        }
      },
      {
        id: 'don-5', donor: 'Demo Donor', donorEmail: 'donor@gmail.com', type: 'Items', amount: null,
        fund: 'Clothes', category: 'Clothes', purpose: 'Clothes',
        details: 'Winter jackets and blankets — good condition, 15 items',
        date: '2026-07-10', status: 'Pending Pickup',
        pickupAddress: '12 Green Park, Mumbai', pickupDate: '2026-07-12',
        livesImpacted: 0, familiesHelped: 0, usage: null
      }
    ],
    ngos: initialNgos,
    notifications: [
      { id: 'n-1', title: 'Donation Submitted', message: 'Your ₹300 donation for Emergency Relief has been received by AJA Abayahastham.', time: '2 hours ago', group: 'today', read: false, icon: 'check-circle' },
      { id: 'n-2', title: 'Pickup Scheduled', message: 'Pickup for your clothes donation confirmed for July 12, 10 AM.', time: '5 hours ago', group: 'today', read: false, icon: 'truck' },
      { id: 'n-3', title: 'Impact Report Available', message: 'See how your ₹1,000 medical donation created impact.', time: 'Yesterday', group: 'yesterday', read: true, icon: 'bar-chart-3' },
      { id: 'n-4', title: 'Welcome to Give Away', message: 'Thank you for joining AJA Abayahastham. Every gift creates hope.', time: '2 days ago', group: 'earlier', read: true, icon: 'heart' }
    ],
    receiverApplications: [
      {
        id: 'APP-2026-001',
        receiverEmail: 'receiver@outlook.com',
        receiverName: 'Ravi Kumar',
        assistanceType: 'Emergency Relief',
        purpose: 'Emergency house rent support',
        amount: 400,
        description: 'Lost job due to medical emergency. Need $400 for one month rent to avoid eviction.',
        notes: 'Family of 4, two school-going children.',
        status: 'Under Review',
        appliedDate: '2026-07-07',
        documents: { 'Aadhaar Card': true, 'Income Certificate': true, 'Government Certificate': true },
        rejectionReason: null,
        timeline: null
      },
      {
        id: 'APP-2026-002',
        receiverEmail: 'receiver@outlook.com',
        receiverName: 'Ravi Kumar',
        assistanceType: 'Medical Assistance',
        purpose: 'Monthly family medical support',
        amount: 350,
        description: 'Need support for ongoing medical treatment for family member.',
        notes: '',
        status: 'Completed',
        appliedDate: '2026-06-01',
        documents: { 'Aadhaar Card': true, 'Doctor Prescription': true },
        rejectionReason: null,
        timeline: null
      }
    ],
    receiverNotifications: [
      { id: 'rn-1', title: 'Application Under Review', message: 'APP-2026-001 is being reviewed by AJA Abayahastham.', time: '2 hours ago', group: 'today', read: false, icon: 'clock' },
      { id: 'rn-2', title: 'Documents Received', message: 'Your documents for APP-2026-001 have been received.', time: '5 hours ago', group: 'today', read: false, icon: 'file-check' },
      { id: 'rn-3', title: 'Funds Released', message: 'APP-2026-002 funds have been released successfully.', time: 'Yesterday', group: 'yesterday', read: true, icon: 'circle-check' },
      { id: 'rn-4', title: 'Welcome to Give Away', message: 'Apply for financial assistance from AJA Abayahastham anytime.', time: '3 days ago', group: 'earlier', read: true, icon: 'heart-handshake' },
      { id: 'rn-5', title: 'Application Completed', message: 'APP-2026-002 has been marked as completed.', time: '4 days ago', group: 'earlier', read: true, icon: 'badge-check' }
    ],
    ngoRequests: [
      {
        id: 'NGO-REQ-001', ngoEmail: 'ngo@ashakiran.org', type: 'Items', category: 'Shelter/Clothing',
        purpose: 'Winter blankets for shelter housing', quantity: 20, priority: 'High',
        beneficiary: '200 homeless individuals', status: 'Under Review', appliedDate: '2026-07-08', rejectionReason: null
      },
      {
        id: 'NGO-REQ-002', ngoEmail: 'ngo@ashakiran.org', type: 'Financial', category: 'Program Funding',
        purpose: 'Elderly lunch program expansion', amount: 1500, priority: 'Normal',
        beneficiary: '150 senior citizens', status: 'Approved', appliedDate: '2026-07-05', rejectionReason: null
      }
    ],
    ngoNotifications: [
      { id: 'nn-1', title: 'Request Under Review', message: 'NGO-REQ-001 is being reviewed by AJA admin.', time: '2 hours ago', group: 'today', read: false, icon: 'clock' },
      { id: 'nn-2', title: 'Request Approved', message: 'NGO-REQ-002 financial assistance has been approved.', time: 'Yesterday', group: 'yesterday', read: true, icon: 'circle-check' },
      { id: 'nn-3', title: 'Complete Verification', message: 'Submit your documents to unlock all platform features.', time: '3 days ago', group: 'earlier', read: true, icon: 'shield' }
    ],
    ngoBeneficiaries: [
      {
        id: 'b1',
        name: 'Ravi Kumar',
        type: 'Emergency Relief',
        status: 'Active',
        resources: 'Rent support',
        amount: '₹400',
        completion: 'In Progress',
        location: 'Mumbai',
        lastUpdated: '2026-07-10',
        completedDonations: 2,
        ngo: 'Asha Kiran Foundation'
      },
      {
        id: 'b2',
        name: 'Sunita Deshmukh',
        type: 'Food Assistance',
        status: 'In Progress',
        resources: 'Monthly ration kit',
        amount: '1 kit / month',
        completion: 'Ongoing',
        location: 'Pune',
        lastUpdated: '2026-07-08',
        completedDonations: 4,
        ngo: 'Asha Kiran Foundation'
      },
      {
        id: 'b3',
        name: 'Family Shelter Unit A',
        type: 'Shelter',
        status: 'Completed',
        resources: 'Winter Blankets',
        amount: '20 pcs',
        completion: '100%',
        location: 'Nagpur',
        lastUpdated: '2026-06-28',
        completedDonations: 1,
        ngo: 'Asha Kiran Foundation'
      },
      {
        id: 'b4',
        name: 'Anita Sharma',
        type: 'Medical Assistance',
        status: 'Pending',
        resources: 'Medical consultation support',
        amount: '₹1,200',
        completion: 'Awaiting approval',
        location: 'Delhi',
        lastUpdated: '2026-07-12',
        completedDonations: 0,
        ngo: 'Asha Kiran Foundation'
      },
      {
        id: 'b5',
        name: 'Community Kitchen Group',
        type: 'Food Assistance',
        status: 'On Hold',
        resources: 'Dry ration package',
        amount: '15 kits',
        completion: 'Paused',
        location: 'Hyderabad',
        lastUpdated: '2026-07-01',
        completedDonations: 3,
        ngo: 'Asha Kiran Foundation'
      }
    ],
    adminNotifications: [
      { id: 'adm-n1', title: 'New NGO Verification', message: 'Smile Foundation submitted verification documents.', time: '10 min ago', group: 'today', priority: 'High', status: 'Unread', read: false, icon: 'shield' },
      { id: 'adm-n2', title: 'Emergency Assistance Request', message: 'APP-2026-001 flagged as high priority medical case.', time: '25 min ago', group: 'today', priority: 'Urgent', status: 'Unread', read: false, icon: 'alert-triangle' },
      { id: 'adm-n3', title: 'Donation Assigned', message: 'Item donation assigned to Asha Kiran Foundation.', time: '1 hour ago', group: 'today', priority: 'Normal', status: 'Read', read: true, icon: 'gift' },
      { id: 'adm-n4', title: 'Funds Released', message: '₹1,000 medical fund released to verified beneficiary.', time: 'Yesterday', group: 'yesterday', priority: 'Normal', status: 'Read', read: true, icon: 'banknote' },
      { id: 'adm-n5', title: 'High Priority Case', message: 'Receiver rent support request requires immediate review.', time: 'Yesterday', group: 'yesterday', priority: 'High', status: 'Unread', read: false, icon: 'flag' },
      { id: 'adm-n6', title: 'Verification Approved', message: 'Helpage India verification completed successfully.', time: '3 days ago', group: 'earlier', priority: 'Normal', status: 'Read', read: true, icon: 'circle-check' }
    ]
  };
}
