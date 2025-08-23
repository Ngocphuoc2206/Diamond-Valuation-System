import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
// ❌ Bỏ useAuth nếu chưa dùng để tránh lỗi/ cảnh báo no-unused
// import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

type ViewMode = 'summary' | 'detailed' | 'certificate';

interface ValuationResult {
  id: string;
  customerName: string;
  submittedDate: string;
  completedDate: string;
  diamondType: string;
  caratWeight: string;
  consultantName: string;
  valuationStaff: string;
  receiptNumber: string;
  results: {
    marketValue: number;
    insuranceValue: number;
    retailValue: number;
    condition: string;
    certificationDetails: string;
    methodology: string;
    photos: string[];
    report: string;
  };
  diamondDetails: {
    shape: string;
    caratWeight: number;
    color: string;
    clarity: string;
    cut: string;
    polish: string;
    symmetry: string;
    fluorescence: string;
    measurements?: {
      length: number;
      width: number;
      depth: number;
    };
    certificateNumber?: string;
    certificateType?: string;
  };
}

const ValuationResults: React.FC = () => {
  const { t } = useLanguage(); // ✅ chỉ khai báo 1 lần
  // const { user } = useAuth(); // ❌ bỏ nếu chưa dùng

  const [selectedResult, setSelectedResult] = useState<ValuationResult | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('summary');

  // Mock completed valuation results
  const completedValuations: ValuationResult[] = [
    {
      id: 'VAL-2024-0123',
      customerName: 'John Doe',
      submittedDate: '2024-01-15',
      completedDate: '2024-01-22',
      diamondType: 'Round Brilliant Cut',
      caratWeight: '2.5ct',
      consultantName: 'Sarah Johnson',
      valuationStaff: 'Dr. Emma Wilson',
      receiptNumber: 'RCP-2024-0123',
      results: {
        marketValue: 17500,
        insuranceValue: 18500,
        retailValue: 19800,
        condition: 'Excellent',
        certificationDetails: 'GIA Certified - Report #2185024759',
        methodology:
          'Professional gemological assessment using industry-standard 4C grading methodology, market analysis, and current pricing trends.',
        photos: [],
        report:
          'This diamond exhibits exceptional quality characteristics with excellent proportions, superior polish, and symmetry. The color grade G represents near-colorless quality with no visible tint to the naked eye. VS1 clarity grade indicates very small inclusions that are difficult to see under 10x magnification.'
      },
      diamondDetails: {
        shape: 'Round Brilliant',
        caratWeight: 2.5,
        color: 'G',
        clarity: 'VS1',
        cut: 'Excellent',
        polish: 'Excellent',
        symmetry: 'Very Good',
        fluorescence: 'None',
        measurements: {
          length: 8.52,
          width: 8.48,
          depth: 5.26
        },
        certificateNumber: '2185024759',
        certificateType: 'GIA'
      }
    }
  ];

  const currentResult = selectedResult || completedValuations[0];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const downloadCertificate = useCallback(() => {
    // In a real application, this would download the actual certificate
    alert('Certificate downloaded successfully!');
  }, []);

  const printCertificate = useCallback(() => {
    window.print();
  }, []);

  const shareCertificate = useCallback(() => {
    if (!currentResult) return;
    if (navigator.share) {
      navigator
        .share({
          title: `Diamond Valuation Certificate - ${currentResult.id}`,
          text: `Professional diamond valuation completed for ${currentResult.diamondType}`,
          url: window.location.href
        })
        .catch(() => {
          // ignore user cancel
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Certificate link copied to clipboard!');
    }
  }, [currentResult]);

  const tabs: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'summary', label: t('Summary') || 'Summary', icon: '📋' },
    { id: 'detailed', label: t('Detailed Report') || 'Detailed Report', icon: '📊' },
    { id: 'certificate', label: t('Official Certificate') || 'Official Certificate', icon: '🏆' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                  {t('Valuation Results') || 'Valuation Results'}
                </h1>
                <p className="text-gray-600">
                  {t('Professional Diamond Assessment Certificate') ||
                    'Professional Diamond Assessment Certificate'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={downloadCertificate} className="btn btn-primary">
                  📄 {t('Download Certificate') || 'Download Certificate'}
                </button>
                <button onClick={printCertificate} className="btn btn-secondary">
                  🖨️ {t('Print') || 'Print'}
                </button>
                <button onClick={shareCertificate} className="btn btn-secondary">
                  📤 {t('Share') || 'Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    viewMode === tab.id
                      ? 'border-luxury-gold text-luxury-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Summary View */}
        {viewMode === 'summary' && currentResult && (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            {/* Valuation Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-serif font-bold mb-4">
                    {t('Valuation Summary') || 'Valuation Summary'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Request ID') || 'Request ID'}:</span>
                      <span className="font-medium">{currentResult.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Diamond Type') || 'Diamond Type'}:</span>
                      <span className="font-medium">{currentResult.diamondType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Carat Weight') || 'Carat Weight'}:</span>
                      <span className="font-medium">{currentResult.caratWeight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Completed Date') || 'Completed Date'}:</span>
                      <span className="font-medium">{currentResult.completedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Consultant') || 'Consultant'}:</span>
                      <span className="font-medium">{currentResult.consultantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Appraiser') || 'Appraiser'}:</span>
                      <span className="font-medium">{currentResult.valuationStaff}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-bold mb-4">
                    {t('Valuation Results') || 'Valuation Results'}
                  </h3>
                  <div className="bg-luxury-gold bg-opacity-10 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          {t('Insurance Value') || 'Insurance Value'}
                        </p>
                        <p className="text-3xl font-bold text-luxury-gold">
                          ${currentResult.results.insuranceValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">{t('Market Value') || 'Market Value'}</p>
                          <p className="font-semibold">
                            ${currentResult.results.marketValue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t('Retail Value') || 'Retail Value'}</p>
                          <p className="font-semibold">
                            ${currentResult.results.retailValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          {t('Condition') || 'Condition'}:{' '}
                          <span className="font-medium text-green-600">
                            {currentResult.results.condition}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diamond Characteristics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-serif font-bold mb-4">
                {t('Diamond Characteristics') || 'Diamond Characteristics'}
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3">{t('Basic Properties') || 'Basic Properties'}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Shape') || 'Shape'}:</span>
                      <span>{currentResult.diamondDetails.shape}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Carat Weight') || 'Carat Weight'}:</span>
                      <span>{currentResult.diamondDetails.caratWeight}ct</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Color Grade') || 'Color Grade'}:</span>
                      <span>{currentResult.diamondDetails.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Clarity Grade') || 'Clarity Grade'}:</span>
                      <span>{currentResult.diamondDetails.clarity}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">{t('Cut Quality') || 'Cut Quality'}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Cut Grade') || 'Cut Grade'}:</span>
                      <span>{currentResult.diamondDetails.cut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Polish') || 'Polish'}:</span>
                      <span>{currentResult.diamondDetails.polish}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Symmetry') || 'Symmetry'}:</span>
                      <span>{currentResult.diamondDetails.symmetry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Fluorescence') || 'Fluorescence'}:</span>
                      <span>{currentResult.diamondDetails.fluorescence}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">{t('Measurements') || 'Measurements'}</h4>
                  {currentResult.diamondDetails.measurements && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('Length') || 'Length'}:</span>
                        <span>{currentResult.diamondDetails.measurements.length}mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('Width') || 'Width'}:</span>
                        <span>{currentResult.diamondDetails.measurements.width}mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('Depth') || 'Depth'}:</span>
                        <span>{currentResult.diamondDetails.measurements.depth}mm</span>
                      </div>
                    </div>
                  )}
                  {currentResult.diamondDetails.certificateNumber && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm">
                        <span className="text-gray-600">{t('Certificate') || 'Certificate'}:</span>
                        <br />
                        <span className="font-medium">
                          {currentResult.diamondDetails.certificateType} #
                          {currentResult.diamondDetails.certificateNumber}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Detailed Report View */}
        {viewMode === 'detailed' && currentResult && (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-serif font-bold mb-6">
                {t('Professional Assessment Report') || 'Professional Assessment Report'}
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">{t('Methodology') || 'Methodology'}</h4>
                  <p className="text-gray-700 leading-relaxed">{currentResult.results.methodology}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">{t('Detailed Analysis') || 'Detailed Analysis'}</h4>
                  <p className="text-gray-700 leading-relaxed">{currentResult.results.report}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">
                    {t('Certification Verification') || 'Certification Verification'}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {currentResult.results.certificationDetails}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-900">
                    {t('Market Analysis') || 'Market Analysis'}
                  </h4>
                  <p className="text-sm text-blue-800">
                    The valuation reflects current market conditions and comparable sales data.
                    Values may fluctuate based on market demand, rarity, and economic factors. This
                    assessment is valid for insurance and estate planning purposes.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Official Certificate View */}
        {viewMode === 'certificate' && currentResult && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            id="certificate"
            className="bg-white rounded-lg shadow-sm p-8 print:shadow-none print:border-2 print:border-luxury-gold"
          >
            {/* Certificate Header */}
            <div className="text-center mb-8 border-b-2 border-luxury-gold pb-6">
              <h1 className="text-3xl font-serif font-bold text-luxury-gold mb-2">
                {t('PROFESSIONAL DIAMOND VALUATION CERTIFICATE') ||
                  'PROFESSIONAL DIAMOND VALUATION CERTIFICATE'}
              </h1>
              <p className="text-gray-600">
                {t('Certified Gemological Assessment') || 'Certified Gemological Assessment'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {t('Certificate ID') || 'Certificate ID'}: {currentResult.id}
              </p>
            </div>

            {/* Customer and Diamond Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold mb-4 text-luxury-gold">
                  {t('CLIENT INFORMATION') || 'CLIENT INFORMATION'}
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>{t('Name') || 'Name'}:</strong> {currentResult.customerName}
                  </p>
                  <p>
                    <strong>{t('Date of Assessment') || 'Date of Assessment'}:</strong>{' '}
                    {currentResult.completedDate}
                  </p>
                  <p>
                    <strong>{t('Receipt Number') || 'Receipt Number'}:</strong>{' '}
                    {currentResult.receiptNumber}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4 text-luxury-gold">
                  {t('ASSESSMENT TEAM') || 'ASSESSMENT TEAM'}
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>{t('Consultant') || 'Consultant'}:</strong>{' '}
                    {currentResult.consultantName}
                  </p>
                  <p>
                    <strong>{t('Certified Appraiser') || 'Certified Appraiser'}:</strong>{' '}
                    {currentResult.valuationStaff}
                  </p>
                  <p>
                    <strong>{t('Assessment Date') || 'Assessment Date'}:</strong>{' '}
                    {currentResult.completedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Diamond Specifications */}
            <div className="mb-8">
              <h3 className="font-bold mb-4 text-luxury-gold border-b border-gray-300 pb-2">
                {t('DIAMOND SPECIFICATIONS') || 'DIAMOND SPECIFICATIONS'}
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="font-medium">{t('Shape & Cut') || 'Shape & Cut'}</p>
                  <p className="text-lg">{currentResult.diamondDetails.shape}</p>
                </div>
                <div>
                  <p className="font-medium">{t('Carat Weight') || 'Carat Weight'}</p>
                  <p className="text-lg">{currentResult.diamondDetails.caratWeight}ct</p>
                </div>
                <div>
                  <p className="font-medium">{t('Color Grade') || 'Color Grade'}</p>
                  <p className="text-lg">{currentResult.diamondDetails.color}</p>
                </div>
                <div>
                  <p className="font-medium">{t('Clarity Grade') || 'Clarity Grade'}</p>
                  <p className="text-lg">{currentResult.diamondDetails.clarity}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <p className="font-medium">{t('Cut Quality') || 'Cut Quality'}</p>
                  <p>{currentResult.diamondDetails.cut}</p>
                </div>
                <div>
                  <p className="font-medium">{t('Polish') || 'Polish'}</p>
                  <p>{currentResult.diamondDetails.polish}</p>
                </div>
                <div>
                  <p className="font-medium">{t('Symmetry') || 'Symmetry'}</p>
                  <p>{currentResult.diamondDetails.symmetry}</p>
                </div>
              </div>
            </div>

            {/* Valuation Results */}
            <div className="mb-8">
              <h3 className="font-bold mb-4 text-luxury-gold border-b border-gray-300 pb-2">
                {t('CERTIFIED VALUES') || 'CERTIFIED VALUES'}
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="font-medium text-gray-600">
                    {t('Market Value') || 'Market Value'}
                  </p>
                  <p className="text-2xl font-bold">
                    ${currentResult.results.marketValue.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-luxury-gold bg-opacity-10 rounded">
                  <p className="font-medium text-luxury-gold">
                    {t('Insurance Value') || 'Insurance Value'}
                  </p>
                  <p className="text-2xl font-bold text-luxury-gold">
                    ${currentResult.results.insuranceValue.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="font-medium text-gray-600">
                    {t('Retail Value') || 'Retail Value'}
                  </p>
                  <p className="text-2xl font-bold">
                    ${currentResult.results.retailValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Certification Footer */}
            <div className="border-t-2 border-luxury-gold pt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                {t(
                  'This certificate represents the professional opinion of qualified gemologists based on industry-standard assessment methodologies. Values are subject to market fluctuations and should be reviewed periodically.'
                ) ||
                  'This certificate represents the professional opinion of qualified gemologists based on industry-standard assessment methodologies. Values are subject to market fluctuations and should be reviewed periodically.'}
              </p>
              <div className="flex justify-center space-x-12 text-sm">
                <div className="text-center">
                  <div className="h-12 border-b border-gray-400 w-48 mb-2"></div>
                  <p className="font-medium">{currentResult.valuationStaff}</p>
                  <p className="text-gray-600">{t('Certified Gemologist') || 'Certified Gemologist'}</p>
                </div>
                <div className="text-center">
                  <div className="h-12 border-b border-gray-400 w-48 mb-2"></div>
                  <p className="font-medium">
                    {t('Date') || 'Date'}: {currentResult.completedDate}
                  </p>
                  <p className="text-gray-600">{t('Official Seal') || 'Official Seal'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ValuationResults;
