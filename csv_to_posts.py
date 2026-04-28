# Converts data.csv into front matter .md files for jekyll-ttrpg-catalog.
# Each row becomes one post. First row is assumed to be column headings.
# The first column value is used as the filename.
# Output files are placed in the current directory; move them to posts/<category>/ manually.
#
# Usage: python csv_to_posts.py
# CSV columns should match the catalog schema: name, category, author, source, source-url,
#   genre, summary, cost, license, cover-image, tags, stats, subtexts, etc.
#
# Original: https://github.com/hfionte/csv_to_yaml

import csv
from datetime import date

csvfile = open('data.csv', 'r')
datareader = csv.reader(csvfile, delimiter=',', quotechar='"')
data_headings = []
today = date.today().strftime('%Y-%m-%d')

for row_index, row in enumerate(datareader):
    if row_index == 0:
        data_headings = row
    else:
        slug = row[0].lower().replace(' ', '-').replace('_', '-')
        filename = f"{today}-{slug}.md"
        with open(filename, 'w') as f:
            f.write("---\n")
            for cell_index, cell in enumerate(row):
                heading = (
                    data_headings[cell_index]
                    .lower()
                    .replace(' ', '-')
                    .replace('%', 'percent')
                    .replace('$', '')
                )
                text = cell.replace('\n', ', ')
                f.write(f"{heading}: {text}\n")
            f.write("---\n")

csvfile.close()
print(f"Done. Move the generated .md files to posts/<category>/")
