# Takes data from Google Spreadsheets and outputs information from them as a Markdown file with YAML front matter named after column headings.
# Inspired by: https://github.com/EvanLovely/csv_to_jekyll

# Import the python libraries.
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from pathlib import Path
import os
import json

# Delete old page files. Leave the _index.md file there.
# [ os.remove("content/colorrun/" + f) for f in os.listdir("content/colorrun/") if not f.startswith("_") and f.startswith("register") and f.endswith(".md") ]

# Get JSON_DATA from the build environment.
jsondict = json.loads(os.environ['JSON_DATA'])

# Use creds to create a client to interact with the Google Drive API
scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_dict(jsondict, scope)
client = gspread.authorize(creds)

# Open the Google Sheet by ID.
sheet1 = client.open_by_key("1D8rouW5W96yRCCJmaZyDlUMmRb5j4XfjmpT_1er3XXc").sheet1
sheet2 = client.open_by_key("1OT4LXYzunrP2ubaRk0azq3ntBTfRdItUKGOKUqk2grI").get_worksheet(1)

# Extract all of the records for each row.
sheetdata1 = sheet1.get_all_records()
sheetdata2 = sheet2.get_all_records()

# Set location to write new files to.
outputpath = Path("content/colorrun/")

# Loop through each row...
for row_index, row in enumerate(sheetdata1):
  if row.get("approved") == "x":
    # Open a new file with filename based on the first column
    filename = str(row.get("url")).lower() + '.md'
    outputfile = outputpath / filename
    new_yaml = open(str(outputfile), 'w')

    # Empty string that we will fill with YAML formatted text based on data extracted from our CSV.
    yaml_text = ""
    yaml_text += "---\n"
    yaml_text += "type: colorrun\n"
    yaml_text += "image: /colorrun/eagle_paint.jpg\n"
    
    # Set the Page title value.
    yaml_text += "title: Donation page for " + row.get("sfname") + " " + row.get("slinitial")[0] + ".\n"
    # Loop through each cell in this row...
    for key,val in row.items():
      # Compile a line of YAML text from our spreadsheet keys and the value of the current value, followed by a linebreak.
      if key == "sfname" or key == "slinitial" or key == "teacher" or key == "grade":
        if key == "slinitial":
          cell_heading = str(key)
          cell_text = cell_heading + ': "' + str(val)[0] + '"\n'
        else:
          cell_heading = str(key)
          cell_text = cell_heading + ': "' + str(val) + '"\n'
        # Add this line of text to the current YAML string.
        yaml_text += cell_text
        
    for student in sheetdata2:
      if student["First"] == row.get("sfname") and student["Last"] == row.get("slinitial") and student["Grade"] == row.get("grade"):
        yaml_text += 'online: "' + student["Online"] + '"\n'
        yaml_text += 'envelope: "' + student["Envelope"] + '"\n'
        yaml_text += 'total: "' + student["TOTAL"] + '"\n'
      
    # Write our YAML string to the new text file and close it.
    new_yaml.write(yaml_text + "---\n")
    new_yaml.close()
