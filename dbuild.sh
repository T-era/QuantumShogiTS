SRC_DIR=./src
LIB_DIR=${SRC_DIR}/lib
TARGETS=("common" "rule" "control")

cd vendor/PlateEditorTS/src
./dbuild.sh
./build.sh
cd -

# Compile TypeScript code.
for fld in ${TARGETS[@]}; do
  tsc -d --out $LIB_DIR/$fld.d.ts $SRC_DIR/ts/$fld/main.ts
done
