#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Load known processing words
const knownWordsData = JSON.parse(fs.readFileSync('./known-processing-words.json', 'utf8'));
const knownWords = knownWordsData.knownWords;
const commonPatterns = knownWordsData.commonPatterns;

/**
 * Extract processing words from a file content using known word patterns
 */
function extractProcessingWords(content, filename) {
  const results = [];
  
  // First, check if the file contains any of our common pattern words
  const hasProcessingWords = commonPatterns.some(word => content.includes(`"${word}"`));
  if (!hasProcessingWords) {
    return results;
  }
  
  // Find all string arrays in the content
  const arrayRegex = /\[(\s*"[^"]+"\s*(?:,\s*"[^"]+"\s*)*)\]/g;
  let match;
  
  while ((match = arrayRegex.exec(content)) !== null) {
    const arrayContent = match[1];
    const words = arrayContent.match(/"([^"]+)"/g)?.map(w => w.replace(/"/g, '')) || [];
    
    // Check if this array contains processing words
    if (words.length >= 30) { // Processing word arrays are typically 57 or 90 words
      const matchingWords = words.filter(w => knownWords.includes(w));
      const matchPercentage = matchingWords.length / words.length;
      
      // If more than 50% of words match our known list, it's likely a processing words array
      if (matchPercentage > 0.5) {
        // Try to find the variable name
        const varMatch = content.substring(Math.max(0, match.index - 100), match.index)
          .match(/(\w+)\s*=\s*$/);
        const variableName = varMatch ? varMatch[1] : 'unknown';
        
        results.push({
          filename,
          variableName,
          words,
          wordCount: words.length,
          matchingKnownWords: matchingWords.length,
          matchPercentage: Math.round(matchPercentage * 100)
        });
      }
    }
  }
  
  // Alternative approach: Find arrays by looking for sequences of our known words
  for (const word of commonPatterns) {
    const wordIndex = content.indexOf(`"${word}"`);
    if (wordIndex === -1) continue;
    
    // Look for array boundaries around this word
    let arrayStart = wordIndex;
    let arrayEnd = wordIndex + word.length;
    
    // Find start of array
    while (arrayStart > 0 && content[arrayStart] !== '[') {
      arrayStart--;
      if (arrayStart > 0 && content[arrayStart] === ']') break; // We're not in an array
    }
    
    // Find end of array
    while (arrayEnd < content.length && content[arrayEnd] !== ']') {
      arrayEnd++;
      if (arrayEnd < content.length && content[arrayEnd] === '[') break; // We're not in an array
    }
    
    if (content[arrayStart] === '[' && content[arrayEnd] === ']') {
      const arrayContent = content.substring(arrayStart + 1, arrayEnd);
      const words = arrayContent.match(/"([^"]+)"/g)?.map(w => w.replace(/"/g, '')) || [];
      
      if (words.length >= 30) {
        const matchingWords = words.filter(w => knownWords.includes(w));
        const matchPercentage = matchingWords.length / words.length;
        
        if (matchPercentage > 0.5) {
          // Try to find the variable name
          const varMatch = content.substring(Math.max(0, arrayStart - 100), arrayStart)
            .match(/(\w+)\s*=\s*$/);
          const variableName = varMatch ? varMatch[1] : 'unknown';
          
          // Check if we already found this array
          const isDuplicate = results.some(r => 
            r.words.length === words.length && 
            r.words[0] === words[0] && 
            r.words[words.length - 1] === words[words.length - 1]
          );
          
          if (!isDuplicate) {
            results.push({
              filename,
              variableName,
              words,
              wordCount: words.length,
              matchingKnownWords: matchingWords.length,
              matchPercentage: Math.round(matchPercentage * 100)
            });
          }
        }
      }
    }
  }
  
  return results;
}

/**
 * Process a single version of the package
 */
async function processVersion(version) {
  console.log(`Processing version ${version}...`);
  
  try {
    // Clean up any existing files
    execSync('rm -rf package anthropic-ai-claude-code-*.tgz', { stdio: 'ignore' });
    
    // Download the package
    execSync(`npm pack @anthropic-ai/claude-code@${version}`, { stdio: 'ignore' });
    
    // Extract the tarball
    const tarball = fs.readdirSync('.').find(f => f.endsWith('.tgz'));
    if (!tarball) {
      throw new Error('Failed to download package');
    }
    
    execSync(`tar -xzf ${tarball}`, { stdio: 'ignore' });
    
    // Find all JavaScript files in the package
    const findJsFiles = (dir) => {
      const files = [];
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          files.push(...findJsFiles(fullPath));
        } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.mjs'))) {
          files.push(fullPath);
        }
      }
      
      return files;
    };
    
    const jsFiles = findJsFiles('package');
    const allResults = [];
    
    // Search each file
    for (const file of jsFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const results = extractProcessingWords(content, path.relative('package', file));
        allResults.push(...results);
      } catch (err) {
        // Skip files that can't be read
      }
    }
    
    // Deduplicate and select the best match
    let bestResult = null;
    if (allResults.length > 0) {
      // Sort by match percentage and word count (prefer 90 or 57 words)
      allResults.sort((a, b) => {
        const aScore = a.matchPercentage + (a.wordCount === 90 || a.wordCount === 57 ? 10 : 0);
        const bScore = b.matchPercentage + (b.wordCount === 90 || b.wordCount === 57 ? 10 : 0);
        return bScore - aScore;
      });
      
      bestResult = allResults[0];
      console.log(`  ✓ Found ${bestResult.wordCount} processing words in ${bestResult.filename} (variable: ${bestResult.variableName})`);
    } else {
      console.log(`  ✗ No processing words found`);
    }
    
    // Clean up
    execSync('rm -rf package anthropic-ai-claude-code-*.tgz', { stdio: 'ignore' });
    
    return {
      version,
      success: bestResult !== null,
      data: bestResult
    };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    
    // Clean up on error
    try {
      execSync('rm -rf package anthropic-ai-claude-code-*.tgz', { stdio: 'ignore' });
    } catch {}
    
    return {
      version,
      success: false,
      error: error.message
    };
  }
}

/**
 * Main function
 */
async function main() {
  // Get command line arguments
  const args = process.argv.slice(2);
  const batchNumber = parseInt(args[0]) || 1;
  const batchSize = 30;
  
  // Get all versions
  console.log('Fetching all versions of @anthropic-ai/claude-code...');
  const output = execSync('npm view @anthropic-ai/claude-code versions --json', { encoding: 'utf8' });
  const allVersions = JSON.parse(output);
  
  // Filter versions (start from 0.2.9 as requested)
  const startIndex = allVersions.indexOf('0.2.9');
  if (startIndex === -1) {
    console.error('Could not find version 0.2.9');
    return;
  }
  
  const versionsToProcess = allVersions.slice(startIndex);
  console.log(`Total versions from 0.2.9: ${versionsToProcess.length}`);
  
  // Calculate batch
  const startIdx = (batchNumber - 1) * batchSize;
  const endIdx = Math.min(startIdx + batchSize, versionsToProcess.length);
  const batchVersions = versionsToProcess.slice(startIdx, endIdx);
  
  console.log(`Processing batch ${batchNumber}: versions ${startIdx + 1} to ${endIdx} (${batchVersions.length} versions)\n`);
  
  // Process each version in the batch
  const results = {};
  
  for (const version of batchVersions) {
    const result = await processVersion(version);
    
    if (result.success && result.data) {
      results[version] = {
        words: result.data.words,
        wordCount: result.data.wordCount,
        variableName: result.data.variableName,
        filename: result.data.filename,
        matchPercentage: result.data.matchPercentage
      };
    } else {
      results[version] = null;
    }
  }
  
  // Save batch results
  const batchOutput = {
    batchNumber,
    startVersion: batchVersions[0],
    endVersion: batchVersions[batchVersions.length - 1],
    versionsProcessed: batchVersions.length,
    results
  };
  
  fs.writeFileSync(`processing-words-batch-${batchNumber}.json`, JSON.stringify(batchOutput, null, 2));
  console.log(`\nBatch ${batchNumber} results saved to processing-words-batch-${batchNumber}.json`);
  
  // Print summary
  const successful = Object.values(results).filter(v => v !== null).length;
  console.log(`Successful extractions: ${successful}/${batchVersions.length}`);
}

// Run the script
main().catch(console.error);