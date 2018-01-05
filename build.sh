SRC_DIR=./src
DEST_DIR=./dest

TSS=("common" "rule" "control" "soloview" "timer" "test")
VENDOR=("PlateEditorTS")

# Prepare TypeScript d files.
./dbuild.sh

# Compile TypeScript code.
for fld in ${TSS[@]}; do
  tsc --out $DEST_DIR/$fld.js $SRC_DIR/ts/$fld/main.ts
done
tsc --out $DEST_DIR/main.js $SRC_DIR/ts/main.ts

# Copy static files.
cp $SRC_DIR/static/* $DEST_DIR/

for name in ${VENDOR[@]}; do
  if [ ! -e $DEST_DIR/$name/ ]; then
    mkdir $DEST_DIR/$name/
  fi
  cp vendor/$name/dest/*.js $DEST_DIR/$name/
done

# Convert slim files to html.
for nm in $SRC_DIR/slim/*.slim; do
  export fn=${nm#${SRC_DIR}/slim}
  slimrb $nm > $DEST_DIR/${fn%.slim}.html
done
