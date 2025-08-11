import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define the diamond valuation form schema
const diamondFormSchema = z.object({
  // Step 1: Diamond Identity
  certificateNumber: z.string().optional(),
  certificateType: z.string().optional(),
  origin: z.string().optional(),
  
  // Step 2: Basic Characteristics
  shape: z.string().min(1, { message: 'Shape is required' }),
  caratWeight: z.string().min(1, { message: 'Carat weight is required' }),
  
  // Step 3: Color and Clarity
  color: z.string().min(1, { message: 'Color is required' }),
  clarity: z.string().min(1, { message: 'Clarity is required' }),
  
  // Step 4: Cut Characteristics
  cut: z.string().min(1, { message: 'Cut is required' }),
  polish: z.string().min(1, { message: 'Polish is required' }),
  symmetry: z.string().min(1, { message: 'Symmetry is required' }),
  fluorescence: z.string().min(1, { message: 'Fluorescence is required' }),
  
  // Step 5: Measurements
  length: z.string().optional(),
  width: z.string().optional(),
  depth: z.string().optional(),
  
  // Step 6: Additional Info
  hasInclusions: z.boolean().optional(),
  hasSettings: z.boolean().optional(),
  settingMaterial: z.string().optional(),
  additionalNotes: z.string().optional(),
  
  // Step 7: Contact Information
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  preferredContact: z.string().min(1, { message: 'Preferred contact method is required' }),
});

type DiamondFormValues = z.infer<typeof diamondFormSchema>;

// Form Steps Components
const Step1Certificate: React.FC = () => {
  const { control, register, formState: { errors } } = useFormContext<DiamondFormValues>();
  const [hasCertificate, setHasCertificate] = useState(false);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Diamond Identity</h2>
      <p className="text-gray-600">
        Enter your diamond's certificate information if available, or proceed without it.
      </p>
      
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasCertificate"
            className="h-4 w-4 text-luxury-gold focus:ring-luxury-gold"
            onChange={(e) => setHasCertificate(e.target.checked)}
            checked={hasCertificate}
          />
          <label htmlFor="hasCertificate" className="font-medium">
            I have a diamond certificate/grading report
          </label>
        </div>
      </div>
      
      {hasCertificate && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="certificateNumber" className="block mb-1 font-medium">
                Certificate Number
              </label>
              <input
                id="certificateNumber"
                type="text"
                {...register('certificateNumber')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                placeholder="E.g. GIA 1234567890"
              />
              {errors.certificateNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.certificateNumber.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="certificateType" className="block mb-1 font-medium">
                Certificate Type
              </label>
              <select
                id="certificateType"
                {...register('certificateType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              >
                <option value="">Select laboratory</option>
                <option value="GIA">GIA (Gemological Institute of America)</option>
                <option value="IGI">IGI (International Gemological Institute)</option>
                <option value="AGS">AGS (American Gem Society)</option>
                <option value="HRD">HRD (Hoge Raad voor Diamant)</option>
                <option value="GSI">GSI (Gemological Science International)</option>
                <option value="EGL">EGL (European Gemological Laboratory)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-4">
            Note: By providing a certificate number, we may be able to retrieve some information
            automatically, which will help in the valuation process.
          </p>
        </>
      )}
      
      <div>
        <label htmlFor="origin" className="block mb-1 font-medium">
          Origin (if known)
        </label>
        <select
          id="origin"
          {...register('origin')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
        >
          <option value="">Unknown/Not sure</option>
          <option value="South Africa">South Africa</option>
          <option value="Botswana">Botswana</option>
          <option value="Russia">Russia</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="Angola">Angola</option>
          <option value="Namibia">Namibia</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );
};

const Step2Basics: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<DiamondFormValues>();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Basic Characteristics</h2>
      <p className="text-gray-600">
        Tell us about your diamond's fundamental properties.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="shape" className="block mb-1 font-medium">
            Shape <span className="text-red-600">*</span>
          </label>
          <select
            id="shape"
            {...register('shape')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">Select shape</option>
            <option value="Round">Round</option>
            <option value="Princess">Princess</option>
            <option value="Cushion">Cushion</option>
            <option value="Emerald">Emerald</option>
            <option value="Oval">Oval</option>
            <option value="Pear">Pear</option>
            <option value="Marquise">Marquise</option>
            <option value="Radiant">Radiant</option>
            <option value="Asscher">Asscher</option>
            <option value="Heart">Heart</option>
            <option value="Other">Other</option>
          </select>
          {errors.shape && (
            <p className="text-red-600 text-sm mt-1">{errors.shape.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="caratWeight" className="block mb-1 font-medium">
            Carat Weight <span className="text-red-600">*</span>
          </label>
          <input
            id="caratWeight"
            type="text"
            {...register('caratWeight')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder="E.g. 1.25"
          />
          {errors.caratWeight && (
            <p className="text-red-600 text-sm mt-1">{errors.caratWeight.message}</p>
          )}
        </div>
      </div>
      
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Diamond Shape Guide</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {['Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Pear'].map((shape) => (
            <div key={shape} className="text-center">
              <div className="bg-white p-2 rounded shadow-sm mb-1">
                {shape === 'Round' && (
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
                )}
                {shape === 'Princess' && (
                  <div className="w-12 h-12 bg-gray-200 rotate-45 mx-auto"></div>
                )}
                {shape === 'Cushion' && (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto"></div>
                )}
                {shape === 'Emerald' && (
                  <div className="w-12 h-10 bg-gray-200 mx-auto"></div>
                )}
                {shape === 'Oval' && (
                  <div className="w-10 h-12 bg-gray-200 rounded-full mx-auto"></div>
                )}
                {shape === 'Pear' && (
                  <div className="w-10 h-12 bg-gray-200 rounded-full rounded-tr-none mx-auto"></div>
                )}
              </div>
              <span className="text-xs">{shape}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Step3ColorClarity: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<DiamondFormValues>();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Color and Clarity</h2>
      <p className="text-gray-600">
        These important characteristics significantly impact your diamond's value.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="color" className="block mb-1 font-medium">
            Color Grade <span className="text-red-600">*</span>
          </label>
          <select
            id="color"
            {...register('color')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">Select color grade</option>
            <option value="D">D (Colorless)</option>
            <option value="E">E (Colorless)</option>
            <option value="F">F (Colorless)</option>
            <option value="G">G (Near Colorless)</option>
            <option value="H">H (Near Colorless)</option>
            <option value="I">I (Near Colorless)</option>
            <option value="J">J (Near Colorless)</option>
            <option value="K">K (Faint)</option>
            <option value="L">L (Faint)</option>
            <option value="M">M (Faint)</option>
            <option value="N-Z">N-Z (Very Light to Light)</option>
            <option value="Fancy">Fancy Color</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.color && (
            <p className="text-red-600 text-sm mt-1">{errors.color.message}</p>
          )}
          
          <div className="mt-3">
            <div className="w-full h-10 bg-gradient-to-r from-white via-yellow-100 to-yellow-300 rounded-md mt-2"></div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>D (Colorless)</span>
              <span>Z (Light)</span>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="clarity" className="block mb-1 font-medium">
            Clarity Grade <span className="text-red-600">*</span>
          </label>
          <select
            id="clarity"
            {...register('clarity')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">Select clarity grade</option>
            <option value="FL">FL (Flawless)</option>
            <option value="IF">IF (Internally Flawless)</option>
            <option value="VVS1">VVS1 (Very Very Slightly Included 1)</option>
            <option value="VVS2">VVS2 (Very Very Slightly Included 2)</option>
            <option value="VS1">VS1 (Very Slightly Included 1)</option>
            <option value="VS2">VS2 (Very Slightly Included 2)</option>
            <option value="SI1">SI1 (Slightly Included 1)</option>
            <option value="SI2">SI2 (Slightly Included 2)</option>
            <option value="I1">I1 (Included 1)</option>
            <option value="I2">I2 (Included 2)</option>
            <option value="I3">I3 (Included 3)</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.clarity && (
            <p className="text-red-600 text-sm mt-1">{errors.clarity.message}</p>
          )}
          
          <div className="mt-3">
            <div className="w-full h-10 flex">
              <div className="flex-grow h-full bg-gray-100 rounded-l-md flex items-center justify-center text-xs">FL-VVS</div>
              <div className="flex-grow h-full bg-gray-200 flex items-center justify-center text-xs">VS</div>
              <div className="flex-grow h-full bg-gray-300 flex items-center justify-center text-xs">SI</div>
              <div className="flex-grow h-full bg-gray-400 rounded-r-md flex items-center justify-center text-xs">I</div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>FL (Perfect)</span>
              <span>I3 (Visible Inclusions)</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-luxury-gold bg-opacity-10 p-4 rounded-md mt-4">
        <h3 className="text-luxury-gold font-medium mb-2">Did you know?</h3>
        <p className="text-sm">
          Color and clarity are two of the "4 Cs" that determine a diamond's value. The color scale ranges from D (colorless) to Z (light yellow or brown), while clarity measures the absence of inclusions and blemishes, ranging from Flawless (FL) to Included (I3).
        </p>
      </div>
    </div>
  );
};

const Step4Cut: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<DiamondFormValues>();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Cut Characteristics</h2>
      <p className="text-gray-600">
        The cut quality significantly affects how light interacts with your diamond.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="cut" className="block mb-1 font-medium">
            Cut Grade <span className="text-red-600">*</span>
          </label>
          <select
            id="cut"
            {...register('cut')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">Select cut grade</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.cut && (
            <p className="text-red-600 text-sm mt-1">{errors.cut.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="polish" className="block mb-1 font-medium">
            Polish <span className="text-red-600">*</span>
          </label>
          <select
            id="polish"
            {...register('polish')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">Select polish grade</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.polish && (
            <p className="text-red-600 text-sm mt-1">{errors.polish.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="symmetry" className="block mb-1 font-medium">
            Symmetry <span className="text-red-600">*</span>
          </label>
          <select
            id="symmetry"
            {...register('symmetry')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">Select symmetry grade</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.symmetry && (
            <p className="text-red-600 text-sm mt-1">{errors.symmetry.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="fluorescence" className="block mb-1 font-medium">
            Fluorescence <span className="text-red-600">*</span>
          </label>
          <select
            id="fluorescence"
            {...register('fluorescence')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">Select fluorescence</option>
            <option value="None">None</option>
            <option value="Faint">Faint</option>
            <option value="Medium">Medium</option>
            <option value="Strong">Strong</option>
            <option value="Very Strong">Very Strong</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.fluorescence && (
            <p className="text-red-600 text-sm mt-1">{errors.fluorescence.message}</p>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium mb-2">Cut Quality Impacts</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="bg-white rounded-full h-20 w-20 mx-auto flex items-center justify-center shadow-md">
              <div className="bg-luxury-gold h-12 w-12 rounded-full opacity-90"></div>
            </div>
            <p className="text-sm mt-2">Excellent Cut</p>
            <p className="text-xs text-gray-500">Maximum Brilliance</p>
          </div>
          <div>
            <div className="bg-white rounded-full h-20 w-20 mx-auto flex items-center justify-center shadow-md">
              <div className="bg-luxury-gold h-12 w-12 rounded-full opacity-60"></div>
            </div>
            <p className="text-sm mt-2">Good Cut</p>
            <p className="text-xs text-gray-500">Good Brilliance</p>
          </div>
          <div>
            <div className="bg-white rounded-full h-20 w-20 mx-auto flex items-center justify-center shadow-md">
              <div className="bg-luxury-gold h-12 w-12 rounded-full opacity-30"></div>
            </div>
            <p className="text-sm mt-2">Poor Cut</p>
            <p className="text-xs text-gray-500">Limited Brilliance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step5Measurements: React.FC = () => {
  const { register } = useFormContext<DiamondFormValues>();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Measurements (Optional)</h2>
      <p className="text-gray-600">
        If known, please provide the physical dimensions of your diamond.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="length" className="block mb-1 font-medium">
            Length (mm)
          </label>
          <input
            id="length"
            type="text"
            {...register('length')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder="E.g. 7.25"
          />
        </div>
        
        <div>
          <label htmlFor="width" className="block mb-1 font-medium">
            Width (mm)
          </label>
          <input
            id="width"
            type="text"
            {...register('width')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder="E.g. 7.20"
          />
        </div>
        
        <div>
          <label htmlFor="depth" className="block mb-1 font-medium">
            Depth (mm)
          </label>
          <input
            id="depth"
            type="text"
            {...register('depth')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder="E.g. 4.35"
          />
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-medium mb-4">Diamond Dimensions Guide</h3>
        <div className="flex justify-center">
          <div className="relative">
            <svg width="200" height="150" viewBox="0 0 200 150" className="mx-auto">
              {/* Diamond outline */}
              <path d="M100,20 L160,80 L100,140 L40,80 Z" fill="none" stroke="#666" strokeWidth="2" />
              
              {/* Width dimension */}
              <line x1="40" y1="80" x2="160" y2="80" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5,3" />
              <text x="100" y="95" textAnchor="middle" fontSize="12" fill="#D4AF37">Width</text>
              
              {/* Length dimension */}
              <line x1="100" y1="20" x2="100" y2="140" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5,3" />
              <text x="115" y="80" textAnchor="middle" fontSize="12" fill="#D4AF37">Length</text>
              
              {/* Depth dimension */}
              <ellipse cx="180" cy="80" rx="8" ry="40" stroke="#666" strokeWidth="1" fill="none" />
              <line x1="172" y1="80" x2="188" y2="80" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5,3" />
              <text x="180" y="60" textAnchor="middle" fontSize="12" fill="#D4AF37">Depth</text>
            </svg>
          </div>
        </div>
        <p className="text-sm text-center text-gray-600 mt-4">
          Accurate measurements help provide a more precise valuation, 
          especially when combined with weight and other characteristics.
        </p>
      </div>
    </div>
  );
};

const Step6Additional: React.FC = () => {
  const { register } = useFormContext<DiamondFormValues>();
  const [hasSettings, setHasSettings] = useState(false);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Additional Information</h2>
      <p className="text-gray-600">
        Any other details that might affect your diamond's valuation.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasInclusions"
            className="h-4 w-4 text-luxury-gold focus:ring-luxury-gold"
            {...register('hasInclusions')}
          />
          <label htmlFor="hasInclusions" className="font-medium">
            There are visible inclusions or blemishes
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasSettings"
            className="h-4 w-4 text-luxury-gold focus:ring-luxury-gold"
            {...register('hasSettings')}
            onChange={(e) => setHasSettings(e.target.checked)}
            checked={hasSettings}
          />
          <label htmlFor="hasSettings" className="font-medium">
            Diamond is in a setting/jewelry piece
          </label>
        </div>
        
        {hasSettings && (
          <div className="pl-6 mt-3">
            <label htmlFor="settingMaterial" className="block mb-1 font-medium">
              Setting Material
            </label>
            <select
              id="settingMaterial"
              {...register('settingMaterial')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            >
              <option value="">Select material</option>
              <option value="Platinum">Platinum</option>
              <option value="18K White Gold">18K White Gold</option>
              <option value="18K Yellow Gold">18K Yellow Gold</option>
              <option value="18K Rose Gold">18K Rose Gold</option>
              <option value="14K White Gold">14K White Gold</option>
              <option value="14K Yellow Gold">14K Yellow Gold</option>
              <option value="14K Rose Gold">14K Rose Gold</option>
              <option value="Silver">Silver</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )}
        
        <div className="mt-4">
          <label htmlFor="additionalNotes" className="block mb-1 font-medium">
            Additional Notes
          </label>
          <textarea
            id="additionalNotes"
            rows={4}
            {...register('additionalNotes')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder="Any other details about your diamond that might be relevant for valuation..."
          ></textarea>
        </div>
      </div>
      
      <div className="bg-luxury-gold bg-opacity-10 p-4 rounded-md">
        <h3 className="text-luxury-gold font-medium mb-2">Helpful Tip</h3>
        <p className="text-sm">
          If your diamond is in a setting, please note that we provide separate valuations for the diamond and the setting. 
          If you're interested in a valuation of the entire piece of jewelry, please specify this in your additional notes.
        </p>
      </div>
    </div>
  );
};

const Step7Contact: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<DiamondFormValues>();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Contact Information</h2>
      <p className="text-gray-600">
        Please provide your contact details so we can deliver your valuation results.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block mb-1 font-medium">
            Full Name <span className="text-red-600">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email Address <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder="Your email address"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block mb-1 font-medium">
            Phone Number <span className="text-red-600">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder="Your phone number"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="preferredContact" className="block mb-1 font-medium">
            Preferred Contact Method <span className="text-red-600">*</span>
          </label>
          <select
            id="preferredContact"
            {...register('preferredContact')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">Select contact method</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="Either">Either</option>
          </select>
          {errors.preferredContact && (
            <p className="text-red-600 text-sm mt-1">{errors.preferredContact.message}</p>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="agreement"
            className="h-4 w-4 text-luxury-gold focus:ring-luxury-gold"
          />
          <label htmlFor="agreement" className="text-sm">
            I agree to the <a href="/terms" className="text-luxury-gold hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-luxury-gold hover:underline">Privacy Policy</a>
          </label>
        </div>
      </div>
    </div>
  );
};

const ValuationTool: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DiamondFormValues>();
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEstimate, setShowEstimate] = useState(false);
  
  const totalSteps = 7;
  
  // Initialize form methods
  const methods = useForm<DiamondFormValues>({
    resolver: zodResolver(diamondFormSchema),
    mode: 'onChange',
  });
  
  const { handleSubmit, trigger, formState } = methods;
  
  // Function to go to next step
  const nextStep = async () => {
    // Validate fields for current step
    let isValid = true;
    
    switch (currentStep) {
      case 1:
        // Step 1 has no required fields
        break;
      case 2:
        isValid = await trigger(['shape', 'caratWeight']);
        break;
      case 3:
        isValid = await trigger(['color', 'clarity']);
        break;
      case 4:
        isValid = await trigger(['cut', 'polish', 'symmetry', 'fluorescence']);
        break;
      case 5:
        // Step 5 has no required fields
        break;
      case 6:
        // Step 6 has no required fields
        break;
      case 7:
        isValid = await trigger(['fullName', 'email', 'phone', 'preferredContact']);
        break;
    }
    
    if (isValid) {
      // If we're on the last step, calculate estimate
      if (currentStep === totalSteps) {
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };
  
  // Function to go back to previous step
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };
  
  // Submit function - Enhanced to create actual valuation request
  const onSubmit = (data: DiamondFormValues) => {
    setFormData(data);
    setIsSubmitting(true);
    
    // Create valuation request in the system
    setTimeout(() => {
      // Generate unique request ID
      const requestId = `VAL-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      // Simple mock calculation for demo purposes
      const caratWeight = parseFloat(data.caratWeight) || 0;
      let basePrice = 0;
      
      // Base price by color
      switch (data.color) {
        case 'D': basePrice = 20000; break;
        case 'E': basePrice = 18000; break;
        case 'F': basePrice = 16000; break;
        case 'G': basePrice = 14000; break;
        case 'H': basePrice = 12000; break;
        case 'I': basePrice = 10000; break;
        case 'J': basePrice = 8000; break;
        default: basePrice = 5000;
      }
      
      // Multiply by carat with progressive scaling
      let pricePerCarat = basePrice;
      if (caratWeight > 1) pricePerCarat *= 1.2;
      if (caratWeight > 2) pricePerCarat *= 1.3;
      
      // Clarity modifier
      let clarityMultiplier = 1;
      switch (data.clarity) {
        case 'FL': clarityMultiplier = 2; break;
        case 'IF': clarityMultiplier = 1.8; break;
        case 'VVS1': clarityMultiplier = 1.6; break;
        case 'VVS2': clarityMultiplier = 1.5; break;
        case 'VS1': clarityMultiplier = 1.4; break;
        case 'VS2': clarityMultiplier = 1.3; break;
        case 'SI1': clarityMultiplier = 1.2; break;
        case 'SI2': clarityMultiplier = 1.1; break;
        default: clarityMultiplier = 1;
      }
      
      // Cut modifier
      let cutMultiplier = 1;
      switch (data.cut) {
        case 'Excellent': cutMultiplier = 1.2; break;
        case 'Very Good': cutMultiplier = 1.1; break;
        case 'Good': cutMultiplier = 1; break;
        case 'Fair': cutMultiplier = 0.9; break;
        case 'Poor': cutMultiplier = 0.8; break;
        default: cutMultiplier = 1;
      }
      
      const estimatedValue = Math.round(pricePerCarat * caratWeight * clarityMultiplier * cutMultiplier);
      
      // Create the valuation request object
      const newValuationRequest = {
        id: requestId,
        customerName: data.fullName,
        customerEmail: data.email,
        customerPhone: data.phone,
        submittedDate: new Date().toISOString().split('T')[0],
        status: 'new_request' as const,
        priority: 'normal' as const,
        diamondType: `${data.shape} Cut`,
        caratWeight: `${data.caratWeight}ct`,
        estimatedValue: `$${estimatedValue.toLocaleString()}`,
        notes: 'Customer valuation request submitted through online form',
        customerNotes: data.additionalNotes || 'No additional notes provided',
        preferredContact: data.preferredContact,
        diamondDetails: {
          shape: data.shape,
          caratWeight: parseFloat(data.caratWeight),
          color: data.color,
          clarity: data.clarity,
          cut: data.cut,
          polish: data.polish,
          symmetry: data.symmetry,
          fluorescence: data.fluorescence,
          hasInclusions: data.hasInclusions,
          hasSettings: data.hasSettings,
          settingMaterial: data.settingMaterial,
          certificateNumber: data.certificateNumber,
          certificateType: data.certificateType,
          origin: data.origin,
          measurements: data.length && data.width && data.depth ? {
            length: parseFloat(data.length),
            width: parseFloat(data.width),
            depth: parseFloat(data.depth)
          } : undefined
        },
        communicationLog: [{
          date: new Date().toISOString().split('T')[0],
          type: 'system' as const,
          from: 'System',
          message: `Valuation request submitted online by ${data.fullName}`
        }],
        timeline: [{
          date: new Date().toISOString().split('T')[0],
          status: 'new_request' as const,
          user: data.fullName,
          notes: 'Initial valuation request submitted through online form'
        }]
      };
      
      // In a real application, you would send this to your backend API
      // For now, we'll store it in localStorage to simulate the request creation
      try {
        const existingRequests = JSON.parse(localStorage.getItem('customerValuationRequests') || '[]');
        existingRequests.push(newValuationRequest);
        localStorage.setItem('customerValuationRequests', JSON.stringify(existingRequests));
        
        console.log('Valuation request created:', newValuationRequest);
      } catch (error) {
        console.error('Error saving valuation request:', error);
      }
      
      setEstimatedValue(estimatedValue);
      setIsSubmitting(false);
      setShowEstimate(true);
    }, 2000);
  };
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  // Render step content
  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return <Step1Certificate />;
      case 2:
        return <Step2Basics />;
      case 3:
        return <Step3ColorClarity />;
      case 4:
        return <Step4Cut />;
      case 5:
        return <Step5Measurements />;
      case 6:
        return <Step6Additional />;
      case 7:
        return <Step7Contact />;
      default:
        return <Step1Certificate />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Diamond <span className="text-luxury-gold">Valuation</span> Tool
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get an estimated value for your diamond by providing its characteristics.
              Complete the form below for a professional valuation.
            </p>
          </div>
          
          {/* Progress steps */}
          {!showEstimate && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-500">Step {currentStep} of {totalSteps}</div>
                <div className="text-sm font-medium text-gray-500">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-luxury-gold rounded-full transition-all duration-300" 
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {!showEstimate ? (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <motion.div
                  key={currentStep}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeIn}
                >
                  <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
                    {renderStepContent(currentStep)}
                    
                    <div className="flex justify-between mt-10">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`btn btn-secondary ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn btn-primary"
                      >
                        {currentStep < totalSteps ? 'Continue' : 'Get Estimate'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </form>
            </FormProvider>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white shadow-md rounded-lg p-6 md:p-8"
            >
              {isSubmitting ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-luxury-gold mx-auto"></div>
                  <p className="mt-4 text-lg">Calculating your estimate...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="inline-block p-4 bg-luxury-gold bg-opacity-10 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-luxury-gold">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                      </svg>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-serif font-bold mb-2">Estimated Diamond Value</h2>
                  <p className="text-gray-600 mb-6">Based on the information you provided</p>
                  
                  <div className="py-4 px-8 bg-gray-50 rounded-lg inline-block mb-8">
                    <span className="block text-5xl font-bold text-luxury-gold">
                      ${estimatedValue?.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm">Estimated market value</span>
                  </div>
                  
                  <div className="max-w-lg mx-auto text-left mb-8">
                    <div className="bg-luxury-gold bg-opacity-10 p-4 rounded-md">
                      <p className="text-sm">
                        <strong>Important Note:</strong> This is an automated estimate based on the information provided.
                        For a precise valuation, we recommend scheduling a professional in-person assessment with our expert gemologists.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-left">Your Diamond Summary</h3>
                      <table className="w-full text-left text-sm">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Shape</td>
                            <td className="py-2">{formData?.shape}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Carat Weight</td>
                            <td className="py-2">{formData?.caratWeight}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Color</td>
                            <td className="py-2">{formData?.color}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Clarity</td>
                            <td className="py-2">{formData?.clarity}</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">Cut</td>
                            <td className="py-2">{formData?.cut}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="text-left">
                      <h3 className="text-lg font-bold mb-2">Next Steps</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Your valuation request has been submitted successfully! A member of our team will contact you at {formData?.email} within 24 hours.
                      </p>
                      
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-green-800 mb-2">✅ Request Submitted Successfully</h4>
                        <p className="text-sm text-green-700">
                          Reference ID: VAL-{new Date().getFullYear()}-{String(Date.now()).slice(-6)}
                        </p>
                      </div>
                      
                      <div className="flex space-x-4">
                        <button 
                          onClick={() => navigate('/dashboard')}
                          className="btn btn-primary"
                        >
                          Track Your Request
                        </button>
                        <button 
                          onClick={() => navigate('/valuation-results')}
                          className="btn btn-secondary"
                        >
                          View Sample Results
                        </button>
                        <button 
                          onClick={() => {
                            setShowEstimate(false);
                            setCurrentStep(1);
                            setFormData(undefined);
                          }}
                          className="btn btn-secondary"
                        >
                          New Request
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {!showEstimate && (
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                Need help with the valuation form? <button onClick={() => navigate('/contact')} className="text-luxury-gold hover:underline bg-transparent border-none cursor-pointer">Contact our experts</button>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValuationTool;
