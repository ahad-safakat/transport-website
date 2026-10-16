import type { indianStates } from './indianStates'

type StateName = (typeof indianStates)[number]

/**
 * Major cities and towns per state/UT, used as type-ahead suggestions in the quote form.
 * Not exhaustive — the city fields still accept any place name.
 */
export const citiesByState: Record<StateName, string[]> = {
  'Andaman and Nicobar Islands': ['Port Blair', 'Diglipur', 'Mayabunder', 'Rangat', 'Car Nicobar'],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Kakinada', 'Rajahmundry', 'Tirupati',
    'Kadapa', 'Anantapur', 'Eluru', 'Ongole', 'Vizianagaram', 'Srikakulam', 'Machilipatnam', 'Chittoor',
    'Hindupur', 'Proddatur', 'Bhimavaram', 'Tenali', 'Nandyal', 'Adoni', 'Amaravati',
  ],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Tezu', 'Along'],
  Assam: [
    'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Dhubri',
    'Diphu', 'Goalpara', 'Karimganj', 'Sivasagar', 'North Lakhimpur', 'Barpeta',
  ],
  Bihar: [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Arrah', 'Begusarai', 'Katihar',
    'Munger', 'Chhapra', 'Hajipur', 'Sasaram', 'Bettiah', 'Motihari', 'Siwan', 'Kishanganj',
  ],
  Chandigarh: ['Chandigarh'],
  Chhattisgarh: [
    'Raipur', 'Bhilai', 'Durg', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Raigarh', 'Jagdalpur', 'Ambikapur',
    'Dhamtari', 'Mahasamund',
  ],
  'Dadra and Nagar Haveli and Daman and Diu': ['Silvassa', 'Daman', 'Diu', 'Dadra'],
  Delhi: [
    'New Delhi', 'Delhi', 'Narela', 'Okhla', 'Naraina', 'Bawana', 'Mundka', 'Najafgarh', 'Kirti Nagar',
    'Azadpur', 'Mayapuri',
  ],
  Goa: [
    'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Canacona', 'Pernem',
    'Verna', 'Kundaim', 'Sanguem', 'Quepem', 'Valpoi',
  ],
  Gujarat: [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand',
    'Nadiad', 'Morbi', 'Mehsana', 'Bharuch', 'Vapi', 'Navsari', 'Valsad', 'Porbandar', 'Gandhidham',
    'Kandla', 'Mundra', 'Bhuj', 'Surendranagar', 'Ankleshwar', 'Palanpur', 'Hazira',
  ],
  Haryana: [
    'Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat',
    'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Rewari', 'Manesar', 'Kurukshetra', 'Palwal',
  ],
  'Himachal Pradesh': [
    'Shimla', 'Solan', 'Baddi', 'Dharamshala', 'Mandi', 'Kullu', 'Manali', 'Una', 'Hamirpur', 'Bilaspur',
    'Nahan', 'Paonta Sahib', 'Chamba', 'Nalagarh',
  ],
  'Jammu and Kashmir': [
    'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kathua', 'Udhampur', 'Pulwama', 'Rajouri',
    'Samba', 'Kupwara',
  ],
  Jharkhand: [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Hazaribagh', 'Deoghar', 'Giridih', 'Ramgarh',
    'Dumka', 'Phusro', 'Adityapur', 'Chaibasa',
  ],
  Karnataka: [
    'Mangaluru', 'Bengaluru', 'Mysuru', 'Hubballi', 'Dharwad', 'Belagavi', 'Kalaburagi', 'Ballari',
    'Udupi', 'Manipal', 'Shivamogga', 'Davanagere', 'Tumakuru', 'Vijayapura', 'Raichur', 'Bidar',
    'Hassan', 'Chikkamagaluru', 'Mandya', 'Chitradurga', 'Kolar', 'Hosapete', 'Gadag', 'Karwar',
    'Bagalkote', 'Puttur', 'Bantwal', 'Moodbidri', 'Karkala', 'Kundapura', 'Bhatkal', 'Sullia',
    'Madikeri', 'Nelamangala', 'Hoskote', 'Doddaballapura', 'Ramanagara', 'Chikkaballapura',
    'Bhadravati', 'Sirsi', 'Dandeli', 'Gokak', 'Nippani', 'Yadgir', 'Koppal', 'Haveri', 'Surathkal',
    'Panambur', 'Baikampady',
  ],
  Kerala: [
    'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha', 'Palakkad',
    'Malappuram', 'Kottayam', 'Kasaragod', 'Pathanamthitta', 'Idukki', 'Wayanad', 'Kalpetta', 'Ernakulam',
    'Aluva', 'Perumbavoor', 'Thalassery', 'Payyanur', 'Kanhangad', 'Vadakara', 'Guruvayur', 'Tirur',
    'Manjeri', 'Chalakudy', 'Angamaly', 'Changanassery', 'Muvattupuzha',
  ],
  Ladakh: ['Leh', 'Kargil'],
  Lakshadweep: ['Kavaratti', 'Agatti', 'Minicoy'],
  'Madhya Pradesh': [
    'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa',
    'Katni', 'Singrauli', 'Burhanpur', 'Khandwa', 'Pithampur', 'Mandideep', 'Chhindwara', 'Vidisha',
    'Guna', 'Shivpuri', 'Neemuch', 'Mandsaur',
  ],
  Maharashtra: [
    'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Navi Mumbai',
    'Bhiwandi', 'Amravati', 'Nanded', 'Sangli', 'Jalgaon', 'Akola', 'Latur', 'Ahmednagar', 'Dhule',
    'Chandrapur', 'Ratnagiri', 'Satara', 'Kalyan', 'Vasai-Virar', 'Panvel', 'JNPT (Nhava Sheva)',
    'Chakan', 'Pimpri-Chinchwad', 'Ichalkaranji', 'Wardha', 'Sindhudurg', 'Baramati', 'Talegaon',
  ],
  Manipur: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Ukhrul'],
  Meghalaya: ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Byrnihat'],
  Mizoram: ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib', 'Serchhip'],
  Nagaland: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
  Odisha: [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak',
    'Baripada', 'Jharsuguda', 'Angul', 'Paradip', 'Jajpur', 'Rayagada', 'Kalinganagar',
  ],
  Puducherry: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  Punjab: [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Pathankot',
    'Moga', 'Firozpur', 'Phagwara', 'Rajpura', 'Mandi Gobindgarh', 'Khanna', 'Sangrur', 'Barnala',
  ],
  Rajasthan: [
    'Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Ajmer', 'Bikaner', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar',
    'Pali', 'Sri Ganganagar', 'Bhiwadi', 'Neemrana', 'Kishangarh', 'Chittorgarh', 'Jaisalmer', 'Barmer',
    'Beawar', 'Tonk', 'Hanumangarh',
  ],
  Sikkim: ['Gangtok', 'Namchi', 'Rangpo', 'Mangan', 'Gyalshing'],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Erode',
    'Vellore', 'Thoothukudi', 'Thanjavur', 'Dindigul', 'Hosur', 'Karur', 'Namakkal', 'Nagercoil',
    'Kanchipuram', 'Sriperumbudur', 'Ambattur', 'Cuddalore', 'Kumbakonam', 'Rajapalayam', 'Sivakasi',
    'Pollachi', 'Krishnagiri', 'Ennore',
  ],
  Telangana: [
    'Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam',
    'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Siddipet', 'Suryapet', 'Medak', 'Sangareddy', 'Patancheru',
  ],
  Tripura: ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Belonia'],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Noida', 'Greater Noida',
    'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Jhansi', 'Firozabad', 'Mathura',
    'Muzaffarnagar', 'Ayodhya', 'Shahjahanpur', 'Rampur', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr',
    'Unnao', 'Sitapur',
  ],
  Uttarakhand: [
    'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Pantnagar',
    'Nainital', 'Almora', 'Sitarganj',
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Kharagpur', 'Haldia', 'Bardhaman', 'Malda',
    'Dankuni', 'Bally', 'Barasat', 'Krishnanagar', 'Jalpaiguri', 'Cooch Behar', 'Raiganj', 'Bankura',
    'Purulia',
  ],
}

/** Every listed city with its state, sorted by city name. */
export const allCities: { city: string; state: StateName }[] = (
  Object.entries(citiesByState) as [StateName, string[]][]
)
  .flatMap(([state, cities]) => cities.map((city) => ({ city, state })))
  .sort((a, b) => a.city.localeCompare(b.city))

/** Finds the state for a typed city name when it matches exactly one listed city (case-insensitive). */
export function stateForCity(name: string): StateName | null {
  const key = name.trim().toLowerCase()
  if (!key) return null
  const matches = allCities.filter((item) => item.city.toLowerCase() === key)
  return matches.length === 1 ? matches[0].state : null
}
