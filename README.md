# Claude Code (aka Tengu)<sup>[1](#the-tengu-discovery)</sup> Processing Words

A comprehensive list of the processing words displayed by Claude Code CLI while it works on your requests.

## Current Processing Words (90 unique)

```
Accomplishing       Elucidating         Perusing
Actioning           Enchanting          Philosophising
Actualizing         Envisioning         Pondering
Baking              Finagling           Pontificating
Booping             Flibbertigibbeting  Processing
Brewing             Forging             Puttering
Calculating         Forming             Puzzling
Cerebrating         Frolicking          Reticulating
Channelling         Generating          Ruminating
Churning            Germinating         Scheming
Clauding            Hatching            Schlepping
Coalescing          Herding             Shimmying
Cogitating          Honking             Shucking
Combobulating       Hustling            Simmering
Computing           Ideating            Smooshing
Concocting          Imagining           Spelunking
Conjuring           Incubating          Spinning
Considering         Inferring           Stewing
Contemplating       Jiving              Sussing
Cooking             Manifesting         Synthesizing
Crafting            Marinating          Thinking
Creating            Meandering          Tinkering
Crunching           Moseying            Transmuting
Deciphering         Mulling             Unfurling
Deliberating        Mustering           Unravelling
Determining         Musing              Vibing
Discombobulating    Noodling            Wandering
Divining            Percolating         Whirring
Doing                                   Wibbling
Effecting                               Wizarding
                                        Working
                                        Wrangling
```

**Note**: Additional words can be fetched dynamically from Anthropic's servers at runtime.

## Key Facts

- **90 processing words**
- **139 versions analyzed** (v0.2.9 → v1.0.48)
- **3 distinct phases** in the word evolution
- **Internal codename**: "Tengu" (found in configuration keys and telemetry)
- **Dynamic word system**: Can fetch additional words from Anthropic's servers via Statsig

## Version History

### Phase 1 (v0.2.9 - v0.2.41)
56 words - Original set without "Pontificating"

### Phase 2 (v0.2.42 - v1.0.28)
57 words - Added "Pontificating"

### Phase 3 (v1.0.29 - present)
90 words - Major expansion adding 33 new words including:
- Flibbertigibbeting
- Discombobulating
- Wizarding
- Booping
- Combobulating
- Divining
- Jiving
- Meandering
- Sussing
- And 24 more creative verbs

## Technical Implementation

1. **Static words**: 90 hardcoded words in the CLI
2. **Dynamic configuration**: Fetches additional words via `tengu_spinner_words` config key
3. **Merger system**: Combines static and dynamic arrays at runtime
4. **Fallback mechanism**: Uses static words if dynamic fetch fails
5. **Display logic**: Random selection every 1000ms with React state management

This design allows Anthropic to update spinner words without releasing new CLI versions, enable A/B testing, and potentially customize words based on user segments.

## The Tengu Discovery

While analyzing Claude Code's source code across 139 versions, we uncovered that "Tengu" appears to be the internal codename for the Claude Code project. This appears in:

- **Configuration keys**: `tengu_spinner_words` in the Statsig configuration system
- **Telemetry events**: Internal tracking uses "tengu" prefixes
- **Dynamic word fetching**: The system retrieves additional processing words using Tengu-named endpoints

Tengu (天狗) are supernatural beings from Japanese folklore, often depicted as skilled warriors and mischievous spirits known for their cleverness and ability to shape-shift. The name seems fitting for a tool that transforms natural language into code with a touch of whimsy in its processing words.

### Summoning Tengu

For those who want to embrace the mystical nature of Claude Code, you can add this fun alias to your shell configuration (`.zshrc` or `.bashrc`):

```bash
# Summon Tengu (Claude Code)
summon() {
  if [[ "$1" == "tengu" ]]; then
    shift
    claude "$@"
  else
    echo "Usage: summon tengu [claude-args]"
  fi
}
```

Now instead of typing `claude`, you can type `summon tengu` to invoke Claude Code!

## About

This repository analyzes all processing words used by [Claude Code CLI](https://github.com/anthropics/claude-code), the official CLI for Claude by Anthropic. These words appear randomly while Claude processes requests.

For detailed technical analysis and extraction scripts, see [TECHNICAL.md](TECHNICAL.md)