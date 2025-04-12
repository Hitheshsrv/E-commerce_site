require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/project');

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

const projectKits = [
    {
        title: 'Racing Drone Kit',
        description: 'High-performance FPV racing drone kit with carbon fiber frame, powerful motors, and HD camera. Perfect for learning drone building and racing.',
        price: 15999,
        imagePath: 'https://i.imgur.com/Zz4ysHb.jpg',
        projectCode: 'PROJ106',
        category: 'drones',
        difficulty: 'intermediate',
        components: [
            { name: 'Carbon Fiber Frame (5-inch)', quantity: 1 },
            { name: 'Brushless Motors (2300KV)', quantity: 4 },
            { name: 'ESC 30A', quantity: 4 },
            { name: 'Flight Controller F4', quantity: 1 },
            { name: 'FPV Camera HD', quantity: 1 },
            { name: 'Video Transmitter', quantity: 1 },
            { name: 'Propellers Set', quantity: 4 },
            { name: 'LiPo Battery 4S', quantity: 1 },
            { name: 'Power Distribution Board', quantity: 1 }
        ],
        skills: ['Drone Assembly', 'Soldering', 'Flight Controller Setup', 'FPV System Configuration'],
        duration: '5-7 hours',
        documentation: 'https://docs.taskntrade.in/projects/racing-drone',
        manufacturer: 'TaskNTrade',
        available: true
    },
    {
        title: 'Arduino Robot Car Kit',
        description: 'Complete DIY robot car kit with Arduino UNO, motors, wheels, chassis, and sensors. Perfect for learning robotics and programming.',
        price: 2999,
        imagePath: 'https://i.imgur.com/i4eouhd.jpg',
        projectCode: 'PROJ101',
        category: 'robotics',
        difficulty: 'beginner',
        components: [
            { name: 'Arduino UNO', quantity: 1 },
            { name: 'DC Motors', quantity: 4 },
            { name: 'Wheels', quantity: 4 },
            { name: 'Chassis', quantity: 1 },
            { name: 'Ultrasonic Sensor', quantity: 1 },
            { name: 'Motor Driver', quantity: 1 }
        ],
        skills: ['Arduino Programming', 'Basic Electronics', 'Robot Assembly'],
        duration: '4-6 hours',
        documentation: 'https://docs.taskntrade.in/projects/arduino-robot-car',
        manufacturer: 'TaskNTrade',
        available: true
    },
    {
        title: 'Line Follower Robot Kit',
        description: 'Build your own line following robot. Includes IR sensors, Arduino Nano, motors, and chassis. Great for beginners in robotics.',
        price: 5999,
        imagePath: 'https://i.imgur.com/EIDCJC1.jpg',
        projectCode: 'PROJ102',
        category: 'robotics',
        difficulty: 'beginner',
        components: [
            { name: 'Arduino Nano', quantity: 1 },
            { name: 'IR Sensors', quantity: 5 },
            { name: 'DC Motors', quantity: 2 },
            { name: 'Chassis', quantity: 1 },
            { name: 'Motor Driver', quantity: 1 }
        ],
        skills: ['Arduino Programming', 'Sensor Calibration', 'Robot Assembly'],
        duration: '3-4 hours',
        documentation: 'https://docs.taskntrade.in/projects/line-follower',
        manufacturer: 'TaskNTrade',
        available: true
    },
    {
        title: 'IoT Home Automation Kit',
        description: 'Complete home automation kit with ESP32, relays, sensors, and mobile app. Control lights, fans, and appliances from your phone.',
        price: 4999,
        imagePath: 'https://i.imgur.com/BMp78Sr.jpg',
        projectCode: 'PROJ103',
        category: 'iot',
        difficulty: 'intermediate',
        components: [
            { name: 'ESP32 Board', quantity: 1 },
            { name: 'Relay Module', quantity: 4 },
            { name: 'DHT11 Sensor', quantity: 1 },
            { name: 'Motion Sensor', quantity: 1 },
            { name: 'Power Supply', quantity: 1 }
        ],
        skills: ['ESP32 Programming', 'IoT Protocols', 'Mobile App Development'],
        duration: '6-8 hours',
        documentation: 'https://docs.taskntrade.in/projects/home-automation',
        manufacturer: 'TaskNTrade',
        available: true
    },
    {
        title: 'Weather Station Kit',
        description: 'Build your own weather monitoring station. Includes temperature, humidity, pressure sensors, and LCD display with NodeMCU.',
        price: 3999,
        imagePath: 'https://i.imgur.com/MGTGF5L.jpg',
        projectCode: 'PROJ104',
        category: 'iot',
        difficulty: 'intermediate',
        components: [
            { name: 'NodeMCU', quantity: 1 },
            { name: 'BME280 Sensor', quantity: 1 },
            { name: 'LCD Display', quantity: 1 },
            { name: 'Rain Sensor', quantity: 1 }
        ],
        skills: ['NodeMCU Programming', 'Sensor Integration', 'Data Logging'],
        duration: '4-5 hours',
        documentation: 'https://docs.taskntrade.in/projects/weather-station',
        manufacturer: 'TaskNTrade',
        available: true
    },
    {
        title: 'Smart Plant Watering System',
        description: 'Automated plant watering system with soil moisture sensors, water pump, and Arduino. Keep your plants healthy automatically.',
        price: 2999,
        imagePath: 'https://i.imgur.com/MGTGF5L.jpg',
        projectCode: 'PROJ105',
        category: 'iot',
        difficulty: 'beginner',
        components: [
            { name: 'Arduino Nano', quantity: 1 },
            { name: 'Soil Moisture Sensor', quantity: 2 },
            { name: 'Water Pump', quantity: 1 },
            { name: 'Relay Module', quantity: 1 }
        ],
        skills: ['Arduino Programming', 'Sensor Calibration', 'Basic Electronics'],
        duration: '2-3 hours',
        documentation: 'https://docs.taskntrade.in/projects/smart-plant',
        manufacturer: 'TaskNTrade',
        available: true
    }
];

async function seedProjects() {
    try {
        // Clear existing projects
        await Project.deleteMany({});
        console.log('Cleared existing projects');

        // Add new projects
        await Project.insertMany(projectKits);
        console.log('Added new projects successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding projects:', error);
        process.exit(1);
    }
}

seedProjects(); 