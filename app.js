const planInput = document.querySelector('#plan-input');
const output = document.querySelector('#prompt-output');
const copyPromptButton = document.querySelector('#copy-prompt');
const planError = document.querySelector('#plan-error');
const toast = document.querySelector('#toast');

const FIXED_OPENING = `Create one realistic 15-second vertical 9:16 TikTok affiliate video at the highest available quality using the product-reference images attached directly here.

Use @me’s saved verified voice for every spoken line. Do not substitute another voice or narrator.

Complete all essential action and narration by 0:14. From 0:14–0:15, hold a silent, stable hero shot with no new dialogue or action. Do not cut off the final spoken line.

Preserve the same product, character, setting, and lighting throughout. Do not generate captions, prices, logos, ratings, random text, or watermarks.`;

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  }
  showToast(successMessage);
}

document.querySelector('#copy-template').addEventListener('click', () => {
  copyText(document.querySelector('#chatgpt-template').textContent.trim(), 'ChatGPT request copied');
});

function autoGrow() {
  planInput.style.height = 'auto';
  const nextHeight = Math.min(Math.max(planInput.scrollHeight, 180), 520);
  planInput.style.height = `${nextHeight}px`;
  planInput.style.overflowY = planInput.scrollHeight > 520 ? 'auto' : 'hidden';
}

function clearOutput() {
  output.innerHTML = '<span class="placeholder">Your finished prompt will appear here.</span>';
  copyPromptButton.disabled = true;
}

document.querySelector('#clear-plan').addEventListener('click', () => {
  planInput.value = '';
  planError.hidden = true;
  autoGrow();
  planInput.focus();
});

document.querySelector('#build-prompt').addEventListener('click', () => {
  const plan = planInput.value.trim();
  if (!plan) {
    planError.hidden = false;
    planInput.focus();
    return;
  }
  planError.hidden = true;
  output.textContent = `${FIXED_OPENING}\n\n${plan}`;
  copyPromptButton.disabled = false;
  output.scrollTop = 0;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

copyPromptButton.addEventListener('click', () => {
  if (!copyPromptButton.disabled) copyText(output.textContent.trim(), 'Google Flow prompt copied');
});

document.querySelector('#clear-output').addEventListener('click', clearOutput);
planInput.addEventListener('input', () => {
  planError.hidden = true;
  autoGrow();
});

autoGrow();
