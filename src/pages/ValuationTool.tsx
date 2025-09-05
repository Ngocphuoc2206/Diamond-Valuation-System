import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "../context/LanguageContext";
import {
  createDiamondFormSchema,
  type DiamondFormValues,
} from "../utils/validation";

// ====== API services (đã có sẵn từ phần trước) ======
import {
  estimate as apiEstimate,
  createValuationCase as apiCreateCase,
} from "../services/valuation";

// ---------- Step 1 ----------
const Step1Certificate: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<DiamondFormValues>();
  const { t } = useLanguage();
  const [hasCertificate, setHasCertificate] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">{t("step1.title")}</h2>
      <p className="text-gray-600">{t("step1.description")}</p>

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
            {t("step1.hasCertificate")}
          </label>
        </div>
      </div>

      {hasCertificate && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="certificateNumber"
                className="block mb-1 font-medium"
              >
                {t("step1.certificateNumber")}
              </label>
              <input
                id="certificateNumber"
                type="text"
                {...register("certificateNumber")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                placeholder={t("placeholder.certificateNumber")}
              />
              {errors.certificateNumber && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.certificateNumber.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="certificateType"
                className="block mb-1 font-medium"
              >
                {t("step1.certificateType")}
              </label>
              <select
                id="certificateType"
                {...register("certificateType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              >
                <option value="">{t("common.select")} laboratory</option>
                <option value="GIA">
                  GIA (Gemological Institute of America)
                </option>
                <option value="IGI">
                  IGI (International Gemological Institute)
                </option>
                <option value="AGS">AGS (American Gem Society)</option>
                <option value="HRD">HRD (Hoge Raad voor Diamant)</option>
                <option value="GSI">
                  GSI (Gemological Science International)
                </option>
                <option value="EGL">
                  EGL (European Gemological Laboratory)
                </option>
                <option value="Other">{t("common.other")}</option>
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">{t("step1.note")}</p>
        </>
      )}

      <div>
        <label htmlFor="origin" className="block mb-1 font-medium">
          {t("step1.origin")}
        </label>
        <select
          id="origin"
          {...register("origin")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
        >
          <option value="">{t("common.unknown")}/Not sure</option>
          <option value="South Africa">South Africa</option>
          <option value="Botswana">Botswana</option>
          <option value="Russia">Russia</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="Angola">Angola</option>
          <option value="Namibia">Namibia</option>
          <option value="Other">{t("common.other")}</option>
        </select>
      </div>
    </div>
  );
};

// ---------- Step 2 ----------
const Step2Basics: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<DiamondFormValues>();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">{t("step2.title")}</h2>
      <p className="text-gray-600">{t("step2.description")}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="shape" className="block mb-1 font-medium">
            {t("step2.shape")}{" "}
            <span className="text-red-600">{t("common.required")}</span>
          </label>
          <select
            id="shape"
            {...register("shape")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">{t("common.select")} shape</option>
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
            <option value="Other">{t("common.other")}</option>
          </select>
          {errors.shape && (
            <p className="text-red-600 text-sm mt-1">{errors.shape.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="caratWeight" className="block mb-1 font-medium">
            {t("step2.caratWeight")}{" "}
            <span className="text-red-600">{t("common.required")}</span>
          </label>
          <input
            id="caratWeight"
            type="text"
            {...register("caratWeight")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder={t("placeholder.carat")}
          />
          {errors.caratWeight && (
            <p className="text-red-600 text-sm mt-1">
              {errors.caratWeight.message}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          {t("step2.shapeGuide")}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {["Round", "Princess", "Cushion", "Emerald", "Oval", "Pear"].map(
            (shape) => (
              <div key={shape} className="text-center">
                <div className="bg-white p-2 rounded shadow-sm mb-1">
                  {shape === "Round" && (
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
                  )}
                  {shape === "Princess" && (
                    <div className="w-12 h-12 bg-gray-200 rotate-45 mx-auto"></div>
                  )}
                  {shape === "Cushion" && (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto"></div>
                  )}
                  {shape === "Emerald" && (
                    <div className="w-12 h-10 bg-gray-200 mx-auto"></div>
                  )}
                  {shape === "Oval" && (
                    <div className="w-10 h-12 bg-gray-200 rounded-full mx-auto"></div>
                  )}
                  {shape === "Pear" && (
                    <div className="w-10 h-12 bg-gray-200 rounded-full rounded-tr-none mx-auto"></div>
                  )}
                </div>
                <span className="text-xs">{shape}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- Step 3 ----------
const Step3ColorClarity: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<DiamondFormValues>();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">{t("step3.title")}</h2>
      <p className="text-gray-600">{t("step3.description")}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="color" className="block mb-1 font-medium">
            {t("step3.colorGrade")}{" "}
            <span className="text-red-600">{t("common.required")}</span>
          </label>
          <select
            id="color"
            {...register("color")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">{t("common.select")} color grade</option>
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
            <option value="Unknown">{t("common.unknown")}</option>
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
            {t("step3.clarityGrade")}{" "}
            <span className="text-red-600">{t("common.required")}</span>
          </label>
          <select
            id="clarity"
            {...register("clarity")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">{t("common.select")} clarity grade</option>
            <option value="FL">FL (Flawless)</option>
            <option value="IF">IF (Internally Flawless)</option>
            <option value="VVS1">VVS1</option>
            <option value="VVS2">VVS2</option>
            <option value="VS1">VS1</option>
            <option value="VS2">VS2</option>
            <option value="SI1">SI1</option>
            <option value="SI2">SI2</option>
            <option value="I1">I1</option>
            <option value="I2">I2</option>
            <option value="I3">I3</option>
            <option value="Unknown">{t("common.unknown")}</option>
          </select>
          {errors.clarity && (
            <p className="text-red-600 text-sm mt-1">
              {errors.clarity.message}
            </p>
          )}

          <div className="mt-3">
            <div className="w-full h-10 flex">
              <div className="flex-grow h-full bg-gray-100 rounded-l-md flex items-center justify-center text-xs">
                FL-VVS
              </div>
              <div className="flex-grow h-full bg-gray-200 flex items-center justify-center text-xs">
                VS
              </div>
              <div className="flex-grow h-full bg-gray-300 flex items-center justify-center text-xs">
                SI
              </div>
              <div className="flex-grow h-full bg-gray-400 rounded-r-md flex items-center justify-center text-xs">
                I
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>FL (Perfect)</span>
              <span>I3 (Visible Inclusions)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-luxury-gold bg-opacity-10 p-4 rounded-md mt-4">
        <h3 className="text-luxury-gold font-medium mb-2">
          {t("step3.didYouKnow")}
        </h3>
        <p className="text-sm">{t("step3.didYouKnowText")}</p>
      </div>
    </div>
  );
};

// ---------- Step 4 ----------
const Step4Cut: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<DiamondFormValues>();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">{t("step4.title")}</h2>
      <p className="text-gray-600">{t("step4.description")}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="cut" className="block mb-1 font-medium">
            {t("step4.cutGrade")}{" "}
            <span className="text-red-600">{t("common.required")}</span>
          </label>
          <select
            id="cut"
            {...register("cut")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">{t("common.select")} cut grade</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Unknown">{t("common.unknown")}</option>
          </select>
          {errors.cut && (
            <p className="text-red-600 text-sm mt-1">{errors.cut.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="polish" className="block mb-1 font-medium">
            {t("step4.polish")}{" "}
            <span className="text-red-600">{t("common.required")}</span>
          </label>
          <select
            id="polish"
            {...register("polish")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">{t("common.select")} polish grade</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Unknown">{t("common.unknown")}</option>
          </select>
          {errors.polish && (
            <p className="text-red-600 text-sm mt-1">{errors.polish.message}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="symmetry" className="block mb-1 font-medium">
            {t("step4.symmetry")}{" "}
            <span className="text-red-600">{t("common.required")}</span>
          </label>
          <select
            id="symmetry"
            {...register("symmetry")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">{t("common.select")} symmetry grade</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Unknown">{t("common.unknown")}</option>
          </select>
          {errors.symmetry && (
            <p className="text-red-600 text-sm mt-1">
              {errors.symmetry.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="fluorescence" className="block mb-1 font-medium">
            {t("step4.fluorescence")}{" "}
            <span className="text-red-600">{t("common.required")}</span>
          </label>
          <select
            id="fluorescence"
            {...register("fluorescence")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">{t("common.select")} fluorescence</option>
            <option value="None">None</option>
            <option value="Faint">Faint</option>
            <option value="Medium">Medium</option>
            <option value="Strong">Strong</option>
            <option value="Very Strong">Very Strong</option>
            <option value="Unknown">{t("common.unknown")}</option>
          </select>
          {errors.fluorescence && (
            <p className="text-red-600 text-sm mt-1">
              {errors.fluorescence.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- Step 5 ----------
const Step5Measurements: React.FC = () => {
  const { register } = useFormContext<DiamondFormValues>();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">{t("step5.title")}</h2>
      <p className="text-gray-600">{t("step5.description")}</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="length" className="block mb-1 font-medium">
            {t("step5.length")}
          </label>
          <input
            id="length"
            type="text"
            {...register("length")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder={t("placeholder.length")}
          />
        </div>
        <div>
          <label htmlFor="width" className="block mb-1 font-medium">
            {t("step5.width")}
          </label>
          <input
            id="width"
            type="text"
            {...register("width")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder={t("placeholder.width")}
          />
        </div>
        <div>
          <label htmlFor="depth" className="block mb-1 font-medium">
            {t("step5.depth")}
          </label>
          <input
            id="depth"
            type="text"
            {...register("depth")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder={t("placeholder.depth")}
          />
        </div>
      </div>
    </div>
  );
};

// ---------- Step 6 ----------
const Step6Additional: React.FC = () => {
  const { register } = useFormContext<DiamondFormValues>();
  const { t } = useLanguage();
  const [hasSettings, setHasSettings] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">{t("step6.title")}</h2>
      <p className="text-gray-600">{t("step6.description")}</p>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasInclusions"
            className="h-4 w-4 text-luxury-gold focus:ring-luxury-gold"
            {...register("hasInclusions")}
          />
          <label htmlFor="hasInclusions" className="font-medium">
            {t("step6.hasInclusions")}
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasSettings"
            className="h-4 w-4 text-luxury-gold focus:ring-luxury-gold"
            {...register("hasSettings")}
            onChange={(e) => setHasSettings(e.target.checked)}
            checked={hasSettings}
          />
          <label htmlFor="hasSettings" className="font-medium">
            {t("step6.hasSettings")}
          </label>
        </div>

        {hasSettings && (
          <div className="pl-6 mt-3">
            <label htmlFor="settingMaterial" className="block mb-1 font-medium">
              {t("step6.settingMaterial")}
            </label>
            <select
              id="settingMaterial"
              {...register("settingMaterial")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            >
              <option value="">{t("common.select")} material</option>
              <option value="Platinum">Platinum</option>
              <option value="18K White Gold">18K White Gold</option>
              <option value="18K Yellow Gold">18K Yellow Gold</option>
              <option value="18K Rose Gold">18K Rose Gold</option>
              <option value="14K White Gold">14K White Gold</option>
              <option value="14K Yellow Gold">14K Yellow Gold</option>
              <option value="14K Rose Gold">14K Rose Gold</option>
              <option value="Silver">Silver</option>
              <option value="Other">{t("common.other")}</option>
            </select>
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="additionalNotes" className="block mb-1 font-medium">
            {t("step6.additionalNotes")}
          </label>
          <textarea
            id="additionalNotes"
            rows={4}
            {...register("additionalNotes")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder={t("step6.notesPlaceholder")}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

// ---------- Step 7 ----------
const Step7Contact: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<DiamondFormValues>();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">{t("step7.title")}</h2>
      <p className="text-gray-600">{t("step7.description")}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block mb-1 font-medium">
            {t("step7.fullName")}{" "}
            <span className="text-red-600">{t("common.required")}</span>
          </label>
          <input
            id="fullName"
            type="text"
            {...register("fullName")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder={t("placeholder.fullName")}
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            {t("step7.email")}{" "}
            <span className="text-red-600">{t("common.required")}</span>
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder={t("placeholder.emailFormat")}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block mb-1 font-medium">
            {t("step7.phone")}{" "}
            <span className="text-red-600">{t("common.required")}</span>
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            placeholder={t("placeholder.phoneFormat")}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="preferredContact" className="block mb-1 font-medium">
            {t("step7.preferredContact")}{" "}
            <span className="text-red-600">{t("common.required")}</span>
          </label>
          <select
            id="preferredContact"
            {...register("preferredContact")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
          >
            <option value="">{t("common.select")} contact method</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="Either">Either</option>
          </select>
          {errors.preferredContact && (
            <p className="text-red-600 text-sm mt-1">
              {errors.preferredContact.message}
            </p>
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
            {t("step7.agreement")}{" "}
            <a href="/terms" className="text-luxury-gold hover:underline">
              {t("step7.terms")}
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-luxury-gold hover:underline">
              {t("step7.privacy")}
            </a>
          </label>
        </div>
      </div>
    </div>
  );
};

// ====== PAGE ======
const ValuationTool: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DiamondFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEstimate, setShowEstimate] = useState(false);

  // Kết quả từ BE
  const [estimateRes, setEstimateRes] = useState<{
    totalPrice: number;
    currency: string;
    requestId: string;
  } | null>(null);

  const [caseId, setCaseId] = useState<string | null>(null);
  const totalSteps = 7;

  const methods = useForm<DiamondFormValues>({
    resolver: zodResolver(createDiamondFormSchema(t)),
    mode: "onChange",
  });

  const { handleSubmit, trigger } = methods;

  // Điều hướng step + validate từng bước
  const nextStep = async () => {
    let isValid = true;
    switch (currentStep) {
      case 2:
        isValid = await trigger(["shape", "caratWeight"]);
        break;
      case 3:
        isValid = await trigger(["color", "clarity"]);
        break;
      case 4:
        isValid = await trigger(["cut", "polish", "symmetry", "fluorescence"]);
        break;
      case 7:
        isValid = await trigger([
          "fullName",
          "email",
          "phone",
          "preferredContact",
        ]);
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      if (currentStep === totalSteps) {
        handleSubmit(onSubmit)();
      } else setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => setCurrentStep((s) => s - 1);

  // Helpers
  const toNum = (v?: string) => {
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  // ===== Submit: gọi BE Estimate thay cho mock =====
  const onSubmit = async (data: DiamondFormValues) => {
    setFormData(data);
    setIsSubmitting(true);

    try {
      const measurements =
        data.length && data.width && data.depth
          ? `${data.length}-${data.width}x${data.depth}mm`
          : undefined;

      const res = await apiEstimate({
        certificateNo: data.certificateNumber || undefined,
        origin: data.origin || "Natural",
        shape: data.shape!,
        carat: toNum(data.caratWeight) ?? 0,
        color: data.color!,
        clarity: data.clarity!,
        cut: data.cut!,
        polish: data.polish!,
        symmetry: data.symmetry!,
        fluorescence: data.fluorescence!,
        tablePercent: undefined, // nếu bạn có field Table% thì map vào đây
        depthPercent: undefined, // nếu có field Depth% (%)
        measurements,
        customerName: data.fullName,
      });

      setEstimateRes({
        totalPrice: res.totalPrice,
        currency: res.currency,
        requestId: res.requestId,
      });

      setShowEstimate(true);
    } catch (err: any) {
      // Có thể hiển thị toast
      console.error("Estimate error", err?.response?.data || err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Estimate failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== Tạo hồ sơ chính thức từ requestId =====
  const createOfficialCase = async () => {
    if (!estimateRes?.requestId || !formData) return;

    try {
      const measurements =
        formData.length && formData.width && formData.depth
          ? `${formData.length}-${formData.width}x${formData.depth}mm`
          : undefined;

      const created = await apiCreateCase({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        preferredMethod: formData.preferredContact || "Email",

        certificateNo: formData.certificateNumber || undefined,
        origin: formData.origin || "Natural",
        shape: formData.shape!,
        carat: toNum(formData.caratWeight) ?? 0,
        color: formData.color!,
        clarity: formData.clarity!,
        cut: formData.cut!,
        polish: formData.polish!,
        symmetry: formData.symmetry!,
        fluorescence: formData.fluorescence!,
        tablePercent: undefined,
        depthPercent: undefined,
        measurements,
        existingRequestId: estimateRes.requestId,
        notes: formData.additionalNotes,
      });

      setCaseId(created.caseId);
      // navigate(`/valuation/cases/${created.caseId}`);
    } catch (err: any) {
      console.error("Create case error", err?.response?.data || err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Create case failed. Please try again."
      );
    }
  };

  // Anim
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  // Render step
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
              {t("valuation.title")}{" "}
              <span className="text-luxury-gold">
                {t("valuation.titleHighlight")}
              </span>{" "}
              {t("valuation.tool")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("valuation.description")}
            </p>
          </div>

          {/* Progress */}
          {!showEstimate && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-500">
                  {t("valuation.step")} {currentStep} {t("valuation.of")}{" "}
                  {totalSteps}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {Math.round((currentStep / totalSteps) * 100)}
                  {t("valuation.complete")}
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
                        className={`btn btn-secondary ${
                          currentStep === 1
                            ? "opacity-0 pointer-events-none"
                            : ""
                        }`}
                      >
                        {t("valuation.previous")}
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {currentStep < totalSteps
                          ? t("valuation.continue")
                          : isSubmitting
                          ? t("results.calculating")
                          : t("valuation.getEstimate")}
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
                  <p className="mt-4 text-lg">{t("results.calculating")}</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="inline-block p-4 bg-luxury-gold bg-opacity-10 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12 h-12 text-luxury-gold"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                        />
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-3xl font-serif font-bold mb-2">
                    {t("results.estimatedValue")}
                  </h2>
                  <p className="text-gray-600 mb-6">{t("results.basedOn")}</p>

                  <div className="py-4 px-8 bg-gray-50 rounded-lg inline-block mb-8">
                    <span className="block text-5xl font-bold text-luxury-gold">
                      {estimateRes
                        ? `${estimateRes.totalPrice.toLocaleString()} ${
                            estimateRes.currency
                          }`
                        : "--"}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {t("results.marketValue")}
                    </span>
                  </div>

                  {/* Summary + Next steps */}
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        Your Diamond Summary
                      </h3>
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

                    <div>
                      <h3 className="text-lg font-bold mb-2">Next Steps</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {t("results.noteText")}
                      </p>

                      {caseId ? (
                        <div className="bg-emerald-50 p-4 rounded-lg mb-4 text-emerald-800">
                          ✅ {t("results.requestSubmitted")} — ID:{" "}
                          <b>{caseId}</b>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={createOfficialCase}
                            className="btn btn-primary"
                          >
                            {t("valuation.submitOfficial")}
                          </button>
                          <button
                            onClick={() => navigate("/dashboard")}
                            className="btn btn-secondary"
                          >
                            {t("valuation.trackRequest")}
                          </button>
                          <button
                            onClick={() => {
                              setShowEstimate(false);
                              setCurrentStep(1);
                              setFormData(undefined);
                              setEstimateRes(null);
                              setCaseId(null);
                            }}
                            className="btn btn-secondary"
                          >
                            {t("valuation.newRequest")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {!showEstimate && (
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                {t("valuation.help")}{" "}
                <button
                  onClick={() => navigate("/contact")}
                  className="text-luxury-gold hover:underline bg-transparent border-none cursor-pointer"
                >
                  {t("valuation.contactExperts")}
                </button>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValuationTool;
