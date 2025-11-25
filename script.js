// Global variables
let currentUser = null;
let userProgress = 0;
let currentQuiz = null;
let currentQuestionIndex = 0;
let quizScore = 0;
let quizTimer = null;

// DOM elements
const loadingScreen = document.getElementById('loadingScreen');
const authContainer = document.getElementById('authContainer');
const appContainer = document.getElementById('appContainer');
const navbar = document.getElementById('navbar');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        authContainer.classList.remove('hidden');
    }, 3000);
    
    initializeAuth();
    initializeNavigation();
    initializeExplore();
    initializeQuiz();
    initializeFacts();
    initializeAnatomy();
});

// Authentication
function initializeAuth() {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const toLogin = document.getElementById('toLogin');
    const toSignup = document.getElementById('toSignup');
    const signupContainer = document.getElementById('signupContainer');
    const loginContainer = document.getElementById('loginContainer');

    toLogin.addEventListener('click', () => {
        signupContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });

    toSignup.addEventListener('click', () => {
        loginContainer.classList.add('hidden');
        signupContainer.classList.remove('hidden');
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
        
        if (username && password) {
            currentUser = { username, progress: 0 };
            showApp();
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        if (username && password) {
            currentUser = { username, progress: 25 };
            showApp();
        }
    });
}

function showApp() {
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    navbar.classList.remove('hidden');
    
    document.getElementById('dropdownUsername').textContent = currentUser.username;
    document.getElementById('userProgress').textContent = currentUser.progress + '%';
    
    updateStats();
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const ctaButtons = document.querySelectorAll('.cta-button');
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('href').substring(1);
            showSection(targetSection);
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');
            showSection(targetSection);
            
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector(`[href="#${targetSection}"]`).classList.add('active');
        });
    });

    profileIcon.addEventListener('click', () => {
        profileDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Explore Section
function initializeExplore() {
    const systemBtns = document.querySelectorAll('.system-btn');
    const organs = document.querySelectorAll('.organ');

    systemBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            systemBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const system = btn.getAttribute('data-system');
            filterOrgans(system);
        });
    });

    organs.forEach(organ => {
        organ.addEventListener('click', () => {
            const organName = organ.getAttribute('data-organ');
            showOrganModal(organName);
        });
    });
}

function filterOrgans(system) {
    const organs = document.querySelectorAll('.organ');
    
    organs.forEach(organ => {
        if (system === 'all' || organ.getAttribute('data-system') === system) {
            organ.style.display = 'flex';
        } else {
            organ.style.display = 'none';
        }
    });
}

function showOrganModal(organName) {
    const modal = document.getElementById('organModal');
    const organData = getOrganData(organName);
    
    // Set header info
    document.getElementById('modalOrganIcon').textContent = organData.icon;
    document.getElementById('modalOrganName').textContent = organData.name;
    document.getElementById('modalOrganBrief').textContent = organData.brief;
    document.getElementById('modalOrganDescription').textContent = organData.description;
    
    // Populate functions
    const functionsList = document.getElementById('organFunctionsList');
    functionsList.innerHTML = '';
    organData.functions.forEach(func => {
        const li = document.createElement('li');
        li.textContent = func;
        functionsList.appendChild(li);
    });
    
    // Populate facts
    const factsList = document.getElementById('organFactsList');
    factsList.innerHTML = '';
    organData.facts.forEach(fact => {
        const li = document.createElement('li');
        li.textContent = fact;
        factsList.appendChild(li);
    });
    
    // Populate nutrition
    const nutritionList = document.getElementById('organNutritionList');
    nutritionList.innerHTML = '';
    organData.nutrition.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        nutritionList.appendChild(li);
    });
    
    // Populate disorders
    const disordersList = document.getElementById('organDisordersList');
    disordersList.innerHTML = '';
    organData.disorders.forEach(disorder => {
        const li = document.createElement('li');
        li.textContent = disorder;
        disordersList.appendChild(li);
    });
    
    // Populate care tips
    const careList = document.getElementById('organCareList');
    careList.innerHTML = '';
    organData.care.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        careList.appendChild(li);
    });
    
    // Initialize tabs
    initializeModalTabs();
    
    modal.classList.remove('hidden');
    
    document.getElementById('closeModal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    document.querySelector('.modal-backdrop').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}

function initializeModalTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            btn.classList.add('active');
            document.getElementById(targetTab + '-panel').classList.add('active');
        });
    });
}

function getOrganData(organName) {
    const organDatabase = {
        brain: {
            icon: '🧠',
            name: 'Brain',
            brief: 'The brain is the control center of your body, managing thoughts, emotions, and all bodily functions.',
            description: 'The brain is a complex organ that serves as the center of the nervous system. It controls thought, memory, emotion, touch, motor skills, vision, breathing, temperature, hunger and every process that regulates our body.',
            facts: [
                'The brain weighs about 3 pounds (1.4 kg)',
                'It uses 20% of your body\'s total energy',
                'Contains about 86 billion neurons',
                'Can generate about 12-25 watts of electricity',
                'Has no pain receptors, so brain surgery can be done while awake'
            ],
            functions: [
                'Controls all body functions and movements',
                'Processes thoughts, emotions, and memories',
                'Regulates breathing, heart rate, and temperature',
                'Coordinates sensory information from all organs'
            ],
            nutrition: [
                'Omega-3 fatty acids from fish support brain health',
                'Blueberries and dark chocolate improve memory',
                'Nuts and seeds provide essential brain nutrients',
                'Stay hydrated - brain is 75% water',
                'Limit sugar and processed foods'
            ],
            disorders: [
                'Alzheimer\'s disease affects memory and thinking',
                'Stroke can damage brain tissue',
                'Depression affects brain chemistry',
                'Concussions can cause temporary brain dysfunction'
            ],
            care: [
                'Get 7-9 hours of quality sleep daily',
                'Exercise regularly to increase blood flow',
                'Challenge your brain with puzzles and learning',
                'Manage stress through meditation or relaxation',
                'Avoid smoking and excessive alcohol'
            ]
        },
        heart: {
            icon: '🫀',
            name: 'Heart',
            brief: 'The heart is a muscular organ that pumps blood throughout your body.',
            description: 'The heart is a muscular organ about the size of a fist, located just behind and slightly left of the breastbone. It pumps blood through the network of arteries and veins called the cardiovascular system.',
            facts: [
                'Beats about 100,000 times per day',
                'Pumps about 2,000 gallons of blood daily',
                'Has four chambers: two atria and two ventricles',
                'Can continue beating outside the body for a short time',
                'Women\'s hearts beat faster than men\'s on average'
            ],
            functions: [
                'Pumps oxygenated blood throughout the body',
                'Delivers nutrients to all organs and tissues',
                'Removes waste products from cells',
                'Maintains proper blood pressure and circulation'
            ],
            nutrition: [
                'Eat plenty of fruits and vegetables',
                'Choose whole grains over refined grains',
                'Include healthy fats like olive oil and avocados',
                'Limit saturated fats and trans fats',
                'Reduce sodium intake to lower blood pressure'
            ],
            disorders: [
                'Heart disease is the leading cause of death',
                'High blood pressure can damage arteries',
                'Heart attacks occur when blood flow is blocked',
                'Arrhythmias cause irregular heartbeats'
            ],
            care: [
                'Exercise for at least 30 minutes most days',
                'Don\'t smoke and avoid secondhand smoke',
                'Maintain a healthy weight',
                'Manage stress and get adequate sleep',
                'Get regular check-ups and monitor blood pressure'
            ]
        },
        lungs: {
            icon: '🫁',
            name: 'Lungs',
            brief: 'The lungs are organs that help you breathe by exchanging oxygen and carbon dioxide.',
            description: 'The lungs are a pair of spongy, air-filled organs located on either side of the chest. They are responsible for the exchange of oxygen and carbon dioxide between the air and blood.',
            facts: [
                'You have two lungs - right lung has 3 lobes, left has 2',
                'Take about 20,000 breaths per day',
                'Surface area is about the size of a tennis court',
                'Can float on water due to air content',
                'Right lung is slightly larger than the left'
            ],
            functions: [
                'Exchange oxygen and carbon dioxide with blood',
                'Filter and humidify incoming air',
                'Help regulate blood pH levels',
                'Produce sounds for speech and singing'
            ],
            nutrition: [
                'Antioxidant-rich foods like berries protect lung tissue',
                'Vitamin C from citrus fruits supports lung health',
                'Omega-3 fatty acids reduce inflammation',
                'Stay hydrated to keep mucus membranes moist',
                'Avoid processed foods that can cause inflammation'
            ],
            disorders: [
                'Asthma causes airways to narrow and swell',
                'COPD includes emphysema and chronic bronchitis',
                'Pneumonia is an infection that inflames air sacs',
                'Lung cancer is often linked to smoking'
            ],
            care: [
                'Never smoke and avoid secondhand smoke',
                'Exercise regularly to strengthen lung capacity',
                'Practice deep breathing exercises',
                'Avoid air pollution when possible',
                'Get vaccinated against respiratory infections'
            ]
        },
        eyes: {
            icon: '👁️',
            name: 'Eyes',
            brief: 'The eyes are complex organs that detect light and convert it into electrical signals for the brain.',
            description: 'The eyes are sophisticated sensory organs that capture light and convert it into electrical signals that the brain interprets as vision. Each eye contains millions of light-sensitive cells.',
            facts: [
                'Can distinguish about 10 million different colors',
                'Blink about 15-20 times per minute',
                'Eyes are about 1 inch in diameter',
                'Can detect a single photon of light',
                'Eyes start developing just 2 weeks after conception'
            ],
            functions: [
                'Detect and focus light to create clear images',
                'Convert light into electrical signals for the brain',
                'Control the amount of light entering through pupils',
                'Provide depth perception and peripheral vision'
            ],
            nutrition: [
                'Vitamin A from carrots supports night vision',
                'Lutein and zeaxanthin from leafy greens protect retina',
                'Omega-3 fatty acids support retinal health',
                'Vitamin C and E act as antioxidants',
                'Zinc helps transport vitamin A to the retina'
            ],
            disorders: [
                'Myopia (nearsightedness) is increasingly common',
                'Cataracts cloud the lens, usually with age',
                'Glaucoma can damage the optic nerve',
                'Macular degeneration affects central vision'
            ],
            care: [
                'Wear sunglasses to protect from UV rays',
                'Take regular breaks from screens (20-20-20 rule)',
                'Get regular eye exams',
                'Don\'t rub your eyes with dirty hands',
                'Ensure proper lighting when reading or working'
            ]
        },
        ears: {
            icon: '👂🏻',
            name: 'Ears',
            brief: 'The ears detect sound waves and help maintain balance and spatial orientation.',
            description: 'The ears are complex organs responsible for hearing and balance. They convert sound waves into electrical signals and contain structures that help maintain equilibrium.',
            facts: [
                'Can hear sounds from 20 Hz to 20,000 Hz',
                'Never stop hearing, even during sleep',
                'Earwax is actually beneficial and self-cleaning',
                'Inner ear contains the smallest bones in the body',
                'Ears continue growing throughout your life'
            ],
            functions: [
                'Detect and process sound waves',
                'Maintain balance and spatial orientation',
                'Filter and amplify important sounds',
                'Protect inner ear from loud noises'
            ],
            nutrition: [
                'Omega-3 fatty acids support inner ear health',
                'Magnesium may help prevent hearing loss',
                'Folate supports healthy blood flow to ears',
                'Limit caffeine which can worsen tinnitus',
                'Stay hydrated for proper ear function'
            ],
            disorders: [
                'Hearing loss can be temporary or permanent',
                'Tinnitus causes ringing or buzzing sounds',
                'Ear infections are common, especially in children',
                'Vertigo affects balance and causes dizziness'
            ],
            care: [
                'Protect ears from loud noises (use ear protection)',
                'Keep ears dry to prevent infections',
                'Don\'t insert objects into ear canal',
                'Clean ears gently with a washcloth',
                'Get hearing tested regularly, especially after age 50'
            ]
        },
        mouth: {
            icon: '👄',
            name: 'Mouth',
            brief: 'The mouth is the entry point for food and air, and plays a crucial role in digestion and communication.',
            description: 'The mouth is a complex cavity that begins the digestive process, enables speech, and serves as an alternative breathing pathway. It contains teeth, tongue, and salivary glands.',
            facts: [
                'Produces about 1-2 liters of saliva daily',
                'Contains over 700 species of bacteria',
                'Taste buds are replaced every 1-2 weeks',
                'Mouth heals faster than other parts of the body',
                'Saliva contains natural antibiotics'
            ],
            functions: [
                'Begins mechanical and chemical digestion',
                'Enables speech and communication',
                'Filters and warms air for breathing',
                'Produces saliva to aid digestion and oral health'
            ],
            nutrition: [
                'Limit sugary foods and drinks to prevent decay',
                'Eat calcium-rich foods for strong teeth',
                'Vitamin C supports healthy gums',
                'Drink plenty of water to maintain saliva production',
                'Avoid acidic foods that can erode enamel'
            ],
            disorders: [
                'Tooth decay is one of the most common diseases',
                'Gum disease can lead to tooth loss',
                'Dry mouth increases risk of dental problems',
                'Oral cancer can affect lips, tongue, or throat'
            ],
            care: [
                'Brush teeth twice daily with fluoride toothpaste',
                'Floss daily to remove plaque between teeth',
                'Use mouthwash to kill bacteria',
                'Visit dentist regularly for cleanings and checkups',
                'Don\'t use teeth as tools to open packages'
            ]
        },
        teeth: {
            icon: '🦷',
            name: 'Teeth',
            brief: 'Teeth are hard structures used for biting, chewing, and breaking down food for digestion.',
            description: 'Teeth are calcified structures that help break down food mechanically. Adults typically have 32 teeth of different types, each designed for specific functions in eating.',
            facts: [
                'Tooth enamel is the hardest substance in the human body',
                'Adults have 32 teeth, children have 20 baby teeth',
                'Teeth are unique like fingerprints',
                'Teeth can reveal information about age, diet, and health',
                'Wisdom teeth are evolutionary remnants'
            ],
            functions: [
                'Cut, tear, and grind food for easier digestion',
                'Support facial structure and appearance',
                'Enable clear speech and pronunciation',
                'Help maintain proper jaw alignment'
            ],
            nutrition: [
                'Calcium and phosphorus strengthen tooth enamel',
                'Vitamin D helps absorb calcium',
                'Limit sugary and acidic foods and drinks',
                'Cheese and milk neutralize mouth acids',
                'Crunchy fruits and vegetables clean teeth naturally'
            ],
            disorders: [
                'Cavities form when bacteria produce acid',
                'Gingivitis causes gum inflammation',
                'Tooth sensitivity can cause pain',
                'Bruxism (teeth grinding) can damage teeth'
            ],
            care: [
                'Brush with fluoride toothpaste twice daily',
                'Floss daily to remove plaque',
                'Use a soft-bristled toothbrush',
                'Replace toothbrush every 3-4 months',
                'See dentist every 6 months for cleanings'
            ]
        },
        tongue: {
            icon: '👅',
            name: 'Tongue',
            brief: 'The tongue is a muscular organ that enables taste, speech, and helps with eating and swallowing.',
            description: 'The tongue is a flexible muscular organ covered with taste buds. It plays essential roles in digestion, speech, and sensory perception of food.',
            facts: [
                'Contains about 10,000 taste buds',
                'Is the strongest muscle in the body relative to size',
                'Taste buds regenerate every 1-2 weeks',
                'Can detect five basic tastes: sweet, sour, salty, bitter, umami',
                'Tongue print is as unique as a fingerprint'
            ],
            functions: [
                'Detects taste and texture of food',
                'Helps with chewing and swallowing',
                'Essential for clear speech',
                'Assists in cleaning the mouth'
            ],
            nutrition: [
                'Stay hydrated to maintain taste sensitivity',
                'Zinc deficiency can affect taste',
                'Avoid very hot foods that can damage taste buds',
                'Limit alcohol and tobacco which dull taste',
                'Eat a variety of foods to stimulate taste buds'
            ],
            disorders: [
                'Geographic tongue causes map-like patches',
                'Oral thrush creates white patches',
                'Burning mouth syndrome causes pain',
                'Loss of taste can result from illness or medication'
            ],
            care: [
                'Brush or scrape tongue daily to remove bacteria',
                'Stay hydrated to prevent dry mouth',
                'Avoid tobacco and excessive alcohol',
                'Be gentle when cleaning to avoid injury',
                'See doctor if tongue changes color or texture'
            ]
        },
        liver: {
            icon: '🟤',
            name: 'Liver',
            brief: 'The liver is a vital organ that detoxifies the body, produces bile, and performs over 500 functions.',
            description: 'The liver is the largest internal organ and performs numerous vital functions including detoxification, protein synthesis, and bile production for digestion.',
            facts: [
                'Performs over 500 different functions',
                'Can regenerate itself if damaged',
                'Processes everything you eat, drink, or absorb',
                'Produces bile to help digest fats',
                'Stores vitamins, minerals, and energy'
            ],
            functions: [
                'Detoxifies harmful substances from blood',
                'Produces bile for fat digestion',
                'Stores glucose, vitamins, and minerals',
                'Synthesizes proteins and blood clotting factors'
            ],
            nutrition: [
                'Limit alcohol consumption to prevent damage',
                'Eat antioxidant-rich foods like berries',
                'Include healthy fats from nuts and fish',
                'Avoid processed foods high in additives',
                'Maintain a healthy weight'
            ],
            disorders: [
                'Fatty liver disease is increasingly common',
                'Hepatitis can cause liver inflammation',
                'Cirrhosis involves scarring of liver tissue',
                'Liver cancer can be primary or secondary'
            ],
            care: [
                'Limit alcohol intake or avoid completely',
                'Maintain a healthy diet and weight',
                'Get vaccinated against hepatitis A and B',
                'Avoid sharing needles or personal items',
                'Be cautious with medications and supplements'
            ]
        },
        stomach: {
            icon: '🫃',
            name: 'Stomach',
            brief: 'The stomach is a muscular sac that stores and digests food using acid and enzymes.',
            description: 'The stomach is a J-shaped muscular organ that temporarily stores food and begins protein digestion using gastric acid and enzymes.',
            facts: [
                'Can stretch to hold up to 4 liters of food',
                'Produces about 2-3 liters of gastric juice daily',
                'Stomach acid is strong enough to dissolve metal',
                'Stomach lining replaces itself every 3-5 days',
                'Can function normally with part of it removed'
            ],
            functions: [
                'Stores food temporarily after eating',
                'Produces acid and enzymes to digest proteins',
                'Churns food to mix with digestive juices',
                'Gradually releases food into small intestine'
            ],
            nutrition: [
                'Eat smaller, more frequent meals',
                'Avoid spicy, acidic, or fatty foods if sensitive',
                'Don\'t eat large meals before bedtime',
                'Stay hydrated but don\'t drink too much with meals',
                'Include probiotics for digestive health'
            ],
            disorders: [
                'Peptic ulcers can cause pain and bleeding',
                'GERD causes acid reflux and heartburn',
                'Gastritis involves stomach lining inflammation',
                'H. pylori bacteria can cause ulcers'
            ],
            care: [
                'Eat regular, balanced meals',
                'Manage stress which can increase acid production',
                'Avoid NSAIDs that can irritate stomach lining',
                'Don\'t smoke as it increases ulcer risk',
                'Seek treatment for persistent stomach pain'
            ]
        },
        kidneys: {
            icon: '🪸',
            name: 'Kidneys',
            brief: 'The kidneys filter waste and excess water from blood to produce urine.',
            description: 'The kidneys are bean-shaped organs that filter blood, remove waste products, regulate blood pressure, and maintain fluid balance in the body.',
            facts: [
                'Filter about 50 gallons of blood daily',
                'Each kidney contains about 1 million nephrons',
                'Can function normally with just one kidney',
                'Produce hormones that regulate blood pressure',
                'Help maintain proper pH balance in blood'
            ],
            functions: [
                'Filter waste products from blood',
                'Regulate water and electrolyte balance',
                'Control blood pressure through hormone production',
                'Maintain proper pH levels in blood'
            ],
            nutrition: [
                'Drink plenty of water to support kidney function',
                'Limit sodium to reduce blood pressure',
                'Moderate protein intake if you have kidney disease',
                'Eat potassium-rich foods like bananas',
                'Limit phosphorus if advised by doctor'
            ],
            disorders: [
                'Chronic kidney disease affects millions',
                'Kidney stones can cause severe pain',
                'Urinary tract infections can spread to kidneys',
                'High blood pressure can damage kidneys'
            ],
            care: [
                'Stay well hydrated with water',
                'Control blood pressure and diabetes',
                'Don\'t overuse pain medications',
                'Get regular check-ups including urine tests',
                'Maintain a healthy weight and exercise regularly'
            ]
        },
        hands: {
            icon: '🤲',
            name: 'Hands',
            brief: 'The hands are complex structures with bones, muscles, and nerves that enable precise movements.',
            description: 'The hands contain 27 bones, numerous muscles, tendons, and nerves that work together to provide incredible dexterity and strength for daily activities.',
            facts: [
                'Each hand has 27 bones, 29 joints, and 123 ligaments',
                'Contain about 17,000 touch receptors',
                'Fingernails grow about 3mm per month',
                'Can distinguish textures just 13 nanometers apart',
                'Dominant hand is usually 10% stronger'
            ],
            functions: [
                'Grasp and manipulate objects with precision',
                'Provide sensory feedback through touch',
                'Enable communication through gestures',
                'Support body weight and balance when needed'
            ],
            nutrition: [
                'Calcium and vitamin D for strong bones',
                'Omega-3 fatty acids reduce inflammation',
                'Vitamin C supports collagen production',
                'Protein helps maintain muscle mass',
                'Stay hydrated for joint lubrication'
            ],
            disorders: [
                'Arthritis causes joint pain and stiffness',
                'Carpal tunnel syndrome affects the wrist',
                'Trigger finger causes finger locking',
                'Fractures are common due to falls'
            ],
            care: [
                'Stretch and exercise hands regularly',
                'Take breaks from repetitive activities',
                'Use proper ergonomics when typing',
                'Protect hands when doing manual work',
                'Keep hands moisturized and clean'
            ]
        },
        spine: {
            icon: '🧿',
            name: 'Spine',
            brief: 'The spine is a column of vertebrae that protects the spinal cord and supports the body.',
            description: 'The spine consists of 33 vertebrae that protect the spinal cord, support body weight, and enable flexible movement while maintaining upright posture.',
            facts: [
                'Has 33 vertebrae: 7 cervical, 12 thoracic, 5 lumbar, 5 sacral, 4 coccygeal',
                'Contains 31 pairs of spinal nerves',
                'Natural curves help distribute weight',
                'Spinal cord is about 18 inches long',
                'Discs act as shock absorbers between vertebrae'
            ],
            functions: [
                'Protects the spinal cord and nerve roots',
                'Supports body weight and maintains posture',
                'Enables flexible movement in multiple directions',
                'Provides attachment points for muscles'
            ],
            nutrition: [
                'Calcium and vitamin D for strong bones',
                'Anti-inflammatory foods like fish and berries',
                'Maintain healthy weight to reduce spine stress',
                'Stay hydrated for disc health',
                'Magnesium helps with muscle function'
            ],
            disorders: [
                'Herniated discs can compress nerves',
                'Scoliosis causes abnormal spine curvature',
                'Osteoporosis weakens vertebrae',
                'Spinal stenosis narrows the spinal canal'
            ],
            care: [
                'Maintain good posture when sitting and standing',
                'Exercise regularly to strengthen core muscles',
                'Use proper lifting techniques',
                'Sleep on a supportive mattress',
                'Take breaks from prolonged sitting'
            ]
        },
        legs: {
            icon: '🦵🏻',
            name: 'Legs',
            brief: 'The legs are powerful limbs that support body weight and enable walking, running, and jumping.',
            description: 'The legs contain the largest bones and strongest muscles in the body, designed to support weight, provide mobility, and maintain balance.',
            facts: [
                'Contain the longest bone in the body (femur)',
                'Leg muscles are among the strongest in the body',
                'Can support several times your body weight',
                'Walking uses over 200 muscles',
                'Legs contain about 50% of total body muscle mass'
            ],
            functions: [
                'Support entire body weight during standing',
                'Enable locomotion through walking and running',
                'Provide stability and balance',
                'Generate power for jumping and climbing'
            ],
            nutrition: [
                'Protein for muscle maintenance and growth',
                'Calcium and vitamin D for bone health',
                'Potassium helps prevent muscle cramps',
                'Iron supports oxygen delivery to muscles',
                'Stay hydrated for optimal muscle function'
            ],
            disorders: [
                'Varicose veins affect blood circulation',
                'Shin splints cause pain in lower legs',
                'Blood clots can be dangerous if untreated',
                'Muscle strains and tears from overuse'
            ],
            care: [
                'Exercise regularly to maintain strength',
                'Stretch before and after physical activity',
                'Wear proper footwear for support',
                'Elevate legs when resting to improve circulation',
                'Maintain healthy weight to reduce joint stress'
            ]
        },
        bones: {
            icon: '🦴',
            name: 'Bones',
            brief: 'Bones form the skeletal system that provides structure, protects organs, and produces blood cells.',
            description: 'The skeletal system consists of 206 bones in adults that provide structural support, protect vital organs, store minerals, and produce blood cells in bone marrow.',
            facts: [
                'Adults have 206 bones, babies are born with about 270',
                'Bones are 5 times stronger than steel of same weight',
                'Bone tissue is constantly being renewed',
                'Femur is the longest and strongest bone',
                'Bones store 99% of the body\'s calcium'
            ],
            functions: [
                'Provide structural framework for the body',
                'Protect vital organs from injury',
                'Store calcium, phosphorus, and other minerals',
                'Produce blood cells in bone marrow'
            ],
            nutrition: [
                'Calcium from dairy products and leafy greens',
                'Vitamin D helps calcium absorption',
                'Vitamin K supports bone formation',
                'Magnesium works with calcium for bone health',
                'Limit caffeine and alcohol which can weaken bones'
            ],
            disorders: [
                'Osteoporosis makes bones weak and brittle',
                'Fractures can occur from trauma or weakness',
                'Arthritis affects joints between bones',
                'Osteomalacia causes soft, weak bones'
            ],
            care: [
                'Get regular weight-bearing exercise',
                'Ensure adequate calcium and vitamin D intake',
                'Don\'t smoke as it weakens bones',
                'Limit alcohol consumption',
                'Get bone density tests as recommended'
            ]
        }
    };
    
    return organDatabase[organName] || {
        icon: '❓',
        name: 'Unknown Organ',
        brief: 'Information not available',
        description: 'Detailed information not available',
        facts: ['No facts available'],
        functions: ['Functions not listed'],
        nutrition: ['No nutrition information available'],
        disorders: ['No disorder information available'],
        care: ['No care information available']
    };
}

// Quiz Section
function initializeQuiz() {
    const quizCards = document.querySelectorAll('.quiz-card');
    
    quizCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            startQuiz(category);
        });
    });
}

function startQuiz(category) {
    currentQuiz = getQuizData(category);
    currentQuestionIndex = 0;
    quizScore = 0;
    
    document.getElementById('quizSelection').classList.add('hidden');
    document.getElementById('quizGame').classList.remove('hidden');
    
    document.getElementById('quizTitle').textContent = currentQuiz.title;
    showQuestion();
}

function showQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('questionCounter').textContent = `${currentQuestionIndex + 1}/${currentQuiz.questions.length}`;
    
    const answersGrid = document.getElementById('answersGrid');
    answersGrid.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(index));
        answersGrid.appendChild(button);
    });
    
    updateQuizProgress();
    startQuizTimer();
}

function selectAnswer(selectedIndex) {
    const question = currentQuiz.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach((option, index) => {
        option.disabled = true;
        if (index === question.correct) {
            option.style.background = '#4CAF50';
        } else if (index === selectedIndex && index !== question.correct) {
            option.style.background = '#F44336';
        }
    });
    
    if (selectedIndex === question.correct) {
        quizScore++;
    }
    
    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuiz.questions.length) {
        showQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    document.getElementById('quizGame').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');
    
    const percentage = Math.round((quizScore / currentQuiz.questions.length) * 100);
    document.getElementById('scorePercentage').textContent = percentage + '%';
    document.getElementById('finalScore').textContent = quizScore;
    document.getElementById('totalQuestions').textContent = currentQuiz.questions.length;
    document.getElementById('correctAnswers').textContent = quizScore;
    document.getElementById('incorrectAnswers').textContent = currentQuiz.questions.length - quizScore;
    
    updateStats();
}

function getQuizData(category) {
    const quizDatabase = {
        nervous: {
            title: 'Nervous System Quiz',
            questions: [
                {
                    question: 'What is the main function of the brain?',
                    answers: ['Pump blood', 'Control body functions', 'Digest food', 'Filter air'],
                    correct: 1
                },
                {
                    question: 'How many neurons are in the human brain?',
                    answers: ['86 million', '86 billion', '86 thousand', '86 trillion'],
                    correct: 1
                }
            ]
        },
        circulatory: {
            title: 'Circulatory System Quiz',
            questions: [
                {
                    question: 'How many chambers does the heart have?',
                    answers: ['2', '3', '4', '5'],
                    correct: 2
                },
                {
                    question: 'What does the heart pump?',
                    answers: ['Air', 'Blood', 'Water', 'Food'],
                    correct: 1
                }
            ]
        }
    };
    
    return quizDatabase[category] || quizDatabase.nervous;
}

function updateQuizProgress() {
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    document.getElementById('quizProgressBar').style.width = progress + '%';
}

function startQuizTimer() {
    let timeLeft = 30;
    document.getElementById('quizTimer').textContent = timeLeft + 's';
    
    quizTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('quizTimer').textContent = timeLeft + 's';
        
        if (timeLeft <= 0) {
            clearInterval(quizTimer);
            nextQuestion();
        }
    }, 1000);
}

// Facts Section
function initializeFacts() {
    const factsGrid = document.getElementById('factsGrid');
    const facts = [
        { icon: '🫀', text: 'Your heart beats about 100,000 times per day' },
        { icon: '🧠', text: 'The brain uses 20% of your body\'s energy' },
        { icon: '🦴', text: 'You have 206 bones in your adult body' },
        { icon: '🫁', text: 'You take about 20,000 breaths per day' },
        { icon: '👁️', text: 'Your eyes can distinguish about 10 million colors' },
        { icon: '👂', text: 'Your ears never stop hearing, even when you sleep' }
    ];
    
    facts.forEach(fact => {
        const factCard = document.createElement('div');
        factCard.className = 'fact-card';
        factCard.innerHTML = `
            <div class="fact-icon">${fact.icon}</div>
            <p>${fact.text}</p>
        `;
        factsGrid.appendChild(factCard);
    });
}

// Anatomy Library
function initializeAnatomy() {
    const anatomyGrid = document.getElementById('anatomyGrid');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    const anatomyData = [
        { category: 'head', icon: '🧠', name: 'Brain', description: 'Controls all body functions and thoughts' },
        { category: 'head', icon: '👁️', name: 'Eyes', description: 'Organs of vision that detect light' },
        { category: 'chest', icon: '🫀', name: 'Heart', description: 'Pumps blood throughout the body' },
        { category: 'chest', icon: '🫁', name: 'Lungs', description: 'Exchange oxygen and carbon dioxide' },
        { category: 'abdomen', icon: '🫃', name: 'Stomach', description: 'Digests food and breaks it down' },
        { category: 'limbs', icon: '🦵', name: 'Legs', description: 'Support body weight and enable movement' }
    ];
    
    function renderAnatomy(filter = 'all') {
        anatomyGrid.innerHTML = '';
        
        anatomyData
            .filter(item => filter === 'all' || item.category === filter)
            .forEach(item => {
                const anatomyItem = document.createElement('div');
                anatomyItem.className = 'anatomy-item';
                anatomyItem.innerHTML = `
                    <h3>${item.icon} ${item.name}</h3>
                    <p>${item.description}</p>
                `;
                anatomyGrid.appendChild(anatomyItem);
            });
    }
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            renderAnatomy(category);
        });
    });
    
    renderAnatomy();
}

// Update user stats
function updateStats() {
    if (currentUser) {
        currentUser.progress = Math.min(currentUser.progress + 5, 100);
        document.getElementById('userProgress').textContent = currentUser.progress + '%';
        
        const quizzesCompleted = parseInt(document.getElementById('quizzesCompleted').textContent) + 1;
        document.getElementById('quizzesCompleted').textContent = quizzesCompleted;
        
        const factsLearned = parseInt(document.getElementById('factsLearned').textContent) + 2;
        document.getElementById('factsLearned').textContent = factsLearned;
        
        const achievements = parseInt(document.getElementById('achievementsEarned').textContent) + 1;
        document.getElementById('achievementsEarned').textContent = achievements;
    }
}