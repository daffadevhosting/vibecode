// ============ TOKEN BILLING SYSTEM ============

// Update balance UI
function updateBalanceUI() {
  const balanceEl = document.getElementById('tokenBalance');
  if (balanceEl) {
    balanceEl.textContent = '🪙 ' + (VibeCodeState.tokenBalance ? VibeCodeState.tokenBalance.toLocaleString() : 0);
  }
}

// Check token balance
async function checkTokenBalance() {
  const billingWorkerUrl = 'https://ai-token-billing.mvstream.workers.dev';
  
  try {
    const response = await fetch(`${billingWorkerUrl}/balance?userId=${VibeCodeState.userId}`, {
      headers: { 'Authorization': 'Bearer demo-token' }
    });
    
    const data = await response.json();
    if (data.ok) {
      VibeCodeState.tokenBalance = data.balance;
      updateBalanceUI();
      return data.balance;
    }
  } catch (error) {
    console.error("Error checking balance:", error);
    return 0;
  }
  return 0;
}

// Consume tokens
async function consumeTokens(promptTokens, completionTokens, model) {
  model = model || modelId;
  const billingWorkerUrl = 'https://ai-token-billing.mvstream.workers.dev';
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  
  try {
    const response = await fetch(`${billingWorkerUrl}/consume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-token'
      },
      body: JSON.stringify({
        userId: VibeCodeState.userId,
        requestId: requestId,
        promptTokens: promptTokens,
        completionTokens: completionTokens,
        model: model
      })
    });
    
    const data = await response.json();
    if (!data.ok) {
      if (data.error === 'insufficient_balance') {
        toast('Saldo token tidak mencukupi!', 'error');
        showTopUpModal();
        return false;
      } else {
        toast('Error: ' + data.error, 'error');
        return false;
      }
    }
    VibeCodeState.tokenBalance = data.newBalance;
    updateBalanceUI();
    return true;
  } catch (error) {
    console.error("Error consuming tokens:", error);
    toast("Gagal terhubung ke Billing System", 'error');
    return false;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkTokenBalance,
    consumeTokens
  };
}
