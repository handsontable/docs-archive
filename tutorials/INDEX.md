
## Constructor options

### General options

- {@link Handsontable.Options#autoComplete} 
- {@link Handsontable.Options#autoWrapCol} 
- {@link Handsontable.Options#autoWrapRow} 
- {@link Handsontable.Options#cells} 
- {@link Handsontable.Options#className} 
- {@link Handsontable.Options#colHeaders} 
- {@link Handsontable.Options#colWidths} 
- {@link Handsontable.Options#columnSorting} 
- {@link Handsontable.Options#columns} 
- {@link Handsontable.Options#comments} 
- {@link Handsontable.Options#contextMenu} 
- {@link Handsontable.Options#copyColsLimit} 
- {@link Handsontable.Options#copyPaste} 
- {@link Handsontable.Options#copyRowsLimit} 
- {@link Handsontable.Options#currentColClassName} 
- {@link Handsontable.Options#currentRowClassName} 
- {@link Handsontable.Options#customBorders} 
- {@link Handsontable.Options#data} 
- {@link Handsontable.Options#dataSchema} 
- {@link Handsontable.Options#debug} 
- {@link Handsontable.Options#enterBeginsEditing} 
- {@link Handsontable.Options#enterMoves} 
- {@link Handsontable.Options#fillHandle} 
- {@link Handsontable.Options#fixedColumnsLeft} 
- {@link Handsontable.Options#fixedRowsTop} 
- {@link Handsontable.Options#fragmentSelectionSize} 
- {@link Handsontable.Options#groups} 
- {@link Handsontable.Options#height} 
- {@link Handsontable.Options#invalidCellClassName} 
- {@link Handsontable.Options#isEmptyCol} 
- {@link Handsontable.Options#isEmptyRow} 
- {@link Handsontable.Options#manualColumnMove} 
- {@link Handsontable.Options#manualColumnResize} 
- {@link Handsontable.Options#manualRowMove} 
- {@link Handsontable.Options#manualRowResize} 
- {@link Handsontable.Options#maxCols} 
- {@link Handsontable.Options#maxRows} 
- {@link Handsontable.Options#mergeCells} 
- {@link Handsontable.Options#minCols} 
- {@link Handsontable.Options#minRows} 
- {@link Handsontable.Options#minSpareCols} 
- {@link Handsontable.Options#minSpareRows} 
- {@link Handsontable.Options#multiSelect} 
- {@link Handsontable.Options#noWordWrapClassName} 
- {@link Handsontable.Options#observeChanges} 
- {@link Handsontable.Options#observeDOMVisibility} 
- {@link Handsontable.Options#outsideClickDeselects} 
- {@link Handsontable.Options#pasteMode} 
- {@link Handsontable.Options#persistentState} 
- {@link Handsontable.Options#placeholder} 
- {@link Handsontable.Options#placeholderCellClassName} 
- {@link Handsontable.Options#readOnlyCellClassName} 
- {@link Handsontable.Options#rowHeaders} 
- {@link Handsontable.Options#search} 
- {@link Handsontable.Options#startCols} 
- {@link Handsontable.Options#startRows} 
- {@link Handsontable.Options#stretchH} 
- {@link Handsontable.Options#tabMoves} 
- {@link Handsontable.Options#undo} 
- {@link Handsontable.Options#width} 
- {@link Handsontable.Options#wordWrap} 

### Column options

- {@link Handsontable.Options#allowInvalid} 
- {@link Handsontable.Options#copyable} 
- {@link Handsontable.Options#editor} 
- {@link Handsontable.Options#type} 
- {@link Handsontable.Options#readOnly} 
- {@link Handsontable.Options#renderer} 
- {@link Handsontable.Options#validator} 

## Methods

### General methods

- {@link Handsontable.Core#destroy}
- {@link Handsontable.Core#getCellRenderer}
- {@link Handsontable.Core#getSettings}
- {@link Handsontable.Core#isListening}
- {@link Handsontable.Core#listen}
- {@link Handsontable.Core#loadData}
- {@link Handsontable.Core#render}
- {@link Handsontable.Core#unlisten}
- {@link Handsontable.Core#updateSettings}
- {@link Handsontable.Core#validateCells}

### Get data methods

- {@link Handsontable.Core#getCopyableData}
- {@link Handsontable.Core#getDataAtCell}
- {@link Handsontable.Core#getDataAtCol}
- {@link Handsontable.Core#getDataAtProp}
- {@link Handsontable.Core#getDataAtRowProp}
- {@link Handsontable.Core#getDataAtRow}
- {@link Handsontable.Core#getData}
- {@link Handsontable.Core#getSourceDataAtCol}
- {@link Handsontable.Core#getSourceDataAtRow}
- {@link Handsontable.Core#getValue}

### Set data methods

- {@link Handsontable.Core#populateFromArray}
- {@link Handsontable.Core#setDataAtCell}
- {@link Handsontable.Core#setDataAtRowProp}
- {@link Handsontable.Core#spliceCol}
- {@link Handsontable.Core#spliceRow}

### Alter grid (create, remove rows and columns)

- {@link Handsontable.Core#alter}

### Cell methods

- {@link Handsontable.Core#destroyEditor}
- {@link Handsontable.Core#getCellMeta}
- {@link Handsontable.Core#getCell}
- {@link Handsontable.Core#setCellMeta}

### Selection methods

- {@link Handsontable.Core#clear}
- {@link Handsontable.Core#deselectCell}
- {@link Handsontable.Core#getSelectedRange}
- {@link Handsontable.Core#getSelected}
- {@link Handsontable.Core#selectCell}

### Grid information methods

- {@link Handsontable.Core#colOffset}
- {@link Handsontable.Core#colToProp}
- {@link Handsontable.Core#countCols}
- {@link Handsontable.Core#countEmptyCols}
- {@link Handsontable.Core#countEmptyRows}
- {@link Handsontable.Core#countRows}
- {@link Handsontable.Core#countVisibleCols}
- {@link Handsontable.Core#countVisibleRows}
- {@link Handsontable.Core#getColHeader}
- {@link Handsontable.Core#getColWidth}
- {@link Handsontable.Core#getRowHeader}
- {@link Handsontable.Core#getRowHeight}
- {@link Handsontable.Core#hasColHeaders}
- {@link Handsontable.Core#hasRowHeaders}
- {@link Handsontable.Core#isEmptyCol}
- {@link Handsontable.Core#isEmptyRow}
- {@link Handsontable.Core#propToCol}
- {@link Handsontable.Core#rowOffset}

### Undo/redo methods

- {@link Handsontable.UndoRedo#clear}
- {@link Handsontable.UndoRedo#isRedoAvailable}
- {@link Handsontable.UndoRedo#isUndoAvailable}
- {@link Handsontable.UndoRedo#redo}
- {@link Handsontable.UndoRedo#undo}
