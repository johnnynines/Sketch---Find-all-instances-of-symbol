var onRun = function (context) {

  var doc = context.document;
  var pg = doc.currentPage();
  var artboard = pg.currentArtboard();
  var pagesWithSymbolNames = NSMutableArray.array();
  var pagesWithSymbol = NSMutableArray.array();
  var thePage = "";
  var theLayer = "";
  var theArtboard = "";
  var selectedLayer = context.selection.firstObject();
  var selectedLayerName = selectedLayer.name();
  var masterSymbol = selectedLayer;
  if (selectedLayer.isKindOfClass(MSSymbolInstance)) {
    masterSymbol = selectedLayer.symbolMaster();
  }
  if (selectedLayer.isKindOfClass(MSSymbolMaster) || selectedLayer.isKindOfClass(MSSymbolInstance)) {
    for (var i = 0; i < doc.pages().count(); i++) {
      var page = doc.pages().objectAtIndex(i);
      for (var j = 0; j < page.artboards().count(); j++) {
        var artboard = page.artboards().objectAtIndex(j);
        for (var k = 0; k < artboard.layers().count(); k++) {
          var layer = artboard.layers().objectAtIndex(k);
          var layerName = layer.name();
          if (layer instanceof MSSymbolInstance) {
                if (layer.isInstanceForMaster(masterSymbol)) {
                pagesWithSymbolNames.addObject(artboard.name())
                pagesWithSymbol.addObject(page)
              
              pagesWithSymbol.addObject(artboard)
              theArtboard = artboard;
              }
          }
        }
      }
    } 
  } else  {
    doc.displayMessage('No layer selected');
  }

  var alert = COSAlertWindow.new();

  alert.setMessageText('Artboards with this symbol');
  alert.setInformativeText('Select the artbord from the list to jump to that symbol instance on the artboard.')

  // var choosePropertyOptions = NSMutableArray.array();

  //  for (var i = 0; i < pagesWithSymbol.count(); i++) {
  //    // alert.addTextLabelWithValue(pagesWithSymbol[i]);
  //    choosePropertyOptions.addObject(pagesWithSymbol[i]);
  //  }
  
  var choosePropertySelect  = createSelect(pagesWithSymbolNames, 0);

  alert.addAccessoryView(choosePropertySelect);
    
  alert.addButtonWithTitle('Go');
  alert.addButtonWithTitle('Cancel');
  if (alert.runModal() == "1000") {
    // doc.currentView().centerRect(theLayer.rect());
    
    doc.setCurrentPage(pagesWithSymbol[alert.viewAtIndex(0).indexOfSelectedItem()]);    
    selectAllSymbols(doc.currentPage(), artboard, masterSymbol);
  }

  function createSelect(options, selectedItemIndex) {
    selectedItemIndex = selectedItemIndex || 0;

    var select = [[NSPopUpButton alloc] initWithFrame:NSMakeRect(0,0,200,25)]
      [select addItemsWithTitles:options]

    select.selectItemAtIndex(selectedItemIndex);

    return select;
  }

  function selectAllSymbols(page, artboard, masterSymbol) {

    var layersToSelect = NSMutableArray.array();
    
    var artboards = page.artboards();
    for (var j = 0; j < artboards.length; j++){
      var layers = artboards.objectAtIndex(j).layers();
      for (var i = 0; i < layers.length; i++) {
          var layer = layers.objectAtIndex(i);
          if (layer instanceof MSSymbolInstance) {
            if (layer.isInstanceForMaster(masterSymbol)) {                          
            layersToSelect.addObject(layer);
          }
        } else if (layer instanceof MSSymbolMaster) {
          if (layer.name().isEqualToString(masterSymbol.name())) {
            layersToSelect.addObject(layer);
          }
        }

        }
    }   
    page.changeSelectionBySelectingLayers(layersToSelect);  
  }
}