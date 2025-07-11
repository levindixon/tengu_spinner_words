#!/usr/bin/env node

import fs from 'fs';

// Read all batch files
const batches = [];
for (let i = 1; i <= 5; i++) {
  const batchFile = `processing-words-batch-${i}.json`;
  if (fs.existsSync(batchFile)) {
    const batch = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
    batches.push(batch);
  }
}

console.log(`Found ${batches.length} batch files`);

// Combine all results
const allResults = {};
const versionDetails = [];
let totalVersions = 0;

for (const batch of batches) {
  totalVersions += batch.versionsProcessed;
  
  // Add results
  Object.assign(allResults, batch.results);
  
  // Create version details
  for (const [version, data] of Object.entries(batch.results)) {
    versionDetails.push({
      version,
      success: data !== null,
      wordCount: data?.wordCount || 0,
      variableName: data?.variableName || null,
      filename: data?.filename || null
    });
  }
}

// Create a history object with just words
const history = {};
for (const [version, data] of Object.entries(allResults)) {
  if (data && data.words) {
    history[version] = data.words;
  }
}

// Analyze changes
const changesDetected = [];
const sortedVersions = Object.keys(allResults).sort((a, b) => {
  // Sort by semantic version
  const aParts = a.split('.').map(p => parseInt(p));
  const bParts = b.split('.').map(p => parseInt(p));
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;
    if (aVal !== bVal) return aVal - bVal;
  }
  return 0;
});

// Find changes between versions
for (let i = 1; i < sortedVersions.length; i++) {
  const prevVersion = sortedVersions[i - 1];
  const currVersion = sortedVersions[i];
  
  const prevData = allResults[prevVersion];
  const currData = allResults[currVersion];
  
  if (prevData && currData && prevData.words && currData.words) {
    const added = currData.words.filter(w => !prevData.words.includes(w));
    const removed = prevData.words.filter(w => !currData.words.includes(w));
    
    if (added.length > 0 || removed.length > 0) {
      changesDetected.push({
        version: currVersion,
        previousVersion: prevVersion,
        added,
        removed,
        wordCountBefore: prevData.wordCount,
        wordCountAfter: currData.wordCount
      });
    }
  }
}

// Create comprehensive output
const output = {
  metadata: {
    totalVersions: totalVersions,
    startVersion: '0.2.9',
    endVersion: sortedVersions[sortedVersions.length - 1],
    extractionDate: new Date().toISOString(),
    successfulExtractions: Object.values(allResults).filter(v => v !== null).length,
    failedExtractions: Object.values(allResults).filter(v => v === null).length
  },
  summary: {
    variableNames: [...new Set(Object.values(allResults).filter(v => v?.variableName).map(v => v.variableName))].sort(),
    uniqueWordCounts: [...new Set(Object.values(allResults).filter(v => v?.wordCount).map(v => v.wordCount))].sort((a, b) => a - b),
    totalChanges: changesDetected.length,
    firstVersionWithWords: sortedVersions.find(v => allResults[v] !== null),
    versionBreakdown: {
      with56Words: Object.values(allResults).filter(v => v?.wordCount === 56).length,
      with57Words: Object.values(allResults).filter(v => v?.wordCount === 57).length,
      with90Words: Object.values(allResults).filter(v => v?.wordCount === 90).length,
      otherWordCounts: Object.values(allResults).filter(v => v && v.wordCount !== 56 && v.wordCount !== 57 && v.wordCount !== 90).length
    }
  },
  changes: changesDetected,
  versions: allResults
};

// Save the comprehensive results
fs.writeFileSync('processing-words-all-versions.json', JSON.stringify(output, null, 2));
console.log('\nSaved comprehensive results to processing-words-all-versions.json');

// Save the word history (simpler format)
fs.writeFileSync('processing-words-history.json', JSON.stringify(history, null, 2));
console.log('Saved word history to processing-words-history.json');

// Create a summary report
const report = {
  overview: {
    totalVersionsAnalyzed: output.metadata.totalVersions,
    successRate: `${Math.round((output.metadata.successfulExtractions / output.metadata.totalVersions) * 100)}%`,
    dateRange: `${output.metadata.startVersion} to ${output.metadata.endVersion}`
  },
  wordCountEvolution: [
    { wordCount: 56, versions: output.summary.versionBreakdown.with56Words, description: "Original set (missing 'Vibing')" },
    { wordCount: 57, versions: output.summary.versionBreakdown.with57Words, description: "Standard set (pre-expansion)" },
    { wordCount: 90, versions: output.summary.versionBreakdown.with90Words, description: "Expanded set (current)" }
  ],
  majorChanges: changesDetected.map(change => ({
    version: change.version,
    previousVersion: change.previousVersion,
    wordCountChange: `${change.wordCountBefore} → ${change.wordCountAfter}`,
    wordsAdded: change.added.length,
    wordsRemoved: change.removed.length
  })),
  variableNamePatterns: {
    totalUnique: output.summary.variableNames.length,
    examples: output.summary.variableNames.slice(0, 10)
  }
};

fs.writeFileSync('processing-words-analysis-report.json', JSON.stringify(report, null, 2));
console.log('Saved analysis report to processing-words-analysis-report.json');

// Print summary
console.log('\n=== Summary ===');
console.log(`Total versions processed: ${output.metadata.totalVersions}`);
console.log(`Successful extractions: ${output.metadata.successfulExtractions}`);
console.log(`Failed extractions: ${output.metadata.failedExtractions}`);
console.log(`\nWord count distribution:`);
console.log(`  56 words: ${output.summary.versionBreakdown.with56Words} versions`);
console.log(`  57 words: ${output.summary.versionBreakdown.with57Words} versions`);
console.log(`  90 words: ${output.summary.versionBreakdown.with90Words} versions`);
console.log(`\nMajor changes detected: ${changesDetected.length}`);
for (const change of changesDetected) {
  console.log(`  - v${change.version}: ${change.wordCountBefore} → ${change.wordCountAfter} words`);
}

// Clean up batch files
console.log('\nCleaning up batch files...');
for (let i = 1; i <= 5; i++) {
  const batchFile = `processing-words-batch-${i}.json`;
  if (fs.existsSync(batchFile)) {
    fs.unlinkSync(batchFile);
  }
}
console.log('Done!');