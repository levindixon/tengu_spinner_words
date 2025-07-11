# Claude Code (Tengu) Processing Words Analysis - Technical Documentation

A comprehensive analysis of all processing words used in the Claude Code CLI (`@anthropic-ai/claude-code`) across its version history.

## Overview

This repository contains tools and data analyzing the whimsical "processing words" displayed by Claude Code while it's thinking. These gerund-form verbs (words ending in -ing) add personality to the CLI experience.

## Key Findings

- **139 versions analyzed** (from v0.2.9 to v1.0.48)
- **100% extraction success rate**
- **3 distinct phases** of processing words:
  1. **56 words** (v0.2.9 - v0.2.41): Original set missing "Pontificating"
  2. **57 words** (v0.2.42 - v1.0.28): Standard set
  3. **90 words** (v1.0.29 - current): Expanded set with 33 new whimsical additions

## Files

### Data Files
- `processing-words-all-versions.json` - Comprehensive data for all versions
- `processing-words-history.json` - Simplified word arrays per version
- `processing-words-analysis-report.json` - Summary statistics and insights
- `known-processing-words.json` - Dictionary of all 90 known processing words

### Scripts
- `extract-processing-words-robust.js` - Main extraction script using pattern matching
- `extract-batch.js` - Batch processing script for handling large version ranges
- `combine-batches.js` - Combines batch results into final datasets

## Major Changes in Processing Words

### Version 0.2.42
- Added "Pontificating" to complete the standard set (56 → 57 words)

### Version 1.0.29
- Major expansion adding 33 new words (57 → 90 words)
- New words include whimsical additions like:
  - Flibbertigibbeting
  - Discombobulating
  - Wizarding
  - Booping
  - And 29 more creative verbs

## Technical Details

### Processing Words Storage
- Processing words are stored in minified JavaScript variables
- Variable names change with each build (e.g., Lj6, pz5, zw5, jy6)
- The 90 processing words are all positive/whimsical verbs - no concerning words like "Terminating" or "Crashing" appear in the dataset
- All processing words are unique with no duplicates in the array

### Dynamic Spinner Words System

The CLI includes a sophisticated dynamic configuration system that can fetch additional "spinner words" from Anthropic's servers at runtime:

#### Key Components:
1. **Static Processing Words**: Hardcoded array of 90 words
2. **Dynamic Configuration**: Fetches additional words via the `tengu_spinner_words` configuration key
3. **Merger System**: Combines static and dynamic words: `[...hardcodedWords, ...dynamicWords]`
4. **Default Fallback**: Uses empty array `{words: []}` if dynamic fetch fails

#### Implementation Details:
- Uses React hooks for state management
- Includes environment variable checks to disable in certain contexts (e.g., `DISABLE_TELEMETRY`)
- Random word selection every 1000ms for display
- Memoization prevents unnecessary re-fetching
- 5-minute cache TTL for configuration data

### "Tengu" - Internal Codename

"Tengu" appears to be the internal project codename for Claude Code CLI:
- Configuration keys: `tengu_spinner_words` for dynamic words
- Telemetry events: `tengu_oauth_*`, `tengu_config_*`, `tengu_preflight_check_failed`
- Used consistently throughout the codebase for feature flags and analytics

The name likely references the Japanese mythological creature known for wisdom and mischief, fitting the CLI's whimsical personality.

### Dynamic Configuration Benefits

The dynamic system powered by Statsig provides several advantages:

1. **Real-time Updates**: Update spinner words without releasing new CLI versions
2. **A/B Testing**: Test different word sets with user segments
3. **Seasonal Content**: Add holiday or event-specific words dynamically
4. **User Personalization**: Customize words based on user type (pro/max/enterprise)
5. **Gradual Rollout**: Test new words with small user percentages first
6. **Analytics**: Track which words appear most often and user engagement

This architecture explains why static analysis finds only 90 unique words - the system is designed to be extensible through server-side configuration.

### Technical Architecture

The spinner word system follows this flow:

1. **Initialization**: CLI starts and loads static words (90 items)
2. **Dynamic Fetch**: Attempts to fetch additional words from Statsig
3. **Merge**: Combines static and dynamic word arrays
4. **Selection**: Randomly picks words from combined list
5. **Display**: Shows selected word in spinner component
6. **Fallback**: Uses only static words if dynamic fetch fails

This ensures reliable operation even without network connectivity while enabling real-time customization when connected.

## Usage

To run the extraction on new versions:

```bash
# Extract all versions from 0.2.9 onwards
node extract-processing-words-robust.js

# Or process in batches
node extract-batch.js 1  # Process batch 1 (first 30 versions)
node extract-batch.js 2  # Process batch 2 (next 30 versions)
# etc...

# Combine batch results
node combine-batches.js
```

## Variable Name Patterns

The analysis discovered 119 unique variable names used across versions, showing how the minified code changes with each build. Examples include: Aq6, At6, C31, CL3, Cu5, D31, DE5, Dt6, Ed5, F31, and many more.

## License

This analysis is provided for educational and research purposes. The Claude Code CLI is property of Anthropic.