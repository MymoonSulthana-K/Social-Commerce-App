import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ReferralContext = createContext();

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error("useReferral must be used within a ReferralProvider");
  }
  return context;
};

export const ReferralProvider = ({ children }) => {
  const [activeReferrals, setActiveReferrals] = useState([]);
  const [referralRewards, setReferralRewards] = useState([]);

  // Load referral data from localStorage on mount
  useEffect(() => {
    const savedReferrals = localStorage.getItem("activeReferrals");
    const savedRewards = localStorage.getItem("referralRewards");

    if (savedReferrals) {
      const referrals = JSON.parse(savedReferrals);
      // Filter out expired referrals
      const validReferrals = referrals.filter(ref => {
        const timeLeft = new Date(ref.expiresAt) - new Date();
        return timeLeft > 0;
      });
      setActiveReferrals(validReferrals);
      localStorage.setItem("activeReferrals", JSON.stringify(validReferrals));
    }

    if (savedRewards) {
      setReferralRewards(JSON.parse(savedRewards));
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("activeReferrals", JSON.stringify(activeReferrals));
  }, [activeReferrals]);

  useEffect(() => {
    localStorage.setItem("referralRewards", JSON.stringify(referralRewards));
  }, [referralRewards]);

  const generateReferralLink = useCallback(async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User must be logged in to create referrals");
      }

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch("http://localhost:5000/api/referrals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create referral");
      }

      const newReferral = {
        id: data.referralCode,
        productId,
        referrerId: "current_user", // Will be set by backend
        referralLink: data.referralLink,
        expiresAt: data.expiresAt,
        status: "active",
        purchases: []
      };

      setActiveReferrals(prev => [...prev, newReferral]);
      return newReferral;
    } catch (error) {
      console.error("Error generating referral:", error);
      
      // If API call fails, generate a local referral as fallback
      if (error.name === 'AbortError') {
        console.log("API timeout, generating local referral");
      }
      
      // Fallback: generate local referral
      const referralCode = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      const localReferral = {
        id: referralCode,
        productId,
        referrerId: "current_user",
        referralLink: `http://localhost:3000/product/${productId}?ref=${referralCode}`,
        expiresAt: expiresAt.toISOString(),
        status: "active",
        purchases: []
      };

      setActiveReferrals(prev => [...prev, localReferral]);
      return localReferral;
    }
  }, []);

  const trackReferralPurchase = (referralId, purchaserId, orderData) => {
    setActiveReferrals(prev => prev.map(ref => {
      if (ref.id === referralId) {
        // Check if purchaser is different from referrer
        if (ref.referrerId === purchaserId) {
          return ref; // Don't count self-purchases
        }

        // Check if purchaser already bought through this referral
        if (ref.purchases.some(p => p.purchaserId === purchaserId)) {
          return ref; // Don't count duplicate purchases
        }

        const updatedRef = {
          ...ref,
          purchases: [...ref.purchases, {
            purchaserId,
            orderId: orderData.orderId,
            amount: orderData.total,
            timestamp: new Date().toISOString()
          }]
        };

        // Check if we reached 3 purchases
        if (updatedRef.purchases.length >= 3) {
          // Create reward for referrer
          const reward = {
            id: `reward_${Date.now()}`,
            referralId: ref.id,
            referrerId: ref.referrerId,
            type: "discount", // or "cashback"
            amount: 100, // ₹100 discount
            description: `Referral reward for ${ref.purchases.length} successful referrals`,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            used: false
          };

          setReferralRewards(prev => [...prev, reward]);

          // Mark referral as completed
          updatedRef.status = "completed";
        }

        return updatedRef;
      }
      return ref;
    }));
  };

  const getReferralById = (referralId) => {
    return activeReferrals.find(ref => ref.id === referralId);
  };

  const getTimeLeft = useCallback((expiresAt) => {
    const timeLeft = new Date(expiresAt) - new Date();
    return Math.max(0, timeLeft);
  }, []);

  const getActiveReferralForProduct = useCallback((productId, referrerId) => {
    return activeReferrals.find(ref =>
      ref.productId === productId &&
      ref.referrerId === referrerId &&
      ref.status === "active" &&
      getTimeLeft(ref.expiresAt) > 0
    );
  }, [activeReferrals]);

  const getUserRewards = (userId) => {
    return referralRewards.filter(reward =>
      reward.referrerId === userId && !reward.used
    );
  };

  const useReward = (rewardId) => {
    setReferralRewards(prev =>
      prev.map(reward =>
        reward.id === rewardId
          ? { ...reward, used: true, usedAt: new Date().toISOString() }
          : reward
      )
    );
  };

  const value = {
    activeReferrals,
    referralRewards,
    generateReferralLink,
    trackReferralPurchase,
    getReferralById,
    getTimeLeft,
    getActiveReferralForProduct,
    getUserRewards,
    useReward
  };

  return (
    <ReferralContext.Provider value={value}>
      {children}
    </ReferralContext.Provider>
  );
};
