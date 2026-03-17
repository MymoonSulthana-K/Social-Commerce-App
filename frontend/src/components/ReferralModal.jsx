import React, { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import "../styles/referral.css"

const ReferralModal = ({ product, onClose }) => {
    const [session, setSession] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");

    const handleShareAndStart = async () => {
        try {
            const data = await apiRequest("/referral/start", {
                method: "POST",
                body: JSON.stringify({ productId: product._id }),
            });
        } catch (err) {
            alert("Error starting referral");
        }
    };

    useEffect(() => {
        if (!session) return;
        const timer = setInterval(() => {
            const distance = new Date(session.expiresAt) - new Date();
            if (distance < 0) {
                setTimeLeft("Expired");
                clearInterval(timer);
            } else {
                const hours = Math.floor(distance / 3600000);
                const mins = Math.floor((distance % 3600000) / 60000);
                const secs = Math.floor((distance % 60000) / 1000);
                setTimeLeft(`${hours}h ${mins}m ${secs}s`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [session]);

    const refLink = `${window.location.origin}/product/${product._id}?ref=${session?.referralCode}`;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Refer {product.name}</h3>
                {!session ? (
                    <button onClick={handleShareAndStart} className="btn share-btn">
                        Share & Earn 50% Discount
                    </button>
                ) : (
                    <div className="referral-info">
                        <p>Expires in: <strong>{timeLeft}</strong></p>
                        <p>Progress: {session.buyers.length}/3 purchases</p>
                        <div className="copy-box">
                            <input readOnly value={refLink} />
                            <button onClick={() => navigator.clipboard.writeText(refLink)}>Copy</button>
                        </div>
                    </div>
                )}
                <button onClick={onClose} className="close-btn">Close</button>
            </div>
        </div>
    );
};

export default ReferralModal;