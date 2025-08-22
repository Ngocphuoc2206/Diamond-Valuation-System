import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/* =========================
   English translations
   ========================= */
const enTranslations: Record<string, string> = {
  // Navigation
  'nav.home': 'Home',
  'nav.shop': 'Shop',
  'nav.valuationTool': 'Valuation Tool',
  'nav.diamondKnowledge': 'Diamond Knowledge',
  'nav.contact': 'Contact',
  'nav.getValuation': 'Get Valuation',
  'nav.signin': 'Sign in',
  'nav.dashboard': 'Dashboard',
  'nav.profile': 'Profile',
  'nav.signout': 'Sign out',
  'nav.cart': 'Cart',
  'nav.faq': 'FAQ',

  // Top bar
  'topbar.freeShipping': 'Free shipping on orders over $1000',
  'topbar.faq': 'FAQ',
  'topbar.contact': 'Contact',

  // Hero Section
  'hero.title': 'Diamond Valuation',
  'hero.titleHighlight': 'Excellence',
  'hero.subtitle':
    "Expert diamond appraisal services with unmatched precision and trust. Discover the true value of your precious gemstones.",
  'hero.getValuation': 'Get a Valuation',
  'hero.learnAboutDiamonds': 'Learn About Diamonds',

  // Introduction Section
  'intro.title': 'Welcome to',
  'intro.titleHighlight': 'Diamond Valuation System',
  'intro.description':
    'We provide expert diamond appraisal services with state-of-the-art technology and experienced specialists. Our mission is to deliver accurate, transparent, and reliable diamond valuations that help our clients make informed decisions about their precious gemstones.',

  // Services
  'service.valuation.title': 'Diamond Valuation',
  'service.valuation.description':
    'Accurate diamond appraisal using advanced technology and expert analysis for insurance, resale, or personal knowledge.',
  'service.certification.title': 'Certification',
  'service.certification.description':
    'Professional diamond certification services to authenticate and document the precise characteristics of your diamonds.',
  'service.consultation.title': 'Expert Consultation',
  'service.consultation.description':
    "Personalized guidance from diamond specialists to help you understand your gemstone's quality and value.",

  // Valuation Process
  'process.title': 'Our',
  'process.titleHighlight': 'Valuation Process',
  'process.description':
    'Experience our streamlined process designed to give you accurate diamond valuations with minimal wait time and maximum transparency.',
  'process.step1.title': 'Submit Request',
  'process.step1.description':
    'Fill out our detailed online form with information about your diamond. Include as many details as you have, such as certification, origin, and physical characteristics.',
  'process.step2.title': 'Consultation',
  'process.step2.description':
    'Our consulting staff will contact you to discuss your valuation needs and arrange for your diamond to be examined by our experts.',
  'process.step3.title': 'Expert Valuation',
  'process.step3.description':
    'Our gemologists perform a comprehensive analysis using advanced equipment to assess all aspects of your diamond according to international standards.',
  'process.step4.title': 'Receive Certificate',
  'process.step4.description':
    "Get your comprehensive valuation certificate with all details about your diamond's characteristics, quality, and estimated value in current market conditions.",
  'process.startNow': 'Start Your Valuation Now',

  // Featured Diamonds
  'featured.diamonds.title': 'Featured',
  'featured.diamonds.titleHighlight': 'Diamonds',
  'featured.diamonds.description':
    'Explore our collection of extraordinary diamonds, each with unique characteristics and exceptional beauty.',
  'featured.diamonds.carat': 'Carat',
  'featured.diamonds.clarity': 'Clarity:',
  'featured.diamonds.color': 'Color:',
  'featured.diamonds.cut': 'Cut:',
  'featured.diamonds.origin': 'Origin:',
  'featured.diamonds.viewDetails': 'View Details',
  'featured.diamonds.viewAll': 'View All Diamonds',

  // Knowledge Base
  'knowledge.title': 'Diamond',
  'knowledge.titleHighlight': 'Knowledge',
  'knowledge.description':
    'Everything you need to know about diamonds, from the basics of the 4 Cs to advanced gemological insights and market trends.',
  'knowledge.searchPlaceholder': 'Search articles, guides, and insights...',
  'knowledge.allArticles': 'All Articles',
  'knowledge.featuredArticles': 'Featured Articles',
  'knowledge.featuredDescription':
    'Start with these essential guides to understanding diamonds and their valuation.',
  'knowledge.readMore': 'Read More',
  'knowledge.articlesFound': 'articles found',
  'knowledge.articleFound': 'article found',
  'knowledge.category.basics': 'Basics',
  'knowledge.category.valuation': 'Valuation',
  'knowledge.category.care': 'Care',
  'knowledge.category.investment': 'Investment',
  'knowledge.category.certification': 'Certification',
  'knowledge.category.basicsArticles': 'Basics Articles',
  'knowledge.category.valuationArticles': 'Valuation Articles',
  'knowledge.category.careArticles': 'Care Articles',
  'knowledge.category.investmentArticles': 'Investment Articles',
  'knowledge.category.certificationArticles': 'Certification Articles',
  'knowledge.exploreAll': 'Explore All Articles',

  // Call to Action
  'cta.title': "Ready to Discover Your Diamond's",
  'cta.titleHighlight': 'True Value?',
  'cta.description':
    'Start your diamond valuation journey today with our expert team and receive a comprehensive assessment of your precious gemstone.',
  'cta.getStarted': 'Get Started Now',

  // Footer
  'footer.description':
    'Your trusted partner for diamond valuation, certification, and expertise in the world of luxury gemstones.',
  'footer.quickLinks': 'Quick Links',
  'footer.home': 'Home',
  'footer.knowledge': 'Diamond Knowledge',
  'footer.valuationTool': 'Valuation Tool',
  'footer.shop': 'Shop',
  'footer.blog': 'Blog',
  'footer.support': 'Support',
  'footer.faq': 'FAQ',
  'footer.contact': 'Contact Us',
  'footer.terms': 'Terms & Conditions',
  'footer.privacy': 'Privacy Policy',
  'footer.newsletter': 'Newsletter',
  'footer.newsletterDescription':
    'Subscribe to our newsletter for the latest diamond trends and valuation insights.',
  'footer.email': 'Your email',
  'footer.subscribe': 'Subscribe',
  'footer.copyright': '© {year} Diamond Valuation System. All rights reserved.',

  // Search
  'search.placeholder': 'Search for diamonds, valuations, or articles...',
  'search.popularSearches': 'Popular Searches',
  'search.certification': 'Diamond certification',
  'search.4cs': "4C's of diamonds",
  'search.process': 'Valuation process',
  'search.care': 'Diamond care',

  // Valuation Tool
  'valuation.title': 'Diamond',
  'valuation.titleHighlight': 'Valuation',
  'valuation.tool': 'Tool',
  'valuation.description':
    'Get an estimated value for your diamond by providing its characteristics. Complete the form below for a professional valuation.',
  'valuation.step': 'Step',
  'valuation.of': 'of',
  'valuation.complete': '% Complete',
  'valuation.previous': 'Previous',
  'valuation.continue': 'Continue',
  'valuation.getEstimate': 'Get Estimate',
  'valuation.help': 'Need help with the valuation form?',
  'valuation.contactExperts': 'Contact our experts',

  // Valuation Form Steps
  'step1.title': 'Diamond Identity',
  'step1.description':
    "Enter your diamond's certificate information if available, or proceed without it.",
  'step1.hasCertificate': 'I have a diamond certificate/grading report',
  'step1.certificateNumber': 'Certificate Number',
  'step1.certificateType': 'Certificate Type',
  'step1.origin': 'Origin (if known)',
  'step1.note':
    'Note: By providing a certificate number, we may be able to retrieve some information automatically, which will help in the valuation process.',

  'step2.title': 'Basic Characteristics',
  'step2.description': "Tell us about your diamond's fundamental properties.",
  'step2.shape': 'Shape',
  'step2.caratWeight': 'Carat Weight',
  'step2.shapeGuide': 'Diamond Shape Guide',

  'step3.title': 'Color and Clarity',
  'step3.description':
    "These important characteristics significantly impact your diamond's value.",
  'step3.colorGrade': 'Color Grade',
  'step3.clarityGrade': 'Clarity Grade',
  'step3.didYouKnow': 'Did you know?',
  'step3.didYouKnowText':
    'Color and clarity are two of the "4 Cs" that determine a diamond\'s value. The color scale ranges from D (colorless) to Z (light yellow or brown), while clarity measures the absence of inclusions and blemishes, ranging from Flawless (FL) to Included (I3).',

  'step4.title': 'Cut Characteristics',
  'step4.description':
    'The cut quality significantly affects how light interacts with your diamond.',
  'step4.cutGrade': 'Cut Grade',
  'step4.polish': 'Polish',
  'step4.symmetry': 'Symmetry',
  'step4.fluorescence': 'Fluorescence',
  'step4.cutQuality': 'Cut Quality Impacts',
  'step4.excellentCut': 'Excellent Cut',
  'step4.maxBrilliance': 'Maximum Brilliance',
  'step4.goodCut': 'Good Cut',
  'step4.goodBrilliance': 'Good Brilliance',
  'step4.poorCut': 'Poor Cut',
  'step4.limitedBrilliance': 'Limited Brilliance',

  'step5.title': 'Measurements (Optional)',
  'step5.description':
    'If known, please provide the physical dimensions of your diamond.',
  'step5.length': 'Length (mm)',
  'step5.width': 'Width (mm)',
  'step5.depth': 'Depth (mm)',
  'step5.guide': 'Diamond Dimensions Guide',
  'step5.guideTip':
    'Accurate measurements help provide a more precise valuation, especially when combined with weight and other characteristics.',

  'step6.title': 'Additional Information',
  'step6.description':
    "Any other details that might affect your diamond's valuation.",
  'step6.hasInclusions': 'There are visible inclusions or blemishes',
  'step6.hasSettings': 'Diamond is in a setting/jewelry piece',
  'step6.settingMaterial': 'Setting Material',
  'step6.additionalNotes': 'Additional Notes',
  'step6.notesPlaceholder':
    "Any other details about your diamond that might be relevant for valuation...",
  'step6.helpfulTip': 'Helpful Tip',
  'step6.helpfulTipText':
    "If your diamond is in a setting, please note that we provide separate valuations for the diamond and the setting. If you're interested in a valuation of the entire piece of jewelry, please specify this in your additional notes.",

  'step7.title': 'Contact Information',
  'step7.description':
    'Please provide your contact details so we can deliver your valuation results.',
  'step7.fullName': 'Full Name',
  'step7.email': 'Email Address',
  'step7.phone': 'Phone Number',
  'step7.preferredContact': 'Preferred Contact Method',
  'step7.agreement': 'I agree to the',
  'step7.terms': 'Terms & Conditions',
  'step7.privacy': 'Privacy Policy',

  // Results
  'results.calculating': 'Calculating your estimate...',
  'results.estimatedValue': 'Estimated Diamond Value',
  'results.basedOn': 'Based on the information you provided',
  'results.marketValue': 'Estimated market value',
  'results.importantNote': 'Important Note:',
  'results.noteText':
    'This is an automated estimate based on the information provided. For a precise valuation, we recommend scheduling a professional in-person assessment with our expert gemologists.',
  'results.summary': 'Your Diamond Summary',
  'results.nextSteps': 'Next Steps',
  'results.requestSubmitted':
    'Your valuation request has been submitted successfully! A member of our team will contact you at {email} within 24 hours.',
  'results.submittedSuccessfully': '✅ Request Submitted Successfully',
  'results.referenceId': 'Reference ID: {id}',
  'results.trackRequest': 'Track Your Request',
  'results.viewSample': 'View Sample Results',
  'results.newRequest': 'New Request',

  // Common
  'common.required': '*',
  'common.select': 'Select',
  'common.unknown': 'Unknown',
  'common.other': 'Other',
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.close': 'Close',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.continue': 'Continue',
  'common.submit': 'Submit',
  'common.reset': 'Reset',
  'common.clear': 'Clear',
  'common.openMenu': 'Open main menu',
  'common.search': 'Search',

  // Placeholders
  'placeholder.certificateNumber': 'E.g. GIA 1234567890',
  'placeholder.carat': 'E.g. 1.25',
  'placeholder.length': 'E.g. 7.25',
  'placeholder.width': 'E.g. 7.20',
  'placeholder.depth': 'E.g. 4.35',
  'placeholder.fullName': 'Your full name',
  'placeholder.email': 'Enter your email',
  'placeholder.emailFormat': 'your.email@example.com',
  'placeholder.phone': 'Your phone number',
  'placeholder.phoneFormat': '(555) 123-4567',
  'placeholder.password': 'Enter your password',
  'placeholder.firstName': 'First name',
  'placeholder.lastName': 'Last name',
  'placeholder.createPassword': 'Create a password',
  'placeholder.confirmPassword': 'Confirm your password',

  // Admin placeholders
  'placeholder.searchUsers': 'Search users...',
  'placeholder.searchProducts': 'Search products...',
  'placeholder.revenueChart': '[Revenue Chart Placeholder]',
  'placeholder.customerChart': '[Customer Chart Placeholder]',

  // Staff placeholders
  'placeholder.marketValue': 'Market Value ($)',
  'placeholder.insuranceValue': 'Insurance Value ($)',
  'placeholder.retailValue': 'Retail Value',
  'placeholder.notesObservations': 'Notes and observations...',
  'placeholder.contactOutcome': 'Record the outcome of your customer contact...',
  'placeholder.diamondType': 'Diamond Type',
  'placeholder.caratWeight': 'Carat Weight',
  'placeholder.colorGrade': 'Color Grade',
  'placeholder.clarityGrade': 'Clarity Grade',
  'placeholder.cutGrade': 'Cut Grade',
  'placeholder.receiptNumber': 'Receipt Number',
  'placeholder.estimatedValue': 'Estimated Value',
  'placeholder.handlingInstructions':
    'Any special handling instructions or notes for the valuation staff...',
  'placeholder.certificationDetails': 'GIA/AGS certification number, details...',
  'placeholder.detailedAnalysis': 'Detailed analysis, observations, methodology used...',

  // Checkout placeholders
  'placeholder.cardNumber': '1234 5678 9012 3456',
  'placeholder.expiryDate': 'MM/YY',
  'placeholder.cvv': '123',
  'placeholder.orderNotes': 'Any special delivery instructions or gift message...',

  // Shop Page
  'shop.title': 'Diamond',
  'shop.titleHighlight': 'Collection',
  'shop.description':
    'Discover our exquisite collection of certified diamonds and luxury jewelry pieces, each one carefully selected for its exceptional quality and beauty.',
  'shop.filters': 'Filters',
  'shop.category': 'Category',
  'shop.allProducts': 'All Products',
  'shop.priceRange': 'Price Range',
  'shop.quickFilters': 'Quick Filters',
  'shop.under5k': 'Under $5,000',
  'shop.5to10k': '$5,000 - $10,000',
  'shop.10to20k': '$10,000 - $20,000',
  'shop.over20k': 'Over $20,000',
  'shop.productsFound': '{count} product{plural} found',
  'shop.featured': 'Featured',
  'shop.priceLowHigh': 'Price: Low to High',
  'shop.priceHighLow': 'Price: High to Low',
  'shop.nameAZ': 'Name: A to Z',
  'shop.shape': 'Shape',
  'shop.carat': 'Carat',
  'shop.color': 'Color',
  'shop.clarity': 'Clarity',
  'shop.view': 'View',
  'shop.addToCart': 'Add to Cart',
  'shop.noProducts': 'No products found',
  'shop.noProductsDesc': 'Try adjusting your filters or search criteria.',
  'shop.resetFilters': 'Reset Filters',
  'shop.needHelp': 'Need Help Choosing?',
  'shop.needHelpDesc':
    'Our diamond experts are here to help you find the perfect piece. Get personalized recommendations and professional guidance.',
  'shop.getValuation': 'Get Valuation',
  'shop.contactExpert': 'Contact Expert',

  // Cart Page
  'cart.title': 'Shopping',
  'cart.titleHighlight': 'Cart',
  'cart.description': 'Review your selected items and proceed to checkout',
  'cart.empty': 'Your cart is empty',
  'cart.emptyDesc': 'Discover our beautiful collection of diamonds and jewelry pieces.',
  'cart.continueShopping': 'Continue Shopping',
  'cart.quantity': 'Qty',
  'cart.remove': 'Remove',
  'cart.orderSummary': 'Order Summary',
  'cart.subtotal': 'Subtotal',
  'cart.shipping': 'Shipping',
  'cart.free': 'Free',
  'cart.tax': 'Tax (estimated)',
  'cart.total': 'Total',
  'cart.proceedCheckout': 'Proceed to Checkout',
  'cart.requestQuote': 'Request Quote',
  'cart.whyChoose': 'Why Choose Us?',
  'cart.securePayments': 'Secure Payments',
  'cart.freeShipping': 'Free Shipping',
  'cart.lifetimeWarranty': 'Lifetime Warranty',
  'cart.needHelp': 'Need help with your order?',
  'cart.contactExperts': 'Contact Our Experts',

  // Product Detail Page
  'product.inStock': 'In Stock',
  'product.outOfStock': 'Out of Stock',
  'product.description': 'Description',
  'product.specifications': 'Diamond Specifications',
  'product.quantity': 'Quantity',
  'product.youMayLike': 'You May Also Like',

  // FAQ Page
  'faq.title': 'Frequently Asked',
  'faq.titleHighlight': 'Questions',
  'faq.description':
    'Find answers to common questions about diamond valuation, our services, and the appraisal process.',
  'faq.searchPlaceholder': 'Search for answers...',
  'faq.allCategories': 'All Categories',
  'faq.generalQuestions': 'General Questions',
  'faq.valuationProcess': 'Valuation Process',
  'faq.pricingFees': 'Pricing & Fees',
  'faq.certificates': 'Certificates',
  'faq.shippingSafety': 'Shipping & Safety',
  'faq.accountSupport': 'Account & Support',
  'faq.noResults': 'No results found',
  'faq.noResultsDesc': 'Try adjusting your search terms or browse different categories.',
  'faq.clearSearch': 'Clear Search',
  'faq.popularTopics': 'Popular Topics',
  'faq.diamondGrading': '💎 Diamond Grading',
  'faq.diamondGradingDesc':
    'Learn about the 4 Cs and how we evaluate diamond quality and characteristics.',
  'faq.pricingFeesDesc':
    "Understand our transparent pricing structure and what's included in each service.",
  'faq.certificatesDesc': 'Information about diamond certificates and how they affect valuation.',
  'faq.shippingSafetyDesc':
    'Safe shipping practices and insurance coverage for your valuable items.',
  'faq.viewQuestions': 'View questions →',
  'faq.readyToStart': 'Ready to Get Started?',
  'faq.readyToStartDesc':
    "If you didn't find the answer you're looking for, our expert team is here to help you with personalized assistance.",
  'faq.startValuation': 'Start Valuation',
  'faq.contactSupport': 'Contact Support',

  // FAQ Categories
  'faq.categories.all': 'All Questions',
  'faq.categories.valuation': 'Valuation Process',
  'faq.categories.pricing': 'Pricing & Fees',
  'faq.categories.shipping': 'Shipping & Safety',
  'faq.categories.certificates': 'Certificates',
  'faq.categories.account': 'Account & Support',
  'faq.categoriesTitle': 'Categories',
  'faq.stillHaveQuestions': 'Still Have Questions?',
  'faq.contactUs': 'Contact Us',
  'faq.question': 'question',
  'faq.questions': 'questions',
  'faq.searchResults': 'Search results for',

  // FAQ Topics
  'faq.topics.diamondGrading': 'Diamond Grading',
  'faq.topics.diamondGradingDesc':
    'Learn about the 4 Cs and how we evaluate diamond quality and characteristics.',
  'faq.topics.pricingFees': 'Pricing & Fees',
  'faq.topics.pricingFeesDesc':
    "Understand our transparent pricing structure and what's included in each service.",
  'faq.topics.certificates': 'Certificates',
  'faq.topics.certificatesDesc':
    'Information about diamond certificates and how they affect valuation.',
  'faq.topics.shippingSafety': 'Shipping & Safety',
  'faq.topics.shippingSafetyDesc':
    'Safe shipping practices and insurance coverage for your valuable items.',

  // FAQ Q&A
  'faq.questions.valuationTime': 'How long does a diamond valuation take?',
  'faq.answers.valuationTime':
    'A standard diamond valuation typically takes 3-5 business days from when we receive your item. Express services are available for urgent requests, which can be completed within 24-48 hours for an additional fee.',

  'faq.questions.informationNeeded':
    'What information do I need to provide for a valuation?',
  'faq.answers.informationNeeded':
    'For the most accurate valuation, please provide any existing certificates (GIA, AGS, etc.), purchase receipts, insurance documents, and detailed photos. Our online form will guide you through all the necessary information.',

  'faq.questions.valuationCost': 'How much does a diamond valuation cost?',
  'faq.answers.valuationCost':
    'Our valuation fees start at $150 for standard service. Pricing varies based on the complexity of the piece, number of stones, and turnaround time. Contact us for a detailed quote based on your specific needs.',

  'faq.questions.valuationDifference':
    "What's the difference between market value and insurance value?",
  'faq.answers.valuationDifference':
    'Market value represents what you could reasonably expect to receive if selling the diamond today. Insurance value (replacement value) is typically 20-40% higher and represents the cost to replace the item with one of similar quality.',

  'faq.questions.insuranceAppraisals': 'Do you provide insurance appraisals?',
  'faq.answers.insuranceAppraisals':
    'Yes, we provide certified appraisals that are accepted by all major insurance companies. Our appraisals meet industry standards and include detailed descriptions, photographs, and current market valuations.',

  'faq.questions.safeShipping':
    'How do you ensure safe shipping of valuable items?',
  'faq.answers.safeShipping':
    'We use fully insured, signature-required shipping with tracking. Items are packaged in discrete, secure containers. We also offer local drop-off and pickup services in major metropolitan areas.',

  'faq.questions.valueTypes': 'What types of values do you provide?',
  'faq.answers.valueTypes':
    'We provide multiple valuation types including Fair Market Value, Insurance Replacement Value, Estate/Probate Value, and Liquidation Value, depending on your specific needs and intended use.',
  'faq.questions.coloredDiamonds':
    'Do you appraise colored diamonds and fancy shapes?',
  'faq.answers.coloredDiamonds':
    'Absolutely! Our certified gemologists have extensive experience with fancy colored diamonds, rare shapes, and unique pieces. Colored diamond valuations may require additional time due to their specialized nature.',
  'faq.questions.certificatesAccepted':
    'Which diamond certificates do you accept?',
  'faq.answers.certificatesAccepted':
    'We work with diamonds certified by GIA, AGS, Gübelin, SSEF, AGL, and other reputable laboratories. If your diamond lacks certification, we can arrange for professional grading as part of the valuation process.',
  'faq.questions.multipleItemsDiscount': 'Do you offer discounts for multiple items?',
  'faq.answers.multipleItemsDiscount':
    'Yes, we offer volume discounts for multiple pieces. Contact us with details about your collection for a customized quote. Estate and collection appraisals receive special pricing considerations.',

  'faq.questions.trackRequest': 'How can I track my valuation request?',
  'faq.answers.trackRequest':
    "Once you submit a request, you'll receive a tracking number and access to our client portal where you can monitor progress, communicate with your assigned gemologist, and receive updates in real-time.",

  'faq.questions.lossOrDamage':
    'What happens if my item is lost or damaged during shipping?',
  'faq.answers.lossOrDamage':
    'All items are fully insured during transit and while in our possession. In the unlikely event of loss or damage, our comprehensive insurance policy will provide full compensation based on the declared value.',

  // Checkout Page
  'checkout.title': 'Secure Checkout',
  'checkout.description': 'Complete your purchase securely',
  'checkout.shippingInfo': 'Shipping Information',
  'checkout.paymentInfo': 'Payment Information',
  'checkout.firstName': 'First Name',
  'checkout.lastName': 'Last Name',
  'checkout.address': 'Address',
  'checkout.city': 'City',
  'checkout.state': 'State',
  'checkout.zipCode': 'ZIP Code',
  'checkout.country': 'Country',
  'checkout.cardNumber': 'Card Number',
  'checkout.expiryDate': 'MM/YY',
  'checkout.cvv': 'CVV',
  'checkout.cardName': 'Cardholder Name',
  'checkout.orderNotes': 'Order Notes',
  'checkout.newsletter': 'Subscribe to newsletter',
  'checkout.insurance': 'Add shipping insurance',
  'checkout.placeOrder': 'Place Order',
  'checkout.processing': 'Processing...',
  'checkout.backToPayment': 'Back to Payment',
  'checkout.backToShipping': 'Back to Shipping',
  'checkout.continue': 'Continue',
  'checkout.moneyBackGuarantee': '30-Day Money Back Guarantee',

  // Contact Page
  'contact.title': 'Contact',
  'contact.titleHighlight': 'Our Experts',
  'contact.description':
    'Get in touch with our diamond experts for personalized assistance with valuations, purchases, or any questions about diamonds.',
  'contact.messageSent': 'Message Sent!',
  'contact.messageReceived':
    "Thank you for contacting us! We've received your message and will get back to you within 24 hours.",
  'contact.backToHome': 'Back to Home',
  'contact.sendAnother': 'Send Another Message',
  'contact.name': 'Full Name',
  'contact.subject': 'Subject',
  'contact.message': 'Message',
  'contact.contactMethod': 'Preferred Contact Method',
  'contact.email': 'Email',
  'contact.phone': 'Phone',
  'contact.either': 'Either',
  'contact.sending': 'Sending...',
  'contact.sendMessage': 'Send Message',
  'contact.officeHours': 'Office Hours',
  'contact.mondayFriday': 'Monday - Friday: 9:00 AM - 6:00 PM',
  'contact.saturday': 'Saturday: 10:00 AM - 4:00 PM',
  'contact.sunday': 'Sunday: Closed',
  'contact.phoneNumber': 'Phone Number',
  'contact.emailAddress': 'Email Address',
  'contact.address': 'Address',
  'contact.officeAddress': '123 Diamond District, New York, NY 10036',
  'contact.faqsTitle': 'Frequently Asked Questions',
  'contact.howLongValuation': 'How long does a valuation take?',
  'contact.howLongAnswer': 'Most valuations are completed within 3-5 business days from receipt.',
  'contact.whatInfoNeeded': 'What information do I need to provide?',
  'contact.whatInfoAnswer':
    'High-quality photos, certificates, and basic measurements help us provide accurate valuations.',
  'contact.insuranceAccepted': 'Are your appraisals accepted by insurance companies?',
  'contact.insuranceAnswer':
    'Yes, our certified appraisals are accepted by all major insurance companies.',
  'contact.viewCredentials': 'View credentials →',

  // Product Detail Page Extensions
  'product.notFound': 'Product Not Found',
  'product.notFoundDesc': "The product you're looking for doesn't exist.",
  'product.backToShop': 'Back to Shop',
  'product.breadcrumbHome': 'Home',
  'product.breadcrumbShop': 'Shop',
  'product.addToCart': 'Add to Cart',
  'product.buyNow': 'Buy Now',
  'product.guarantees': 'Guarantees',
  'product.certifiedAuthentic': 'Certified Authentic',
  'product.thirtyDayReturn': '30-Day Return',
  'product.freeShipping': 'Free Shipping',
  'product.lifetimeWarranty': 'Lifetime Warranty',
  'product.needHelp': 'Need help or have questions about this product?',
  'product.contactExpert': 'Contact Expert',
  'product.getValuation': 'Get Valuation',

  // Validation
  'validation.required': 'This field is required',
  'validation.email': 'Invalid email address',
  'validation.phone': 'Valid phone number is required',
  'validation.shape': 'Shape is required',
  'validation.caratWeight': 'Carat weight is required',
  'validation.color': 'Color is required',
  'validation.clarity': 'Clarity is required',
  'validation.cut': 'Cut is required',
  'validation.polish': 'Polish is required',
  'validation.symmetry': 'Symmetry is required',
  'validation.fluorescence': 'Fluorescence is required',
  'validation.fullName': 'Full name is required',
  'validation.preferredContact': 'Preferred contact method is required',

  // Auth
  'auth.login': 'Login',
  'auth.register': 'Register',
  'auth.welcomeBack': 'Welcome Back',
  'auth.loginDescription':
    'Sign in to your account to access your dashboard and track your valuations.',
  'auth.createAccount': 'Create Account',
  'auth.registerDescription':
    'Create an account to access exclusive features and track your diamond valuation history.',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.confirmPassword': 'Confirm Password',
  'auth.firstName': 'First Name',
  'auth.lastName': 'Last Name',
  'auth.rememberMe': 'Remember me',
  'auth.forgotPassword': 'Forgot password?',
  "auth.dontHaveAccount": "Don't have an account?",
  'auth.alreadyHaveAccount': 'Already have an account?',
  'auth.signIn': 'Sign In',
  'auth.signUp': 'Sign Up',
  'auth.signingIn': 'Signing in...',
  'auth.signingUp': 'Signing up...',
  'auth.invalidCredentials': 'Invalid email or password',
  'auth.emailExists': 'This email is already in use',
  'auth.registrationSuccess': 'Registration successful! Please sign in.',
  'auth.or': 'Or',
  'auth.continueWithGoogle': 'Continue with Google',
  'auth.continueWithFacebook': 'Continue with Facebook',
  'auth.passwordsDontMatch': "Passwords do not match",
  'auth.acceptTerms': 'Please accept the terms and conditions',
  'auth.termsAndConditions': 'Terms and Conditions',
  'auth.privacyPolicy': 'Privacy Policy',
  'auth.agreeToTerms': 'I agree to the',
  'auth.and': 'and',
  'auth.subscribeNewsletter': 'Subscribe to our newsletter for updates',

  // Dashboard (user)
  'dashboard.welcome': 'Welcome back',
  'dashboard.subtitle': 'Manage your account, orders, and valuations',
  'dashboard.overview': 'Overview',
  'dashboard.orders': 'Orders',
  'dashboard.valuations': 'Valuations',
  'dashboard.favorites': 'Favorites',
  'dashboard.profile': 'Profile',
  'dashboard.requests': 'My Requests',
  'dashboard.notifications': 'Notifications',
  'dashboard.newValuation': 'New Valuation',
  'dashboard.totalOrders': 'Total Orders',
  'dashboard.totalRequests': 'Total Requests',
  'dashboard.completed': 'Completed',
  'dashboard.inProgress': 'In Progress',
  'dashboard.pending': 'Pending',
  'dashboard.recentActivity': 'Recent Activity',
  'dashboard.orderHistory': 'Order History',
  'dashboard.item': 'item',
  'dashboard.items': 'items',
  'dashboard.valuationRequests': 'Valuation Requests',
  'dashboard.profileSettings': 'Profile Settings',
  'dashboard.changePhoto': 'Change Photo',
  'dashboard.photoRequirements': 'JPG, PNG or GIF. Max size 2MB.',
  'dashboard.addPhone': 'Add phone number',
  'dashboard.location': 'Location',
  'dashboard.cityCountry': 'City, Country',
  'dashboard.saveChanges': 'Save Changes',
  'dashboard.viewAll': 'View All',
  'dashboard.status': 'Status',
  'dashboard.submittedDate': 'Submitted',
  'dashboard.lastUpdate': 'Last Update',
  'dashboard.viewDetails': 'View Details',
  'dashboard.downloadReport': 'Download Report',
  'dashboard.contactSupport': 'Contact Support',

  // Communication
  'communication.title': 'Communication Center',
  'communication.subtitle': 'Stay connected with our team',
  'communication.newMessage': 'New Message',
  'communication.messages': 'Messages',
  'communication.history': 'Communication History',
  'communication.compose': 'Compose Message',
  'communication.subject': 'Subject',
  'communication.message': 'Message',
  'communication.requestId': 'Related Request ID',
  'communication.send': 'Send Message',
  'communication.cancel': 'Cancel',
  'communication.noMessages': 'No messages yet',
  'communication.noMessagesDesc':
    'When you receive messages from our team, they will appear here.',
  'communication.readMore': 'Read More',
  'communication.reply': 'Reply',
  'communication.download': 'Download',
  'communication.attachment': 'Attachment',

  // Admin Dashboard (EN)
  'admin.dashboard': 'Admin Dashboard',
  'admin.overview': 'Overview',
  'admin.users': 'Users',
  'admin.orders': 'Orders',
  'admin.products': 'Products',
  'admin.valuations': 'Valuations',
  'admin.staff': 'Staff',
  'admin.reports': 'Reports',
  'admin.settings': 'Settings',
  'admin.totalUsers': 'Total Users',
  'admin.totalValuations': 'Total Valuations',
  'admin.pendingValuations': 'Pending Valuations',
  'admin.totalRevenue': 'Total Revenue',
  'admin.monthlyRevenue': 'Monthly Revenue',
  'admin.completedOrders': 'Completed Orders',
  'admin.pendingOrders': 'Pending Orders',
  'admin.customerRating': 'Customer Rating',
  'admin.avgTurnaroundTime': 'Avg Turnaround Time',
  'admin.recentActivity': 'Recent Activity',
  'admin.userManagement': 'User Management',
  'admin.orderManagement': 'Order Management',
  'admin.productManagement': 'Product Management',
  'admin.staffManagement': 'Staff Management',
  'admin.viewAll': 'View All',
  'admin.addNew': 'Add New',
  'admin.edit': 'Edit',
  'admin.delete': 'Delete',

  // System Configuration (EN)
  'admin.systemConfig': 'System Configuration',
  'admin.pricingManagement': 'Pricing Management',
  'admin.baseValuationFee': 'Base Valuation Fee',
  'admin.insuranceAppraisalFee': 'Insurance Appraisal Fee',
  'admin.turnaroundSettings': 'Turnaround Time Settings',
  'admin.standardDays': 'Standard (Business Days)',
  'admin.expressDays': 'Express (Business Days)',
  'admin.emergencyHours': 'Emergency (Hours)',
  'admin.emailNotifications': 'Email Notifications',
  'admin.sendOrderConfirmations': 'Send order confirmations',

  // Orders & Products (EN)
  'admin.totalOrders': 'Total Orders',
  'admin.revenue': 'Revenue',
  'admin.pending': 'Pending',
  'admin.completed': 'Completed',
  'admin.cancelled': 'Cancelled',
  'admin.orderValue': 'Order Value',
  'admin.customer': 'Customer',
  'admin.date': 'Date',
  'admin.amount': 'Amount',

  // Analytics & Reports (EN)
  'admin.performanceOverview': 'Performance Overview',
  'admin.revenueAnalytics': 'Revenue Analytics',
  'admin.userGrowth': 'User Growth',
  'admin.orderTrends': 'Order Trends',
  'admin.dailyOrders': 'Daily Orders',
  'admin.conversionRate': 'Conversion Rate',
  'admin.averageOrderValue': 'Average Order Value',
  'admin.search': 'Search',
  'admin.filter': 'Filter',
  'admin.export': 'Export',
  'admin.import': 'Import',

  // Valuation Results (EN)
  'valuation.results': 'Valuation Results',
  'valuation.summary': 'Summary',
  'valuation.detailed': 'Detailed Report',
  'valuation.certificate': 'Certificate',
  'valuation.marketValue': 'Market Value',
  'valuation.insuranceValue': 'Insurance Value',
  'valuation.retailValue': 'Retail Value',
  'valuation.condition': 'Condition',
  'valuation.methodology': 'Methodology',
  'valuation.diamondDetails': 'Diamond Details',
  'valuation.shape': 'Shape',
  'valuation.caratWeight': 'Carat Weight',
  'valuation.color': 'Color',
  'valuation.clarity': 'Clarity',
  'valuation.cut': 'Cut',
  'valuation.polish': 'Polish',
  'valuation.symmetry': 'Symmetry',
  'valuation.fluorescence': 'Fluorescence',
  'valuation.measurements': 'Measurements',
  'valuation.certificateNumber': 'Certificate Number',
  'valuation.certificateType': 'Certificate Type',
  'valuation.submittedDate': 'Submitted Date',
  'valuation.completedDate': 'Completed Date',
  'valuation.consultantName': 'Consultant Name',
  'valuation.valuationStaff': 'Valuation Staff',
  'valuation.receiptNumber': 'Receipt Number',
  'valuation.downloadReport': 'Download Report',
  'valuation.printCertificate': 'Print Certificate',
  'valuation.requestNew': 'Request New Valuation',

  // Staff (EN)
  'staff.dashboard': 'Staff Dashboard',
  // keep one 'staff.overview' only (this one kept under Detail View below)
  'staff.myTasks': 'My Tasks',
  'staff.workQueue': 'Work Queue',
  'staff.customerContact': 'Customer Contact',
  'staff.appraisals': 'Appraisals',
  'staff.teamManagement': 'Team Management',
  'staff.myReports': 'My Reports',
  'staff.myPerformance': 'My Performance',
  'staff.accessDenied': 'Access Denied',
  'staff.noPermission': 'You do not have permission to access this page.',
  'staff.goToDashboard': 'Go to Dashboard',

  // Staff Status Labels (EN)
  'staff.new': 'New Request',
  'staff.inProgress': 'In Progress',
  'staff.review': 'Under Review',
  'staff.completed': 'Completed',
  'staff.cancelled': 'Cancelled',

  // Staff Detail View (EN)  — keep canonical keys here to avoid duplicates
  'staff.requestDetails': 'Request Details',
  'staff.overview': 'Overview',
  // removed duplicate: 'staff.customer' stays in Data Labels section below
  'staff.communication': 'Communication',
  'staff.actions': 'Actions',
  'staff.valuation': 'Valuation',
  'staff.results': 'Results', // kept here; removed from Additional UI duplicates
  'staff.diamondInformation': 'Diamond Information',
  'staff.assignmentInformation': 'Assignment Information',
  'staff.customerInformation': 'Customer Information',
  'staff.quickActions': 'Quick Actions', // kept here; removed from Section Headings duplicate
  'staff.communicationHistory': 'Communication History',
  'staff.recordCommunication': 'Record Communication',
  'staff.availableActions': 'Available Actions',
  'staff.statusActions': 'Status Actions',
  'staff.additionalNotes': 'Additional Notes',
  'staff.assignToMe': 'Assign to Me',
  'staff.markAsContacted': 'Mark as Contacted',
  'staff.createReceipt': 'Create Receipt',
  'staff.reviewResults': 'Review Results',
  'staff.sendResults': 'Send Results',
  'staff.callCustomer': 'Call Customer',
  'staff.sendEmail': 'Send Email',
  'staff.scheduleAppointment': 'Schedule Appointment',
  'staff.logEmail': 'Log Email',
  'staff.logPhoneCall': 'Log Phone Call',
  'staff.logMeeting': 'Log Meeting',
  'staff.saveNotes': 'Save Notes',
  'staff.diamondSpecifications': 'Diamond Specifications', // kept here
  'staff.specialInstructions': 'Special Instructions',
  "staff.customersBackground": "Customer's Background",
  'staff.valuationWorkspace': 'Valuation Workspace',
  'staff.valueAssessment': 'Value Assessment',
  'staff.conditionQuality': 'Condition & Quality',
  'staff.overallCondition': 'Overall Condition',
  'staff.certificationDetails': 'Certification Details',
  'staff.detailedProfessionalAnalysis': 'Detailed Professional Analysis',
  'staff.recommendations': 'Recommendations',
  'staff.valuationResultsSummary': 'Valuation Results Summary',
  'staff.qualityAssessment': 'Quality Assessment',
  'staff.professionalAnalysis': 'Professional Analysis',
  'staff.valuationActions': 'Valuation Actions',
  'staff.workflowActions': 'Workflow Actions',
  'staff.startValuation': 'Start Valuation',
  'staff.updateProgress': 'Update Progress',
  'staff.completeValuation': 'Complete Valuation',
  'staff.putOnHold': 'Put on Hold',
  // removed duplicate: 'staff.saveProgress' will live in Action Buttons below
  'staff.qualityChecklist': 'Quality Checklist',
  'staff.saveValuationData': 'Save Valuation Data',
  'staff.pending': 'Pending',
  'staff.onHold': 'On Hold',

  // Staff Performance Metrics (EN)
  'staff.assignedTasks': 'Assigned Tasks',
  'staff.completedToday': 'Completed Today',
  'staff.totalCompleted': 'Total Completed',
  'staff.rating': 'Rating',
  'staff.averageRating': 'Average Rating',
  'staff.thisMonth': 'This Month',

  // Staff Section Headings (EN) — removed duplicate 'staff.quickActions'
  'staff.teamPerformanceOverview': 'Team Performance Overview',
  'staff.customerCommunicationCenter': 'Customer Communication Center',
  'staff.tasksAssignedToYou': 'Tasks Assigned to You',
  'staff.yourRecentActivities': 'Your Recent Activities',
  'staff.valuationWorkflow': 'Valuation Workflow',
  'staff.toolsAndResources': 'Tools and Resources',

  // Staff Action Buttons (EN)
  'staff.contact': 'Contact',
  'staff.manageTemplates': 'Manage Templates',
  'staff.accessDB': 'Access DB',
  'staff.viewTemplates': 'View Templates',
  'staff.uploadPhotos': 'Upload Photos',
  'staff.saveProgress': 'Save Progress', // kept here; removed from Detail View
  'staff.completeAppraisal': 'Complete Appraisal',
  'staff.downloadFullReport': 'Download Full Report',

  // Staff Email Template (EN)
  'staff.emailTemplate': 'Dear',
  'staff.emailBody':
    'We have completed the professional valuation of your diamond. Please find the detailed report attached.',
  'staff.emailClosing': 'Best regards',
  'staff.messageToCustomer': 'Message to Customer',

  // Staff Additional UI Labels (EN) — removed duplicates: results, diamondSpecifications, customer
  'staff.request': 'Request',
  'staff.receipt': 'Receipt',
  'staff.quickResponseTemplates': 'Quick response templates',
  'staff.trackCustomerCalls': 'Track customer calls',
  'staff.scheduleConsultations': 'Schedule consultations',
  'staff.waitingDeliveryConfirmation': 'Waiting for diamond delivery confirmation',
  'staff.followUpDocumentation': 'Follow up on additional documentation',
  'staff.diamondCalculator': 'Diamond Calculator',
  'staff.priceDatabase': 'Price Database',
  'staff.reportTemplates': 'Report Templates',
  'staff.photoGallery': 'Photo Gallery',
  'staff.valuationDetails': 'Valuation Details',
  'staff.consultingStaffPerformance': 'Consulting Staff Performance',

  // Staff Data Labels (EN) — keep canonical 'staff.customer' here
  'staff.customer': 'Customer',
  'staff.email': 'Email',
  'staff.phone': 'Phone',
  'staff.submitted': 'Submitted',
  'staff.type': 'Type',
  'staff.carat': 'Carat',
  'staff.estValue': 'Est. Value',
  'staff.latestNotes': 'Latest Notes',
  'staff.pendingCustomerFollowups': 'Pending Customer Follow-ups',
  'staff.currentAppraisal': 'Current Appraisal',
  'staff.shape': 'Shape',
  'staff.caratWeight': 'Carat Weight',
  'staff.colorGrade': 'Color Grade',
  'staff.clarityGrade': 'Clarity Grade',
  'staff.valuationStaffPerformance': 'Valuation Staff Performance',
  'staff.emeraldCut': 'Emerald Cut',
  'staff.diamondAppraisalWorkstation': 'Diamond Appraisal Workstation',
  'staff.openTool': 'Open Tool',

  // Enhanced Staff Features (EN)
  'staff.myValuationWorkflow': 'My Valuation Workflow',
  'staff.pendingReview': 'Pending Review',
  'staff.myPerformanceReports': 'My Performance Reports',
  'staff.workflowManagement': 'Workflow Management',
  'staff.viewCallHistory': 'View Call History',
  'staff.bookAppointment': 'Book Appointment',
};

/* =========================
   Vietnamese translations
   ========================= */
const viTranslations: Record<string, string> = {
  // Navigation
  'nav.home': 'Trang Chủ',
  'nav.shop': 'Cửa Hàng',
  'nav.valuationTool': 'Công Cụ Định Giá',
  'nav.diamondKnowledge': 'Kiến Thức Kim Cương',
  'nav.contact': 'Liên Hệ',
  'nav.getValuation': 'Định Giá',
  'nav.signin': 'Đăng Nhập',
  'nav.dashboard': 'Bảng Điều Khiển',
  'nav.profile': 'Hồ Sơ',
  'nav.signout': 'Đăng Xuất',
  'nav.cart': 'Giỏ Hàng',
  'nav.faq': 'Câu Hỏi Thường Gặp',

  // Top bar
  'topbar.freeShipping': 'Miễn phí vận chuyển cho đơn hàng trên $1000',
  'topbar.faq': 'Câu Hỏi',
  'topbar.contact': 'Liên Hệ',

  // Hero Section
  'hero.title': 'Định Giá Kim Cương',
  'hero.titleHighlight': 'Xuất Sắc',
  'hero.subtitle':
    'Dịch vụ thẩm định kim cương chuyên nghiệp với độ chính xác và uy tín vượt trội. Khám phá giá trị thực của những viên đá quý của bạn.',
  'hero.getValuation': 'Định Giá Ngay',
  'hero.learnAboutDiamonds': 'Tìm Hiểu Về Kim Cương',

  // Introduction Section
  'intro.title': 'Chào Mừng Đến Với',
  'intro.titleHighlight': 'Hệ Thống Định Giá Kim Cương',
  'intro.description':
    'Chúng tôi cung cấp dịch vụ thẩm định kim cương chuyên nghiệp với công nghệ tiên tiến và các chuyên gia giàu kinh nghiệm. Sứ mệnh của chúng tôi là mang đến những đánh giá chính xác, minh bạch và đáng tin cậy giúp khách hàng đưa ra quyết định sáng suốt về những viên đá quý của mình.',

  // Services
  'service.valuation.title': 'Định Giá Kim Cương',
  'service.valuation.description':
    'Thẩm định kim cương chính xác sử dụng công nghệ tiên tiến và phân tích chuyên môn cho bảo hiểm, bán lại, hoặc hiểu biết cá nhân.',
  'service.certification.title': 'Chứng Nhận',
  'service.certification.description':
    'Dịch vụ chứng nhận kim cương chuyên nghiệp để xác thực và ghi nhận những đặc điểm chính xác của kim cương.',
  'service.consultation.title': 'Tư Vấn Chuyên Gia',
  'service.consultation.description':
    'Hướng dẫn cá nhân từ các chuyên gia kim cương giúp bạn hiểu về chất lượng và giá trị của viên đá quý.',

  // Valuation Process
  'process.title': 'Quy Trình',
  'process.titleHighlight': 'Định Giá',
  'process.description':
    'Trải nghiệm quy trình hợp lý được thiết kế để mang đến định giá kim cương chính xác với thời gian chờ tối thiểu và tính minh bạch tối đa.',
  'process.step1.title': 'Gửi Yêu Cầu',
  'process.step1.description':
    'Điền vào biểu mẫu trực tuyến chi tiết với thông tin về kim cương của bạn. Bao gồm càng nhiều chi tiết càng tốt như chứng nhận, nguồn gốc và đặc điểm vật lý.',
  'process.step2.title': 'Tư Vấn',
  'process.step2.description':
    'Nhân viên tư vấn sẽ liên hệ với bạn để thảo luận về nhu cầu định giá và sắp xếp để kim cương được kiểm tra bởi các chuyên gia.',
  'process.step3.title': 'Định Giá Chuyên Gia',
  'process.step3.description':
    'Các nhà kim cương học thực hiện phân tích toàn diện bằng thiết bị tiên tiến để đánh giá tất cả khía cạnh theo tiêu chuẩn quốc tế.',
  'process.step4.title': 'Nhận Chứng Chỉ',
  'process.step4.description':
    'Nhận chứng chỉ định giá toàn diện với tất cả chi tiết về đặc điểm, chất lượng và giá trị ước tính trong điều kiện thị trường hiện tại.',
  'process.startNow': 'Bắt Đầu Định Giá Ngay',

  // Featured Diamonds
  'featured.diamonds.title': 'Kim Cương',
  'featured.diamonds.titleHighlight': 'Nổi Bật',
  'featured.diamonds.description':
    'Khám phá bộ sưu tập kim cương đặc biệt của chúng tôi, mỗi viên đều có đặc điểm độc đáo và vẻ đẹp xuất sắc.',
  'featured.diamonds.carat': 'Carat',
  'featured.diamonds.clarity': 'Độ Tinh Khiết:',
  'featured.diamonds.color': 'Màu Sắc:',
  'featured.diamonds.cut': 'Cắt Gọt:',
  'featured.diamonds.origin': 'Nguồn Gốc:',
  'featured.diamonds.viewDetails': 'Xem Chi Tiết',
  'featured.diamonds.viewAll': 'Xem Tất Cả Kim Cương',

  // Knowledge Base
  'knowledge.title': 'Kiến Thức',
  'knowledge.titleHighlight': 'Kim Cương',
  'knowledge.description':
    'Nâng cao hiểu biết về kim cương với các bài viết, hướng dẫn và tài nguyên chuyên môn.',
  'knowledge.searchPlaceholder': 'Tìm kiếm bài viết, hướng dẫn và thông tin chuyên sâu...',
  'knowledge.allArticles': 'Tất Cả Bài Viết',
  'knowledge.featuredArticles': 'Bài Viết Nổi Bật',
  'knowledge.featuredDescription':
    'Bắt đầu với những hướng dẫn cần thiết để hiểu về kim cương và định giá.',
  'knowledge.readMore': 'Đọc Thêm',
  'knowledge.articlesFound': 'bài viết được tìm thấy',
  'knowledge.articleFound': 'bài viết được tìm thấy',
  'knowledge.category.basics': 'Kiến Thức Cơ Bản',
  'knowledge.category.valuation': 'Định Giá',
  'knowledge.category.care': 'Chăm Sóc',
  'knowledge.category.investment': 'Đầu Tư',
  'knowledge.category.certification': 'Chứng Nhận',
  'knowledge.category.basicsArticles': 'Bài Viết Kiến Thức Cơ Bản',
  'knowledge.category.valuationArticles': 'Bài Viết Định Giá',
  'knowledge.category.careArticles': 'Bài Viết Chăm Sóc',
  'knowledge.category.investmentArticles': 'Bài Viết Đầu Tư',
  'knowledge.category.certificationArticles': 'Bài Viết Chứng Nhận',
  'knowledge.exploreAll': 'Khám Phá Tất Cả Bài Viết',

  // Call to Action
  'cta.title': 'Sẵn Sàng Khám Phá',
  'cta.titleHighlight': 'Giá Trị Thực',
  'cta.description':
    'Bắt đầu hành trình định giá kim cương ngay hôm nay với đội ngũ chuyên gia và nhận được đánh giá toàn diện về viên đá quý của bạn.',
  'cta.getStarted': 'Bắt Đầu Ngay',

  // Footer
  'footer.description':
    'Đối tác đáng tin cậy cho định giá kim cương, chứng nhận và chuyên môn trong thế giới đá quý cao cấp.',
  'footer.quickLinks': 'Liên Kết Nhanh',
  'footer.home': 'Trang Chủ',
  'footer.knowledge': 'Kiến Thức Kim Cương',
  'footer.valuationTool': 'Công Cụ Định Giá',
  'footer.shop': 'Cửa Hàng',
  'footer.blog': 'Blog',
  'footer.support': 'Hỗ Trợ',
  'footer.faq': 'Câu Hỏi Thường Gặp',
  'footer.contact': 'Liên Hệ',
  'footer.terms': 'Điều Khoản & Điều Kiện',
  'footer.privacy': 'Chính Sách Bảo Mật',
  'footer.newsletter': 'Bản Tin',
  'footer.newsletterDescription':
    'Đăng ký bản tin để nhận xu hướng kim cương mới nhất và thông tin định giá.',
  'footer.email': 'Email của bạn',
  'footer.subscribe': 'Đăng Ký',
  'footer.copyright': '© {year} Hệ Thống Định Giá Kim Cương. Tất cả quyền được bảo lưu.',

  // Search
  'search.placeholder': 'Tìm kiếm kim cương, định giá, hoặc bài viết...',
  'search.popularSearches': 'Tìm Kiếm Phổ Biến',
  'search.certification': 'Chứng nhận kim cương',
  'search.4cs': '4C của kim cương',
  'search.process': 'Quy trình định giá',
  'search.care': 'Chăm sóc kim cương',

  // Valuation Tool
  'valuation.title': 'Công Cụ',
  'valuation.titleHighlight': 'Định Giá',
  'valuation.tool': 'Kim Cương',
  'valuation.description':
    'Nhận ước tính giá trị kim cương bằng cách cung cấp đặc điểm của nó. Hoàn thành biểu mẫu dưới đây để được định giá chuyên nghiệp.',
  'valuation.step': 'Bước',
  'valuation.of': 'của',
  'valuation.complete': '% Hoàn Thành',
  'valuation.previous': 'Trước',
  'valuation.continue': 'Tiếp Tục',
  'valuation.getEstimate': 'Nhận Ước Tính',
  'valuation.help': 'Cần hỗ trợ với biểu mẫu định giá?',
  'valuation.contactExperts': 'Liên hệ chuyên gia',

  // Valuation Form Steps
  'step1.title': 'Nhận Dạng Kim Cương',
  'step1.description':
    'Nhập thông tin chứng chỉ kim cương nếu có, hoặc tiếp tục mà không cần.',
  'step1.hasCertificate': 'Tôi có chứng chỉ/báo cáo phân loại kim cương',
  'step1.certificateNumber': 'Số Chứng Chỉ',
  'step1.certificateType': 'Loại Chứng Chỉ',
  'step1.origin': 'Nguồn Gốc (nếu biết)',
  'step1.note':
    'Lưu ý: Bằng cách cung cấp số chứng chỉ, chúng tôi có thể tự động truy xuất một số thông tin, điều này sẽ giúp ích trong quá trình định giá.',

  'step2.title': 'Đặc Điểm Cơ Bản',
  'step2.description': 'Cho chúng tôi biết về các thuộc tính cơ bản của kim cương.',
  'step2.shape': 'Hình Dạng',
  'step2.caratWeight': 'Trọng Lượng Carat',
  'step2.shapeGuide': 'Hướng Dẫn Hình Dạng Kim Cương',

  'step3.title': 'Màu Sắc và Độ Tinh Khiết',
  'step3.description':
    'Những đặc điểm quan trọng này ảnh hưởng đáng kể đến giá trị kim cương.',
  'step3.colorGrade': 'Cấp Độ Màu',
  'step3.clarityGrade': 'Cấp Độ Tinh Khiết',
  'step3.didYouKnow': 'Bạn có biết?',
  'step3.didYouKnowText':
    'Màu sắc và độ tinh khiết là hai trong số "4 C" quyết định giá trị kim cương. Thang màu từ D (không màu) đến Z (vàng nhạt hoặc nâu nhạt), trong khi độ tinh khiết đo sự vắng mặt của tạp chất và khuyết điểm, từ Hoàn Hảo (FL) đến Có Tạp Chất (I3).',

  'step4.title': 'Đặc Điểm Cắt Gọt',
  'step4.description':
    'Chất lượng cắt gọt ảnh hưởng đáng kể đến cách ánh sáng tương tác với kim cương.',
  'step4.cutGrade': 'Cấp Độ Cắt Gọt',
  'step4.polish': 'Đánh Bóng',
  'step4.symmetry': 'Đối Xứng',
  'step4.fluorescence': 'Huỳnh Quang',
  'step4.cutQuality': 'Tác Động Chất Lượng Cắt Gọt',
  'step4.excellentCut': 'Cắt Gọt Xuất Sắc',
  'step4.maxBrilliance': 'Độ Lấp Lánh Tối Đa',
  'step4.goodCut': 'Cắt Gọt Tốt',
  'step4.goodBrilliance': 'Độ Lấp Lánh Tốt',
  'step4.poorCut': 'Cắt Gọt Kém',
  'step4.limitedBrilliance': 'Độ Lấp Lánh Hạn Chế',

  'step5.title': 'Kích Thước (Tùy Chọn)',
  'step5.description': 'Nếu biết, vui lòng cung cấp kích thước vật lý của kim cương.',
  'step5.length': 'Chiều Dài (mm)',
  'step5.width': 'Chiều Rộng (mm)',
  'step5.depth': 'Chiều Sâu (mm)',
  'step5.guide': 'Hướng Dẫn Kích Thước Kim Cương',
  'step5.guideTip':
    'Kích thước chính xác giúp cung cấp định giá chính xác hơn, đặc biệt khi kết hợp với trọng lượng và các đặc điểm khác.',

  'step6.title': 'Thông Tin Bổ Sung',
  'step6.description': 'Bất kỳ chi tiết nào khác có thể ảnh hưởng đến định giá kim cương.',
  'step6.hasInclusions': 'Có tạp chất hoặc khuyết điểm nhìn thấy được',
  'step6.hasSettings': 'Kim cương đang trong khung cài/trang sức',
  'step6.settingMaterial': 'Chất Liệu Khung Cài',
  'step6.additionalNotes': 'Ghi Chú Bổ Sung',
  'step6.notesPlaceholder':
    'Bất kỳ chi tiết nào khác về kim cương có thể liên quan đến định giá...',
  'step6.helpfulTip': 'Mẹo Hữu Ích',
  'step6.helpfulTipText':
    'Nếu kim cương của bạn trong khung cài, chúng tôi cung cấp định giá riêng cho kim cương và khung cài. Nếu bạn muốn định giá toàn bộ món trang sức, vui lòng ghi rõ trong ghi chú bổ sung.',

  'step7.title': 'Thông Tin Liên Hệ',
  'step7.description':
    'Vui lòng cung cấp thông tin liên hệ để chúng tôi có thể gửi kết quả định giá.',
  'step7.fullName': 'Họ Tên Đầy Đủ',
  'step7.email': 'Địa Chỉ Email',
  'step7.phone': 'Số Điện Thoại',
  'step7.preferredContact': 'Phương Thức Liên Hệ Ưa Thích',
  'step7.agreement': 'Tôi đồng ý với',
  'step7.terms': 'Điều Khoản & Điều Kiện',
  'step7.privacy': 'Chính Sách Bảo Mật',

  // Results
  'results.calculating': 'Đang tính toán ước tính...',
  'results.estimatedValue': 'Giá Trị Kim Cương Ước Tính',
  'results.basedOn': 'Dựa trên thông tin bạn cung cấp',
  'results.marketValue': 'Giá trị thị trường ước tính',
  'results.importantNote': 'Lưu Ý Quan Trọng:',
  'results.noteText':
    'Đây là ước tính tự động dựa trên thông tin được cung cấp. Để có định giá chính xác, chúng tôi khuyến nghị đặt lịch đánh giá trực tiếp với các nhà kim cương học chuyên nghiệp.',
  'results.summary': 'Tóm Tắt Kim Cương',
  'results.nextSteps': 'Bước Tiếp Theo',
  'results.requestSubmitted':
    'Yêu cầu định giá đã được gửi thành công! Một thành viên trong đội ngũ sẽ liên hệ với bạn tại {email} trong vòng 24 giờ.',
  'results.submittedSuccessfully': '✅ Yêu Cầu Đã Gửi Thành Công',
  'results.referenceId': 'Mã Tham Chiếu: {id}',
  'results.trackRequest': 'Theo Dõi Yêu Cầu',
  'results.viewSample': 'Xem Kết Quả Mẫu',
  'results.newRequest': 'Yêu Cầu Mới',

  // Shop Page (VI)
  'shop.title': 'Bộ Sưu Tập',
  'shop.titleHighlight': 'Kim Cương',
  'shop.description':
    'Khám phá bộ sưu tập kim cương và trang sức cao cấp được chứng nhận của chúng tôi, mỗi món đều được lựa chọn cẩn thận vì chất lượng và vẻ đẹp đặc biệt.',
  'shop.filters': 'Bộ Lọc',
  'shop.category': 'Danh Mục',
  'shop.allProducts': 'Tất Cả Sản Phẩm',
  'shop.priceRange': 'Khoảng Giá',
  'shop.quickFilters': 'Bộ Lọc Nhanh',
  'shop.under5k': 'Dưới $5.000',
  'shop.5to10k': '$5.000 - $10.000',
  'shop.10to20k': '$10.000 - $20.000',
  'shop.over20k': 'Trên $20.000',
  'shop.productsFound': 'Tìm thấy {count} sản phẩm{plural}',
  'shop.featured': 'Nổi Bật',
  'shop.priceLowHigh': 'Giá: Thấp đến Cao',
  'shop.priceHighLow': 'Giá: Cao đến Thấp',
  'shop.nameAZ': 'Tên: A đến Z',
  'shop.shape': 'Hình Dạng',
  'shop.carat': 'Carat',
  'shop.color': 'Màu',
  'shop.clarity': 'Tinh Khiết',
  'shop.view': 'Xem',
  'shop.addToCart': 'Thêm Vào Giỏ',
  'shop.noProducts': 'Không tìm thấy sản phẩm',
  'shop.noProductsDesc': 'Thử điều chỉnh bộ lọc hoặc tiêu chí tìm kiếm.',
  'shop.resetFilters': 'Đặt Lại Bộ Lọc',
  'shop.needHelp': 'Cần Hỗ Trợ Lựa Chọn?',
  'shop.needHelpDesc':
    'Các chuyên gia kim cương của chúng tôi sẵn sàng giúp bạn tìm món trang sức hoàn hảo. Nhận tư vấn cá nhân và hướng dẫn chuyên nghiệp.',
  'shop.getValuation': 'Nhận Định Giá',
  'shop.contactExpert': 'Liên Hệ Chuyên Gia',

  // Cart Page (VI)
  'cart.title': 'Giỏ',
  'cart.titleHighlight': 'Hàng',
  'cart.description': 'Xem lại các mặt hàng đã chọn và tiến hành thanh toán',
  'cart.empty': 'Giỏ hàng của bạn trống',
  'cart.emptyDesc': 'Khám phá bộ sưu tập kim cương và trang sức tuyệt đẹp của chúng tôi.',
  'cart.continueShopping': 'Tiếp Tục Mua Sắm',
  'cart.quantity': 'SL',
  'cart.remove': 'Xóa',
  'cart.orderSummary': 'Tóm Tắt Đơn Hàng',
  'cart.subtotal': 'Tạm Tính',
  'cart.shipping': 'Vận Chuyển',
  'cart.free': 'Miễn Phí',
  'cart.tax': 'Thuế (ước tính)',
  'cart.total': 'Tổng Cộng',
  'cart.proceedCheckout': 'Tiến Hành Thanh Toán',
  'cart.requestQuote': 'Yêu Cầu Báo Giá',
  'cart.whyChoose': 'Tại Sao Chọn Chúng Tôi?',
  'cart.securePayments': 'Thanh Toán An Toàn',
  'cart.freeShipping': 'Miễn Phí Vận Chuyển',
  'cart.lifetimeWarranty': 'Bảo Hành Trọn Đời',
  'cart.needHelp': 'Cần hỗ trợ với đơn hàng?',
  'cart.contactExperts': 'Liên Hệ Chuyên Gia',

  // Common (VI)
  'common.required': '*',
  'common.select': 'Chọn',
  'common.unknown': 'Không rõ',
  'common.other': 'Khác',
  'common.yes': 'Có',
  'common.no': 'Không',
  'common.loading': 'Đang tải...',
  'common.error': 'Lỗi',
  'common.success': 'Thành công',
  'common.cancel': 'Hủy',
  'common.save': 'Lưu',
  'common.edit': 'Chỉnh sửa',
  'common.delete': 'Xóa',
  'common.view': 'Xem',
  'common.close': 'Đóng',
  'common.back': 'Quay lại',
  'common.next': 'Tiếp theo',
  'common.previous': 'Trước',
  'common.continue': 'Tiếp tục',
  'common.submit': 'Gửi',
  'common.reset': 'Đặt lại',
  'common.clear': 'Xóa',
  'common.openMenu': 'Mở menu chính',
  'common.search': 'Tìm kiếm',

  // Placeholders (VI)
  'placeholder.certificateNumber': 'VD: GIA 1234567890',
  'placeholder.carat': 'VD: 1.25',
  'placeholder.length': 'VD: 7.25',
  'placeholder.width': 'VD: 7.20',
  'placeholder.depth': 'VD: 4.35',
  'placeholder.fullName': 'Họ và tên của bạn',
  'placeholder.email': 'Nhập email của bạn',
  'placeholder.emailFormat': 'email.cua.ban@example.com',
  'placeholder.phone': 'Số điện thoại của bạn',
  'placeholder.phoneFormat': '(084) 123-4567',
  'placeholder.password': 'Nhập mật khẩu của bạn',
  'placeholder.firstName': 'Tên',
  'placeholder.lastName': 'Họ',
  'placeholder.createPassword': 'Tạo mật khẩu',
  'placeholder.confirmPassword': 'Xác nhận mật khẩu',

  // Admin placeholders (VI)
  'placeholder.searchUsers': 'Tìm kiếm người dùng...',
  'placeholder.searchProducts': 'Tìm kiếm sản phẩm...',
  'placeholder.revenueChart': '[Biểu Đồ Doanh Thu]',
  'placeholder.customerChart': '[Biểu Đồ Khách Hàng]',

  // Staff placeholders (VI)
  'placeholder.marketValue': 'Giá Trị Thị Trường ($)',
  'placeholder.insuranceValue': 'Giá Trị Bảo Hiểm ($)',
  'placeholder.retailValue': 'Giá Trị Bán Lẻ',
  'placeholder.notesObservations': 'Ghi chú và quan sát...',
  'placeholder.contactOutcome': 'Ghi lại kết quả liên hệ với khách hàng...',
  'placeholder.diamondType': 'Loại Kim Cương',
  'placeholder.caratWeight': 'Trọng Lượng Carat',
  'placeholder.colorGrade': 'Cấp Độ Màu',
  'placeholder.clarityGrade': 'Cấp Độ Tinh Khiết',
  'placeholder.cutGrade': 'Cấp Độ Cắt Gọt',
  'placeholder.receiptNumber': 'Số Hóa Đơn',
  'placeholder.estimatedValue': 'Giá Trị Ước Tính',
  'placeholder.handlingInstructions':
    'Hướng dẫn xử lý đặc biệt hoặc ghi chú cho nhân viên định giá...',
  'placeholder.certificationDetails': 'Số chứng nhận GIA/AGS, chi tiết...',
  'placeholder.detailedAnalysis': 'Phân tích chi tiết, quan sát, phương pháp sử dụng...',

  // Checkout placeholders (VI)
  'placeholder.cardNumber': '1234 5678 9012 3456',
  'placeholder.expiryDate': 'MM/YY',
  'placeholder.cvv': '123',
  'placeholder.orderNotes': 'Hướng dẫn giao hàng đặc biệt hoặc tin nhắn quà tặng...',

  // FAQ Page (VI)
  'faq.title': 'Câu Hỏi Thường',
  'faq.titleHighlight': 'Gặp',
  'faq.description':
    'Tìm câu trả lời cho các câu hỏi thường gặp về định giá kim cương, dịch vụ của chúng tôi và quy trình thẩm định.',
  'faq.searchPlaceholder': 'Tìm kiếm câu trả lời...',
  'faq.allCategories': 'Tất Cả Danh Mục',
  'faq.generalQuestions': 'Câu Hỏi Chung',
  'faq.valuationProcess': 'Quy Trình Định Giá',
  'faq.pricingFees': 'Giá & Phí',
  'faq.certificates': 'Chứng Nhận',
  'faq.shippingSafety': 'Vận Chuyển & An Toàn',
  'faq.accountSupport': 'Tài Khoản & Hỗ Trợ',
  'faq.noResults': 'Không tìm thấy kết quả',
  'faq.noResultsDesc': 'Thử điều chỉnh thuật ngữ tìm kiếm hoặc duyệt các danh mục khác.',
  'faq.clearSearch': 'Xóa Tìm Kiếm',
  'faq.popularTopics': 'Chủ Đề Phổ Biến',
  'faq.diamondGrading': '💎 Phân Loại Kim Cương',
  'faq.diamondGradingDesc':
    'Tìm hiểu về 4C và cách chúng tôi đánh giá chất lượng và đặc điểm kim cương.',
  'faq.pricingFeesDesc':
    'Hiểu về cấu trúc giá minh bạch và những gì được bao gồm trong mỗi dịch vụ.',
  'faq.certificatesDesc':
    'Thông tin về chứng nhận kim cương và cách chúng ảnh hưởng đến định giá.',
  'faq.shippingSafetyDesc':
    'Thực hành vận chuyển an toàn và bảo hiểm cho các vật phẩm có giá trị.',
  'faq.viewQuestions': 'Xem câu hỏi →',
  'faq.readyToStart': 'Sẵn Sàng Bắt Đầu?',
  'faq.readyToStartDesc':
    'Nếu bạn không tìm thấy câu trả lời mình tìm kiếm, đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn một cách cá nhân.',
  'faq.startValuation': 'Bắt Đầu Định Giá',
  'faq.contactSupport': 'Liên Hệ Hỗ Trợ',

  // FAQ Categories (VI)
  'faq.categories.all': 'Tất Cả Câu Hỏi',
  'faq.categories.valuation': 'Quy Trình Định Giá',
  'faq.categories.pricing': 'Giá & Phí',
  'faq.categories.shipping': 'Vận Chuyển & An Toàn',
  'faq.categories.certificates': 'Chứng Nhận',
  'faq.categories.account': 'Tài Khoản & Hỗ Trợ',
  'faq.categoriesTitle': 'Danh Mục',
  'faq.stillHaveQuestions': 'Vẫn Còn Thắc Mắc?',
  'faq.contactUs': 'Liên Hệ Chúng Tôi',
  'faq.question': 'câu hỏi',
  'faq.questions': 'câu hỏi',
  'faq.searchResults': 'Kết quả tìm kiếm cho',

  // FAQ Topics (VI)
  'faq.topics.diamondGrading': 'Phân Loại Kim Cương',
  'faq.topics.diamondGradingDesc':
    'Tìm hiểu về 4C và cách chúng tôi đánh giá chất lượng và đặc điểm kim cương.',
  'faq.topics.pricingFees': 'Giá & Phí',
  'faq.topics.pricingFeesDesc':
    'Hiểu về cấu trúc giá minh bạch và những gì được bao gồm trong mỗi dịch vụ.',
  'faq.topics.certificates': 'Chứng Nhận',
  'faq.topics.certificatesDesc':
    'Thông tin về chứng nhận kim cương và cách chúng ảnh hưởng đến định giá.',
  'faq.topics.shippingSafety': 'Vận Chuyển & An Toàn',
  'faq.topics.shippingSafetyDesc':
    'Thực hành vận chuyển an toàn và bảo hiểm cho các vật phẩm có giá trị.',

  // FAQ Q&A (VI)
  'faq.questions.valuationTime': 'Việc định giá kim cương mất bao lâu?',
  'faq.answers.valuationTime':
    'Một việc định giá kim cương tiêu chuẩn thường mất 3-5 ngày làm việc kể từ khi chúng tôi nhận được món đồ của bạn. Dịch vụ nhanh có sẵn cho các yêu cầu khẩn cấp, có thể hoàn thành trong vòng 24-48 giờ với phí bổ sung.',

  'faq.questions.informationNeeded': 'Tôi cần cung cấp thông tin gì để định giá?',
  'faq.answers.informationNeeded':
    'Để có được định giá chính xác nhất, vui lòng cung cấp bất kỳ chứng nhận hiện có (GIA, AGS, v.v.), hóa đơn mua hàng, tài liệu bảo hiểm và ảnh chi tiết. Biểu mẫu trực tuyến của chúng tôi sẽ hướng dẫn bạn qua tất cả thông tin cần thiết.',

  'faq.questions.valuationCost': 'Việc định giá kim cương có giá bao nhiêu?',
  'faq.answers.valuationCost':
    'Phí định giá của chúng tôi bắt đầu từ $150 cho dịch vụ tiêu chuẩn. Giá cả thay đổi dựa trên độ phức tạp của món đồ, số lượng viên đá và thời gian hoàn thành. Liên hệ với chúng tôi để có báo giá chi tiết dựa trên nhu cầu cụ thể của bạn.',

  'faq.questions.valuationDifference':
    'Sự khác biệt giữa giá trị thị trường và giá trị bảo hiểm là gì?',
  'faq.answers.valuationDifference':
    'Giá trị thị trường đại diện cho những gì bạn có thể mong đợi nhận được nếu bán kim cương ngày hôm nay. Giá trị bảo hiểm (giá trị thay thế) thường cao hơn 20-40% và đại diện cho chi phí để thay thế món đồ bằng một món có chất lượng tương tự.',

  'faq.questions.insuranceAppraisals': 'Bạn có cung cấp thẩm định bảo hiểm không?',
  'faq.answers.insuranceAppraisals':
    'Có, chúng tôi cung cấp thẩm định được chứng nhận được chấp nhận bởi tất cả các công ty bảo hiểm lớn. Thẩm định của chúng tôi đáp ứng tiêu chuẩn ngành và bao gồm mô tả chi tiết, ảnh chụp và định giá thị trường hiện tại.',

  'faq.questions.safeShipping': 'Bạn đảm bảo vận chuyển an toàn các vật phẩm có giá trị như thế nào?',
  'faq.answers.safeShipping':
    'Chúng tôi sử dụng vận chuyển được bảo hiểm đầy đủ, yêu cầu chữ ký với theo dõi. Các món đồ được đóng gói trong thùng chứa kín đáo, an toàn. Chúng tôi cũng cung cấp dịch vụ giao nhận tại chỗ ở các khu vực đô thị lớn.',

  'faq.questions.valueTypes': 'Bạn cung cấp những loại giá trị nào?',
  'faq.answers.valueTypes':
    'Chúng tôi cung cấp nhiều loại định giá bao gồm Giá Trị Thị Trường Công Bằng, Giá Trị Thay Thế Bảo Hiểm, Giá Trị Di Sản/Thừa Kế và Giá Trị Thanh Lý, tùy thuộc vào nhu cầu cụ thể và mục đích sử dụng của bạn.',

  'faq.questions.coloredDiamonds':
    'Bạn có thẩm định kim cương màu và hình dạng đặc biệt không?',
  'faq.answers.coloredDiamonds':
    'Hoàn toàn có! Các chuyên gia đá quý được chứng nhận của chúng tôi có kinh nghiệm phong phú với kim cương màu đặc biệt, hình dạng hiếm và các món đồ độc đáo. Định giá kim cương màu có thể cần thêm thời gian do tính chất chuyên biệt.',

  'faq.questions.certificatesAccepted': 'Bạn chấp nhận những chứng nhận kim cương nào?',
  'faq.answers.certificatesAccepted':
    'Chúng tôi làm việc với kim cương được chứng nhận bởi GIA, AGS, Gübelin, SSEF, AGL và các phòng thí nghiệm uy tín khác. Nếu kim cương của bạn thiếu chứng nhận, chúng tôi có thể sắp xếp phân loại chuyên nghiệp như một phần của quy trình định giá.',

  'faq.questions.multipleItemsDiscount': 'Bạn có giảm giá cho nhiều món đồ không?',
  'faq.answers.multipleItemsDiscount':
    'Có, chúng tôi cung cấp giảm giá số lượng cho nhiều món đồ. Liên hệ với chúng tôi với chi tiết về bộ sưu tập của bạn để có báo giá tùy chỉnh. Thẩm định di sản và bộ sưu tập nhận được cân nhắc giá đặc biệt.',

  'faq.questions.trackRequest': 'Làm thế nào tôi có thể theo dõi yêu cầu định giá của mình?',
  'faq.answers.trackRequest':
    'Sau khi bạn gửi yêu cầu, bạn sẽ nhận được số theo dõi và quyền truy cập vào cổng khách hàng nơi bạn có thể theo dõi tiến độ, giao tiếp với chuyên gia đá quý được phân công và nhận cập nhật theo thời gian thực.',

  'faq.questions.lossOrDamage': 'Điều gì xảy ra nếu món đồ của tôi bị mất hoặc hư hỏng trong quá trình vận chuyển?',
  'faq.answers.lossOrDamage':
    'Tất cả các món đồ được bảo hiểm đầy đủ trong quá trình vận chuyển và khi đang trong sự bảo quản của chúng tôi. Trong trường hợp không may mất mát hoặc hư hỏng, chính sách bảo hiểm toàn diện của chúng tôi sẽ cung cấp bồi thường đầy đủ dựa trên giá trị khai báo.',

  // Checkout Page (VI)
  'checkout.title': 'Thanh Toán An Toàn',
  'checkout.description': 'Hoàn tất việc mua hàng một cách an toàn',
  'checkout.shippingInfo': 'Thông Tin Giao Hàng',
  'checkout.paymentInfo': 'Thông Tin Thanh Toán',
  'checkout.firstName': 'Tên',
  'checkout.lastName': 'Họ',
  'checkout.address': 'Địa Chỉ',
  'checkout.city': 'Thành Phố',
  'checkout.state': 'Tỉnh/Bang',
  'checkout.zipCode': 'Mã Bưu Điện',
  'checkout.country': 'Quốc Gia',
  'checkout.cardNumber': 'Số Thẻ',
  'checkout.expiryDate': 'MM/YY',
  'checkout.cvv': 'CVV',
  'checkout.cardName': 'Tên Chủ Thẻ',
  'checkout.orderNotes': 'Ghi Chú Đơn Hàng',
  'checkout.newsletter': 'Đăng ký nhận tin tức',
  'checkout.insurance': 'Thêm bảo hiểm vận chuyển',
  'checkout.placeOrder': 'Đặt Hàng',
  'checkout.processing': 'Đang xử lý...',
  'checkout.backToPayment': 'Quay Lại Thanh Toán',
  'checkout.backToShipping': 'Quay Lại Giao Hàng',
  'checkout.continue': 'Tiếp Tục',
  'checkout.moneyBackGuarantee': 'Đảm Bảo Hoàn Tiền 30 Ngày',

  // Contact Page (VI)
  'contact.title': 'Liên Hệ',
  'contact.titleHighlight': 'Chuyên Gia',
  'contact.description':
    'Liên hệ với các chuyên gia kim cương của chúng tôi để được hỗ trợ cá nhân về định giá, mua hàng hoặc bất kỳ câu hỏi nào về kim cương.',
  'contact.messageSent': 'Tin Nhắn Đã Gửi!',
  'contact.messageReceived':
    'Cảm ơn bạn đã liên hệ với chúng tôi! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi trong vòng 24 giờ.',
  'contact.backToHome': 'Về Trang Chủ',
  'contact.sendAnother': 'Gửi Tin Nhắn Khác',
  'contact.name': 'Họ Tên Đầy Đủ',
  'contact.subject': 'Chủ Đề',
  'contact.message': 'Tin Nhắn',
  'contact.contactMethod': 'Phương Thức Liên Hệ Ưa Thích',
  'contact.email': 'Email',
  'contact.phone': 'Điện Thoại',
  'contact.either': 'Cả Hai',
  'contact.sending': 'Đang gửi...',
  'contact.sendMessage': 'Gửi Tin Nhắn',
  'contact.officeHours': 'Giờ Làm Việc',
  'contact.mondayFriday': 'Thứ Hai - Thứ Sáu: 9:00 - 18:00',
  'contact.saturday': 'Thứ Bảy: 10:00 - 16:00',
  'contact.sunday': 'Chủ Nhật: Đóng cửa',
  'contact.phoneNumber': 'Số Điện Thoại',
  'contact.emailAddress': 'Địa Chỉ Email',
  'contact.address': 'Địa Chỉ',
  'contact.officeAddress': '123 Khu Kim Cương, New York, NY 10036',
  'contact.faqsTitle': 'Câu Hỏi Thường Gặp',
  'contact.howLongValuation': 'Định giá mất bao lâu?',
  'contact.howLongAnswer': 'Hầu hết các định giá được hoàn thành trong vòng 3-5 ngày làm việc kể từ khi nhận.',
  'contact.whatInfoNeeded': 'Tôi cần cung cấp thông tin gì?',
  'contact.whatInfoAnswer':
    'Ảnh chất lượng cao, chứng chỉ và kích thước cơ bản giúp chúng tôi cung cấp định giá chính xác.',
  'contact.insuranceAccepted': 'Định giá của bạn có được các công ty bảo hiểm chấp nhận không?',
  'contact.insuranceAnswer':
    'Có, định giá được chứng nhận của chúng tôi được tất cả các công ty bảo hiểm lớn chấp nhận.',
  'contact.viewCredentials': 'Xem thông tin chứng nhận →',

  // Product Detail Page (VI)
  'product.notFound': 'Không Tìm Thấy Sản Phẩm',
  'product.notFoundDesc': 'Sản phẩm bạn tìm kiếm không tồn tại.',
  'product.backToShop': 'Quay Lại Cửa Hàng',
  'product.breadcrumbHome': 'Trang Chủ',
  'product.breadcrumbShop': 'Cửa Hàng',
  'product.addToCart': 'Thêm Vào Giỏ',
  'product.buyNow': 'Mua Ngay',
  'product.guarantees': 'Đảm Bảo',
  'product.certifiedAuthentic': 'Chứng Nhận Chính Hãng',
  'product.thirtyDayReturn': 'Đổi Trả 30 Ngày',
  'product.freeShipping': 'Miễn Phí Vận Chuyển',
  'product.lifetimeWarranty': 'Bảo Hành Trọn Đời',
  'product.needHelp': 'Cần hỗ trợ hoặc có câu hỏi về sản phẩm này?',
  'product.contactExpert': 'Liên Hệ Chuyên Gia',
  'product.getValuation': 'Nhận Định Giá',

  // Validation (VI)
  'validation.required': 'Trường này là bắt buộc',
  'validation.email': 'Địa chỉ email không hợp lệ',
  'validation.phone': 'Số điện thoại hợp lệ là bắt buộc',
  'validation.shape': 'Hình dạng là bắt buộc',
  'validation.caratWeight': 'Trọng lượng carat là bắt buộc',
  'validation.color': 'Màu sắc là bắt buộc',
  'validation.clarity': 'Độ tinh khiết là bắt buộc',
  'validation.cut': 'Cắt gọt là bắt buộc',
  'validation.polish': 'Đánh bóng là bắt buộc',
  'validation.symmetry': 'Đối xứng là bắt buộc',
  'validation.fluorescence': 'Huỳnh quang là bắt buộc',
  'validation.fullName': 'Họ tên đầy đủ là bắt buộc',
  'validation.preferredContact': 'Phương thức liên hệ ưa thích là bắt buộc',

  // Auth (VI)
  'auth.login': 'Đăng Nhập',
  'auth.register': 'Đăng Ký',
  'auth.welcomeBack': 'Chào Mừng Trở Lại',
  'auth.loginDescription':
    'Đăng nhập vào tài khoản của bạn để truy cập bảng điều khiển và theo dõi các định giá của bạn.',
  'auth.createAccount': 'Tạo Tài Khoản',
  'auth.registerDescription':
    'Tạo tài khoản để truy cập các tính năng độc quyền và theo dõi lịch sử định giá kim cương của bạn.',
  'auth.email': 'Email',
  'auth.password': 'Mật Khẩu',
  'auth.confirmPassword': 'Xác Nhận Mật Khẩu',
  'auth.firstName': 'Tên',
  'auth.lastName': 'Họ',
  'auth.rememberMe': 'Ghi nhớ đăng nhập',
  'auth.forgotPassword': 'Quên mật khẩu?',
  'auth.dontHaveAccount': 'Chưa có tài khoản?',
  'auth.alreadyHaveAccount': 'Đã có tài khoản?',
  'auth.signIn': 'Đăng Nhập',
  'auth.signUp': 'Đăng Ký',
  'auth.signingIn': 'Đang đăng nhập...',
  'auth.signingUp': 'Đang đăng ký...',
  'auth.invalidCredentials': 'Email hoặc mật khẩu không hợp lệ',
  'auth.emailExists': 'Email này đã được sử dụng',
  'auth.registrationSuccess': 'Đăng ký thành công! Vui lòng đăng nhập.',
  'auth.or': 'Hoặc',
  'auth.continueWithGoogle': 'Tiếp tục với Google',
  'auth.continueWithFacebook': 'Tiếp tục với Facebook',
  'auth.passwordsDontMatch': 'Mật khẩu không khớp',
  'auth.acceptTerms': 'Vui lòng đồng ý với điều khoản và điều kiện',
  'auth.termsAndConditions': 'Điều Khoản và Điều Kiện',
  'auth.privacyPolicy': 'Chính Sách Bảo Mật',
  'auth.agreeToTerms': 'Tôi đồng ý với',
  'auth.and': 'và',
  'auth.subscribeNewsletter': 'Đăng ký nhận bản tin để cập nhật thông tin',

  // Admin Dashboard (VI)
  'admin.title': 'Bảng Điều Khiển',
  'admin.titleHighlight': 'Quản Trị',
  'admin.description': 'Quản trị và quản lý hệ thống toàn diện',
  'admin.accessDenied': 'Từ Chối Truy Cập',
  'admin.noPermission': 'Bạn không có quyền truy cập trang này.',
  'admin.backToDashboard': 'Quay Lại Bảng Điều Khiển',

  // Admin Navigation (VI)
  'admin.overview': 'Tổng Quan',
  'admin.userManagement': 'Quản Lý Người Dùng',
  'admin.valuations': 'Định Giá',
  'admin.orders': 'Đơn Hàng',
  'admin.products': 'Sản Phẩm',
  'admin.staffManagement': 'Quản Lý Nhân Viên',
  'admin.analytics': 'Phân Tích',

  // System Configuration (VI)
  'admin.systemConfig': 'Cấu Hình Hệ Thống',
  'admin.pricingManagement': 'Quản Lý Giá Cả',
  'admin.baseValuationFee': 'Phí Định Giá Cơ Bản',
  'admin.insuranceAppraisalFee': 'Phí Thẩm Định Bảo Hiểm',
  'admin.turnaroundSettings': 'Cài Đặt Thời Gian Xử Lý',
  'admin.standardDays': 'Tiêu Chuẩn (Ngày Làm Việc)',
  'admin.expressDays': 'Nhanh (Ngày Làm Việc)',
  'admin.emergencyHours': 'Khẩn Cấp (Giờ)',
  'admin.emailNotifications': 'Thông Báo Email',
  'admin.sendOrderConfirmations': 'Gửi xác nhận đơn hàng',

  // User Management (VI)
  'admin.users': 'Người Dùng',
  'admin.customers': 'Khách Hàng',
  'admin.staff': 'Nhân Viên',
  'admin.admins': 'Quản Trị Viên',
  'admin.totalUsers': 'Tổng Số Người Dùng',
  'admin.activeUsers': 'Người Dùng Hoạt Động',
  'admin.newUsers': 'Người Dùng Mới',
  'admin.userDetails': 'Chi Tiết Người Dùng',
  'admin.role': 'Vai Trò',
  'admin.status': 'Trạng Thái',
  'admin.actions': 'Hành Động',
  'admin.edit': 'Chỉnh Sửa',
  'admin.delete': 'Xóa',
  'admin.view': 'Xem',
  'admin.active': 'Hoạt Động',
  'admin.inactive': 'Không Hoạt Động',
  'admin.banned': 'Bị Cấm',

  // Orders & Products (VI)
  'admin.totalOrders': 'Tổng Số Đơn Hàng',
  'admin.revenue': 'Doanh Thu',
  'admin.pending': 'Đang Chờ',
  'admin.completed': 'Đã Hoàn Thành',
  'admin.cancelled': 'Đã Hủy',
  'admin.orderValue': 'Giá Trị Đơn Hàng',
  'admin.customer': 'Khách Hàng',
  'admin.date': 'Ngày',
  'admin.amount': 'Số Tiền',

  // Analytics & Reports (VI)
  'admin.performanceOverview': 'Tổng Quan Hiệu Suất',
  'admin.revenueAnalytics': 'Phân Tích Doanh Thu',
  'admin.userGrowth': 'Tăng Trưởng Người Dùng',
  'admin.orderTrends': 'Xu Hướng Đơn Hàng',
  'admin.monthlyRevenue': 'Doanh Thu Hàng Tháng',
  'admin.dailyOrders': 'Đơn Hàng Hàng Ngày',
  'admin.conversionRate': 'Tỷ Lệ Chuyển Đổi',
  'admin.averageOrderValue': 'Giá Trị Đơn Hàng Trung Bình',
  'admin.search': 'Tìm Kiếm',

  // Dashboard Stats (VI)
  'admin.keyMetrics': 'Chỉ Số Chính',
  'admin.fromLastMonth': 'từ tháng trước',
  'admin.quickActions': 'Hành Động Nhanh',
  'admin.manageUsers': 'Quản Lý Người Dùng',
  'admin.viewEditAccounts': 'Xem và chỉnh sửa tài khoản người dùng',
  'admin.valuationQueue': 'Hàng Đợi Định Giá',
  'admin.monitorPending': 'Theo dõi yêu cầu đang chờ',
  'admin.viewAnalytics': 'Xem Phân Tích',
  'admin.businessInsights': 'Thông tin kinh doanh',
  'admin.recentActivities': 'Hoạt Động Gần Đây',
  'admin.systemActivities': 'Hoạt Động Hệ Thống Gần Đây',

  // User Management Details (VI)
  'admin.addNewUser': 'Thêm Người Dùng Mới',
  'admin.totalCustomers': 'Tổng Số Khách Hàng',
  'admin.consultingStaff': 'Nhân Viên Tư Vấn',
  'admin.valuationStaff': 'Nhân Viên Định Giá',
  'admin.managers': 'Quản Lý',
  'admin.allUsers': 'Tất Cả Người Dùng',
  'admin.bulkActions': 'Hành Động Hàng Loạt',
  'admin.user': 'Người Dùng',
  'admin.lastActive': 'Hoạt Động Cuối',
  'admin.suspend': 'Tạm Ngưng',
  'admin.activate': 'Kích Hoạt',
  'admin.suspended': 'Bị Tạm Ngưng',

  // System Configuration Details (VI)
  'admin.sendValuationUpdates': 'Gửi cập nhật định giá',
  'admin.sendMarketingEmails': 'Gửi email tiếp thị',
  'admin.saveSettings': 'Lưu Cài Đặt',

  // Customer Dashboard (VI)
  'customer.dashboard': 'Bảng Điều Khiển Khách Hàng',
  'customer.welcomeBack': 'Chào mừng trở lại',
  'customer.requestValuation': 'Yêu Cầu Định Giá',
  'customer.browseShop': 'Duyệt Cửa Hàng',
  'customer.overview': 'Tổng Quan',
  'customer.valuations': 'Định Giá',
  'customer.orders': 'Đơn Hàng',
  'customer.appointments': 'Cuộc Hẹn',
  'customer.profile': 'Hồ Sơ',

  // Staff Dashboard (VI)
  'staff.dashboard': 'Bảng Điều Khiển Nhân Viên',
  // removed duplicate: 'staff.overview' will be kept under Detail View below
  'staff.myTasks': 'Nhiệm Vụ Của Tôi',
  'staff.workQueue': 'Hàng Đợi Công Việc',
  'staff.customerContact': 'Liên Hệ Khách Hàng',
  'staff.appraisals': 'Thẩm Định',
  'staff.teamManagement': 'Quản Lý Nhóm',
  'staff.myReports': 'Báo Cáo Của Tôi',
  'staff.myPerformance': 'Hiệu Suất Của Tôi',
  'staff.accessDenied': 'Từ Chối Truy Cập',
  'staff.noPermission': 'Bạn không có quyền truy cập trang này.',
  'staff.goToDashboard': 'Đi Đến Bảng Điều Khiển',

  // Staff Dashboard Stats (VI)
  'staff.assignedTasks': 'Nhiệm Vụ Được Giao',
  'staff.completedToday': 'Hoàn Thành Hôm Nay',
  'staff.totalCompleted': 'Tổng Hoàn Thành',
  'staff.completed': 'Hoàn Thành',
  'staff.rating': 'Đánh Giá',
  'staff.averageRating': 'Đánh Giá Trung Bình',
  'staff.thisMonth': 'Tháng Này',

  // Staff Dashboard Content (VI)
  'staff.myTasksToday': 'Nhiệm Vụ Hôm Nay',
  'staff.pendingReview': 'Chờ Xem Xét',
  'staff.workloadDistribution': 'Phân Bổ Khối Lượng Công Việc',
  'staff.recentActivity': 'Hoạt Động Gần Đây',
  'staff.customerCommunication': 'Liên Lạc Khách Hàng',
  'staff.valuationWorkflow': 'Quy Trình Định Giá',
  'staff.teamOverview': 'Tổng Quan Nhóm',

  // Staff Status Labels (VI)
  'staff.status.newRequest': 'Yêu Cầu Mới',
  'staff.status.consultantAssigned': 'Đã Giao Tư Vấn',
  'staff.status.customerContacted': 'Đã Liên Hệ Khách Hàng',
  'staff.status.receiptCreated': 'Đã Tạo Biên Lai',
  'staff.status.valuationAssigned': 'Đã Giao Định Giá',
  'staff.status.valuationInProgress': 'Đang Định Giá',
  'staff.status.valuationCompleted': 'Định Giá Hoàn Thành',
  'staff.status.consultantReview': 'Tư Vấn Xem Xét',
  'staff.status.resultsSent': 'Đã Gửi Kết Quả',
  'staff.status.completed': 'Hoàn Thành',
  'staff.status.onhold': 'Tạm Dừng',
  'staff.status.cancelled': 'Đã Hủy',

  // Staff Detail View (VI) — keep canonical keys here
  'staff.requestDetails': 'Chi Tiết Yêu Cầu',
  'staff.overview': 'Tổng Quan',
  // removed duplicate: 'staff.customer' will live in Data Labels
  'staff.communication': 'Liên Lạc',
  'staff.actions': 'Hành Động',
  'staff.valuation': 'Định Giá',
  'staff.results': 'Kết Quả', // kept here
  'staff.diamondInformation': 'Thông Tin Kim Cương',
  'staff.assignmentInformation': 'Thông Tin Phân Công',
  'staff.customerInformation': 'Thông Tin Khách Hàng',
  'staff.quickActions': 'Hành Động Nhanh', // kept here
  'staff.communicationHistory': 'Lịch Sử Liên Lạc',
  'staff.recordCommunication': 'Ghi Nhận Liên Lạc',
  'staff.availableActions': 'Hành Động Có Sẵn',
  'staff.statusActions': 'Hành Động Trạng Thái',
  'staff.additionalNotes': 'Ghi Chú Bổ Sung',
  'staff.assignToMe': 'Giao Cho Tôi',
  'staff.markAsContacted': 'Đánh Dấu Đã Liên Hệ',
  'staff.createReceipt': 'Tạo Biên Nhận',
  'staff.reviewResults': 'Xem Xét Kết Quả',
  'staff.sendResults': 'Gửi Kết Quả',
  'staff.callCustomer': 'Gọi Khách Hàng',
  'staff.sendEmail': 'Gửi Email',
  'staff.scheduleAppointment': 'Đặt Lịch Hẹn',
  'staff.logEmail': 'Ghi Nhận Email',
  'staff.logPhoneCall': 'Ghi Nhận Cuộc Gọi',
  'staff.logMeeting': 'Ghi Nhận Cuộc Họp',
  'staff.saveNotes': 'Lưu Ghi Chú',
  'staff.diamondSpecifications': 'Thông Số Kim Cương', // kept here
  'staff.specialInstructions': 'Hướng Dẫn Đặc Biệt',
  'staff.customersBackground': 'Thông Tin Khách Hàng',
  'staff.valuationWorkspace': 'Không Gian Định Giá',
  'staff.valueAssessment': 'Đánh Giá Giá Trị',
  'staff.conditionQuality': 'Tình Trạng & Chất Lượng',
  'staff.overallCondition': 'Tình Trạng Tổng Thể',
  'staff.certificationDetails': 'Chi Tiết Chứng Chỉ',
  'staff.detailedProfessionalAnalysis': 'Phân Tích Chuyên Nghiệp Chi Tiết',
  'staff.recommendations': 'Khuyến Nghị',
  'staff.valuationResultsSummary': 'Tóm Tắt Kết Quả Định Giá',
  'staff.qualityAssessment': 'Đánh Giá Chất Lượng',
  'staff.professionalAnalysis': 'Phân Tích Chuyên Nghiệp',
  'staff.valuationActions': 'Hành Động Định Giá',
  'staff.workflowActions': 'Hành Động Quy Trình',
  'staff.startValuation': 'Bắt Đầu Định Giá',
  'staff.updateProgress': 'Cập Nhật Tiến Độ',
  'staff.completeValuation': 'Hoàn Thành Định Giá',
  'staff.putOnHold': 'Tạm Dừng',
  // removed duplicate: 'staff.saveProgress' will live in Button Actions
  'staff.qualityChecklist': 'Danh Sách Kiểm Tra Chất Lượng',
  'staff.saveValuationData': 'Lưu Dữ Liệu Định Giá',

  // Staff Dashboard Section Headings (VI)
  'staff.myValuationWorkflow': 'Quy Trình Định Giá Của Tôi',
  'staff.customerCommunicationCenter': 'Trung Tâm Liên Lạc Khách Hàng',
  'staff.diamondAppraisalWorkstation': 'Trạm Thẩm Định Kim Cương',
  'staff.workflowManagement': 'Quản Lý Quy Trình',
  'staff.myPerformanceReports': 'Báo Cáo Hiệu Suất Của Tôi',

  // Staff Dashboard Button Actions (VI)
  'staff.manageTemplates': 'Quản Lý Mẫu',
  'staff.viewCallHistory': 'Xem Lịch Sử Cuộc Gọi',
  'staff.bookAppointment': 'Đặt Lịch Hẹn',
  'staff.contact': 'Liên Hệ',
  'staff.openTool': 'Mở Công Cụ',
  'staff.accessDB': 'Truy Cập CSDL',
  'staff.viewTemplates': 'Xem Mẫu',
  'staff.uploadPhotos': 'Tải Ảnh Lên',
  'staff.saveProgress': 'Lưu Tiến Độ', // kept here
  'staff.completeAppraisal': 'Hoàn Thành Thẩm Định',
  'staff.downloadFullReport': 'Tải Báo Cáo Đầy Đủ',

  // Staff Email Template (VI)
  'staff.emailTemplate': 'Kính chào',
  'staff.emailBody':
    'Chúng tôi đã hoàn thành việc thẩm định chuyên nghiệp cho viên kim cương của bạn. Vui lòng tìm báo cáo chi tiết trong tệp đính kèm.',
  'staff.emailClosing': 'Trân trọng',
  'staff.messageToCustomer': 'Tin Nhắn Gửi Khách Hàng',

  // Staff Additional UI Labels (VI) — removed duplicates: results, diamondSpecifications, customer
  'staff.request': 'Yêu Cầu',
  'staff.receipt': 'Biên Lai',
  'staff.quickResponseTemplates': 'Mẫu phản hồi nhanh',
  'staff.trackCustomerCalls': 'Theo dõi cuộc gọi khách hàng',
  'staff.scheduleConsultations': 'Lên lịch tư vấn',
  'staff.waitingDeliveryConfirmation': 'Chờ xác nhận giao kim cương',
  'staff.followUpDocumentation': 'Theo dõi tài liệu bổ sung',
  'staff.diamondCalculator': 'Máy Tính Kim Cương',
  'staff.priceDatabase': 'Cơ Sở Dữ Liệu Giá',
  'staff.reportTemplates': 'Mẫu Báo Cáo',
  'staff.photoGallery': 'Thư Viện Ảnh',
  'staff.valuationDetails': 'Chi Tiết Định Giá',
  'staff.consultingStaffPerformance': 'Hiệu Suất Nhân Viên Tư Vấn',

  // Staff Data Labels (VI) — keep canonical 'staff.customer' here
  'staff.customer': 'Khách Hàng',
  'staff.email': 'Email',
  'staff.phone': 'Điện Thoại',
  'staff.submitted': 'Đã Gửi',
  'staff.type': 'Loại',
  'staff.carat': 'Carat',
  'staff.estValue': 'Giá Trị Ước Tính',
  'staff.latestNotes': 'Ghi Chú Mới Nhất',
  'staff.pendingCustomerFollowups': 'Theo Dõi Khách Hàng Đang Chờ',
  'staff.currentAppraisal': 'Thẩm Định Hiện Tại',
  'staff.shape': 'Hình Dạng',
  'staff.caratWeight': 'Trọng Lượng Carat',
  'staff.colorGrade': 'Độ Màu',
  'staff.clarityGrade': 'Độ Tinh Khiết',
  'staff.valuationStaffPerformance': 'Hiệu Suất Nhân Viên Định Giá',
  'staff.emeraldCut': 'Cắt Emerald',
};

/* =========================
   Provider & Hook
   ========================= */
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage === 'en' || savedLanguage === 'vi') return savedLanguage;
    const browserLanguage = navigator.language.toLowerCase();
    return browserLanguage.startsWith('vi') ? 'vi' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const dict = language === 'vi' ? viTranslations : enTranslations;
    return dict[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
