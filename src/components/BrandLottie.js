import React, { useMemo } from "react";
import Lottie from "lottie-react";
import baseBotdData from "../../public/lottie/base_botd_pretty.json";
import baseBotmData from "../../public/lottie/base_botm_pretty.json";
import newBaseData from "../../public/lottie/BaseBOTDN.json";

// Utility to extract the word layer and its shapes
function getWordLayerAndShapes(animationData, layerName) {
  const layer = animationData.layers.find(l => l.nm && l.nm.includes(layerName));
  return layer ? { layer, shapes: layer.shapes } : { layer: null, shapes: [] };
}

// Function to edit the animation data for letter colors, image path, and background
function editImage(animationData, color, imagePath, bgFill, bgStroke, wordType, botdShapes, botmShapes, isNewVersion = false) {
  // Deep copy to avoid mutating the import
  const data = JSON.parse(JSON.stringify(animationData));
  let imageWidth = 260;
  let imageHeight = 260;
  
  // Update the image path for the asset
  if (Array.isArray(data.assets)) {
    const imageAsset = data.assets.find(asset => asset.id === "2" || asset.id === "1") || data.assets[0];
    if (imageAsset) {
      imageAsset.p = imagePath;
      // For data URLs, set u to empty string; for regular paths, set u appropriately
      if (imagePath && imagePath.startsWith('data:')) {
        imageAsset.u = "";
      } else {
        imageAsset.u = imagePath && imagePath.includes('/') ? "" : "lottie/";
      }
      imageAsset.w = imageWidth;
      imageAsset.h = imageHeight;
    }
  }
  
  // Center the image layer
  const imageLayer = data.layers.find(
    (layer) => layer.ty === 2 && (layer.refId === "2" || layer.refId === 2 || layer.refId === "1" || layer.refId === 1)
  );
  if (imageLayer && imageLayer.ks) {
    if (isNewVersion) {
      // For new version, use original positioning but adjust for image scaling
      // Original position: [-0.5, -5.661, 0], anchor: [150, 150]
      // Keep original position but update anchor to match new image dimensions
      imageLayer.ks.p.k = [-0.5, -5.661, 0];
      imageLayer.ks.a.k = [imageWidth / 2, imageHeight / 2];
      // Set scale to fit the image properly within the base shape
      imageLayer.ks.s.k = [60.062, 60.062, 96.538];
    } else {
      imageLayer.ks.p.k = [90, 90, 0];
      imageLayer.ks.a.k = [imageWidth / 2, imageHeight / 2];
    }
  }
  
  // Update background fill and stroke
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
  
  // Handle word layers differently for new vs old versions
  if (isNewVersion) {
    // For new version, handle both BOTD and BOTM layers visibility
    const botdLayer = data.layers.find(l => l.nm && l.nm.includes("Brand of the Day"));
    const botmLayer = data.layers.find(l => l.nm && l.nm.includes("Brand of the Moment"));
    
    if (wordType === "botd") {
      // Show BOTD, hide BOTM
      if (botdLayer) {
        botdLayer.ks.o.a = 0;
        botdLayer.ks.o.k = 100;
        updateLayerColors(botdLayer, color);
      }
      if (botmLayer) {
        botmLayer.ks.o.a = 0;
        botmLayer.ks.o.k = 0;
      }
    } else if (wordType === "botm") {
      // For new version, if BOTM layer doesn't exist, show BOTD layer instead
      if (botmLayer) {
        botmLayer.ks.o.a = 0;
        botmLayer.ks.o.k = 100;
        updateLayerColors(botmLayer, color);
        if (botdLayer) {
          botdLayer.ks.o.a = 0;
          botdLayer.ks.o.k = 0;
        }
      } else if (botdLayer) {
        // If no BOTM layer exists, show BOTD layer for BOTM type
        botdLayer.ks.o.a = 0;
        botdLayer.ks.o.k = 100;
        updateLayerColors(botdLayer, color);
      }
    }
  } else {
    // Old version logic (unchanged)
    let wordLayer = null;
    if (wordType === "botd") {
      wordLayer = data.layers.find(l => l.nm && l.nm.includes("BRAND  OF THE DAY"));
      if (wordLayer && botdShapes) wordLayer.shapes = JSON.parse(JSON.stringify(botdShapes));
    } else if (wordType === "botm") {
      wordLayer = data.layers.find(l => l.nm && l.nm === "BOTM");
      if (wordLayer && botmShapes) wordLayer.shapes = JSON.parse(JSON.stringify(botmShapes));
    }
    
    if (wordLayer) {
      updateLayerColors(wordLayer, color);
    }
  }
  
  return data;
}

// Helper function to update colors in a layer
function updateLayerColors(wordLayer, color) {
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

export default function BrandLottie({ 
  brandColor, 
  bgFill, 
  bgStroke, 
  imagePath, 
  wordType, 
  botdShapes, 
  botmShapes, 
  style, 
  isNewVersion = false 
}) {
  // Pick the correct base data
  const baseData = isNewVersion ? newBaseData : (wordType === "botd" ? baseBotdData : baseBotmData);
  
  const animationData = useMemo(
    () => editImage(baseData, brandColor, imagePath, bgFill, bgStroke, wordType, botdShapes, botmShapes, isNewVersion),
    [brandColor, bgFill, bgStroke, imagePath, wordType, botdShapes, botmShapes, isNewVersion]
  );
  
  return (
    <Lottie
      key={JSON.stringify([brandColor, bgFill, bgStroke, imagePath, wordType, isNewVersion])}
      animationData={animationData}
      style={{ 
        width: "100%", 
        height: "100%",
        overflow: "visible"
      }}
      loop={true}
      autoplay={true}
    />
  );
} 