# Automated UPI Payment Gateway Integration Guide (Option 2)

This document is a quick reminder and guide for integrating automated UPI payments into **Jinzai** using a **Personal Savings Account** with **zero paperwork / zero KYC**.

---

## 🎯 Objective
- **Zero Document Setup**: No GST, no business registration, no merchant bank account required.
- **Direct Payouts**: 100% of the money goes instantly into your personal UPI ID: `domainexpansion@okaxis`.
- **Instant Plan Activation**: Webhook automatically activates the user's plan (`single_99`, `pro_399`, `business_999`, `institution_4999`) in the database upon payment.

---

## 🚀 2-Minute Setup Steps

### 1. Register on a Zero-KYC UPI Gateway Provider
Choose either:
* **[UPIGateway.com](https://upigateway.com)**
* **[EkQR.in](https://ekqr.in)**

### 2. Configure Your UPI ID
In the gateway dashboard:
* Enter your UPI ID: `domainexpansion@okaxis`
* Set Webhook URL: `https://jinzai-ten.vercel.app/api/payment/upi-webhook`

### 3. Retrieve API Credentials
Copy from your gateway dashboard:
1. **API Key / Secret Token** (e.g., `key_xxxxxxxxxxxx`)
2. **UPI Gateway Service Name** (e.g. `UPIGateway` or `EkQR`)

---

## 💻 Architecture & Code in Jinzai

### 1. Environment Variables (`.env`)
```env
UPI_GATEWAY_PROVIDER="upigateway"
UPI_GATEWAY_KEY="your_api_key_here"
UPI_GATEWAY_SECRET="your_secret_here"
```

### 2. Payment Flow
1. **Frontend**: When the user clicks "Pay ₹399", it calls `/api/payment/create-upi-order`.
2. **Backend**: Jinzai calls the UPI Gateway to create a dynamic QR code for the exact order amount with a unique transaction reference.
3. **User**: Scans the dynamic QR on Google Pay / PhonePe / Paytm.
4. **Webhook**: The gateway sends a verified callback to `/api/payment/upi-webhook`.
5. **Auto-Activation**:
   ```typescript
   // Jinzai updates Prisma DB automatically:
   await db.user.update({
     where: { email },
     data: {
       plan: requestedPlan,
       planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
     },
   });
   ```
6. **Confirmation**: Resend sends an automated receipt & welcome email to the user.

---

## 📋 Checklist When Ready
- [ ] Create account on UPIGateway.com or EkQR.in
- [ ] Add `domainexpansion@okaxis` in settings
- [ ] Copy API Key and share with assistant to complete the wiring
