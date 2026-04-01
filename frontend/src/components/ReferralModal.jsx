import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import "../styles/referral.css"

const ReferralModal = ({ product, onClose }) => {
    const [session, setSession] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [copied, setCopied] = useState(false);

    const handleShareAndStart = async () => {
        try {
            const data = await apiRequest("/referral/start", {
                method: "POST",
                body: JSON.stringify({ productId: product._id }),
            });
            setSession(data);
        } catch (err) {
            alert(err.message || "Error starting referral");
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(refLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert("Failed to copy link");
        }
    };

    // Fetch existing session when modal opens and refetch every 5 seconds
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await apiRequest(`/referral/status/${product._id}`, {
                    method: "GET",
                });
                setSession(data); // Set to data, which could be null if no referral exists
            } catch (err) {
                setSession(null); // Clear session on error (e.g., no referral found)
            }
        };

        fetchSession();
        
        // Refetch every 5 seconds to get updated buyer count
        const interval = setInterval(fetchSession, 5000);
        
        return () => clearInterval(interval);
    }, [product._id]);

    useEffect(() => {
        if (!session) return;
        
        // Calculate timer immediately and update every second
        const updateTimer = () => {
            const expiryDate = new Date(session.expiresAt);
            const now = new Date();
            const distance = expiryDate - now;
            
            if (distance < 0) {
                setTimeLeft("Expired");
            } else {
                const hours = Math.floor(distance / 3600000);
                const mins = Math.floor((distance % 3600000) / 60000);
                const secs = Math.floor((distance % 60000) / 1000);
                setTimeLeft(`${hours}h ${mins}m ${secs}s`);
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [session]);

    const refLink = `${window.location.origin}/product/${product._id}?ref=${session?.referralCode}`;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Refer {product.name}</h3>
                <p>You can referrrr this product to 3 unique friends and if they buy within 24 hours, you'll earn a 50% discount!</p>
                {!session ? (
                    <button onClick={handleShareAndStart} className="btn share-btn">
                        Share & Earn 50% Discount
                    </button>
                ) : (
                    <div className="referral-info">
                        {session.isCompleted ? (
                            <div className="success-message">
                                <p className="success-text">🎉 Referral Successful!</p>
                                <p>You are eligible for a <strong>50% discount</strong> for this product!</p>
                            </div>
                        ) : (
                            <>
                                <p>Expires in: <strong>{timeLeft}</strong></p>
                                <p>Progress: {session.buyers.length}/3 purchases</p>
                            </>
                        )}
                        <div className="copy-box">
                            <input readOnly value={refLink} />
                            <button onClick={handleCopyLink} className={`copy-btn ${copied ? 'copied' : ''}`}>
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                )}
                <button onClick={onClose} className="close-btn">Close</button>
            </div>
        </div>
    );
};

export default ReferralModal;
