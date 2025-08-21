import { z } from 'zod';

// Create validation schema with customizable error messages
export const createDiamondFormSchema = (t: (key: string) => string) => {
  return z.object({
    // Step 1: Diamond Identity
    certificateNumber: z.string().optional(),
    certificateType: z.string().optional(),
    origin: z.string().optional(),
    
    // Step 2: Basic Characteristics
    shape: z.string().min(1, { message: t('validation.shape') }),
    caratWeight: z.string().min(1, { message: t('validation.caratWeight') }),
    
    // Step 3: Color and Clarity
    color: z.string().min(1, { message: t('validation.color') }),
    clarity: z.string().min(1, { message: t('validation.clarity') }),
    
    // Step 4: Cut Characteristics
    cut: z.string().min(1, { message: t('validation.cut') }),
    polish: z.string().min(1, { message: t('validation.polish') }),
    symmetry: z.string().min(1, { message: t('validation.symmetry') }),
    fluorescence: z.string().min(1, { message: t('validation.fluorescence') }),
    
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
    fullName: z.string().min(1, { message: t('validation.fullName') }),
    email: z.string().email({ message: t('validation.email') }),
    phone: z.string().min(10, { message: t('validation.phone') }),
    preferredContact: z.string().min(1, { message: t('validation.preferredContact') }),
  });
};

export type DiamondFormValues = z.infer<ReturnType<typeof createDiamondFormSchema>>;
