// src/pages/admin/tabs/SettingsTab.tsx
// ============================
import React, { useState } from "react";
import { motion as motion8 } from "framer-motion";

interface SettingsTabProps {
  t: (key: string) => string;
  onSave: (payload: any) => void;
}

const fadeInUp8 = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const SettingsTab: React.FC<SettingsTabProps> = ({ t, onSave }) => {
  const [pricing, setPricing] = useState({ base: 150, insurance: 400 });
  const [turnaround, setTurnaround] = useState({
    standard: 5,
    express: 2,
    emergencyHours: 24,
  });
  const [emails, setEmails] = useState({
    confirm: true,
    valuation: true,
    marketing: true,
  });

  return (
    <motion8.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp8}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-serif font-bold mb-6">
          {t("admin.systemConfig")}
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">{t("admin.pricingManagement")}</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">
                  {t("admin.baseValuationFee")}
                </h5>
                <input
                  type="number"
                  value={pricing.base}
                  onChange={(e) =>
                    setPricing({ ...pricing, base: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">
                  {t("admin.insuranceAppraisalFee")}
                </h5>
                <input
                  type="number"
                  value={pricing.insurance}
                  onChange={(e) =>
                    setPricing({
                      ...pricing,
                      insurance: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">
              {t("admin.turnaroundSettings")}
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">{t("admin.standardDays")}</h5>
                <input
                  type="number"
                  value={turnaround.standard}
                  onChange={(e) =>
                    setTurnaround({
                      ...turnaround,
                      standard: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">{t("admin.expressDays")}</h5>
                <input
                  type="number"
                  value={turnaround.express}
                  onChange={(e) =>
                    setTurnaround({
                      ...turnaround,
                      express: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">
                  {t("admin.emergencyHours")}
                </h5>
                <input
                  type="number"
                  value={turnaround.emergencyHours}
                  onChange={(e) =>
                    setTurnaround({
                      ...turnaround,
                      emergencyHours: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">
              {t("admin.emailNotifications")}
            </h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={emails.confirm}
                  onChange={(e) =>
                    setEmails({ ...emails, confirm: e.target.checked })
                  }
                  className="text-luxury-gold focus:ring-luxury-gold"
                />
                <span className="ml-2">
                  {t("admin.sendOrderConfirmations")}
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={emails.valuation}
                  onChange={(e) =>
                    setEmails({ ...emails, valuation: e.target.checked })
                  }
                  className="text-luxury-gold focus:ring-luxury-gold"
                />
                <span className="ml-2">{t("admin.sendValuationUpdates")}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={emails.marketing}
                  onChange={(e) =>
                    setEmails({ ...emails, marketing: e.target.checked })
                  }
                  className="text-luxury-gold focus:ring-luxury-gold"
                />
                <span className="ml-2">{t("admin.sendMarketingEmails")}</span>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t">
            <button
              onClick={() => onSave({ pricing, turnaround, emails })}
              className="btn btn-primary"
            >
              {t("admin.saveSettings")}
            </button>
          </div>
        </div>
      </div>
    </motion8.div>
  );
};

export default SettingsTab;
