## clean

```bash
rm -rf public && rm -rf resources
```

## build

Build the Hugo site and remove any unused resources.

```py
import subprocess
from sys import platform
if platform == "linux" or platform == "linux2":
    subprocess.run(["./bin/hugo.linux", "--gc"])
elif platform == "darwin":
    subprocess.run(["./bin/hugo.macos", "--gc"])
elif platform == "win32":
    subprocess.run(["./bin/hugo.exe", "--gc", "--log"])
```

## serve

Serve the Hugo site at localhost:1313

```py
import subprocess
from sys import platform
if platform == "linux" or platform == "linux2":
    subprocess.run(["./bin/hugo.linux", "server","--disableFastRender"])
elif platform == "darwin":
    subprocess.run(["./bin/hugo.macos", "server","--disableFastRender"])
elif platform == "win32":
    subprocess.run(["./bin/hugo.exe", "server","--disableFastRender"])
```

## update_hugo

Update the Hugo Binaries to the specified version. Need to set the version number as an argument like: "maid update_hugo 0.52"

```py
from six.moves import urllib
import tarfile
import zipfile
import os
import shutil
import sys

print('Updating Hugo binaries')

os.chdir("./bin")

version = sys.argv[2]
tarNames = ["macOS","Linux"]
zipNames = ["Windows"]
urlBase = "https://github.com/gohugoio/hugo/releases/download/v{}/".format(version)

for i in range(len(tarNames)):
  tarFilename = "hugo_extended_{}_{}-64bit.tar.gz".format(version,tarNames[i])
  print("Processing: "+tarFilename)
  urllib.request.urlretrieve(urlBase+tarFilename, tarFilename)
  tar = tarfile.open(tarFilename, "r:gz")
  tar.extractall("temp")
  tar.close()
  shutil.copyfile("./temp/hugo", "hugo.{}".format(tarNames[i].lower()))
  shutil.rmtree("temp")
  os.remove(tarFilename)
  i += 1

for i in range(len(zipNames)):
  zipFilename = "hugo_extended_{}_{}-64bit.zip".format(version,zipNames[i])
  print("Processing: "+zipFilename)
  urllib.request.urlretrieve(urlBase+zipFilename, zipFilename)
  with zipfile.ZipFile(zipFilename,"r") as zip_ref:
    zip_ref.extractall("temp")
  shutil.copyfile("./temp/hugo.exe", "hugo.exe")
  shutil.rmtree("temp")
  os.remove(zipFilename)
  i += 1

print("Hugo has been updated to version {}.".format(version))
```

## check_links

Go module 'muffet' to check for broken links on locally running website.

```py
import os
import subprocess
muffet = os.environ["GOPATH"] + "/bin/muffet"
f = open("linkcheck.txt", "w")
subprocess.run([muffet, "--exclude", "https://www.linkedin.com/*", "http://localhost:1313"], stdout=f)
```