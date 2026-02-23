
path = r'c:\Users\Nikhil Narayan\foodlink\views\donor_dashboard.ejs'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line 263 (0-indexed: 262) should have the broken EJS tag
for i, line in enumerate(lines):
    if '<% - JSON.stringify(listings)' in line:
        lines[i] = line.replace('<% - JSON.stringify(listings)', '<%- JSON.stringify(listings)')
        print(f'Fixed line {i+1}: {lines[i].rstrip()}')

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Done')
