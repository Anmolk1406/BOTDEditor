import React, { useState, useEffect, useMemo } from "react";
import { ChromePicker } from "react-color";
import JSZip from "jszip";
import { DotLottie } from '@dotlottie/dotlottie-js';
import BrandLottie from "../components/BrandLottie";
import FigmaStyledLayout from "../components/FigmaStyledLayout";
import baseBotdData from "../../public/lottie/base_botd_pretty.json";
import baseBotmData from "../../public/lottie/base_botm_pretty.json";
import newBaseData from "../../public/lottie/BaseBOTDN.json";
import { LOTTIE_IMAGE_PATH as DEFAULT_IMAGE_PATH } from "../../next.config.mjs";

// Selection Button Component (for viewing - single selection)
const SelectionButton = ({ children, isActive, onClick, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles = {
    flex: 1,
    padding: "10px",
    border: isActive ? '.5px solid #FFBADE' : '.5px solid #E4E4E4',
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "800",
    fontFamily: "'Chakra Petch', sans-serif",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: isActive ? "#FFD2E9" : "#f3f4f6",
    color: isActive ? "#D60271" : "#6b7280",
  };

  const hoverStyles = {
    ...baseStyles,
    backgroundColor: isActive ? "#FFC0E1" : "#e5e7eb",
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={isHovered ? hoverStyles : baseStyles}
      {...props}
    >
      {children}
    </button>
  );
};

// Multi-Select Button Component (for download options - can select multiple)
const MultiSelectButton = ({ children, isSelected, onToggle, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles = {
    flex: 1,
    padding: "10px",
    border: isSelected ? '.5px solid #FFBADE' : '.5px solid #E4E4E4',
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "800",
    fontFamily: "'Chakra Petch', sans-serif",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: isSelected ? "#FFD2E9" : "#fff",
    color: isSelected ? "#D60271" : "#6b7280",
  };

  const hoverStyles = {
    ...baseStyles,
    backgroundColor: isSelected ? "#FFC0E1" : "#e5e7eb",
  };

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={isHovered ? hoverStyles : baseStyles}
      {...props}
    >
      {children}
    </button>
  );
};

// Download Button Component
const DownloadButton = ({ onClick, children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles = {
    width: "100%",
    padding: "14px",
    background: "#5E12C1",
    color: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    fontFamily: "'Chakra Petch', sans-serif",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "auto",
    transition: "all 0.2s ease"
  };

  const hoverStyles = {
    ...baseStyles,
    background: "#7127D2"
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={isHovered ? hoverStyles : baseStyles}
      {...props}
    >
      <img 
          src="/lottie/Assets/DownloadSimple.svg" 
          alt="Upload" 
          style={{ width: 20, height: 20, display: "inline-block", marginRight: "8px" }} 
        />
      {children}
    </button>
  );
};

// Custom Color Picker Component
const CustomColorPicker = ({ color, onChange, onClose }) => {
  const [colorMode, setColorMode] = useState('HEX');
  const [inputValue, setInputValue] = useState('');

  // Convert RGB array to different formats
  const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
      const hex = Math.round(n * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const rgbToHsl = (r, g, b) => {
    r *= 255; g *= 255; b *= 255;
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  // Update input value when color or mode changes
  useEffect(() => {
    const [r, g, b, a] = color;
    switch (colorMode) {
      case 'HEX':
        setInputValue(rgbToHex(r, g, b));
        break;
      case 'RGB':
        setInputValue(`${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`);
        break;
      case 'HSL':
        const [h, s, l] = rgbToHsl(r, g, b);
        setInputValue(`${h}, ${s}%, ${l}%`);
        break;
      default:
        setInputValue(rgbToHex(r, g, b));
    }
  }, [color, colorMode]);

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    if (s === 0) {
      return [l, l, l]; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      return [
        hue2rgb(p, q, h + 1/3),
        hue2rgb(p, q, h),
        hue2rgb(p, q, h - 1/3)
      ];
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    try {
      let newColor = [...color];
      
      if (colorMode === 'HEX' && value.match(/^#[0-9A-Fa-f]{6}$/)) {
        const r = parseInt(value.slice(1, 3), 16) / 255;
        const g = parseInt(value.slice(3, 5), 16) / 255;
        const b = parseInt(value.slice(5, 7), 16) / 255;
        newColor = [r, g, b, color[3]];
        onChange(newColor);
      } else if (colorMode === 'RGB') {
        const rgb = value.split(',').map(v => parseInt(v.trim()));
        if (rgb.length === 3 && rgb.every(v => v >= 0 && v <= 255)) {
          newColor = [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, color[3]];
          onChange(newColor);
        }
      } else if (colorMode === 'HSL') {
        const hslMatch = value.match(/^(\d+),\s*(\d+)%,\s*(\d+)%$/);
        if (hslMatch) {
          const h = parseInt(hslMatch[1]);
          const s = parseInt(hslMatch[2]);
          const l = parseInt(hslMatch[3]);
          if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
            const [r, g, b] = hslToRgb(h, s, l);
            newColor = [r, g, b, color[3]];
            onChange(newColor);
          }
        }
      }
    } catch (error) {
      // Invalid input, ignore
    }
  };

  return (
    <div style={{
      position: "absolute",
      zIndex: 1000,
      top: "50px",
      right: "20px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      border: "1px solid #e5e7eb",
      width: "280px"
    }}>
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0 }} onClick={onClose} />
      
      {/* Color Picker */}
      <div style={{ position: "relative", zIndex: 1001 }}>
        <ChromePicker
          color={{ r: color[0] * 255, g: color[1] * 255, b: color[2] * 255, a: color[3] }}
          onChange={(newColor) => {
            onChange([
              newColor.rgb.r / 255,
              newColor.rgb.g / 255,
              newColor.rgb.b / 255,
              newColor.rgb.a
            ]);
          }}
          disableAlpha={false}
        />
        
        {/* Custom Input Section */}
        <div style={{ marginTop: "16px", display: "flex", gap: "8px", alignItems: "center" }}>
          {/* Mode Dropdown */}
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              fontFamily: "'Chakra Petch', sans-serif",
              backgroundColor: "#fff",
              color: "#374151",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="HEX">HEX</option>
            <option value="RGB">RGB</option>
            <option value="HSL">HSL</option>
          </select>
          
          {/* Color Value Input */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "12px",
              fontFamily: "monospace",
              backgroundColor: "#f9fafb",
              color: "#111827",
              outline: "none"
            }}
            placeholder={colorMode === 'HEX' ? '#000000' : colorMode === 'RGB' ? '0, 0, 0' : '0, 0%, 0%'}
          />
          
          {/* Opacity Display */}
          <span style={{
            padding: "8px 12px",
            fontSize: "12px",
            fontWeight: "600",
            fontFamily: "'Chakra Petch', sans-serif",
            color: "#6b7280",
            backgroundColor: "#f3f4f6",
            borderRadius: "6px",
            minWidth: "50px",
            textAlign: "center"
          }}>
            {Math.round(color[3] * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Upload Button Component
const UploadButton = ({ onFileChange }) => {
  const fileInputRef = React.useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Base styles
  const baseStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "12px",
    border: "2px solid #E4E4E4",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    backgroundColor: "#F2F2F2",
    color: '#000000',
    fontFamily: "'Chakra Petch', sans-serif",
    width: "100%"
  };

  // Hover styles
  const hoverStyles = {
    ...baseStyles,
    backgroundColor: "#E4E4E4",
  };

  return (
    <>
      <button 
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={isHovered ? hoverStyles : baseStyles}
      >
        <img 
          src="/lottie/Assets/UploadSimple.svg" 
          alt="Upload" 
          style={{ width: 20, height: 20, display: "inline-block", marginRight: "8px" }} 
        />
        UPLOAD IMAGE
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ display: "none" }}
      />
    </>
  );
};

// Helper function to convert JSON to .lottie format
async function convertJsonToDotLottie(animationData, animationId = 'main') {
  try {
    // Create DotLottie instance with proper options
    const dotLottie = new DotLottie({
      version: "1.0.0",
      author: "BOTD Editor",
      generator: "BOTD Editor v1.0.0"
    });
    
    // Add animation with the JSON data
    const animation = dotLottie.addAnimation({
      id: animationId,
      data: animationData,
      loop: true,
      autoplay: true
    });
    
    // Build the .lottie file
    const dotLottieArrayBuffer = await dotLottie.toArrayBuffer();
    
    if (!dotLottieArrayBuffer || dotLottieArrayBuffer.byteLength === 0) {
      throw new Error('Generated .lottie buffer is empty');
    }
    
    return dotLottieArrayBuffer;
  } catch (error) {
    throw error;
  }
}

// Function to recreate the editImage logic for downloading (copied from BrandLottie)
function editImageForDownload(animationData, color, imagePath, bgFill, bgStroke, wordType, botdShapes, botmShapes, isNewVersion = false) {
  const data = JSON.parse(JSON.stringify(animationData));
  let imageWidth = 260;
  let imageHeight = 260;
  
  // Update the image path for the asset - FIXED VERSION
  if (Array.isArray(data.assets)) {
    const imageAsset = data.assets.find(asset => asset.id === "2" || asset.id === "1") || data.assets[0];
    if (imageAsset) {
      // Set the image path - handle different cases including data URLs
      if (imagePath && imagePath !== "null" && imagePath !== DEFAULT_IMAGE_PATH) {
        imageAsset.p = imagePath;
        // For data URLs, set u to empty string; for regular paths, set u appropriately
        if (imagePath.startsWith('data:')) {
          imageAsset.u = "";
        } else {
          imageAsset.u = imagePath.includes('/') ? "" : "lottie/";
        }
      } else {
        // Use default image path
        imageAsset.p = DEFAULT_IMAGE_PATH;
        imageAsset.u = "lottie/";
      }
      imageAsset.w = imageWidth;
      imageAsset.h = imageHeight;
    }
  }
  
  const imageLayer = data.layers.find(
    (layer) => layer.ty === 2 && (layer.refId === "2" || layer.refId === 2 || layer.refId === "1" || layer.refId === 1)
  );
  if (imageLayer && imageLayer.ks) {
    if (isNewVersion) {
      // For new version, use original positioning but adjust for image scaling
      // Original position: [-0.5, -2.329, 0], anchor: [157, 157]
      // Keep original position but update anchor to match new image dimensions
      imageLayer.ks.p.k = [-0.5, -2.329, 0];
      imageLayer.ks.a.k = [imageWidth / 2, imageHeight / 2];
      // Set scale to fit the image properly within the base shape
      imageLayer.ks.s.k = [50, 50, 124.413];
    } else {
      imageLayer.ks.p.k = [90, 90, 0];
      imageLayer.ks.a.k = [imageWidth / 2, imageHeight / 2];
    }
  }
  
  const bgLayer = data.layers.find(
    (layer) => layer.nm && (layer.nm.toLowerCase() === "base" || layer.nm.toLowerCase().includes("base"))
  );
  if (bgLayer && Array.isArray(bgLayer.shapes)) {
    const rectGroup = bgLayer.shapes.find(
      (group) => group.ty === "gr" && (group.nm === "Rectangle 21501" || group.nm === "Rectangle 34625896")
    );
    if (rectGroup && Array.isArray(rectGroup.it)) {
      rectGroup.it.forEach((item) => {
        if (item.ty === "fl" && item.c && Array.isArray(item.c.k)) {
          item.c.k = bgFill;
        }
        if (item.ty === "st" && item.c && Array.isArray(item.c.k)) {
          item.c.k = bgStroke;
        }
      });
    }
  }
  
  if (isNewVersion) {
    const botdLayer = data.layers.find(l => l.nm && l.nm.includes("Brand of the Day"));
    const botmLayer = data.layers.find(l => l.nm && l.nm.includes("Brand of the Moment"));
    
    if (wordType === "botd") {
      if (botdLayer) {
        botdLayer.ks.o.a = 0;
        botdLayer.ks.o.k = 100;
        updateLayerColorsForDownload(botdLayer, color);
      }
      if (botmLayer) {
        botmLayer.ks.o.a = 0;
        botmLayer.ks.o.k = 0;
      }
    } else if (wordType === "botm") {
      if (botmLayer) {
        botmLayer.ks.o.a = 0;
        botmLayer.ks.o.k = 100;
        updateLayerColorsForDownload(botmLayer, color);
      }
      if (botdLayer) {
        botdLayer.ks.o.a = 0;
        botdLayer.ks.o.k = 0;
      }
    }
  } else {
    let wordLayer = null;
    if (wordType === "botd") {
      wordLayer = data.layers.find(l => l.nm && l.nm.includes("BRAND  OF THE DAY"));
      if (wordLayer && botdShapes) wordLayer.shapes = JSON.parse(JSON.stringify(botdShapes));
    } else if (wordType === "botm") {
      wordLayer = data.layers.find(l => l.nm && l.nm === "BOTM");
      if (wordLayer && botmShapes) wordLayer.shapes = JSON.parse(JSON.stringify(botmShapes));
    }
    
    if (wordLayer) {
      updateLayerColorsForDownload(wordLayer, color);
    }
  }
  
  return data;
}

function updateLayerColorsForDownload(wordLayer, color) {
  if (wordLayer && Array.isArray(wordLayer.shapes)) {
    wordLayer.shapes.forEach((group) => {
      // Handle groups (BOTD style) - single uppercase letters
      if (group.ty === "gr" && typeof group.nm === "string" && /^[A-Z]$/.test(group.nm)) {
        group.it.forEach((item) => {
          if (item.ty === "fl" && item.c && Array.isArray(item.c.k)) {
            item.c.k = color;
          }
        });
      }
      // Handle direct shapes (BOTM style) - single uppercase letters
      else if (group.ty === "sh" && typeof group.nm === "string" && /^[A-Z]$/.test(group.nm)) {
        if (group.c && Array.isArray(group.c.k)) {
          group.c.k = color;
        }
      }
      // Handle any other group structures that might contain fills
      else if (group.ty === "gr" && group.it) {
        group.it.forEach((item) => {
          if (item.ty === "fl" && item.c && Array.isArray(item.c.k)) {
            const parentName = group.nm || "";
            if (/[A-Z]/.test(parentName)) {
              item.c.k = color;
            }
          }
        });
      }
    });
    
    // Additional recursive pass to ensure all fills get updated
    function updateFillsRecursively(shapes, targetColor) {
      shapes.forEach((shape) => {
        if (shape.ty === "fl" && shape.c && Array.isArray(shape.c.k)) {
          shape.c.k = targetColor;
        }
        if (shape.it && Array.isArray(shape.it)) {
          updateFillsRecursively(shape.it, targetColor);
        }
        if (shape.shapes && Array.isArray(shape.shapes)) {
          updateFillsRecursively(shape.shapes, targetColor);
        }
      });
    }
    
    updateFillsRecursively(wordLayer.shapes, color);
  }
}

// Helper functions

function getWordShapes(animationData, layerName) {
  const layer = animationData.layers.find(l => l.nm && l.nm.includes(layerName));
  return layer ? layer.shapes : [];
}

export default function Home() {
  const [brandColor, setBrandColor] = useState([0.898, 0.1608, 0.1451, 1]);
  const [bgFill, setBgFill] = useState([1, 1, 1, 1]);
  const [bgStroke, setBgStroke] = useState([0.498, 0.7373, 0.0118, 1]);
  const [showPickers, setShowPickers] = useState({});
  const [wordType, setWordType] = useState("botm"); // For viewport viewing only
  const [version, setVersion] = useState("new"); // For viewport viewing only
  const [brandName, setBrandName] = useState(""); // Added brand name state
  
  // Edit separately states
  const [editBgSeparately, setEditBgSeparately] = useState(false);
  const [editTextSeparately, setEditTextSeparately] = useState(false);
  
  
  // Separate color states for old and new versions
  const [bgFillOld, setBgFillOld] = useState([1, 1, 1, 1]);
  const [bgFillNew, setBgFillNew] = useState([1, 1, 1, 1]);
  const [brandColorOld, setBrandColorOld] = useState([0.898, 0.1608, 0.1451, 1]);
  const [brandColorNew, setBrandColorNew] = useState([0.898, 0.1608, 0.1451, 1]);
  
  // Download selection states (can select multiple)
  const [downloadTypes, setDownloadTypes] = useState({ botd: true, botm: true });
  const [downloadVersions, setDownloadVersions] = useState({ old: false, new: true });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  




  // Extract shapes for old version
  const botdShapes = useMemo(() => getWordShapes(baseBotdData, "BRAND  OF THE DAY"), []);
  const botmShapes = useMemo(() => getWordShapes(baseBotmData, "BOTM"), []);






  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show success message briefly
      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 2000);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop for image upload
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => 
      file.type.startsWith('image/') && 
      (file.name.toLowerCase().endsWith('.png') || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg'))
    );
    
    if (imageFile) {
      // Show success message briefly
      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 2000);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  // Function to save selected animation combinations
  async function saveModifiedLotties() {
    const timestamp = Date.now();
    const mainZip = new JSZip();
    
    const cleanPrefix = brandName ? brandName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase() : 'brand_animation';
    
    // Get selected types and versions
    const selectedTypes = Object.entries(downloadTypes).filter(([_, selected]) => selected).map(([type, _]) => type);
    const selectedVersions = Object.entries(downloadVersions).filter(([_, selected]) => selected).map(([version, _]) => version);
    


    // Validate selections
    if (selectedTypes.length === 0) {
      alert('Please select at least one type (BOTD or BOTM) to download!');
      return;
    }
    if (selectedVersions.length === 0) {
      alert('Please select at least one version (OLD or NEW) to download!');
      return;
    }

    let fileCount = 0;

    // Generate files for all combinations of selected types and versions
    for (const type of selectedTypes) {
      for (const versionName of selectedVersions) {
        // Determine base data
        let baseData;
        if (versionName === "new") {
          baseData = newBaseData;
        } else {
          baseData = type === "botd" ? baseBotdData : baseBotmData;
        }

        // Determine colors based on edit separately settings and version
        const currentBrandColor = editTextSeparately ? 
          (versionName === "old" ? brandColorOld : brandColorNew) : brandColor;
        const currentBgFill = editBgSeparately ? 
          (versionName === "old" ? bgFillOld : bgFillNew) : bgFill;

        // Generate modified data
        const modifiedData = editImageForDownload(
          baseData, currentBrandColor, uploadedImage || DEFAULT_IMAGE_PATH, 
          currentBgFill, bgStroke, type, botdShapes, botmShapes, versionName === "new"
        );
        
        // Add JSON file to ZIP
        const jsonContent = JSON.stringify(modifiedData);
        const jsonFilename = `${cleanPrefix}_${type}_${versionName}.json`;
        mainZip.file(jsonFilename, jsonContent);
        fileCount++;

        // Convert JSON to .lottie and add to ZIP
        try {
          const dataForLottie = JSON.parse(JSON.stringify(modifiedData));
          const dotLottieBuffer = await convertJsonToDotLottie(dataForLottie, `${type}_${versionName}`);
          const dotLottieFilename = `${cleanPrefix}_${type}_${versionName}.lottie`;
          mainZip.file(dotLottieFilename, new Uint8Array(dotLottieBuffer), { binary: true });
          fileCount++;
        } catch (error) {
          // Failed to convert to .lottie, continue with JSON only
        }
      }
    }



    // Generate and download the ZIP file
    const zipBlob = await mainZip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    const combinationName = `${selectedTypes.join('_')}_${selectedVersions.join('_')}`;
    link.download = `${cleanPrefix}_${combinationName}_${timestamp}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div 
      style={{
        height: "100vh",
        width: "100vw",
        background: isDragOver ? "#e8f4fd" : "#f5f5f5",
        fontFamily: "'Chakra Petch', sans-serif",
        display: "flex",
        padding: "20px",
        gap: "20px",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        transition: "background-color 0.2s ease"
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag and Drop Overlay */}
      {isDragOver && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 123, 255, 0.1)",
          border: "3px dashed #007bff",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          pointerEvents: "none"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "40px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
          }}>
            <div style={{
              fontSize: "48px",
              marginBottom: "16px"
            }}>
              📁
            </div>
            <div style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#007bff",
              marginBottom: "8px",
              fontFamily: "'Chakra Petch', sans-serif"
            }}>
              Drop Image Here
            </div>
            <div style={{
              fontSize: "14px",
              color: "#6c757d",
              fontFamily: "'Chakra Petch', sans-serif"
            }}>
              PNG, JPG, or JPEG files accepted
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Success Message */}
      {showUploadSuccess && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "#28a745",
          color: "white",
          padding: "16px 24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          zIndex: 1001,
          fontFamily: "'Chakra Petch', sans-serif",
          fontSize: "14px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span style={{ fontSize: "18px" }}>✓</span>
          Image uploaded successfully!
        </div>
      )}
      
      {/* Main Content Area with Two Viewports - Horizontal Layout */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        boxSizing: "border-box"
      }}>
        {/* Old Version Viewport */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <BrandLottie
                brandColor={editTextSeparately ? brandColorOld : brandColor}
                bgFill={editBgSeparately ? bgFillOld : bgFill}
                bgStroke={bgStroke}
                imagePath={uploadedImage || DEFAULT_IMAGE_PATH}
                wordType={wordType}
                botdShapes={botdShapes}
                botmShapes={botmShapes}
                isNewVersion={false}
                key={`old-${wordType}-${refreshKey}`}
              />
            </div>
          </div>
        </div>

        {/* New Version Viewport */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>

          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <BrandLottie
                brandColor={editTextSeparately ? brandColorNew : brandColor}
                bgFill={editBgSeparately ? bgFillNew : bgFill}
                bgStroke={bgStroke}
                imagePath={uploadedImage || DEFAULT_IMAGE_PATH}
                wordType={wordType}
                botdShapes={botdShapes}
                botmShapes={botmShapes}
                isNewVersion={true}
                key={`new-${wordType}-${refreshKey}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div style={{
        width: "20%",
        background: "#fff",
        border: "1px solid #e5e7eb",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        borderRadius: "8px"
      }}>
        <h2 style={{
          margin: "12px 0 12px 0",
          fontSize: "18px",
          fontWeight: "600",
          color: "#111827",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontFamily: "'Chakra Petch', sans-serif",
          fontWeight: '800'
        }}>
          PROPERTIES
        </h2>
        <div style={{color: "#6b7280", width: "100%", height: "1px", backgroundColor: "#E4E4E4", marginBottom: "12px"}}> </div>

        {/* Image Upload */}
        <div>
          <h3 style={{
            fontSize: "12px",
            padding: "12px 0 12px 0",
            fontWeight: "500",
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: '800'
          }}>
            IMAGE
          </h3>
          <UploadButton onFileChange={handleImageUpload} />
          <p style={{
            margin: "8px 0 0 0",
            fontSize: "10px",
            color: "#969696"
          }}>
            UPLOAD THE IMAGE IN A 300*300 PX FRAME
          </p>
        </div>

        {/* Type Selection */}
        <div>
          <h3 style={{
            padding: "12px 0 12px 0",
            fontSize: "12px",
            fontWeight: "800",
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontFamily: "'Chakra Petch', sans-serif"
          }}>
            TYPE
          </h3>
          <div style={{ display: "flex", gap: "8px" }}>
            <SelectionButton
              isActive={wordType === "botd"}
              onClick={() => setWordType("botd")}
            >
              BOTD
            </SelectionButton>
            <SelectionButton
              isActive={wordType === "botm"}
              onClick={() => setWordType("botm")}
            >
              BOTM
            </SelectionButton>
          </div>
          <p style={{
            margin: "8px 0 0 0",
            fontSize: "10px",
            color: "#969696"
          }}>
            VIEW BOTD OR BOTM
          </p>
        </div>

        {/* Background Color */}
        <div style={{ padding: "12px 0 12px 0" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <h3 style={{
              fontSize: "12px",
              fontWeight: "800",
              color: "#606060",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontFamily: "'Chakra Petch', sans-serif"
            }}>
              BACKGROUND COLOR
            </h3>
            {!editBgSeparately && (
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: `rgba(${Math.round(bgFill[0] * 255)}, ${Math.round(bgFill[1] * 255)}, ${Math.round(bgFill[2] * 255)}, ${bgFill[3]})`,
                  border: "2px solid #e5e7eb",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
                onClick={() => setShowPickers(prev => ({ ...prev, bgFill: !prev.bgFill }))}
              />
            )}
            {showPickers.bgFill && !editBgSeparately && (
              <CustomColorPicker
                color={bgFill}
                onChange={setBgFill}
                onClose={() => setShowPickers(prev => ({ ...prev, bgFill: false }))}
              />
            )}
          </div>
          
          {/* Edit Separately Checkbox */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: editBgSeparately ? "12px" : "0" }}>
            <input
              type="checkbox"
              id="editBgSeparately"
              checked={editBgSeparately}
              onChange={(e) => {
                setEditBgSeparately(e.target.checked);
                if (e.target.checked) {
                  // Initialize separate colors with current unified color
                  setBgFillOld([...bgFill]);
                  setBgFillNew([...bgFill]);
                  setShowPickers(prev => ({ ...prev, bgFill: false }));
                } else {
                  // When unchecking, use the new version color as the unified color
                  setBgFill([...bgFillNew]);
                  setShowPickers(prev => ({ ...prev, bgFillOld: false, bgFillNew: false }));
                }
              }}
              style={{ marginRight: "8px", cursor: "pointer" }}
            />
            <label 
              htmlFor="editBgSeparately" 
              style={{ 
                fontSize: "11px", 
                color: "#606060", 
                fontFamily: "'Chakra Petch', sans-serif",
                cursor: "pointer"
              }}
            >
              Edit separately
            </label>
          </div>
          
          {/* Separate Color Pickers */}
          {editBgSeparately && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Old Version Color */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#606060", fontFamily: "'Chakra Petch', sans-serif" }}>
                  Old Version
                </span>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    backgroundColor: `rgba(${Math.round(bgFillOld[0] * 255)}, ${Math.round(bgFillOld[1] * 255)}, ${Math.round(bgFillOld[2] * 255)}, ${bgFillOld[3]})`,
                    border: "2px solid #e5e7eb",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                  onClick={() => setShowPickers(prev => ({ ...prev, bgFillOld: !prev.bgFillOld }))}
                />
                {showPickers.bgFillOld && (
                  <CustomColorPicker
                    color={bgFillOld}
                    onChange={setBgFillOld}
                    onClose={() => setShowPickers(prev => ({ ...prev, bgFillOld: false }))}
                  />
                )}
              </div>
              
              {/* New Version Color */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#606060", fontFamily: "'Chakra Petch', sans-serif" }}>
                  New Version
                </span>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    backgroundColor: `rgba(${Math.round(bgFillNew[0] * 255)}, ${Math.round(bgFillNew[1] * 255)}, ${Math.round(bgFillNew[2] * 255)}, ${bgFillNew[3]})`,
                    border: "2px solid #e5e7eb",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                  onClick={() => setShowPickers(prev => ({ ...prev, bgFillNew: !prev.bgFillNew }))}
                />
                {showPickers.bgFillNew && (
                  <CustomColorPicker
                    color={bgFillNew}
                    onChange={setBgFillNew}
                    onClose={() => setShowPickers(prev => ({ ...prev, bgFillNew: false }))}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stroke Color */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "12px 0 12px 0"}}>
          <h3 style={{
            fontSize: "12px",
            fontWeight: "800",
            color: "#606060",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            STROKE COLOR
          </h3>
          <div
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: `rgba(${Math.round(bgStroke[0] * 255)}, ${Math.round(bgStroke[1] * 255)}, ${Math.round(bgStroke[2] * 255)}, ${bgStroke[3]})`,
              border: "2px solid #e5e7eb",
              borderRadius: "6px",
              cursor: "pointer"
            }}
            onClick={() => setShowPickers(prev => ({ ...prev, bgStroke: !prev.bgStroke }))}
          />
          {showPickers.bgStroke && (
            <CustomColorPicker
              color={bgStroke}
              onChange={setBgStroke}
              onClose={() => setShowPickers(prev => ({ ...prev, bgStroke: false }))}
            />
          )}
        </div>

        {/* Text Color */}
        <div style={{ padding: "12px 0 12px 0" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <h3 style={{
              fontSize: "12px",
              fontWeight: "800",
              color: "#606060",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontFamily: "'Chakra Petch', sans-serif"
            }}>
              TEXT COLOR
            </h3>
            {!editTextSeparately && (
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: `rgba(${Math.round(brandColor[0] * 255)}, ${Math.round(brandColor[1] * 255)}, ${Math.round(brandColor[2] * 255)}, ${brandColor[3]})`,
                  border: "2px solid #e5e7eb",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
                onClick={() => setShowPickers(prev => ({ ...prev, brandColor: !prev.brandColor }))}
              />
            )}
            {showPickers.brandColor && !editTextSeparately && (
              <CustomColorPicker
                color={brandColor}
                onChange={setBrandColor}
                onClose={() => setShowPickers(prev => ({ ...prev, brandColor: false }))}
              />
            )}
          </div>
          
          {/* Edit Separately Checkbox */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: editTextSeparately ? "12px" : "0" }}>
            <input
              type="checkbox"
              id="editTextSeparately"
              checked={editTextSeparately}
              onChange={(e) => {
                setEditTextSeparately(e.target.checked);
                if (e.target.checked) {
                  // Initialize separate colors with current unified color
                  setBrandColorOld([...brandColor]);
                  setBrandColorNew([...brandColor]);
                  setShowPickers(prev => ({ ...prev, brandColor: false }));
                } else {
                  // When unchecking, use the new version color as the unified color
                  setBrandColor([...brandColorNew]);
                  setShowPickers(prev => ({ ...prev, brandColorOld: false, brandColorNew: false }));
                }
              }}
              style={{ marginRight: "8px", cursor: "pointer" }}
            />
            <label 
              htmlFor="editTextSeparately" 
              style={{ 
                fontSize: "11px", 
                color: "#606060", 
                fontFamily: "'Chakra Petch', sans-serif",
                cursor: "pointer"
              }}
            >
              Edit separately
            </label>
          </div>
          
          {/* Separate Color Pickers */}
          {editTextSeparately && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Old Version Color */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#606060", fontFamily: "'Chakra Petch', sans-serif" }}>
                  Old Version
                </span>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    backgroundColor: `rgba(${Math.round(brandColorOld[0] * 255)}, ${Math.round(brandColorOld[1] * 255)}, ${Math.round(brandColorOld[2] * 255)}, ${brandColorOld[3]})`,
                    border: "2px solid #e5e7eb",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                  onClick={() => setShowPickers(prev => ({ ...prev, brandColorOld: !prev.brandColorOld }))}
                />
                {showPickers.brandColorOld && (
                  <CustomColorPicker
                    color={brandColorOld}
                    onChange={setBrandColorOld}
                    onClose={() => setShowPickers(prev => ({ ...prev, brandColorOld: false }))}
                  />
                )}
              </div>
              
              {/* New Version Color */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#606060", fontFamily: "'Chakra Petch', sans-serif" }}>
                  New Version
                </span>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    backgroundColor: `rgba(${Math.round(brandColorNew[0] * 255)}, ${Math.round(brandColorNew[1] * 255)}, ${Math.round(brandColorNew[2] * 255)}, ${brandColorNew[3]})`,
                    border: "2px solid #e5e7eb",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                  onClick={() => setShowPickers(prev => ({ ...prev, brandColorNew: !prev.brandColorNew }))}
                />
                {showPickers.brandColorNew && (
                  <CustomColorPicker
                    color={brandColorNew}
                    onChange={setBrandColorNew}
                    onClose={() => setShowPickers(prev => ({ ...prev, brandColorNew: false }))}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Configuration Frame */}
        <div style={{
          border: "1px solid #E4E4E4",
          borderRadius: "4px",
          padding: "20px",
          backgroundColor: "#F2F2F2"
        }}>
          {/* Brand Name */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{
              margin: "0 0 12px 0",
              fontSize: "12px",
              fontWeight: "800",
              color: "#606060",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontFamily: "'Chakra Petch', sans-serif"
            }}>
              BRAND NAME
            </h3>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="NAME"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                color: "#373737",
                backgroundColor: "#fff",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Type Selection (for viewing) */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{
              margin: "0 0 12px 0",
              fontSize: "12px",
              fontWeight: "800",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontFamily: "'Chakra Petch', sans-serif"
            }}>
              TYPE
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <MultiSelectButton
                isSelected={downloadTypes.botd}
                onToggle={() => setDownloadTypes(prev => ({ ...prev, botd: !prev.botd }))}
              >
                BOTD
              </MultiSelectButton>
              <MultiSelectButton
                isSelected={downloadTypes.botm}
                onToggle={() => setDownloadTypes(prev => ({ ...prev, botm: !prev.botm }))}
              >
                BOTM
              </MultiSelectButton>
            </div>
            <p style={{
              margin: "8px 0 0 0",
              fontSize: "10px",
              color: "#969696"
            }}>
              SELECT TYPES TO DOWNLOAD
            </p>
          </div>

          {/* Version Selection */}
          <div>
            <h3 style={{
              margin: "0 0 12px 0",
              fontSize: "12px",
              fontWeight: "800",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontFamily: "'Chakra Petch', sans-serif"
            }}>
              VERSION
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <MultiSelectButton
                isSelected={downloadVersions.old}
                onToggle={() => setDownloadVersions(prev => ({ ...prev, old: !prev.old }))}
              >
                OLD
              </MultiSelectButton>
              <MultiSelectButton
                isSelected={downloadVersions.new}
                onToggle={() => setDownloadVersions(prev => ({ ...prev, new: !prev.new }))}
              >
                NEW
              </MultiSelectButton>
            </div>
            <p style={{
              margin: "8px 0 0 0",
              fontSize: "10px",
              color: "#969696"
            }}>
              SELECT VERSIONS TO DOWNLOAD
            </p>
          </div>
        </div>



        {/* Download Button */}
        <DownloadButton onClick={saveModifiedLotties}>
          DOWNLOAD
        </DownloadButton>
      </div>
    </div>
  );
}

