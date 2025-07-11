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

For those who want to embrace the mystical nature of Claude Code, you can add either of these fun scripts to your shell configuration (`.zshrc` or `.bashrc`):

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

Something a bit more dramatic 👹

https://github.com/user-attachments/assets/735da73b-a489-4060-8a42-cbefa7db6222

```bash
# Summon Tengu (Claude Code) with animated ASCII art
summon() {
  if [[ "$1" == "tengu" ]]; then
    shift

    # Clear screen for dramatic effect
    clear

    # Function to print string character by character
    print_animated() {
      local text="$1"
      local delay="${2:-0.0005}"
      for (( i=0; i<${#text}; i++ )); do
        printf "%s" "${text:$i:1}"
        sleep "$delay"
      done
      printf "\n"
    }

    # Draw the Tengu face with accelerating animation
    echo ""
    lines=(
      "                    👹👹👹👹👹👹👹👹"
      "                👹👹👹👹👹👹👹👹👹👹👹👹"
      "              👹👹👹👹👹👹👹👹👹👹👹👹👹👹"
      "            👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹"
      "          👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹"
      "        👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹"
      "      👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹"
      "    👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹"
      "    👹👹👹👹  👹👹👹👹👹👹👹👹👹👹👹👹  👹👹👹👹"
      "    👹👹👹      👹👹👹👹👹👹👹👹      👹👹👹"
      "    👹👹👹  ⚫  👹👹👹👹👹👹👹👹  ⚫  👹👹👹"
      "    👹👹👹      👹👹👹👹👹👹👹👹      👹👹👹"
      "    👹👹👹👹👹👹👹👹👹  👹  👹👹👹👹👹👹👹👹"
      "    👹👹👹👹👹👹👹👹      👹👹👹👹👹👹👹👹"
      "      👹👹👹👹👹👹👹  👹👹  👹👹👹👹👹👹👹"
      "        👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹"
      "          👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹"
      "            👹👹👹👹👹👹👹👹👹👹👹👹👹👹"
      "              👹👹👹👹👹👹👹👹👹👹👹👹"
      "                👹👹👹👹👹👹👹👹👹👹"
    )

    # Print with accelerating speed
    delay=0.0025
    for line in "${lines[@]}"; do
      print_animated "$line" "$delay"
      # Accelerate by reducing delay
      delay=$(echo "$delay * 0.9" | bc -l)
    done
    echo ""
    sleep 0.3
    print_animated "              🌸 SUMMONING TENGU... 🌸" 0.05
    echo ""

    # Dramatic pause
    sleep 1

    # Launch Claude Code with any arguments passed
    claude "$@"
  else
    echo "Usage: summon tengu [claude-args]"
    echo "Example: summon tengu --help"
    echo "Example: summon tengu \"Help me fix this bug\""
  fi
}
```

## About

This repository analyzes all processing words used by [Claude Code CLI](https://github.com/anthropics/claude-code), the official CLI for Claude by Anthropic. These words appear randomly while Claude processes requests.

For detailed technical analysis and extraction scripts, see [TECHNICAL.md](TECHNICAL.md)
