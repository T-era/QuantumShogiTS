SRC_DIR=./src
DEST_DIR=./dest

TSS=("common" "rule" "control" "test")

# Prepare TypeScript d files.
./dbuild.sh

# Compile TypeScript code.
for fld in ${TSS[@]}; do
  tsc --out $DEST_DIR/$fld.js $SRC_DIR/ts/$fld/main.ts
done
tsc --out $DEST_DIR/main.js $SRC_DIR/ts/main.ts

# Copy static files.
cp $SRC_DIR/static/* $DEST_DIR/

# Convert slim files to html.
for nm in $SRC_DIR/slim/*.slim; do
  export fn=${nm#${SRC_DIR}/slim}
  slimrb $nm > $DEST_DIR/${fn%.slim}.html
done
