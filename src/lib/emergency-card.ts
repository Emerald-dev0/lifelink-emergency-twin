/**
 * Generates a printable LIFELINK emergency card as SVG.
 * Each card is unique per patient (QR encodes their LL-ID URL).
 */

interface EmergencyCardData {
  identifier: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  emergencyContacts: Array<{ name: string; relationship: string; phone: string }>;
  origin: string;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current += ' ' + word;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

/**
 * Generate a wallet-sized emergency card (credit card proportions: 85.6mm x 53.98mm)
 * Designed to be printed and kept in a wallet.
 */
export function generateWalletCard(data: EmergencyCardData): string {
  const emergencyUrl = `${data.origin}/emergency/${data.identifier}`;
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(emergencyUrl)}&format=svg&bgcolor=FFFFFF&color=050505`;

  const allergyTags = data.allergies.slice(0, 3).map((a, i) => `
    <rect x="80" y="${138 + i * 22}" width="${Math.min(a.length * 7.5 + 16, 200)}" height="18" rx="9" fill="#FFB800" fill-opacity="0.15" stroke="#FFB800" stroke-opacity="0.3" stroke-width="0.5"/>
    <text x="${88 + (Math.min(a.length * 7.5 + 16, 200)) / 2}" y="${151 + i * 22}" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" fill="#FFB800" text-anchor="middle">${escapeXml(a)}</text>
  `).join('');

  const medTags = data.medications.slice(0, 2).map((m, i) => `
    <text x="80" y="${220 + i * 16}" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#AAAAAA">• ${escapeXml(m.length > 35 ? m.slice(0, 35) + '…' : m)}</text>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="340" height="212" viewBox="0 0 340 212">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A0A0A"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
  </defs>

  <!-- Card Background -->
  <rect width="340" height="212" rx="12" fill="url(#bg)"/>
  <rect width="340" height="212" rx="12" fill="none" stroke="#00E5FF" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Top Bar -->
  <rect width="340" height="3" y="0" rx="12" fill="#FF3D3D"/>

  <!-- LIFELINK Branding -->
  <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="#00E5FF" letter-spacing="2">LIFELINK</text>
  <text x="16" y="36" font-family="system-ui, -apple-system, sans-serif" font-size="7" fill="#666666" letter-spacing="1">EMERGENCY MEDICAL ID</text>

  <!-- QR Code (right side) -->
  <rect x="230" y="50" width="95" height="95" rx="8" fill="white"/>
  <image x="235" y="55" width="85" height="85" href="${qrDataUrl}"/>

  <!-- Blood Type -->
  <text x="16" y="70" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#666666" letter-spacing="1">BLOOD TYPE</text>
  <text x="16" y="95" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" fill="#FF3D3D">${escapeXml(data.bloodType)}</text>

  <!-- Allergies -->
  <text x="16" y="120" font-family="system-ui, -apple-system, sans-serif" font-size="7" fill="#FFB800" font-weight="700" letter-spacing="1">⚠ ALLERGIES</text>
  ${allergyTags}

  <!-- Medications -->
  <text x="16" y="207" font-family="system-ui, -apple-system, sans-serif" font-size="7" fill="#00E5FF" font-weight="700" letter-spacing="1">MEDICATIONS</text>
  ${medTags}

  <!-- Footer -->
  <text x="16" y="204" font-family="monospace" font-size="6" fill="#444444">${escapeXml(data.identifier)}</text>
  <text x="324" y="204" font-family="system-ui, -apple-system, sans-serif" font-size="6" fill="#444444" text-anchor="end">Scan QR → Emergency Info</text>
</svg>`;
}

/**
 * Generate a car sticker / larger card (4" x 3" at 96dpi ≈ 384x288)
 * Designed to be printed and placed in car window or on medical equipment.
 */
export function generateCarSticker(data: EmergencyCardData): string {
  const emergencyUrl = `${data.origin}/emergency/${data.identifier}`;
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(emergencyUrl)}&format=svg&bgcolor=FFFFFF&color=050505`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="384" height="288" viewBox="0 0 384 288">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A0A0A"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="384" height="288" rx="16" fill="url(#bg)"/>
  <rect width="384" height="288" rx="16" fill="none" stroke="#FF3D3D" stroke-opacity="0.3" stroke-width="2"/>

  <!-- Red Banner -->
  <rect width="384" height="36" rx="16" fill="#FF3D3D"/>
  <rect y="20" width="384" height="16" fill="#FF3D3D"/>
  <text x="192" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" fill="white" text-anchor="middle" letter-spacing="3">EMERGENCY MEDICAL INFORMATION</text>

  <!-- LIFELINK -->
  <text x="192" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#00E5FF" text-anchor="middle" letter-spacing="2">LIFELINK DIGITAL TWIN</text>

  <!-- Blood Type — Center -->
  <text x="192" y="100" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#888888" text-anchor="middle" letter-spacing="2">BLOOD TYPE</text>
  <text x="192" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="900" fill="#FF3D3D" text-anchor="middle">${escapeXml(data.bloodType)}</text>

  <!-- QR Code -->
  <rect x="142" y="155" width="100" height="100" rx="8" fill="white"/>
  <image x="147" y="160" width="90" height="90" href="${qrDataUrl}"/>

  <!-- Allergies -->
  ${data.allergies.length > 0 ? `
  <text x="20" y="180" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#FFB800" font-weight="700" letter-spacing="1">⚠ ALLERGIES</text>
  ${data.allergies.slice(0, 4).map((a, i) => `
    <text x="20" y="${196 + i * 16}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#FFB800">• ${escapeXml(a)}</text>
  `).join('')}` : ''}

  <!-- Medications -->
  ${data.medications.length > 0 ? `
  <text x="260" y="180" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#00E5FF" font-weight="700" letter-spacing="1">MEDICATIONS</text>
  ${data.medications.slice(0, 3).map((m, i) => `
    <text x="260" y="${196 + i * 16}" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#AAAAAA">• ${escapeXml(m.length > 22 ? m.slice(0, 22) + '…' : m)}</text>
  `).join('')}` : ''}

  <!-- Footer -->
  <text x="20" y="278" font-family="monospace" font-size="8" fill="#444444">${escapeXml(data.identifier)}</text>
  <text x="364" y="278" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#444444" text-anchor="end">SCAN QR FOR FULL INFO</text>
</svg>`;
}

/**
 * Download an SVG string as a file.
 */
export function downloadSvg(svgString: string, filename: string) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Trigger browser print dialog with an SVG (for wallet card / sticker).
 */
export function printSvg(svgString: string) {
  const printWindow = window.open('', '_blank', 'width=400,height=300');
  if (!printWindow) {
    // Popup blocked — fallback to download
    downloadSvg(svgString, 'lifelink-emergency-card.svg');
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>LIFELINK Emergency Card</title>
      <style>
        @page { margin: 0.5in; size: auto; }
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        img { max-width: 100%; height: auto; }
      </style>
    </head>
    <body>
      <img src="data:image/svg+xml;base64,${btoa(svgString)}" />
      <script>window.onload = () => { window.print(); }</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
