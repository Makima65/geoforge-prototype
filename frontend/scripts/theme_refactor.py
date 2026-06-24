import pathlib

root = pathlib.Path(__file__).resolve().parent.parent / 'src'
replacements = [
    ('bg-[#24b47e] hover:bg-[#3ecf8e]', 'bg-accent hover:bg-accent-strong'),
    ('bg-[#3ecf8e] hover:bg-[#2ebc7a]', 'bg-accent hover:bg-accent-strong'),
    ('bg-[#3ecf8e] hover:bg-[#2fb575]', 'bg-accent hover:bg-accent-strong'),
    ('bg-[#24b47e] hover:bg-[#3ecf8e]', 'bg-accent hover:bg-accent-strong'),
    ('bg-[#24b47e]', 'bg-accent'),
    ('bg-[#3ecf8e]', 'bg-accent'),
    ('text-[#3ecf8e]', 'text-accent'),
    ('text-[#24b47e]', 'text-accent'),
    ('bg-[#051A10]', 'bg-panel-strong'),
    ('bg-[#0A0A0A]', 'bg-surface-strong'),
    ('bg-[#111111]', 'bg-surface-soft'),
    ('bg-[#151515]', 'bg-panel-strong'),
    ('bg-[#0F0F0F]', 'bg-surface-strong'),
    ('bg-[#f8f9fa] dark:bg-[#111111]', 'bg-surface-soft'),
    ('hover:bg-[#f8f9fa] dark:bg-[#111111]', 'hover:bg-surface-soft'),
    ('bg-neutral-100 dark:bg-[#1A1A1A]', 'bg-soft'),
    ('border-neutral-200 dark:border-neutral-800/80', 'border-default'),
    ('border-neutral-200 dark:border-neutral-800', 'border-default'),
    ('bg-white dark:bg-[#0A0A0A]', 'bg-surface'),
    ('bg-[#3ecf8e]/5', 'bg-accent-soft'),
    ('bg-[#24b47e]/5', 'bg-accent-soft'),
    ('bg-[#24b47e]/10', 'bg-accent-soft'),
    ('bg-[#3ecf8e]/10', 'bg-accent-soft'),
    ('bg-[#3ecf8e]/20', 'bg-accent-soft'),
    ('text-gray-900 dark:text-white', 'text-primary'),
    ('text-neutral-500 dark:text-neutral-500', 'text-muted'),
    ('text-neutral-600 dark:text-neutral-400', 'text-muted'),
    ('bg-[#161616]', 'bg-panel-strong'),
    ('hover:bg-[#161616]', 'hover:bg-panel-strong'),
    ('bg-[#151515] border border-neutral-200 dark:border-neutral-800', 'bg-panel-strong border border-default'),
    ('shadow-[0_0_30px_rgba(62,207,142,0.3)]', 'shadow-accent'),
    ('shadow-[0_0_40px_rgba(62,207,142,0.5)]', 'shadow-accent-strong'),
    ('shadow-[0_0_20px_rgba(36,180,126,0.05)]', 'shadow-accent-soft'),
    ('shadow-[0_0_15px_rgba(36,180,126,0.05)]', 'shadow-accent-soft'),
    ('text-gray-900 dark:text-white', 'text-primary'),
    ('text-neutral-500 dark:text-neutral-500', 'text-muted'),
    ('text-neutral-600 dark:text-neutral-400', 'text-muted'),
]

files = list(root.rglob('*.jsx')) + list(root.rglob('*.js'))
changed = 0
for path in files:
    text = path.read_text(encoding='utf-8')
    new_text = text
    for old, new in replacements:
        new_text = new_text.replace(old, new)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        changed += 1
        print(f'Updated {path}')
print(f'Processed {len(files)} files, changed {changed} files')
