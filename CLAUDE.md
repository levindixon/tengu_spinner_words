# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JavaScript analysis tool that extracts and analyzes "processing words" (whimsical verbs like "activating", "orchestrating") from all versions of the Claude Code CLI. The project discovered that "Tengu" is the internal codename for Claude Code and documented the evolution of these words across 139 versions.

## Key Commands

### Running the Analysis
```bash
# Extract processing words from all versions
npm run extract-all

# Process versions in batches (for large ranges)
npm run extract-batch

# Combine batch results into final output
npm run combine-batches

# Test specific problematic versions
npm run test-problematic
```

## Architecture & Key Files

### Data Files
- `known-processing-words.json` - Complete dictionary of all 90 discovered words
- `processing-words-all-versions.json` - Comprehensive version-by-version data including metadata
- `processing-words-history.json` - Simplified arrays of words per version
- `processing-words-analysis-report.json` - Summary statistics and analysis

### Core Scripts
- `extract-processing-words-robust.js` - Main extraction logic that downloads and analyzes Claude Code binaries
- `extract-batch.js` - Handles batch processing for analyzing multiple versions efficiently
- `combine-batches.js` - Merges batch results into final dataset

## Important Technical Details

1. The extraction process downloads Claude Code binaries from NPM and analyzes them using string matching patterns
2. Processing words follow a specific pattern: positive gerunds (ending in -ing) used in spinner animations
3. The project uses only Node.js built-in modules - no external dependencies
4. All file operations use ES modules (`import`/`export` syntax)

## Development Notes

- When modifying extraction logic, test with a small version range first
- The project discovered a dynamic configuration system where Claude Code can fetch additional words from Anthropic's servers
- All processing words are intentionally whimsical and positive - no negative words are used