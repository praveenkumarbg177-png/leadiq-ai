import json
import re

with open(r'C:\Users\prave\.gemini\antigravity-ide\brain\d35097a3-c97d-43e6-9fc6-b88d4dc53c94\.system_generated\steps\37\content.md', 'r', encoding='utf-8') as f:
    html = f.read()

# ChatGPT shares usually store the conversation state in a JSON script block.
# We'll look for strings that look like typical chat messages, or just dump the whole JSON to search through.
matches = re.findall(r'"parts":\s*\[(.*?)\]', html)
if not matches:
    # Try finding large text blocks in JSON strings
    matches = re.findall(r'"text":\s*"(.*?)"', html)
    if not matches:
        matches = re.findall(r'\\\"parts\\\":\s*\[(.*?)\]', html)
        
with open('scratch.txt', 'w', encoding='utf-8') as f:
    f.write('\n\n===MATCH===\n\n'.join(matches))

# Also extract anything that looks like "features" or "Lead Scoring"
features = re.findall(r'.{0,100}feature.{0,100}', html, re.IGNORECASE)
with open('scratch2.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(features))
