// ============ AI OPERATIONS ============

// Send chat message
async function sendChat() {
  if (!DOM.chatInput) return;
  
  const msg = DOM.chatInput.value.trim();
  if (!msg) return;
  
  DOM.chatInput.value = '';
  
  addMsg('user', msg);
  VibeCodeState.chatHistory.push({ role: 'user', content: msg });
  
  const reply = await callAI(msg);
  addMsg('ai', reply);
  VibeCodeState.chatHistory.push({ role: 'ai', content: reply });
}

// Call AI API
async function callAI(prompt) {
  const backendUrl = VibeCodeState.backendWorkerUrl;
  if (!backendUrl) return "Worker URL belum diatur. Atur di Settings!";
  
  const balance = await checkTokenBalance();
  if (balance <= 0) {
    toast("Saldo token habis! Silakan top-up.", 'error');
    showTopUpModal();
    return "Saldo token habis. Silakan top-up terlebih dahulu.";
  }
  
  try {
    const response = await fetch(backendUrl + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: VibeCodeState.chatHistory.concat([{ role: 'user', content: prompt }]),
        model: modelId,
        projectInstruction: projectInstruction,
      })
    });
    
    if (!response.ok) throw new Error('AI Error: ' + response.statusText);
    
    const data = await response.json();
    const aiResponse = typeof data.response === 'string' 
      ? data.response 
      : (data.response?.response || data.error || "Tidak ada respons dari AI.");
    
    const promptTokens = Math.ceil(prompt.length / 4);
    const completionTokens = Math.ceil(aiResponse.length / 4);
    
    await consumeTokens(promptTokens, completionTokens, modelId);
    
    return aiResponse;
  } catch (error) {
    return '[Error AI]\n\n' + error.message + '\n\nPastikan Worker URL benar dan Cloudflare Workers AI sudah diaktifkan.';
  }
}

// Add message to chat
function addMsg(role, content) {
  if (!DOM.chatMessages) return;
  
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  const roleText = role === 'user' ? 'You' : 'VibeCode AI';
  div.innerHTML = '<div class="role">' + roleText + '</div>' + escapeHtml(content).replace(/\n/g, '<br>');
  DOM.chatMessages.appendChild(div);
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

// Edit active file with AI
async function editActiveFileWithAI() {
  if (!VibeCodeState.activeFile) { 
    toast('Buka file terlebih dahulu', 'error'); 
    return; 
  }
  
  const instruction = prompt('Instruksi edit untuk ' + VibeCodeState.activeFile + ':');
  if (!instruction || !instruction.trim()) return;
  
  const editFileBtn = document.getElementById('editFileBtn');
  if (editFileBtn) editFileBtn.disabled = true;
  
  try {
    const backendUrl = VibeCodeState.backendWorkerUrl;
    const response = await fetch(backendUrl + '/api/ai/edit-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: VibeCodeState.activeFile,
        content: VibeCodeState.files[VibeCodeState.activeFile] || '',
        instruction: instruction.trim(),
        model: modelId,
        projectInstruction: projectInstruction
      })
    });
    
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'AI edit gagal');
    
    VibeCodeState.files[VibeCodeState.activeFile] = data.content;
    saveState();
    renderEditor();
    markChanged(VibeCodeState.activeFile);
    addMsg('ai', data.summary);
    toast('File berhasil diedit AI', 'success');
  } catch (error) {
    toast('AI edit error: ' + error.message, 'error');
  } finally {
    if (editFileBtn) editFileBtn.disabled = false;
  }
}

// Show top-up modal
function showTopUpModal() {
  const balance = VibeCodeState.tokenBalance || 0;
  const html = `
    <h3>Top-Up Token</h3>
    <p style="color:var(--text-dim);font-size:12px;margin-bottom:12px;">
      Saldo token kamu: <strong>${formatNumber(balance)}</strong>
    </p>
    <label>Pilih Paket:</label>
    <select class="git-input" id="topUpPlan">
      <option value="STARTER">Starter: 50,000 tokens ($1)</option>
      <option value="PRO">Pro: 300,000 tokens ($5)</option>
      <option value="BUSINESS">Business: 1,500,000 tokens ($20)</option>
      <option value="ENTERPRISE">Enterprise: 10,000,000 tokens ($100)</option>
    </select>
    <div class="btn-row">
      <button class="btn secondary" id="topUpCancelBtn">Batal</button>
      <button class="btn" id="topUpConfirmBtn">Top-Up</button>
    </div>
  `;
  showModal(html);
  
  const topUpCancelBtn = document.getElementById('topUpCancelBtn');
  const topUpConfirmBtn = document.getElementById('topUpConfirmBtn');
  
  if (topUpCancelBtn) topUpCancelBtn.addEventListener('click', hideModal);
  if (topUpConfirmBtn) topUpConfirmBtn.addEventListener('click', topUpTokens);
}

// Top-up tokens via PayPal
async function topUpTokens() {
  const planSelect = document.getElementById('topUpPlan');
  if (!planSelect) return;
  
  const plan = planSelect.value;
  const planData = {
    STARTER: { tokens: 50000, amount: '1.00', name: 'Starter' },
    PRO: { tokens: 300000, amount: '5.00', name: 'Pro' },
    BUSINESS: { tokens: 1500000, amount: '20.00', name: 'Business' },
    ENTERPRISE: { tokens: 10000000, amount: '100.00', name: 'Enterprise' }
  }[plan];
  
  const backendUrl = VibeCodeState.backendWorkerUrl;
  if (!planData || !backendUrl) { 
    toast('Backend Worker URL belum diatur', 'error'); 
    return; 
  }
  
  try {
    const response = await fetch(backendUrl + '/api/payments/create-token-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { 
          customer_id: VibeCodeState.userId, 
          email: VibeCodeState.userId + '@vibecode.local', 
          name: 'VibeCode User' 
        },
        order: {
          sku: plan,
          amount: planData.amount,
          currency: 'USD',
          itemName: planData.name + ' - ' + formatNumber(planData.tokens) + ' tokens',
          return_url: window.location.origin + window.location.pathname + '?paypal=success',
          cancel_url: window.location.origin + window.location.pathname + '?paypal=cancel'
        }
      })
    });
    
    const data = await response.json();
    if (response.ok && data.success) {
      const approval = data.data.links && data.data.links.find(function(link) { 
        return link.rel === 'approve'; 
      });
      if (!approval) throw new Error('PayPal approval URL tidak ditemukan');
      
      localStorage.setItem('vibecode_pending_paypal_order', data.data.order_id);
      hideModal();
      window.location.href = approval.href;
    } else {
      toast('PayPal error: ' + (data.error || 'gagal membuat order'), 'error');
    }
  } catch (error) {
    toast('Gagal membuat pembayaran: ' + error.message, 'error');
  }
}

// Capture pending PayPal order
async function capturePendingPayPalOrder() {
  const pendingOrder = localStorage.getItem('vibecode_pending_paypal_order');
  const paymentStatus = new URLSearchParams(window.location.search).get('paypal');
  
  if (!pendingOrder || !paymentStatus) return;
  
  localStorage.removeItem('vibecode_pending_paypal_order');
  if (paymentStatus === 'cancel') { 
    toast('Pembayaran dibatalkan', 'error'); 
    return; 
  }
  
  try {
    const backendUrl = VibeCodeState.backendWorkerUrl;
    const response = await fetch(backendUrl + '/api/payments/capture-token-order/' + encodeURIComponent(pendingOrder), {
      method: 'POST'
    });
    
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'capture gagal');
    
    toast('Pembayaran berhasil! Token sudah ditambahkan.', 'success');
    await checkTokenBalance();
    window.history.replaceState(null, '', window.location.pathname);
  } catch (error) {
    toast('Gagal memproses pembayaran: ' + error.message, 'error');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sendChat,
    callAI,
    addMsg,
    editActiveFileWithAI,
    showTopUpModal,
    topUpTokens,
    capturePendingPayPalOrder
  };
}
