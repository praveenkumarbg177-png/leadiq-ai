import json
import re

with open(r'C:\Users\prave\.gemini\antigravity-ide\brain\d35097a3-c97d-43e6-9fc6-b88d4dc53c94\.system_generated\steps\37\content.md', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract all JSON string literals that might be the chat text
# The chat text is often a long string with markdown inside.
# Look for anything starting with "Firstly what is this project" or similar, or just long text nodes.
texts = []

# It seems the text is stored in nested arrays in the __NEXT_DATA__
# We can just extract all strings that look like markdown (e.g. have '#' or '- ') and are long.
strings = re.findall(r'"((?:[^"\\]|\\.)*)"', html)
for s in strings:
    s = s.replace('\\n', '\n').replace('\\"', '"').replace('\\/', '/')
    if len(s) > 100 and ('#' in s or '-' in s) and 'Features You Should Put in the Website' in s:
        texts.append(s)

with open('chat_text.txt', 'w', encoding='utf-8') as f:
    f.write('\n\n---\n\n'.join(texts))
