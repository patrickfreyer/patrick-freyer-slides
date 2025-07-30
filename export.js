import puppeteer from 'puppeteer';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import os from 'os';
import fs from 'fs';

// Detect Chrome/Chromium executable paths for different operating systems
function getChromePath() {
  const platform = os.platform();
  
  // Common Chrome/Chromium paths for different systems
  const chromePaths = {
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium'
    ],
    linux: [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/snap/bin/chromium',
      '/usr/bin/google-chrome-beta',
      '/usr/bin/google-chrome-dev'
    ],
    win32: [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ]
  };
  
  const paths = chromePaths[platform] || [];
  
  // Find the first existing executable
  for (const chromePath of paths) {
    try {
      if (fs.existsSync(chromePath)) {
        console.log(`Found Chrome at: ${chromePath}`);
        return chromePath;
      }
    } catch (error) {
      // Continue to next path
    }
  }
  
  console.log('No Chrome executable found in standard locations');
  return null;
}

// Launch browser - optimized for cross-platform compatibility
async function launchBrowser() {
  console.log('Launching Chrome with Puppeteer...');
  
  const platform = os.platform();
  const executablePath = getChromePath();
  
  // Base arguments for all platforms
  const baseArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-web-security',
    '--disable-gpu',
    '--no-first-run',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding'
  ];
  
  // Additional Linux-specific arguments for GitHub Actions
  const linuxArgs = [
    '--disable-extensions',
    '--disable-plugins',
    '--disable-sync',
    '--disable-translate',
    '--disable-default-apps',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-hang-monitor',
    '--disable-prompt-on-repost',
    '--disable-web-resources',
    '--disable-features=TranslateUI',
    '--disable-ipc-flooding-protection',
    '--disable-blink-features=AutomationControlled',
    '--no-zygote',
    '--single-process'
  ];
  
  const args = platform === 'linux' ? [...baseArgs, ...linuxArgs] : baseArgs;
  
  const launchOptions = {
    headless: 'new',
    args,
    ignoreHTTPSErrors: true,
    timeout: 60000,
    ...(executablePath && { executablePath })
  };

  try {
    console.log(`Attempting to launch browser with executable: ${executablePath || 'system default'}`);
    console.log(`Platform: ${platform}`);
    
    const browser = await puppeteer.launch(launchOptions);
    console.log('✓ Browser launched successfully');
    return browser;
  } catch (error) {
    console.error('❌ Failed to launch browser:', error.message);
    
    // Fallback to system Chrome without explicit path
    console.log('🔄 Retrying without explicit Chrome path...');
    const fallbackOptions = {
      headless: 'new',
      args,
      ignoreHTTPSErrors: true,
      timeout: 60000
    };
    
    try {
      const browser = await puppeteer.launch(fallbackOptions);
      console.log('✓ Browser launched with fallback options');
      return browser;
    } catch (fallbackError) {
      console.error('❌ Fallback launch also failed:', fallbackError.message);
      throw fallbackError;
    }
  }
}

// Default configuration for slide exports
export const defaultConfig = {
  // PDF options - Custom dimensions to match slide container (1600x900px)
  width: 1600,
  height: 900,
  printBackground: true,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  // Viewport should match slide dimensions exactly
  viewport: {
    width: 1600,
    height: 900,
    deviceScaleFactor: 1 // Will be overridden to 2 in PDF generation for better quality
  },
  // Image export options
  imageFormat: 'png', // 'png' or 'jpeg'
  imageQuality: 95, // 0-100 (only for JPEG)
};

// Function to read local HTML file
function readLocalHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

// Function to add PDF-specific optimizations to HTML content
function addPdfOptimizations(htmlContent) {
  // Add PDF-specific CSS rules to improve rendering - conservative approach from working version
  const pdfOptimizationCSS = `
    <style>
      /* PDF Optimization Styles */
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Remove problematic text shadows that cause gray backgrounds */
      * {
        text-shadow: none !important;
      }
      
      /* Fix box-shadow rendering - remove or simplify shadows */
      * {
        box-shadow: none !important;
      }
      
      /* Remove slide margins for PDF to fit exactly */
      .slide-container {
        margin: 0 !important;
      }
      
      /* Preserve icon and number ball backgrounds */
      .icon-and-number-ball {
        background-color: var(--bcg-green) !important;
        background: var(--bcg-green) !important;
      }
      
      /* Preserve agenda arrow backgrounds */
      .agenda-item.active .agenda-arrow {
        background-color: var(--bcg-green) !important;
      }
      
      .agenda-item.inactive .agenda-arrow {
        background-color: var(--bcg-light-gray) !important;
      }
      
      /* Preserve any other circular background elements */
      .icon-and-number-ball-inline {
        background-color: transparent !important;
        border: 2px solid var(--section-title-color) !important;
      }
      
      /* Improve gradient rendering in PDF */
      .slide-container,
      [style*="gradient"] {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Fix Font Awesome icons for PDF */
      .fas, .far, .fab, .fal {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      
      /* Force background images to render */
      .decorative-left-section, .background-overlay {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Fallback for external images that fail to load */
      .decorative-left-section {
        background-color: var(--bcg-green) !important;
      }
      
      .background-overlay {
        background-color: rgba(0, 0, 0, 0.3) !important;
      }
      
      /* Improve clip-path rendering */
      .arrow-background-section-left,
      .arrow-background-section-right {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Remove any filter effects that might cause artifacts */
      * {
        filter: none !important;
        backdrop-filter: none !important;
      }
      
      /* Fix callout boxes and content overlays */
      .callout-box, .content-overlay-box {
        background-color: white !important;
        border: 1px solid #ccc !important;
        box-shadow: none !important;
      }
    </style>
  `;
  
  // Insert the optimization CSS before the closing </head> tag
  const optimizedHtml = htmlContent.replace('</head>', `${pdfOptimizationCSS}</head>`);
  
  return optimizedHtml;
}

export async function convertHtmlToPdf(browser, htmlFilePath, outputPath, config = defaultConfig) {
  console.log(`Converting ${path.basename(htmlFilePath)} to PDF...`);
  
  const page = await browser.newPage();
  
  try {
    // Set viewport to match slide dimensions exactly with high DPI
    await page.setViewport({
      ...config.viewport,
      deviceScaleFactor: 2 // Higher DPI for better quality
    });
    
    // Read HTML file
    let htmlContent = readLocalHtmlFile(htmlFilePath);
    
    // Add PDF-specific CSS optimizations
    const pdfOptimizedHtml = addPdfOptimizations(htmlContent);
    
    // Create a data URL to load the HTML content
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(pdfOptimizedHtml)}`;
    await page.goto(dataUrl, { 
      waitUntil: 'networkidle0',
      timeout: 45000 
    });
    
    // Wait longer for fonts, images, and complex CSS to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Additional wait for any lazy-loaded content
    await page.waitForTimeout(2000);
    
    // Wait for fonts to finish loading
    await page.evaluate(() => {
      return document.fonts.ready;
    });
    
    // Check for failed image loads and apply fallbacks
    await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          // Remove broken images to prevent grey boxes
          img.style.display = 'none';
        }
      });
      
      // Apply fallback backgrounds for elements with external image backgrounds
      const elementsWithBgImages = document.querySelectorAll('[style*="background-image"]');
      elementsWithBgImages.forEach(el => {
        const style = window.getComputedStyle(el);
        const bgImage = style.backgroundImage;
        if (bgImage.includes('unsplash.com') || bgImage.includes('http')) {
          // Add a fallback background color
          el.style.backgroundColor = 'var(--bcg-green)';
        }
      });
    });
    
    // Force layout recalculation
    await page.evaluate(() => {
      document.body.offsetHeight;
    });
    
    // Generate PDF with exact slide dimensions
    const pdfBuffer = await page.pdf({
      width: config.width,
      height: config.height,
      printBackground: config.printBackground,
      margin: config.margin,
      preferCSSPageSize: false
    });
    
    await page.close();
    
    // Save PDF to local file system
    const fileExists = fs.existsSync(outputPath);
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`✓ ${fileExists ? 'Updated' : 'Created'}: ${outputPath}`);
    
    return { 
      fileName: path.basename(outputPath), 
      buffer: pdfBuffer,
      localPath: outputPath
    };
    
  } catch (error) {
    console.error(`Error converting ${htmlFilePath}:`, error.message);
    await page.close();
    return null;
  }
}

export async function convertHtmlToImage(browser, htmlFilePath, outputPath, config = defaultConfig) {
  console.log(`Converting ${path.basename(htmlFilePath)} to ${config.imageFormat.toUpperCase()}...`);
  
  const page = await browser.newPage();
  
  try {
    // Set viewport to match slide dimensions exactly
    await page.setViewport(config.viewport);
    
    // Read HTML file
    let htmlContent = readLocalHtmlFile(htmlFilePath);
    
    // Create a data URL to load the HTML content
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
    await page.goto(dataUrl, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait a bit more for any animations or dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate screenshot with exact slide dimensions
    const screenshotOptions = {
      width: config.width,
      height: config.height,
      type: config.imageFormat,
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: config.width,
        height: config.height
      }
    };
    
    // Add quality option for JPEG
    if (config.imageFormat === 'jpeg') {
      screenshotOptions.quality = config.imageQuality;
    }
    
    const imageBuffer = await page.screenshot(screenshotOptions);
    
    await page.close();
    
    // Save image to local file system
    const fileExists = fs.existsSync(outputPath);
    fs.writeFileSync(outputPath, imageBuffer);
    console.log(`✓ ${fileExists ? 'Updated' : 'Created'}: ${outputPath}`);
    
    return { 
      fileName: path.basename(outputPath), 
      buffer: imageBuffer,
      localPath: outputPath
    };
    
  } catch (error) {
    console.error(`Error converting ${htmlFilePath}:`, error.message);
    await page.close();
    return null;
  }
}

// Function to recursively find HTML files in directories
function findHtmlFilesRecursively(dir) {
  let htmlFiles = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Recursively search subdirectories
      htmlFiles = htmlFiles.concat(findHtmlFilesRecursively(fullPath));
    } else if (item.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
  
  return htmlFiles;
}

// Main export function for processing multiple HTML files
export async function exportSlides(slidesDirectory = './slides', options = {}) {
  const config = { ...defaultConfig, ...options };
  
  console.log('🚀 Starting slide export...\n');
  
  try {
    // Find all HTML files in the slides directory (including subdirectories)
    const htmlFiles = findHtmlFilesRecursively(slidesDirectory);
    
    if (htmlFiles.length === 0) {
      console.log('No HTML files found in slides directory.');
      return { success: false, message: 'No files to export' };
    }
    
    console.log(`Found ${htmlFiles.length} HTML files:`);
    htmlFiles.forEach(file => console.log(`  - ${path.basename(file)}`));
    console.log('');
    
    // Launch browser
    const browser = await launchBrowser();
    
    const results = [];
    
    for (const htmlFile of htmlFiles) {
      const baseName = path.basename(htmlFile, '.html');
      const baseDir = path.dirname(htmlFile);
      
      // Convert to PNG image
      const imageOutputPath = path.join(baseDir, `${baseName}.png`);
      const imageResult = await convertHtmlToImage(browser, htmlFile, imageOutputPath, config);
      if (imageResult) {
        results.push({ type: 'image', ...imageResult });
      }
      
      // Convert to PDF
      const pdfOutputPath = path.join(baseDir, `${baseName}.pdf`);
      const pdfResult = await convertHtmlToPdf(browser, htmlFile, pdfOutputPath, config);
      if (pdfResult) {
        results.push({ type: 'pdf', ...pdfResult });
      }
    }
    
    await browser.close();
    
    console.log(`\n✅ Export complete!`);
    console.log(`📄 Generated ${results.filter(r => r.type === 'pdf').length} PDF files`);
    console.log(`🖼️  Generated ${results.filter(r => r.type === 'image').length} PNG files`);
    
    return {
      success: true,
      results,
      htmlFiles
    };
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    throw error;
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const slidesDir = process.argv[2] || './slides';
  exportSlides(slidesDir).catch(console.error);
}