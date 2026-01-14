// QR Code Generator Application
// Pure vanilla JavaScript - no frameworks

// Application State
const state = {
  inputType: 'url',
  inputValue: '',
  size: 256,
  errorCorrection: 'M',
  fgColor: '#000000',
  bgColor: '#FFFFFF',
  cornerStyle: 'square',
  logoUrl: null,
  logoOpacity: 100,
  frameTemplate: 'none',
  frameText: 'SCAN ME'
};

// Input type configurations
const inputConfigs = {
  url: { label: 'Enter URL', placeholder: 'https://example.com', hint: 'Enter the URL you want to encode' },
  text: { label: 'Enter Text', placeholder: 'Your message here...', hint: 'Enter any text content' },
  email: { label: 'Enter Email', placeholder: 'name@example.com', hint: 'Enter an email address' },
  phone: { label: 'Enter Phone', placeholder: '+1234567890', hint: 'Enter a phone number with country code' },
  bitcoin: { label: 'Bitcoin Address', placeholder: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', hint: 'Enter a Bitcoin wallet address' },
  wifi: { label: 'WiFi Network Name', placeholder: 'MyNetwork', hint: 'Enter the WiFi network SSID' },
  sms: { label: 'Phone Number', placeholder: '+1234567890', hint: 'Enter a phone number for SMS' },
  vcard: { label: 'vCard Data', placeholder: 'Name;Phone;Email', hint: 'Enter contact info separated by semicolons' }
};

// DOM Elements
let canvas, ctx, placeholder, loadingSpinner, contentInput, inputLabel, inputHint;
let sizeSlider, sizeValue, fgColor, bgColor, fgColorText, bgColorText;
let opacitySlider, opacityValue, logoInput, logoPreview, logoImage, logoOpacityContainer;
let frameText, frameTextContainer;
let debounceTimer = null;
let qrInstance = null;

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initDOMElements();
  initTheme();
  initEventListeners();
});

function initDOMElements() {
  canvas = document.getElementById('qrCanvas');
  ctx = canvas.getContext('2d');
  placeholder = document.getElementById('qrPlaceholder');
  loadingSpinner = document.getElementById('loadingSpinner');
  contentInput = document.getElementById('contentInput');
  inputLabel = document.getElementById('inputLabel');
  inputHint = document.getElementById('inputHint');
  sizeSlider = document.getElementById('sizeSlider');
  sizeValue = document.getElementById('sizeValue');
  fgColor = document.getElementById('fgColor');
  bgColor = document.getElementById('bgColor');
  fgColorText = document.getElementById('fgColorText');
  bgColorText = document.getElementById('bgColorText');
  opacitySlider = document.getElementById('opacitySlider');
  opacityValue = document.getElementById('opacityValue');
  logoInput = document.getElementById('logoInput');
  logoPreview = document.getElementById('logoPreview');
  logoImage = document.getElementById('logoImage');
  logoOpacityContainer = document.getElementById('logoOpacityContainer');
  frameText = document.getElementById('frameText');
  frameTextContainer = document.getElementById('frameTextContainer');
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
}

function initEventListeners() {
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', function() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });

  // Input type tabs
  document.getElementById('inputTypeTabs').addEventListener('click', function(e) {
    const tab = e.target.closest('.input-tab');
    if (!tab) return;
    
    document.querySelectorAll('.input-tab').forEach(function(t) { 
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    
    state.inputType = tab.dataset.type;
    const config = inputConfigs[state.inputType];
    inputLabel.textContent = config.label;
    contentInput.placeholder = config.placeholder;
    inputHint.textContent = config.hint;
    
    generateQR();
  });

  // Content input
  contentInput.addEventListener('input', function(e) {
    state.inputValue = e.target.value;
    debouncedGenerate();
  });

  // Size slider
  sizeSlider.addEventListener('input', function(e) {
    state.size = parseInt(e.target.value);
    sizeValue.textContent = state.size + 'px';
    debouncedGenerate();
  });

  // Error correction buttons
  document.getElementById('errorLevelBtns').addEventListener('click', function(e) {
    const btn = e.target.closest('.error-level-btn');
    if (!btn) return;
    
    document.querySelectorAll('.error-level-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    state.errorCorrection = btn.dataset.level;
    generateQR();
  });

  // Color inputs
  fgColor.addEventListener('input', function(e) {
    state.fgColor = e.target.value;
    fgColorText.value = e.target.value;
    generateQR();
  });

  bgColor.addEventListener('input', function(e) {
    state.bgColor = e.target.value;
    bgColorText.value = e.target.value;
    generateQR();
  });

  fgColorText.addEventListener('change', function(e) {
    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
      state.fgColor = e.target.value;
      fgColor.value = e.target.value;
      generateQR();
    }
  });

  bgColorText.addEventListener('change', function(e) {
    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
      state.bgColor = e.target.value;
      bgColor.value = e.target.value;
      generateQR();
    }
  });

  // Corner style buttons
  document.querySelectorAll('.corner-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.corner-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.cornerStyle = btn.dataset.corner;
      generateQR();
    });
  });

  // Logo upload
  logoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        state.logoUrl = event.target.result;
        logoImage.src = state.logoUrl;
        logoPreview.classList.remove('hidden');
        logoOpacityContainer.classList.remove('hidden');
        generateQR();
      };
      reader.readAsDataURL(file);
    }
  });

  // Remove logo
  document.getElementById('removeLogo').addEventListener('click', function() {
    state.logoUrl = null;
    logoPreview.classList.add('hidden');
    logoOpacityContainer.classList.add('hidden');
    logoInput.value = '';
    generateQR();
  });

  // Logo opacity
  opacitySlider.addEventListener('input', function(e) {
    state.logoOpacity = parseInt(e.target.value);
    opacityValue.textContent = state.logoOpacity + '%';
    generateQR();
  });

  // Frame buttons
  document.getElementById('frameBtns').addEventListener('click', function(e) {
    const btn = e.target.closest('.frame-btn');
    if (!btn) return;
    
    document.querySelectorAll('.frame-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    state.frameTemplate = btn.dataset.frame;
    
    if (state.frameTemplate !== 'none') {
      frameTextContainer.classList.remove('hidden');
    } else {
      frameTextContainer.classList.add('hidden');
    }
    
    generateQR();
  });

  // Frame text
  frameText.addEventListener('input', function(e) {
    state.frameText = e.target.value || 'SCAN ME';
    debouncedGenerate();
  });

  // Collapsible sections
  document.querySelectorAll('.collapsible-header').forEach(function(header) {
    header.addEventListener('click', function() {
      const section = header.dataset.section;
      const content = document.getElementById(section + 'Content');
      const arrow = header.querySelector('.collapsible-arrow');
      const isOpen = content.classList.contains('open');
      
      content.classList.toggle('open');
      arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      header.setAttribute('aria-expanded', !isOpen);
    });
  });

  // Download buttons
  document.getElementById('downloadBtns').addEventListener('click', function(e) {
    const btn = e.target.closest('button[data-format]');
    if (!btn || btn.disabled) return;
    downloadQR(btn.dataset.format);
  });

  // Reset button
  document.getElementById('resetBtn').addEventListener('click', resetAll);
}

function debouncedGenerate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(generateQR, 300);
}

function setDownloadButtons(enabled) {
  document.querySelectorAll('#downloadBtns button').forEach(function(btn) {
    btn.disabled = !enabled;
  });
}

function resetAll() {
  state.inputType = 'url';
  state.inputValue = '';
  state.size = 256;
  state.errorCorrection = 'M';
  state.fgColor = '#000000';
  state.bgColor = '#FFFFFF';
  state.cornerStyle = 'square';
  state.logoUrl = null;
  state.logoOpacity = 100;
  state.frameTemplate = 'none';
  state.frameText = 'SCAN ME';

  // Reset UI
  contentInput.value = '';
  sizeSlider.value = 256;
  sizeValue.textContent = '256px';
  fgColor.value = '#000000';
  bgColor.value = '#FFFFFF';
  fgColorText.value = '#000000';
  bgColorText.value = '#FFFFFF';
  opacitySlider.value = 100;
  opacityValue.textContent = '100%';
  frameText.value = '';
  logoPreview.classList.add('hidden');
  logoOpacityContainer.classList.add('hidden');
  frameTextContainer.classList.add('hidden');
  logoInput.value = '';

  // Reset active states
  document.querySelectorAll('.input-tab').forEach(function(t, i) { 
    t.classList.toggle('active', i === 0);
    t.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
  });
  document.querySelectorAll('.error-level-btn').forEach(function(b) { 
    b.classList.toggle('active', b.dataset.level === 'M'); 
  });
  document.querySelectorAll('.corner-btn').forEach(function(b) { 
    b.classList.toggle('active', b.dataset.corner === 'square'); 
  });
  document.querySelectorAll('.frame-btn').forEach(function(b) { 
    b.classList.toggle('active', b.dataset.frame === 'none'); 
  });

  // Reset input config
  const config = inputConfigs.url;
  inputLabel.textContent = config.label;
  contentInput.placeholder = config.placeholder;
  inputHint.textContent = config.hint;

  // Hide QR
  canvas.classList.add('hidden');
  placeholder.classList.remove('hidden');
  setDownloadButtons(false);
}

function generateQR() {
  if (!state.inputValue.trim()) {
    canvas.classList.add('hidden');
    placeholder.classList.remove('hidden');
    setDownloadButtons(false);
    return;
  }

  if (typeof qrcode === 'undefined') {
    console.error('QR code library not loaded');
    return;
  }

  loadingSpinner.classList.remove('hidden');

  try {
    // Build content based on input type
    let content = state.inputValue;
    switch (state.inputType) {
      case 'url':
        if (!content.startsWith('http://') && !content.startsWith('https://')) {
          content = 'https://' + content;
        }
        break;
      case 'email':
        content = 'mailto:' + state.inputValue;
        break;
      case 'phone':
        content = 'tel:' + state.inputValue;
        break;
      case 'sms':
        content = 'sms:' + state.inputValue;
        break;
      case 'bitcoin':
        content = 'bitcoin:' + state.inputValue;
        break;
      case 'wifi':
        content = 'WIFI:S:' + state.inputValue + ';;';
        break;
      case 'vcard':
        const parts = state.inputValue.split(';');
        content = 'BEGIN:VCARD\nVERSION:3.0\n';
        if (parts[0]) content += 'FN:' + parts[0] + '\n';
        if (parts[1]) content += 'TEL:' + parts[1] + '\n';
        if (parts[2]) content += 'EMAIL:' + parts[2] + '\n';
        content += 'END:VCARD';
        break;
    }

    const frameSize = state.frameTemplate !== 'none' ? 40 : 0;
    const textHeight = state.frameTemplate !== 'none' ? 30 : 0;
    const totalWidth = state.size + frameSize * 2;
    const totalHeight = state.size + frameSize * 2 + textHeight;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Clear and fill background
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw frame if selected
    if (state.frameTemplate !== 'none') {
      drawFrame(totalWidth, totalHeight - textHeight);
    }

    // Create QR code using qrcode-generator
    const errorLevelMap = { L: 'L', M: 'M', Q: 'Q', H: 'H' };
    const qr = qrcode(0, errorLevelMap[state.errorCorrection] || 'M');
    qr.addData(content);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const moduleSize = Math.floor(state.size / moduleCount);
    const qrSize = moduleSize * moduleCount;

    // Create temp canvas for QR
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = qrSize;
    tempCanvas.height = qrSize;
    const tempCtx = tempCanvas.getContext('2d');

    // Fill background
    tempCtx.fillStyle = state.bgColor;
    tempCtx.fillRect(0, 0, qrSize, qrSize);

    // Draw QR modules
    const radius = state.cornerStyle === 'rounded' ? moduleSize * 0.3 : 0;
    tempCtx.fillStyle = state.fgColor;

    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qr.isDark(row, col)) {
          const x = col * moduleSize;
          const y = row * moduleSize;
          if (radius > 0) {
            tempCtx.beginPath();
            tempCtx.moveTo(x + radius, y);
            tempCtx.lineTo(x + moduleSize - radius, y);
            tempCtx.quadraticCurveTo(x + moduleSize, y, x + moduleSize, y + radius);
            tempCtx.lineTo(x + moduleSize, y + moduleSize - radius);
            tempCtx.quadraticCurveTo(x + moduleSize, y + moduleSize, x + moduleSize - radius, y + moduleSize);
            tempCtx.lineTo(x + radius, y + moduleSize);
            tempCtx.quadraticCurveTo(x, y + moduleSize, x, y + moduleSize - radius);
            tempCtx.lineTo(x, y + radius);
            tempCtx.quadraticCurveTo(x, y, x + radius, y);
            tempCtx.fill();
          } else {
            tempCtx.fillRect(x, y, moduleSize, moduleSize);
          }
        }
      }
    }

    // Center QR code in frame
    const offsetX = frameSize + (state.size - qrSize) / 2;
    const offsetY = frameSize + (state.size - qrSize) / 2;
    ctx.drawImage(tempCanvas, offsetX, offsetY);

    // Draw logo if present
    if (state.logoUrl) {
      drawLogo(frameSize);
    }

    // Draw frame text
    if (state.frameTemplate !== 'none' && state.frameText) {
      drawFrameText(totalWidth, totalHeight);
    }

    canvas.classList.remove('hidden');
    placeholder.classList.add('hidden');
    setDownloadButtons(true);
  } catch (error) {
    console.error('Error generating QR:', error);
  } finally {
    loadingSpinner.classList.add('hidden');
  }
}

function drawFrame(width, height) {
  const padding = 8;
  ctx.strokeStyle = state.fgColor;
  ctx.lineWidth = 2;

  switch (state.frameTemplate) {
    case 'simple':
      ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);
      break;
    case 'scanme':
    case 'decorative':
      ctx.beginPath();
      roundRect(ctx, padding, padding, width - padding * 2, height - padding * 2, 12);
      ctx.stroke();
      break;
    case 'modern':
      const cornerLength = 20;
      ctx.beginPath();
      ctx.moveTo(padding, padding + cornerLength);
      ctx.lineTo(padding, padding);
      ctx.lineTo(padding + cornerLength, padding);
      ctx.moveTo(width - padding - cornerLength, padding);
      ctx.lineTo(width - padding, padding);
      ctx.lineTo(width - padding, padding + cornerLength);
      ctx.moveTo(width - padding, height - padding - cornerLength);
      ctx.lineTo(width - padding, height - padding);
      ctx.lineTo(width - padding - cornerLength, height - padding);
      ctx.moveTo(padding + cornerLength, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(padding, height - padding - cornerLength);
      ctx.stroke();
      break;
    case 'minimal':
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);
      ctx.setLineDash([]);
      break;
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function drawFrameText(width, height) {
  ctx.fillStyle = state.fgColor;
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(state.frameText.toUpperCase(), width / 2, height - 15);
}

function drawLogo(frameSize) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    const logoSize = state.size * 0.2;
    const x = frameSize + (state.size - logoSize) / 2;
    const y = frameSize + (state.size - logoSize) / 2;

    // Clear area for logo
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);

    // Draw logo with opacity
    ctx.globalAlpha = state.logoOpacity / 100;
    ctx.drawImage(img, x, y, logoSize, logoSize);
    ctx.globalAlpha = 1;
  };
  img.src = state.logoUrl;
}

function applyRoundedCorners(tempCanvas) {
  const tempCtx = tempCanvas.getContext('2d');
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const data = imageData.data;

  // Detect module size
  const moduleSize = detectModuleSize(data, tempCanvas.width, tempCanvas.height);
  if (moduleSize < 3) return;

  // Get foreground color RGB
  const fgR = parseInt(state.fgColor.slice(1, 3), 16);
  const fgG = parseInt(state.fgColor.slice(3, 5), 16);
  const fgB = parseInt(state.fgColor.slice(5, 7), 16);

  // Clear and redraw with rounded modules
  tempCtx.fillStyle = state.bgColor;
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  const radius = moduleSize * 0.3;

  for (let y = 0; y < tempCanvas.height; y += moduleSize) {
    for (let x = 0; x < tempCanvas.width; x += moduleSize) {
      const idx = (y * tempCanvas.width + x) * 4;
      if (isDark(data[idx], data[idx + 1], data[idx + 2])) {
        tempCtx.fillStyle = state.fgColor;
        tempCtx.beginPath();
        roundRect(tempCtx, x, y, moduleSize, moduleSize, radius);
        tempCtx.fill();
      }
    }
  }
}

function detectModuleSize(data, width, height) {
  // Find the first dark pixel and measure module width
  for (let y = 0; y < height; y++) {
    let inDark = false;
    let darkStart = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dark = isDark(data[idx], data[idx + 1], data[idx + 2]);
      
      if (dark && !inDark) {
        inDark = true;
        darkStart = x;
      } else if (!dark && inDark) {
        return x - darkStart;
      }
    }
  }
  return 4;
}

function isDark(r, g, b) {
  return (r + g + b) / 3 < 128;
}

function downloadQR(format) {
  if (!state.inputValue.trim()) return;

  const link = document.createElement('a');
  const filename = 'qrcode-' + Date.now();

  if (format === 'svg') {
    // Generate SVG version
    const svgContent = generateSVG();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    link.href = URL.createObjectURL(blob);
    link.download = filename + '.svg';
  } else if (format === 'jpg') {
    // Create new canvas with white background for JPG
    const jpgCanvas = document.createElement('canvas');
    jpgCanvas.width = canvas.width;
    jpgCanvas.height = canvas.height;
    const jpgCtx = jpgCanvas.getContext('2d');
    jpgCtx.fillStyle = '#FFFFFF';
    jpgCtx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);
    jpgCtx.drawImage(canvas, 0, 0);
    link.href = jpgCanvas.toDataURL('image/jpeg', 0.95);
    link.download = filename + '.jpg';
  } else {
    // PNG download
    link.href = canvas.toDataURL('image/png');
    link.download = filename + '.png';
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function generateSVG() {
  let content = state.inputValue;
  switch (state.inputType) {
    case 'url':
      if (!content.startsWith('http://') && !content.startsWith('https://')) {
        content = 'https://' + content;
      }
      break;
    case 'email':
      content = 'mailto:' + state.inputValue;
      break;
    case 'phone':
      content = 'tel:' + state.inputValue;
      break;
    case 'sms':
      content = 'sms:' + state.inputValue;
      break;
    case 'bitcoin':
      content = 'bitcoin:' + state.inputValue;
      break;
    case 'wifi':
      content = 'WIFI:S:' + state.inputValue + ';;';
      break;
    case 'vcard':
      const parts = state.inputValue.split(';');
      content = 'BEGIN:VCARD\nVERSION:3.0\n';
      if (parts[0]) content += 'FN:' + parts[0] + '\n';
      if (parts[1]) content += 'TEL:' + parts[1] + '\n';
      if (parts[2]) content += 'EMAIL:' + parts[2] + '\n';
      content += 'END:VCARD';
      break;
  }

  // Create QR for SVG generation
  const errorLevelMap = { L: 'L', M: 'M', Q: 'Q', H: 'H' };
  const qr = qrcode(0, errorLevelMap[state.errorCorrection] || 'M');
  qr.addData(content);
  qr.make();

  const moduleCount = qr.getModuleCount();
  const moduleSize = Math.floor(state.size / moduleCount);
  const qrSize = moduleSize * moduleCount;

  const frameSize = state.frameTemplate !== 'none' ? 40 : 0;
  const textHeight = state.frameTemplate !== 'none' ? 30 : 0;
  const totalWidth = state.size + frameSize * 2;
  const totalHeight = state.size + frameSize * 2 + textHeight;

  const offsetX = frameSize + (state.size - qrSize) / 2;
  const offsetY = frameSize + (state.size - qrSize) / 2;
  const radius = state.cornerStyle === 'rounded' ? moduleSize * 0.3 : 0;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`;
  svg += `<rect width="100%" height="100%" fill="${state.bgColor}"/>`;

  // Draw QR modules
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        const x = offsetX + col * moduleSize;
        const y = offsetY + row * moduleSize;
        if (radius > 0) {
          svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" rx="${radius}" ry="${radius}" fill="${state.fgColor}"/>`;
        } else {
          svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${state.fgColor}"/>`;
        }
      }
    }
  }
  
  if (state.frameTemplate !== 'none' && state.frameText) {
    svg += `<text x="${totalWidth / 2}" y="${totalHeight - 10}" text-anchor="middle" fill="${state.fgColor}" font-family="Inter, sans-serif" font-size="14" font-weight="bold">${escapeXml(state.frameText.toUpperCase())}</text>`;
  }
  
  svg += '</svg>';
  return svg;
}

function escapeXml(str) {
  return str.replace(/[<>&'"]/g, function(c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
    }
  });
}
