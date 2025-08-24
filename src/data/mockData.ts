import type {
  Article,
  Diamond,
  Product,
  User,
  ValuationRequest,
} from "../types";

// Sample Users with Passwords
export const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "customer@diamond.com",
    password: "customer123",
    role: "customer",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "consulting@diamond.com",
    password: "consulting123",
    role: "consulting_staff",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "3",
    name: "Dr. Robert Johnson",
    email: "valuation@diamond.com",
    password: "valuation123",
    role: "valuation_staff",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "manager@diamond.com",
    password: "manager123",
    role: "manager",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "admin@diamond.com",
    password: "admin123",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
];

// Sample Diamonds
export const diamonds: Diamond[] = [
  {
    id: "1",
    name: "Brilliant Star Diamond",
    price: 15000,
    origin: "South Africa",
    shape: "Round",
    caratWeight: 1.5,
    color: "D",
    clarity: "VVS1",
    cut: "Excellent",
    proportions: "Ideal",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    measurements: {
      length: 7.4,
      width: 7.4,
      depth: 4.5,
    },
    certificateNumber: "GIA12345678",
    images: [
      "https://images.unsplash.com/photo-1600267185393-e158a98703de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlhbW9uZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1599707367072-cd6ada2d013e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlhbW9uZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "This exceptional round brilliant diamond features outstanding fire and brilliance. With D color and VVS1 clarity, it represents the pinnacle of diamond quality.",
    featured: true,
  },
  {
    id: "2",
    name: "Azure Princess Cut",
    price: 12800,
    origin: "Russia",
    shape: "Princess",
    caratWeight: 1.2,
    color: "E",
    clarity: "VS1",
    cut: "Excellent",
    proportions: "Very Good",
    polish: "Excellent",
    symmetry: "Very Good",
    fluorescence: "Faint",
    measurements: {
      length: 6.5,
      width: 6.5,
      depth: 4.7,
    },
    certificateNumber: "GIA87654321",
    images: [
      "https://images.unsplash.com/photo-1615655239312-c2f43cc4902f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlhbW9uZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZGlhbW9uZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "This stunning princess cut diamond showcases exceptional brilliance and fire. Its precise cut maximizes light performance, creating a mesmerizing display.",
    featured: true,
  },
  {
    id: "3",
    name: "Emerald Elegance",
    price: 18500,
    origin: "Botswana",
    shape: "Emerald",
    caratWeight: 2.0,
    color: "F",
    clarity: "VS2",
    cut: "Very Good",
    proportions: "Excellent",
    polish: "Very Good",
    symmetry: "Excellent",
    fluorescence: "None",
    measurements: {
      length: 8.5,
      width: 6.2,
      depth: 4.3,
    },
    certificateNumber: "GIA24681012",
    images: [
      "https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGlhbW9uZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRpYW1vbmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "This sophisticated emerald cut diamond offers elegant step facets that create a hall-of-mirrors effect. Its clarity is emphasized by the open table, showcasing remarkable transparency.",
    featured: false,
  },
  {
    id: "4",
    name: "Oval Splendor",
    price: 21000,
    origin: "Australia",
    shape: "Oval",
    caratWeight: 1.8,
    color: "D",
    clarity: "IF",
    cut: "Excellent",
    proportions: "Ideal",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    measurements: {
      length: 9.1,
      width: 6.4,
      depth: 4.0,
    },
    certificateNumber: "GIA13579246",
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRpYW1vbmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGRpYW1vbmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "This flawless oval diamond represents the pinnacle of diamond perfection. With no inclusions or blemishes even under 10x magnification, it offers incomparable brilliance.",
    featured: true,
  },
];

// Sample Valuation Requests
export const valuationRequests: ValuationRequest[] = [
  {
    id: "1",
    customerId: "1",
    customerName: "John Doe",
    status: "submitted",
    createdAt: "2025-08-01T10:30:00Z",
    updatedAt: "2025-08-01T10:30:00Z",
    diamondDetails: {
      shape: "Round",
      caratWeight: 1.25,
      color: "G",
      clarity: "VS2",
    },
  },
  {
    id: "2",
    customerId: "1",
    customerName: "John Doe",
    status: "consulting",
    createdAt: "2025-07-28T14:20:00Z",
    updatedAt: "2025-07-29T09:15:00Z",
    diamondDetails: {
      shape: "Pear",
      caratWeight: 0.9,
      color: "F",
      clarity: "VVS2",
    },
    assignedTo: "2",
  },
  {
    id: "3",
    customerId: "1",
    customerName: "John Doe",
    status: "received",
    createdAt: "2025-07-22T11:45:00Z",
    updatedAt: "2025-07-24T16:30:00Z",
    diamondDetails: {
      shape: "Cushion",
      caratWeight: 2.1,
      color: "E",
      clarity: "SI1",
    },
    assignedTo: "2",
    receiptNumber: "REC-20250724-003",
  },
  {
    id: "4",
    customerId: "1",
    customerName: "John Doe",
    status: "in_valuation",
    createdAt: "2025-07-15T09:10:00Z",
    updatedAt: "2025-07-28T14:20:00Z",
    diamondDetails: {
      shape: "Emerald",
      caratWeight: 1.75,
      color: "D",
      clarity: "FL",
    },
    assignedTo: "3",
    receiptNumber: "REC-20250715-001",
  },
  {
    id: "5",
    customerId: "1",
    customerName: "John Doe",
    status: "completed",
    createdAt: "2025-07-01T13:20:00Z",
    updatedAt: "2025-07-05T10:45:00Z",
    diamondDetails: {
      shape: "Oval",
      caratWeight: 1.3,
      color: "H",
      clarity: "VS1",
    },
    assignedTo: "3",
    receiptNumber: "REC-20250701-005",
    certificateUrl: "/certificates/cert-5.pdf",
  },
];

// Sample Products (for e-commerce)
export const products: Product[] = [
  {
    id: "1",
    name: "Classic Solitaire Diamond Ring",
    price: 5999,
    category: "Rings",
    description:
      "A timeless classic featuring a stunning round brilliant diamond set in 18k white gold.",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlhbW9uZCUyMHJpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlhbW9uZCUyMHJpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    ],
    inStock: true,
    featured: true,
    diamondDetails: {
      shape: "Round",
      caratWeight: 1.0,
      color: "F",
      clarity: "VS1",
      cut: "Excellent",
    },
  },
  {
    id: "2",
    name: "Halo Diamond Pendant",
    price: 3299,
    category: "Pendants",
    description:
      "Elegant pendant featuring a round center diamond surrounded by a halo of smaller diamonds, set in 14k rose gold.",
    images: [
      "https://images.unsplash.com/photo-1561828995-aa79a2db86dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlhbW9uZCUyMG5lY2tsYWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1561828995-aa79a2db86dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlhbW9uZCUyMG5lY2tsYWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    ],
    inStock: true,
    featured: false,
    diamondDetails: {
      shape: "Round",
      caratWeight: 0.75,
      color: "G",
      clarity: "VS2",
      cut: "Very Good",
    },
  },
  {
    id: "3",
    name: "Tennis Bracelet",
    price: 8499,
    category: "Bracelets",
    description:
      "Stunning tennis bracelet featuring 36 round brilliant diamonds totaling 5 carats, set in platinum.",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlhbW9uZCUyMGJyYWNlbGV0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlhbW9uZCUyMGJyYWNlbGV0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    ],
    inStock: true,
    featured: true,
    diamondDetails: {
      caratWeight: 5.0,
      color: "F-G",
      clarity: "VS1-VS2",
      cut: "Excellent",
    },
  },
  {
    id: "4",
    name: "Three-Stone Diamond Engagement Ring",
    price: 7299,
    category: "Rings",
    description:
      "Symbolizing your past, present, and future, this ring features three beautiful diamonds set in 18k yellow gold.",
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRpYW1vbmQlMjByaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRpYW1vbmQlMjByaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    ],
    inStock: true,
    featured: true,
    diamondDetails: {
      shape: "Round",
      caratWeight: 1.5,
      color: "E",
      clarity: "VVS2",
      cut: "Excellent",
    },
  },
];

// Sample Articles (for knowledge base)
export const articles: Article[] = [
  {
    id: "1",
    title: "The 4 Cs of Diamond Quality",
    excerpt:
      "Understanding the crucial factors that determine a diamond's value: Cut, Color, Clarity, and Carat Weight.",
    summary:
      "Learn about the four key characteristics that determine diamond quality and value: Cut, Color, Clarity, and Carat Weight.",
    content:
      "Diamonds are evaluated based on four key characteristics, known as the 4 Cs: Cut, Color, Clarity, and Carat Weight. The Cut refers to how well a diamond has been shaped and faceted, affecting its brilliance and fire. Color is graded on a scale from D (colorless) to Z (light yellow or brown). Clarity measures the absence of inclusions and blemishes. Finally, Carat Weight measures the diamond's size. Together, these factors determine a diamond's overall quality and value.",
    author: "Dr. Emily Reynolds",
    publishDate: "2025-06-15T12:00:00Z",
    category: "basics",
    tags: ["4Cs", "Diamond Quality", "Beginner Guide"],
    featuredImage:
      "https://images.unsplash.com/photo-1599707367072-cd6ada2d013e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlhbW9uZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    featured: true,
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Diamond Shapes: Beyond the Round Brilliant",
    excerpt:
      "Explore the diverse world of diamond shapes and discover which one matches your personality.",
    summary:
      "Discover the variety of diamond shapes available and learn which shape best suits your style and preferences.",
    content:
      "While round brilliant diamonds are the most popular choice, there's a wide variety of shapes to consider. Princess cuts offer contemporary elegance with their square shape and brilliant faceting. Emerald cuts provide sophisticated vintage appeal with their step-cut facets. Oval diamonds combine the fire of round brilliants with an elongated shape that can make fingers appear slimmer. Other popular shapes include cushion, pear, marquise, radiant, asscher, and heart. Each shape has unique characteristics that affect both appearance and value.",
    author: "Marcus Chen",
    publishDate: "2025-07-01T12:00:00Z",
    category: "basics",
    tags: ["Diamond Shapes", "Buying Guide"],
    featuredImage:
      "https://images.unsplash.com/photo-1615655239312-c2f43cc4902f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlhbW9uZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    featured: false,
    readTime: "7 min read",
  },
  {
    id: "3",
    title: "Diamond Certificates: Why They Matter",
    excerpt:
      "Learn why diamond certification is essential and how to read a diamond grading report.",
    summary:
      "Understand the importance of diamond certificates and learn how to interpret grading reports from major laboratories.",
    content:
      "Diamond certificates, also known as grading reports, are documents issued by gemological laboratories that evaluate and describe a diamond's characteristics. These reports provide an objective assessment of the diamond's quality based on the 4 Cs and other attributes. Leading laboratories include the Gemological Institute of America (GIA), American Gem Society (AGS), and International Gemological Institute (IGI). A certificate ensures that you're getting exactly what you pay for and serves as proof of the diamond's quality. Always request a certificate when purchasing a diamond, especially for significant investments.",
    author: "Sophia Martinez",
    publishDate: "2025-07-18T12:00:00Z",
    category: "certification",
    tags: ["Diamond Certificates", "GIA", "Diamond Buying"],
    featuredImage:
      "https://images.unsplash.com/photo-1563962585448-ec03defd36a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZGlhbW9uZCUyMGNlcnRpZmljYXRlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    featured: true,
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "Diamond Care and Maintenance",
    excerpt: "Essential tips to keep your diamonds sparkling for generations.",
    summary:
      "Learn proper diamond care techniques to maintain brilliance and ensure your diamonds last for generations.",
    content:
      "Diamonds may be the hardest natural substance, but they still require proper care to maintain their brilliance. Regular cleaning is essential—a simple solution of mild dish soap and warm water, along with a soft toothbrush, can remove everyday grime. For deeper cleaning, professional services are recommended every six months. Store your diamonds separately from other jewelry to prevent scratching. Remove diamond jewelry before engaging in heavy physical activities or using household chemicals. With proper care, your diamonds will remain brilliant for generations to come.",
    author: "James Wilson",
    publishDate: "2025-08-01T12:00:00Z",
    category: "care",
    tags: ["Diamond Care", "Maintenance", "Cleaning"],
    featuredImage:
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRpYW1vbmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    featured: false,
    readTime: "4 min read",
  },
  {
    id: "5",
    title: "Diamond Investment Guide",
    excerpt: "Understanding diamonds as investment assets and market trends.",
    summary:
      "Explore the potential of diamonds as investment vehicles and learn about market factors that affect value.",
    content:
      "Investing in diamonds requires careful consideration of several factors. Unlike stocks or bonds, diamonds are physical assets that don't generate income but can appreciate in value over time. Investment-grade diamonds typically have exceptional characteristics: high color grades (D-F), excellent clarity (FL-VVS2), ideal cuts, and significant carat weights (2+ carats). Market trends, rarity, and economic conditions all influence diamond values. While diamonds can be part of a diversified portfolio, they should be considered long-term investments due to market illiquidity and transaction costs.",
    author: "Robert Kim",
    publishDate: "2025-08-05T12:00:00Z",
    category: "investment",
    tags: ["Diamond Investment", "Market Trends", "Asset Diversification"],
    featuredImage:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRpYW1vbmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    featured: false,
    readTime: "8 min read",
  },
  {
    id: "6",
    title: "Understanding Diamond Valuation Methods",
    excerpt: "How professionals determine the value of your diamonds.",
    summary:
      "Learn about the various methods used by professionals to accurately assess diamond value and market worth.",
    content:
      "Diamond valuation is a complex process that combines scientific assessment with market analysis. Professional valuers consider the 4 Cs, fluorescence, polish, symmetry, and current market conditions. Three main approaches are used: the cost approach (replacement cost), the market approach (comparable sales), and the income approach (for investment diamonds). Factors like origin, historical significance, and setting also influence value. Understanding these methods helps you better appreciate your diamond's worth and make informed decisions about insurance, sales, or purchases.",
    author: "Dr. Emily Reynolds",
    publishDate: "2025-08-08T12:00:00Z",
    category: "valuation",
    tags: ["Diamond Valuation", "Professional Assessment", "Market Analysis"],
    featuredImage:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRpYW1vbmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    featured: true,
    readTime: "10 min read",
  },
];

// Dashboard Stats
export const dashboardStats = {
  valuationRequests: {
    total: 157,
    completed: 124,
    pending: 33,
  },
  revenue: {
    total: 287500,
    monthly: [
      22500, 24800, 21900, 25600, 23700, 26800, 28900, 27500, 29800, 30200,
      31500, 32700,
    ],
  },
  customerRatings: 4.8,
  averageTurnaroundTime: 3.2, // days
};
