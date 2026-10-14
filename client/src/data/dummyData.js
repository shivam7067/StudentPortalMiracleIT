// Rich dummy data for MiracleIT Student Portal

export const currentStudent = {
  id: "MIT-2026-0842",
  name: "Priya Sundaram",
  email: "priya.sundaram@miracleit.edu",
  phone: "+91 98765 43210",
  batch: "MIRACLE-2026-MERN-02",
  course: "MERN Stack Development",
  rollNo: "MIT-0842",
  joinDate: "Jan 15, 2026",
  validTill: "Jan 14, 2027",
  bloodGroup: "O+",
  dob: "14 Aug 2003",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  bio: "Passionate full-stack developer in training. Focused on React 19, Node.js microservices, and high-performance cloud applications.",
  github: "https://github.com/priyasundaram",
  linkedin: "https://linkedin.com/in/priyasundaram",
  portfolio: "https://priyasundaram.dev",
  address: "Indiranagar, Bengaluru, Karnataka, 560038",
  skills: [
    { name: "JavaScript / ES6+", level: 90 },
    { name: "React.js", level: 88 },
    { name: "Node.js & Express", level: 82 },
    { name: "MongoDB & Mongoose", level: 85 },
    { name: "Data Structures & Algorithms", level: 78 },
    { name: "Tailwind CSS", level: 92 },
    { name: "Git & GitHub", level: 86 }
  ],
  stats: {
    attendance: 96.4,
    dsaSolved: 184,
    assignmentsSubmitted: 18,
    assignmentsTotal: 19,
    examsGiven: 6,
    avgScore: 92.5,
    streak: 34,
    rank: 3,
    totalPoints: 3420,
    certCount: 2
  }
};

export const dashboardOverview = {
  announcementsCount: 4,
  pendingAssignments: 1,
  upcomingExamDays: 3,
  hiringDrivesActive: 8,
  recentActivities: [
    { id: 1, type: "assignment", text: "Submitted 'E-Commerce Cart State Reducer'", time: "2 hours ago", status: "Under Review" },
    { id: 2, type: "code", text: "Solved LeetCode #206: Reverse Linked List", time: "5 hours ago", status: "Success" },
    { id: 3, type: "exam", text: "Completed 'Node.js Event Loop & Streams Assessment'", time: "Yesterday", status: "Score: 94%" },
    { id: 4, type: "mentor", text: "1-on-1 Architecture Session with Mentor Arpan", time: "2 days ago", status: "Completed" }
  ],
  weeklySchedule: [
    { day: "Monday", class: "Advanced React Context & useReducer", time: "10:00 AM - 12:30 PM", mentor: "Arpan Sen", link: "https://meet.google.com" },
    { day: "Tuesday", class: "DSA: Dynamic Programming Part II", time: "02:00 PM - 04:30 PM", mentor: "Neha Sharma", link: "https://meet.google.com" },
    { day: "Wednesday", class: "Express Middleware & JWT Security", time: "10:00 AM - 12:30 PM", mentor: "Arpan Sen", link: "https://meet.google.com" },
    { day: "Thursday", class: "Live Coding Lab & PR Code Pairing", time: "03:00 PM - 05:30 PM", mentor: "Karthik Verma", link: "https://meet.google.com" },
    { day: "Friday", class: "System Design: Scaling Redis & Mongo", time: "11:00 AM - 01:00 PM", mentor: "Vikram Roy", link: "https://meet.google.com" }
  ]
};

export const codingProblems = [
  {
    id: "prob-1",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array & Hash Map",
    acceptance: "49.8%",
    solved: true,
    starterCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ]
  },
  {
    id: "prob-2",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    acceptance: "34.2%",
    solved: true,
    starterCode: `function lengthOfLongestSubstring(s) {
  let set = new Set();
  let left = 0, maxLength = 0;
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}`,
    description: "Given a string `s`, find the length of the longest substring without duplicate characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3" },
      { input: 's = "bbbbb"', output: "1" }
    ]
  },
  {
    id: "prob-3",
    title: "LRU Cache Implementation",
    difficulty: "Hard",
    category: "Design & Hash Map",
    acceptance: "41.5%",
    solved: false,
    starterCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
  }
}`,
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    examples: [
      { input: "LRUCache(2); put(1, 1); put(2, 2); get(1); put(3, 3); get(2);", output: "[null, null, null, 1, null, -1]" }
    ]
  },
  {
    id: "prob-4",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    category: "Trees",
    acceptance: "32.8%",
    solved: true,
    starterCode: `function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}`,
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    examples: [
      { input: "root = [2,1,3]", output: "true" }
    ]
  }
];

export const examsData = [
  {
    id: "exam-101",
    title: "MERN Stack Sprint 3 Mid-Term Assessment",
    subject: "Full Stack Engineering",
    type: "Coding + Proctored MCQ",
    date: "Oct 12, 2026",
    time: "11:00 AM - 01:30 PM",
    duration: "150 Mins",
    totalMarks: 100,
    status: "Upcoming",
    instructions: "Strict fullscreen proctoring enabled. Covers React 19 hooks, Node event loop, and MongoDB aggregation pipelines."
  },
  {
    id: "exam-102",
    title: "DSA Diagnostic Test: Trees & Graphs",
    subject: "Data Structures",
    type: "Timed Algorithms",
    date: "Oct 20, 2026",
    time: "03:00 PM - 05:00 PM",
    duration: "120 Mins",
    totalMarks: 100,
    status: "Upcoming",
    instructions: "3 algorithmic coding questions with hidden stress test cases."
  },
  {
    id: "exam-99",
    title: "Frontend Architecture & Web Vitals Test",
    subject: "React & Performance",
    type: "Coding & Architecture",
    date: "Sep 28, 2026",
    duration: "90 Mins",
    totalMarks: 100,
    scoredMarks: 94,
    status: "Completed",
    percentile: "Top 4%"
  },
  {
    id: "exam-98",
    title: "Database Indexing & Query Optimization",
    subject: "MongoDB & SQL",
    type: "Practical Lab Exam",
    date: "Sep 14, 2026",
    duration: "120 Mins",
    totalMarks: 100,
    scoredMarks: 91,
    status: "Completed",
    percentile: "Top 8%"
  }
];

export const assignmentsData = [
  {
    id: "asg-1",
    title: "Authentication Microservice with JWT & Refresh Tokens",
    subject: "Backend Security",
    deadline: "Tomorrow at 11:59 PM",
    maxMarks: 50,
    status: "Pending Submission",
    assignedDate: "Oct 01, 2026",
    description: "Build an express service with secure httpOnly cookie authentication, rate limiting, and bcrypt password hashing.",
    requirements: ["Dockerized MongoDB setup", "Access token rotation mechanism", "Jest unit test coverage > 80%"]
  },
  {
    id: "asg-2",
    title: "Real-time Chat Engine with WebSockets & Redis Pub/Sub",
    subject: "System Architecture",
    deadline: "Oct 18, 2026",
    maxMarks: 50,
    status: "In Progress",
    assignedDate: "Oct 04, 2026",
    description: "Implement scalable bi-directional communication with typing indicators, offline notifications, and room isolation."
  },
  {
    id: "asg-3",
    title: "E-Commerce Cart State Reducer & Local Storage Sync",
    subject: "React Fundamentals",
    deadline: "Submitted",
    maxMarks: 50,
    obtainedMarks: 48,
    status: "Graded",
    assignedDate: "Sep 22, 2026",
    mentorFeedback: "Exceptional code readability and immaculate TypeScript types. Minor note on handling edge case when coupon expires."
  },
  {
    id: "asg-4",
    title: "Responsive Dashboard Layout with Tailwind CSS",
    subject: "UI / UX Engineering",
    deadline: "Submitted",
    maxMarks: 50,
    obtainedMarks: 50,
    status: "Graded",
    assignedDate: "Sep 15, 2026",
    mentorFeedback: "Pixel-perfect implementation! Great attention to mobile drawer gestures."
  }
];

export const attendanceRecords = {
  overallPercentage: 96.4,
  totalSessions: 112,
  presentSessions: 108,
  absentSessions: 4,
  subjects: [
    { name: "React 19 & Next.js", total: 32, attended: 31, percentage: 96.8 },
    { name: "Node.js & Backend Architecture", total: 30, attended: 29, percentage: 96.6 },
    { name: "Database Engineering (Mongo/Postgres)", total: 24, attended: 23, percentage: 95.8 },
    { name: "Data Structures & Algorithms", total: 26, attended: 25, percentage: 96.1 }
  ],
  monthlyLog: [
    { date: "Oct 04, 2026", subject: "Node.js Streams", status: "Present", duration: "2.5 hrs" },
    { date: "Oct 03, 2026", subject: "DSA: Graphs DFS & BFS", status: "Present", duration: "2.5 hrs" },
    { date: "Oct 02, 2026", subject: "React Server Components", status: "Present", duration: "2.0 hrs" },
    { date: "Oct 01, 2026", subject: "Live Code Pairing Lab", status: "Present", duration: "3.0 hrs" },
    { date: "Sep 30, 2026", subject: "MongoDB Query Aggregation", status: "Absent", duration: "2.5 hrs", reason: "Medical leave approved" },
    { date: "Sep 29, 2026", subject: "Express Routing & Middleware", status: "Present", duration: "2.5 hrs" }
  ]
};

export const timetableSchedule = [
  { day: "Monday", time: "10:00 AM - 12:30 PM", subject: "Advanced React Context & Custom Hooks", room: "Lab Room Alpha", mentor: "Arpan Sen", type: "Lecture" },
  { day: "Monday", time: "02:00 PM - 04:30 PM", subject: "DSA Lab: Two Pointers & Binary Search", room: "Terminal Hub 3", mentor: "Neha Sharma", type: "Hands-on Lab" },
  { day: "Tuesday", time: "10:00 AM - 12:30 PM", subject: "Node.js Cluster & Worker Threads", room: "Lab Room Beta", mentor: "Arpan Sen", type: "Lecture" },
  { day: "Tuesday", time: "03:00 PM - 05:00 PM", subject: "1-on-1 Mentor Reviews & PR Feedback", room: "Mentor Lounge", mentor: "Karthik Verma", type: "Mentorship" },
  { day: "Wednesday", time: "10:00 AM - 12:30 PM", subject: "MongoDB Schema Design & Sharding", room: "Lab Room Alpha", mentor: "Vikram Roy", type: "Lecture" },
  { day: "Wednesday", time: "02:00 PM - 04:30 PM", subject: "Live Coding Kata & Speed Drills", room: "Virtual Arena", mentor: "Neha Sharma", type: "Challenge" },
  { day: "Thursday", time: "11:00 AM - 01:30 PM", subject: "Dockerizing Full Stack Web Applications", room: "DevOps Sandbox", mentor: "Arpan Sen", type: "Workshop" },
  { day: "Friday", time: "10:00 AM - 12:30 PM", subject: "Weekly Module Examination & Retrospective", room: "Exam Hall Pro", mentor: "Staff Committee", type: "Assessment" }
];

export const certificatesData = [
  {
    id: "CERT-MIT-9082",
    title: "Certified MERN Stack Developer (Level 1)",
    issuedTo: "Priya Sundaram",
    issueDate: "Aug 20, 2026",
    verificationUrl: "https://miracleit.edu/verify/CERT-MIT-9082",
    skills: ["React.js", "Express.js", "MongoDB", "Node.js", "REST APIs"],
    grade: "Distinction (95%)",
    status: "Verified & Issued"
  },
  {
    id: "CERT-MIT-8841",
    title: "Algorithmic Problem Solving & DSA Specialist",
    issuedTo: "Priya Sundaram",
    issueDate: "Sep 15, 2026",
    verificationUrl: "https://miracleit.edu/verify/CERT-MIT-8841",
    skills: ["Data Structures", "Recursion", "Dynamic Programming", "Time Complexity Analysis"],
    grade: "Grade A",
    status: "Verified & Issued"
  }
];

export const placementDrives = [
  {
    id: "drive-1",
    company: "CloudScale Technologies",
    role: "Full Stack Engineer (MERN)",
    ctc: "8.5 - 12 LPA",
    location: "Bengaluru / Hybrid",
    eligibility: "Attendance > 85% & Avg Score > 80%",
    status: "Shortlisted for Round 2",
    deadline: "Oct 15, 2026",
    interviewDate: "Oct 18, 2026",
    rounds: ["Resume Screen (Passed)", "DSA Coding Assessment (Passed)", "System Design Round (Scheduled)", "HR Culture Fit"]
  },
  {
    id: "drive-2",
    company: "FinNexus Systems",
    role: "Backend Node.js Engineer",
    ctc: "9 - 14 LPA",
    location: "Hyderabad / On-site",
    eligibility: "Attendance > 80%",
    status: "Applied",
    deadline: "Oct 20, 2026",
    interviewDate: "TBA",
    rounds: ["Online Assessment", "Technical Interview", "Director Round"]
  },
  {
    id: "drive-3",
    company: "ApexData AI",
    role: "Frontend Engineer (React 19)",
    ctc: "10 - 15 LPA",
    location: "Pune / Remote",
    eligibility: "Completed Capstone Project",
    status: "Eligible to Apply",
    deadline: "Oct 25, 2026",
    interviewDate: "TBA",
    rounds: ["Machine Coding Round", "React Internals Deep Dive", "Founder Round"]
  },
  {
    id: "drive-4",
    company: "HyperLogic Software",
    role: "Software Development Engineer - 1",
    ctc: "8 - 11 LPA",
    location: "Gurugram / Hybrid",
    eligibility: "Attendance > 85%",
    status: "Eligible to Apply",
    deadline: "Oct 30, 2026",
    interviewDate: "TBA",
    rounds: ["Aptitude + DSA Screen", "System Architecture", "HR Round"]
  }
];

export const announcementsData = [
  {
    id: "ann-1",
    title: "MiracleIT Inter-Batch Hackathon 2026 Announced!",
    category: "Hackathon",
    date: "Today, 09:30 AM",
    urgent: true,
    content: "Registrations are now open for the 48-Hour Full-Stack Hackathon. Winner gets direct interview placement with Top Tier partner companies and ₹1,50,000 cash prize."
  },
  {
    id: "ann-2",
    title: "Special Masterclass on Next.js 15 App Router & Server Actions",
    category: "Masterclass",
    date: "Yesterday",
    urgent: false,
    content: "Join Staff Engineer Rohan Bose from HyperScale on Saturday 05:00 PM for an exclusive session on server side rendering and streaming architectures."
  },
  {
    id: "ann-3",
    title: "Mid-Term Examination Schedule Released for Batch MERN-02",
    category: "Exams",
    date: "Oct 02, 2026",
    urgent: true,
    content: "The exams portal will open on Oct 12th. Please review system compatibility and ensure webcam/microphone access is tested."
  },
  {
    id: "ann-4",
    title: "Campus Placement Drive with CloudScale Technologies",
    category: "Placement",
    date: "Sep 29, 2026",
    urgent: false,
    content: "Eligible students have been notified via the Placement Portal tab. Check your application tracker for Round 2 schedule."
  }
];

export const doubtsThreads = [
  {
    id: "dbt-1",
    question: "Why does useEffect trigger twice in React 18/19 Strict Mode during development?",
    subject: "React Internals",
    askedBy: "Priya Sundaram",
    date: "3 hours ago",
    status: "Answered",
    replies: [
      {
        author: "Arpan Sen (Lead Mentor)",
        role: "Mentor",
        content: "In development mode with StrictMode enabled, React purposefully unmounts and remounts components once to help you identify side-effects that are missing cleanup routines (like unsubscribing from event listeners or aborting fetch requests). In production, it only mounts once!"
      }
    ]
  },
  {
    id: "dbt-2",
    question: "Difference between process.nextTick() and setImmediate() in the Node.js event loop?",
    subject: "Node.js Runtime",
    askedBy: "Priya Sundaram",
    date: "Yesterday",
    status: "Answered",
    replies: [
      {
        author: "Vikram Roy (Mentor)",
        role: "Mentor",
        content: "process.nextTick() queues callbacks in the microtask queue that fires immediately after the current operation finishes before the event loop continues to the next phase. setImmediate() is queued in the Check phase of the event loop after I/O callbacks."
      }
    ]
  },
  {
    id: "dbt-3",
    question: "Best index strategy for compound queries filtering by user_id and sorting by createdAt?",
    subject: "MongoDB",
    askedBy: "Priya Sundaram",
    date: "2 days ago",
    status: "Open",
    replies: []
  }
];

export const mentorsData = [
  {
    id: "mentor-1",
    name: "Arpan Sen",
    role: "Principal Full Stack Architect",
    company: "Ex-Amazon, MiracleIT Lead",
    speciality: "React, Node.js, Distributed Systems",
    rating: 4.95,
    sessionsTaken: 340,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    availableSlots: ["Today 04:30 PM", "Tomorrow 11:00 AM", "Thursday 03:00 PM"]
  },
  {
    id: "mentor-2",
    name: "Neha Sharma",
    role: "Senior Competitive Programmer",
    company: "Google Code Jam Finalist",
    speciality: "Data Structures, Dynamic Programming, Graphs",
    rating: 4.92,
    sessionsTaken: 290,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    availableSlots: ["Tomorrow 02:00 PM", "Friday 04:00 PM"]
  },
  {
    id: "mentor-3",
    name: "Karthik Verma",
    role: "Engineering Director",
    company: "Tech Lead at Fintech Unicorn",
    speciality: "System Design, Microservices, Cloud DevOps",
    rating: 4.88,
    sessionsTaken: 210,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    availableSlots: ["Thursday 05:00 PM", "Saturday 10:00 AM"]
  }
];

export const leaderboardData = [
  { rank: 1, name: "Kunal Mehra", batch: "MIRACLE-MERN-02", points: 3890, streak: 45, problems: 240, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
  { rank: 2, name: "Aarav Gupta", batch: "MIRACLE-MERN-02", points: 3640, streak: 41, problems: 215, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80" },
  { rank: 3, name: "Priya Sundaram", batch: "MIRACLE-MERN-02", points: 3420, streak: 34, problems: 184, isCurrentUser: true, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" },
  { rank: 4, name: "Rohan Varma", batch: "MIRACLE-MERN-02", points: 3190, streak: 28, problems: 172, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80" },
  { rank: 5, name: "Sneha Nair", batch: "MIRACLE-MERN-02", points: 3050, streak: 26, problems: 160, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" }
];

export const goalsData = [
  { id: 1, title: "Solve 200 DSA Problems on Portal IDE", current: 184, target: 200, category: "Algorithms", deadline: "Oct 20, 2026", completed: false },
  { id: 2, title: "Maintain 95%+ Overall Attendance for Placements", current: 96.4, target: 95, category: "Discipline", deadline: "Ongoing", completed: true },
  { id: 3, title: "Complete Full Stack Capstone & Deploy on AWS", current: 80, target: 100, category: "Engineering", deadline: "Nov 01, 2026", completed: false },
  { id: 4, title: "Crack 5 Technical Mock Interviews with Mentors", current: 3, target: 5, category: "Placements", deadline: "Oct 31, 2026", completed: false }
];

export const projectsData = [
  {
    id: "proj-1",
    title: "DevForge — Collaborative Real-Time Code Sandbox",
    description: "Multi-tenant cloud IDE with Dockerized container execution, WebSockets cursor presence, and GitHub gist syncing.",
    tags: ["React 19", "Node.js", "Docker", "WebSockets", "Tailwind CSS"],
    status: "Under Mentor Review",
    score: "96 / 100",
    repoUrl: "https://github.com/priyasundaram/devforge",
    liveUrl: "https://devforge-sandbox.demo.app",
    feedback: "High quality container sandboxing. Outstanding architecture and responsive frontend."
  },
  {
    id: "proj-2",
    title: "FinPulse — Personal Wealth & Stock Analytics Dashboard",
    description: "Financial tracker analyzing portfolio volatility, automated tax calculations, and real-time stock ticker graphs.",
    tags: ["React", "Express", "MongoDB", "Chart.js", "AlphaVantage API"],
    status: "Completed",
    score: "94 / 100",
    repoUrl: "https://github.com/priyasundaram/finpulse",
    liveUrl: "https://finpulse-analytics.demo.app",
    feedback: "Super clean database index strategy for high volume historical price queries."
  },
  {
    id: "proj-3",
    title: "NeuroDoc — AI Medical Assistant & Appointment Booking",
    description: "Healthcare appointment portal with symptom triage assistant built using OpenAI LLM function calling.",
    tags: ["Next.js", "TypeScript", "FastAPI", "Tailwind CSS"],
    status: "In Development",
    score: "Pending",
    repoUrl: "https://github.com/priyasundaram/neurodoc",
    liveUrl: "#"
  }
];
