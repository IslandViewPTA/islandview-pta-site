# Takes in a file CSV file and outputs each row as a Markdown file with YAML front matter named after first column.
# Data in the first row of the CSV is assumed to be the column heading.
# Original work borrowed from: https://github.com/EvanLovely/csv_to_jekyll

# Import the python libraries.
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from pathlib import Path
import os
import json

# Delete old page files. Leave the _index.md file there.
[ os.remove("site/content/colorrun/" + f) for f in os.listdir("site/content/colorrun/") if not f.startswith("_") and f.endswith(".md") ]

# Get JSON_DATA from the build environment.
jsondict = json.loads(os.environ['JSON_DATA'])

# Use creds to create a client to interact with the Google Drive API
scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_dict(jsondict, scope)
client = gspread.authorize(creds)

# Open the Google Sheet by ID.
sheet = client.open_by_key("1KqNkSL6F8AVadHoTSgdyyuLiZ-DQ03XG2L2LRZ2sg2o").sheet1

# Extract all of the records for each row.
sheetdata = sheet.get_all_records()

# Set location to write new files to.
outputpath = Path("site/content/colorrun/")

# Loop through each row...
for row_index, row in enumerate(sheetdata):
  if row.get("approved") == "x":
    # Open a new file with filename based on the first column
    filename = row.get("sfname").lower().replace(" ", "-") + row.get("slinitial").lower().replace(" ", "-") + str(row.get("grade")).lower() + '.md'
    outputfile = outputpath / filename
    new_yaml = open(outputfile, 'w')

    # Empty string that we will fill with YAML formatted text based on data extracted from our CSV.
    yaml_text = ""
    yaml_text += "---\n"
    yaml_text += "type: colorrun\n"
    yaml_text += "image: https://www.islandviewpta.org/colorrun/eagle_paint.jpg\n"
    
    # Set the Page title value.
    yaml_text += "title: Donation page for " + row.get("sfname") + " " + row.get("slinitial") + ".\n"
    # Loop through each cell in this row...
    for key,val in row.items():
      # Compile a line of YAML text from our spreadsheet keys and the value of the current value, followed by a linebreak.
      if key == "sfname" or key == "slinitial" or key == "teacher" or key == "grade":
        cell_heading = str(key)
        cell_text = cell_heading + ': "' + str(val) + '"\n'
        # Add this line of text to the current YAML string.
        yaml_text += cell_text

    # Write our YAML string to the new text file and close it.
    new_yaml.write(yaml_text + "---\n")
    new_yaml.close()
